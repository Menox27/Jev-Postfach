// User model for email accounts
import { Database } from "../db";

export interface User {
  id?: number;
  email: string;
  imapHost: string;
  imapPort: number;
  imapUser: string;
  imapPass: string;
  jevApiKey: string;
  createdAt?: Date;
}

export class UserModel {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  async create(user: Omit<User, "id">): Promise<User> {
    const result = await this.db.db.run(
      "INSERT INTO users (email, imap_host, imap_port, imap_user, imap_pass, jev_api_key) VALUES (?, ?, ?, ?, ?, ?)",
      [user.email, user.imapHost, user.imapPort, user.imapUser, user.imapPass, user.jevApiKey]
    );
    
    return {
      id: result.lastID,
      ...user,
      createdAt: new Date()
    };
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.db.db.get(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    
    return user ? this.mapRowToUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.db.get(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    
    return user ? this.mapRowToUser(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.db.db.all("SELECT * FROM users");
    return users.map(user => this.mapRowToUser(user));
  }

  async update(id: number, updates: Partial<User>): Promise<boolean> {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        fields.push(`${this.camelToSnake(key)} = ?`);
        values.push(value);
      }
    }
    
    if (fields.length === 0) return false;
    
    values.push(id);
    const result = await this.db.db.run(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    
    return result.changes > 0;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.db.run(
      "DELETE FROM users WHERE id = ?",
      [id]
    );
    
    return result.changes > 0;
  }

  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      imapHost: row.imap_host,
      imapPort: row.imap_port,
      imapUser: row.imap_user,
      imapPass: row.imap_pass,
      jevApiKey: row.jev_api_key,
      createdAt: row.created_at
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}
