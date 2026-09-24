// Classification Engine for email processing
import { ImapClient } from "./imapClient";
import { JevClient } from "./jevClient";

interface ClassificationRule {
  label: string;
  folder: string;
  prompt: string;
}

interface DatabaseInterface {
  saveClassification(emailUid: number, result: any): Promise<void>;
  getRules(): Promise<ClassificationRule[]>;
}

export class ClassificationEngine {
  private imapClient: ImapClient;
  private jevClient: JevClient;
  private db: DatabaseInterface;

  constructor(imap: ImapClient, jev: JevClient, database: DatabaseInterface) {
    this.imapClient = imap;
    this.jevClient = jev;
    this.db = database;
  }

  async processEmails(userId: number): Promise<void> {
    // Fetch unread emails
    const emails = await this.imapClient.fetchUnreadEmails();
    
    // Get classification rules
    const rules = await this.db.getRules();
    
    for (const email of emails) {
      try {
        // Prepare email data for classification
        const emailData = {
          sender: email.envelope.from[0]?.address || "unknown",
          subject: email.envelope.subject || "",
          preview: email.body?.toString().substring(0, 500) || ""
        };

        // Classify email using Jev
        const classification = await this.jevClient.classifyEmail(emailData);
        
        // Save classification result with user ID
        await this.db.saveClassification(userId, email.uid, classification);
        
        // Find matching rule for the label
        const rule = rules.find(r => r.label === classification.label);
        
        // Move email to appropriate folder if rule exists
        if (rule) {
          await this.imapClient.moveEmail(email.uid, rule.folder);
        }
        
        console.log(`Processed email ${email.uid}: ${classification.label}`);
      } catch (error) {
        console.error(`Failed to process email ${email.uid}:`, error.message);
      }
    }
  }
}
