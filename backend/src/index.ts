// Entry point for the application - only for manual processing
import { ImapClient } from "./imapClient";
import { JevClient } from "./jevClient";
import { ClassificationEngine } from "./classificationEngine";
import { Database } from "./db";

console.log("Smart Email Labeling System - Manual Processing Mode");
console.log("Use the web API for normal operation");
console.log("To process emails manually, provide IMAP credentials as environment variables");

// This file is for manual processing only, not for web server
// The web server is started by server.ts

