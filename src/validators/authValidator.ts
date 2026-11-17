import {z} from "zod"


export const registerSchema = z.object({ 
    name : z
        .string()
        .min(4, "Name must be atleast 4 character"),

    
    email : z
        .string()
        .email("Please enter a valid email"),
    
    password : z
        .string()
        .min(6, "Password must be atleast 6 character")
})



export const loginSchema = z.object({ 

    email : z 
        .string()
        .email("Please enter a valid email"),

    password : z 
        .string()
        .min(6, "Password must be atleast 6 characters")
})

