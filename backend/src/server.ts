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
const imapConfig = {
  host: process.env.IMAP_HOST || "imap.mail.me.com",
  port: parseInt(process.env.IMAP_PORT || "993"),
  secure: true,
  auth: {
    user: process.env.IMAP_USER || "",
    pass: process.env.IMAP_PASS || ""
  }
};
const imapClient = new ImapClient(imapConfig);

const jevConfig = {
  apiKey: process.env.JEV_API_KEY || "",
  model: process.env.JEV_MODEL || "typesafe/jev-1.13"
};
const jevClient = new JevClient(jevConfig);

const engine = new ClassificationEngine(imapClient, jevClient, db);

// API Endpoints
app.get("/api/emails", async (req, res) => {
  try {
    // Fetch recent classifications from database
    const emails = await db.db.all("SELECT * FROM classifications ORDER BY timestamp DESC LIMIT 50");
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/rules", async (req, res) => {
  try {
    const rules = await db.getRules();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/rules", async (req, res) => {
  try {
    const rule = req.body;
    await db.saveRule(rule);
    res.status(201).json({ message: "Rule saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/process", async (req, res) => {
  try {
    await engine.processEmails();
    res.json({ message: "Email processing completed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

