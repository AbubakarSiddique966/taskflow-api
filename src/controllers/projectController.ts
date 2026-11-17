
import { Request, Response } from "express";
import projectModel from "../models/projectModel";
import { success } from "zod";
import { ftruncateSync } from "node:fs";
import { userInfo } from "node:os";
import userModel from "../models/userModel";

export async function createProject(
    req: Request,
    res: Response
): Promise<void> {

    try {
        const { title, description } = req.body;

        if (!title || !description) {
            res.status(400).json({
                success: false,
                message: "Title and description must be provided"
            });
            return;
        }

        
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
            return;
        }

        
        const project = await projectModel.create({
            title,
            description,
            owner: userId
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project
        });

    } catch (error) {
        console.error("Create project error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create project"
        });
    }
}


export async function getAllProjects(req : Request, res : Response) : Promise<void> {
    try{ 

        const userId = req.user?.userId

        if(!userId){
            res.status(401).json({ 
                success : false, 
                message : "Unauthorized"
            })
            return
        }

        const {search, status, page, limit} = req.query 

        const currentPage = Math.max(1, Number(page) || 1) 
        const perPage = Math.min(100, Math.max(1, Number(limit) || 5))
        const skip = (currentPage - 1) * perPage 

        const filter : Record<string, unknown> = {
            owner : userId
        }

        if(typeof search === "string" && search.trim()){ 
            filter.title = { 
                $regex : search.trim(), 
                $options : "i"
            }
        }

        if(typeof status === "string"){
            if(!["active", "completed", "on-hold"].includes(status)){ 
                res.status(400).json({ 
                    success : false, 
                    message : "Invalid project status"
                })
                return
            }
        
            filter.status = status
        }

        const [projects, totalProjects] = await Promise.all([
            projectModel
                .find(filter)
                .sort({createdAt : -1})
                .skip(skip)
                .limit(perPage),

            projectModel.countDocuments(filter)
        ])

        res.status(200).json({
            success : true, 
            pagination : { 
                totalProjects, 
                currentPage,
                totalPages : Math.ceil(totalProjects / currentPage),
                perPage
            },

            projects
        })

    }catch(error){ 
        res.status(500).json({
            success : false, 
            message : "cannot get projects", 
            error
        })
    }
}


export async function getProjectById(req : Request, res : Response) : Promise<void> {
    try { 

        const userId = req.user?.userId 

        if(!userId){ 
            res.status(400).json({ 
                success : false,
                message : "unauthorized"
            })

            return
        }

        const {id} = req.params

        if(!id){ 
            res.status(400).json({
                success : false, 
                message : "project id is required"
            })
            return
        }

        const projects = await projectModel.findOne({
            _id : id, 
            owner : userId
        })

        if(!projects){ 
            res.status(400).json({
                success : false, 
                message : "project not found"
            })
        }

        res.status(200).json({
            success : true, 
            message : "project fetched successfully",
            projects
        })

    } catch (error){ 
        res.status(500).json({ 
            success : false, 
            message : "internal server error", 
            error
        })
    }
}


export async function updateProject(req : Request, res : Response) : Promise<void>{
    
    try { 

        const userId = req.user?.userId

        if(!userId){ 
            res.status(400).json({
                success : false, 
                message : "unauthorized"
            })
            return
        }

        const id = req.params.id

        if(!id){
            res.status(400).json({
                success : false, 
                message : "Project id is required"
            })
            return
        }

        const {title, description, status} = req.body 

        if(title === undefined && 
            description === undefined && 
            status === undefined
        ){ 
            res.status(400).json({
                success : false, 
                message : "Please provide atleast one feild"
            })
            return
        }

        const project = await projectModel.findOne({ 
            _id : id, 
            owner : userId
        })

        if(!project){ 
            res.status(400).json({ 
                success : false, 
                message : "Project not found"
            })
            return
        }

        if(title !== undefined) project.title = title 
        if(description !== undefined) project.description = description 
        if(status !== undefined) project.status = status 

        await project.save()

        res.status(200).json({
            success : true, 
            message : "Project updated successfully",
            project
        })

    } catch(error){ 
        res.status(500).json({ 
            success : false, 
            message : "Internal server error", 
            error
        })
    }
}



