import { Request, Response, NextFunction } from "express";
import { success } from "zod";

export async function adminMiddleware(
    req : Request, 
    res : Response, 
    next : NextFunction
) : Promise<void>{
    try { 
        if(!req.user){ 
            res.status(401).json({ 
                success : false, 
                message : "Unauthorized"
            })
            return
        }

        if(req.user.role !== "admin"){ 
            res.status(403).json({
                success : false, 
                message : "Access Denied. only admin can access"
            })
            return
        }

        next()

    }catch(error){ 
        res.status(500).json({ 
            success : false, 
            message : "Internal server error"
        })
    }
}