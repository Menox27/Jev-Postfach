// Main server file with Express and API endpoints
import express from "express";
import { ImapClient } from "./imapClient";
import { JevClient } from "./jevClient";
import { ClassificationEngine } from "./classificationEngine";
import { Database } from "./db";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize components
const db = new Database();

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Smart Email Labeling System API is running" });
});

// API Endpoints
app.get("/api/emails/:userId/classifications", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    // Fetch recent classifications from database for specific user
    const emails = await db.db.all("SELECT * FROM classifications WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50", [userId]);
    return res.json(emails);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/rules", async (req, res) => {
  try {
    const rules = await db.getRules();
    return res.json(rules);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/rules", async (req, res) => {
  try {
    const rule = req.body;
    await db.saveRule(rule);
    return res.status(201).json({ message: "Rule saved successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/emails/:userId/process", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Get user account
    const user = await db.db.get("SELECT * FROM users WHERE id = ?", [userId]);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Initialize IMAP client with user credentials
    const imapConfig = {
      host: user.imap_host,
      port: user.imap_port,
      secure: true,
      auth: {
        user: user.imap_user,
        pass: user.imap_pass
      }
    };
    
    // Initialize Jev client with user API key
    const jevConfig = {
      apiKey: user.jev_api_key,
      model: process.env.JEV_MODEL || "typesafe/jev-1.13"
    };
    
    const imapClient = new ImapClient(imapConfig);
    const jevClient = new JevClient(jevConfig);
    const engine = new ClassificationEngine(imapClient, jevClient, db);
    
    // Connect to IMAP
    await imapClient.connect();
    
    // Process emails
    await engine.processEmails(userId);
    
    // Disconnect
    await imapClient.disconnect();
    
    return res.json({ message: `Email processing completed for user ${userId}` });
  } catch (error: any) {
    console.error("Processing error:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/users/register", async (req, res) => {
  try {
    const { email, imapHost, imapPort, imapUser, imapPass, jevApiKey } = req.body;
    
    // Check if user already exists
    const existingUser = await db.db.get("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    
    // Create new user
    const result = await db.db.run(
      "INSERT INTO users (email, imap_host, imap_port, imap_user, imap_pass, jev_api_key) VALUES (?, ?, ?, ?, ?, ?)",
      [email, imapHost, imapPort, imapUser, imapPass, jevApiKey]
    );
    
    return res.status(201).json({ 
      message: "User registered successfully", 
      user: { 
        id: result.lastID, 
        email: email,
        imapHost: imapHost,
        imapPort: imapPort
      } 
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await db.db.all("SELECT id, email, imap_host, imap_port FROM users");
    return res.json({ users });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(parseInt(port.toString()), "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});