export async function deleteProject(req : Request, res : Response) : Promise<void> {
    try { 

        const userId = req.user?.userId 

        if(!userId){ 
            res.status(400).json({ 
                success : false, 
                message : "unauthorized"
            })
            return
        }

        const id = req.params.id 

        if(!id){ 
            res.status(400).json({ 
                success : false, 
                message : "project id is required"
            })
            return
        }

        const deleteProject = await projectModel.findOneAndDelete({
            _id : id, 
            owner : userId
        })

        if(!deleteProject){ 
            res.status(400).json({
                success : false, 
                message : "No project found"
            })
            return
        }

        res.status(200).json({ 
            success : true, 
            message : "Project is deleted successfully",
            userID : deleteProject?._id
        })

    }catch(error){ 
        res.status(500).json({ 
            success : false, 
            message : "Internal server error", 
            error
        })
    }
}


export async function getAllProjectsForAdmin(
    req : Request, 
    res : Response, 
) : Promise<void>{ 

    try { 

       const {search, status, page, limit} = req.query 

       const currentPage = Math.max(1, Number(page) || 1) 
       const perPage = Math.min(100, Math.max(1, Number(limit) || 5))
       const skip = (currentPage - 1) * perPage 

       const filter : Record<string, unknown> = {} 

       if(typeof search === "string" && search.trim()){
        filter.title = { 
            $regex : search.trim(),
            $options : "i"
        }
       }

       if(typeof status === "string"){
        if(!["active", "completed", "on-hold"].includes(status)){ 
            res.status(400).json({ 
                success : false, 
                message : "Invalid project status"
            })
            return;
        }
        filter.status = status
       }

       const [projects, totalProjects] = await Promise.all([
            projectModel
                .find(filter)
                .populate("owner", "name email")
                .sort({createdAt : -1})
                .skip(skip)
                .limit(perPage),

            projectModel.countDocuments(filter)
       ])

       res.status(200).json({ 
        success : true, 
        pagination : {
            totalProjects, 
            currentPage, 
            totalPage : Math.ceil(totalProjects / perPage), 
            perPage
        },
        projects
       })
    } catch (error) { 
        res.status(500).json({
            success : false, 
            message : "Failed to get projects",
            error
        })
    }

}


export async function getAllUserAdmin(req : Request, res : Response) : Promise<void>{

    try { 
        const user = await projectModel.find().select("-password")

        res.status(200).json({
            success : true, 
            message : "Successfully fetched all user", 
            count : user.length,
            user
        })

    } catch (error){ 
        res.status(500).json({ 
            success : false, 
            message : "failed to get all user",
            error
        })
    }
}


export async function deleteUserAdmin(req : Request, res : Response) : Promise<void>{
    try { 

        const adminId = req.user?.userId 
        const id = req.params.id 

        if(!adminId){ 
            res.status(400).json({
                success : false, 
                message : "Unauthorized"
            })
            return
        }

        if(!id){ 
            res.status(400).json({
                success : false,
                message : "User id is required"
            })
            return
        }

        if(adminId === id){
            res.status(400).json({ 
                success : false, 
                message : "You cannot delete your own id"
            })
            return
        }

        const user = await projectModel.findById(id) 

        if(!user){ 
            res.status(400).json({
                success : false, 
                message : "user not found"
            })
            return
        }

        await projectModel.deleteMany({
            owner : id
        })

        await projectModel.findByIdAndDelete(id) 

        res.status(200).json({ 
            success : true, 
            message : "User and their projects deleted successfully"
        })

    }catch (error) { 
        res.status(500).json({ 
            success : false, 
            message : "Cannot delete the user", 
            error
        })
    }
}


export async function getAdminStatistics(req : Request, res : Response) : Promise<void>{
    try { 

        const [totalUsers,
            totalProjects,
            activeProjects,
            completedProjects,
            onHoldProjects] = await Promise.all([
                userModel.countDocuments(), 

                projectModel.countDocuments(), 

                projectModel.countDocuments({
                    status : "active"
                }), 

                projectModel.countDocuments({
                    status : "completed"
                }),

                projectModel.countDocuments({
                    status : "on-hold"
                })
            ])

            res.status(200).json({
                success : true, 
                statistics : {
                    totalUsers,
                    totalProjects, 
                    activeProjects,
                    completedProjects, 
                    onHoldProjects
                } 
            })

    }catch(error){ 
        res.status(500).json({ 
            success : false, 
            message : "Failed to fetched statistics", 
            error
        })
    }
}