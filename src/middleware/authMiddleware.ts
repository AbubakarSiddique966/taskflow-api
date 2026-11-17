
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: string;
    role: "user" | "admin";
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    try {
        
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Authentication token missing"
            });
            return;
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Token is invalid or missing"
            });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            res.status(500).json({
                success: false,
                message: "JWT_SECRET is missing"
            });
            return;
        }

        const decoded = jwt.verify(token, jwtSecret);


        if (
            typeof decoded === "string" ||
            typeof decoded.userId !== "string" ||
            decoded.userId.length === 0 ||
            (decoded.role !== "admin" && decoded.role !== "user")
        ) {
            res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
            return;
        }

        const payload: JwtPayload = {
            userId: decoded.userId,
            role: decoded.role
        };

        req.user = payload;

        next();

    } catch (error) {

        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}
