// Database interface and SQLite implementation
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export interface ClassificationResult {
  label: string;
  confidence: number;
  reasoning: string;
}

export interface ClassificationRule {
  id?: number;
  label: string;
  folder: string;
  prompt: string;
}

export class Database {
  private db: any;

  constructor(dbPath: string = "./emails.db") {
    this.init(dbPath);
  }

  private async init(dbPath: string) {
    this.db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS classifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        email_uid INTEGER,
        label TEXT,
        confidence REAL,
        reasoning TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT UNIQUE,
        folder TEXT,
        prompt TEXT
      );
      
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        imap_host TEXT NOT NULL,
        imap_port INTEGER NOT NULL,
        imap_user TEXT NOT NULL,
        imap_pass TEXT NOT NULL,
        jev_api_key TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      INSERT OR IGNORE INTO rules (label, folder, prompt) VALUES 
      ("Important", "INBOX.Important", "Important emails requiring attention"),
      ("Newsletter", "INBOX.Newsletter", "Marketing and newsletter emails"),
      ("Receipt", "INBOX.Receipts", "Financial receipts and invoices"),
      ("Spam", "INBOX.Spam", "Unsolicited promotional emails");
    `);
  }

  async saveClassification(userId: number, emailUid: number, result: ClassificationResult): Promise<void> {
    await this.db.run(
      "INSERT INTO classifications (user_id, email_uid, label, confidence, reasoning) VALUES (?, ?, ?, ?, ?)",
      [userId, emailUid, result.label, result.confidence, result.reasoning]
    );
  }

  async getRules(): Promise<ClassificationRule[]> {
    return await this.db.all("SELECT * FROM rules");
  }

  async saveRule(rule: ClassificationRule): Promise<void> {
    await this.db.run(
      "INSERT OR REPLACE INTO rules (label, folder, prompt) VALUES (?, ?, ?)",
      [rule.label, rule.folder, rule.prompt]
    );
  }
}
