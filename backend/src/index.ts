// Entry point for the application
import { ImapClient } from "./imapClient";
import { JevClient } from "./jevClient";
import { ClassificationEngine } from "./classificationEngine";
import { Database } from "./db";

async function main() {
  // Initialize components
  const db = new Database();
  
  // IMAP configuration for iCloud
  const imapConfig = {
    host: process.env.IMAP_HOST || "imap.mail.me.com",
    port: parseInt(process.env.IMAP_PORT || "993"),
    secure: true,
    auth: {
      user: process.env.IMAP_USER || "",
      pass: process.env.IMAP_PASS || ""
    }
  };
  
  // Jev API configuration
  const jevConfig = {
    apiKey: process.env.JEV_API_KEY || "",
    model: process.env.JEV_MODEL || "typesafe/jev-1.13"
  };
  
  try {
    const imapClient = new ImapClient(imapConfig);
    const jevClient = new JevClient(jevConfig);
    const engine = new ClassificationEngine(imapClient, jevClient, db);
    
    // Connect to IMAP
    await imapClient.connect();
    console.log("Connected to iCloud IMAP");
    
    // Process emails
    await engine.processEmails();
    console.log("Email processing completed");
    
    // Disconnect
    await imapClient.disconnect();
    console.log("Disconnected from iCloud IMAP");
  } catch (error) {
    console.error("Application error:", error);
  }
}

main();

