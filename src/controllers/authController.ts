import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel";
import { registerSchema, loginSchema } from "../validators/authValidator";
import jwt from "jsonwebtoken"





export async function registerUser(req : Request, res : Response) : Promise<void>{
    
    try { 

        const validation = registerSchema.safeParse(req.body); 

        if (!validation.success) {
            res.status(400).json({
            success: false,
            message: validation.error.issues[0]?.message
            });
        return;
        }

        const { name, email, password } = validation.data;

        const existingUser = await userModel.findOne({email})

        if(existingUser){ 
            res.status(400).json({
                success : false, 
                message : "Email is already exist"
            })

            return
        }

        const hashedPassword = await bcrypt.hash(password, 10) 

        const user = await userModel.create({
            name, 
            email, 
            password : hashedPassword
        })
        
        res.status(201).json({ 
            success : true, 
            message : "user is created successfully", 
            user : { 
                id : user._id, 
                name : user.name, 
                email : user.email, 
                role : user.role
            }
        })

    } catch (error) { 

        console.error("Registration error", error)

        res.status(500).json({ 
            success : false,
            message : "Internal server error"
        })
    }
}


export async function loginUser(req : Request, res : Response) : Promise<void>{
    
    try { 

        const validation = loginSchema.safeParse(req.body) 

        if (!validation.success) {
            res.status(400).json({
                success: false,
                message: validation.error.issues[0]?.message
            });
            return;
        }

        const {email, password} = validation.data;

        const user = await userModel.findOne({email}) 

        if(!user){ 
            res.status(401).json({ 
                success : false, 
                message : "Invalid email or password"
            })
            return
        }

        const isPasswordCorrect = await bcrypt.compare(
            password, 
            user.password
        )

        if(!isPasswordCorrect){ 
            res.status(401).json({ 
                success : false, 
                message : "invalid email or password"
            })
            return
        }

        if(!process.env.JWT_SECRET){ 
            throw new Error("JWT_SECRET is missing")
        }


        const token = jwt.sign(

            {
                userId : user._id.toString(), 
                role : user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn : "1d"
            }

        )

        res.status(200).json({
            success : true, 
            message : "Login Successfully",
            token,
            user : {
                id : user._id,
                name : user.name, 
                email : user.email, 
                role : user.role
            }

        })

    }catch (error) {

        console.error("Login error", error)

        res.status(500).json({ 
            success : false, 
            message : "Internal server error"
        })
    }
}



export async function getProfile(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Profile error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
