// Authentication controller for user management
import { Request, Response } from "express";
import { UserModel, User } from "../models/User";
import { Database } from "../db";

interface AuthRequest extends Request {
  user?: User;
}

export class AuthController {
  private userModel: UserModel;

  constructor(database: Database) {
    this.userModel = new UserModel(database);
  }

  // Register a new user
  register = async (req: Request, res: Response) => {
    try {
      const { email, imapHost, imapPort, imapUser, imapPass, jevApiKey } = req.body;
      
      // Check if user already exists
      const existingUser = await this.userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      
      // Create new user
      const user = await this.userModel.create({
        email,
        imapHost,
        imapPort,
        imapUser,
        imapPass,
        jevApiKey
      });
      
      res.status(201).json({ 
        message: "User registered successfully", 
        user: { 
          id: user.id, 
          email: user.email,
          imapHost: user.imapHost,
          imapPort: user.imapPort
        } 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get all users (for account switching)
  getUsers = async (req: AuthRequest, res: Response) => {
    try {
      const users = await this.userModel.findAll();
      res.json({
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          imapHost: user.imapHost,
          imapPort: user.imapPort
        }))
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get user by ID
  getUserById = async (req: AuthRequest, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userModel.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          imapHost: user.imapHost,
          imapPort: user.imapPort
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Update user account
  updateUser = async (req: AuthRequest, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;
      
      // Remove sensitive fields that shouldn't be updated through this endpoint
      const { id, email, imapPass, jevApiKey, ...allowedUpdates } = updates;
      
      const success = await this.userModel.update(userId, allowedUpdates);
      
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Delete user account
  deleteUser = async (req: AuthRequest, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const success = await this.userModel.delete(userId);
      
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
