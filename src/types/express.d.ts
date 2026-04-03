import { Request } from "express";

// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "VIEWER" | "ADMIN" | "ANALYST" ;
         
      };
    }
  }
}

export {};
