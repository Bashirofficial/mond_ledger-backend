import { Request } from "express";
import { Role } from "../generated/client/enums";

// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role:  Role;
         
      };
    }
  }
}

export {};
