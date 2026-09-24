// Jev API Client for email classification via TypeSafe Jev
import axios from "axios";

interface JevConfig {
  apiKey: string;
  model: string;
  baseURL?: string;
}

interface EmailData {
  sender: string;
  subject: string;
  preview: string;
}

interface ClassificationResult {
  label: string;
  confidence: number;
  reasoning: string;
}

export class JevClient {
  private apiKey: string;
  private model: string;
  private baseURL: string;

  constructor(config: JevConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.baseURL = config.baseURL || "https://openrouter.ai/api/v1";
  }

  async classifyEmail(email: EmailData): Promise<ClassificationResult> {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: "system",
              content: "You are an email classification assistant. Classify emails into categories like 'Important', 'Newsletter', 'Receipt', 'Spam', etc."
            },
            {
              role: "user",
              content: `Classify this email:\nFrom: ${email.sender}\nSubject: ${email.subject}\nPreview: ${email.preview}`
            }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "email_classification",
              schema: {
                type: "object",
                properties: {
                  label: { type: "string" },
                  confidence: { type: "number" },
                  reasoning: { type: "string" }
                },
                required: ["label", "confidence", "reasoning"],
                additionalProperties: false
              }
            }
          }
        },
        {
          headers: {
            "Authorization": `Bearer ${this.apiKey}`,
            "HTTP-Referer": "https://smart-email-labeling-system.com",
            "X-Title": "Smart Email Labeling System"
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      throw new Error(`Jev API request failed: ${error.message}`);
    }
  }
}
