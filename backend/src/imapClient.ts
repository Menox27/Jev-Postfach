// IMAP Client for iCloud Mail using imapflow
import { ImapFlow } from "imapflow";

interface ImapConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class ImapClient {
  private client: ImapFlow;

  constructor(config: ImapConfig) {
    this.client = new ImapFlow({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
      logger: false,
    });
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.logout();
  }

  async fetchUnreadEmails(): Promise<any[]> {
    await this.client.mailboxOpen("INBOX");
    const emails: any[] = [];
    
    const lock = await this.client.getMailboxLock("INBOX");
    try {
      for await (const message of this.client.fetch(
        { seen: false },
        { source: { start: 0, end: 10000 } }
      )) {
        emails.push({
          uid: message.uid,
          envelope: message.envelope,
          body: message.source,
        });
      }
    } finally {
      lock.release();
    }
    
    return emails;
  }

  async moveEmail(uid: number, folder: string): Promise<void> {
    await this.client.messageMove(uid, folder);
  }
}
