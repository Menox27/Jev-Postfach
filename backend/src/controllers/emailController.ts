// Email controller for handling email operations
import { Request, Response } from "express";
import { ImapClient } from "../imapClient";
import { JevClient } from "../jevClient";
import { ClassificationEngine } from "../classificationEngine";
import { Database } from "../db";
import { UserModel } from "../models/User";

interface AuthRequest extends Request {
  user?: any;
}

export class EmailController {
  private db: Database;
  private userModel: UserModel;

  constructor(database: Database) {
    this.db = database;
    this.userModel = new UserModel(database);
  }

  // Process emails for a specific user
  processEmails = async (req: AuthRequest, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get user account
      const user = await this.userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Initialize IMAP client with user credentials
      const imapConfig = {
        host: user.imapHost,
        port: user.imapPort,
        secure: true,
        auth: {
          user: user.imapUser,
          pass: user.imapPass
        }
      };
      
      // Initialize Jev client with user API key
      const jevConfig = {
        apiKey: user.jevApiKey,
        model: process.env.JEV_MODEL || "typesafe/jev-1.13"
      };
      
      const imapClient = new ImapClient(imapConfig);
      const jevClient = new JevClient(jevConfig);
      const engine = new ClassificationEngine(imapClient, jevClient, this.db);
      
      // Connect to IMAP
      await imapClient.connect();
      
      // Process emails
      await engine.processEmails();
      
      // Disconnect
      await imapClient.disconnect();
      
      res.json({ message: `Email processing completed for ${user.email}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get classifications for a specific user
  getClassifications = async (req: AuthRequest, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get user account
      const user = await this.userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Fetch classifications for this user
      const classifications = await this.db.db.all(
        "SELECT c.* FROM classifications c WHERE c.user_id = ? ORDER BY c.timestamp DESC LIMIT 50",
        [userId]
      );
      
      res.json(classifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get emails from a specific folder for a user
  getEmailsFromFolder = async (req: AuthRequest, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const folder = req.params.folder || "INBOX";
      
      // Get user account
      const user = await this.userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Initialize IMAP client with user credentials
      const imapConfig = {
        host: user.imapHost,
        port: user.imapPort,
        secure: true,
        auth: {
          user: user.imapUser,
          pass: user.imapPass
        }
      };
      
      const imapClient = new ImapClient(imapConfig);
      
      // Connect to IMAP
      await imapClient.connect();
      
      // Open folder and fetch emails
      await imapClient.client.mailboxOpen(folder);
      const emails: any[] = [];
      
      const lock = await imapClient.client.getMailboxLock(folder);
      try {
        for await (const message of imapClient.client.fetch(
          { all: true },
          { envelope: true, flags: true }
        )) {
          emails.push({
            uid: message.uid,
            envelope: message.envelope,
            flags: message.flags
          });
        }
      } finally {
        lock.release();
      }
      
      // Disconnect
      await imapClient.disconnect();
      
      res.json({
        folder: folder,
        emails: emails
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
