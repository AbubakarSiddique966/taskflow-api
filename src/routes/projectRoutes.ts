import { Router } from "express";
import { createProject,
    getAllProjects,
    getProjectById, 
    updateProject,
    deleteProject,
    getAllProjectsForAdmin,
    getAllUserAdmin,
    deleteUserAdmin,
    getAdminStatistics
} 
from "../controllers/projectController";

import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = Router() 


router.post("/", authMiddleware, createProject)

router.get("/", authMiddleware, getAllProjects)

router.get("/admin", authMiddleware, adminMiddleware, getAllProjectsForAdmin)

router.get("/:id", authMiddleware, getProjectById)

router.put("/:id", authMiddleware, updateProject)

router.delete("/:id", authMiddleware, deleteProject)

router.get("/admin/all", authMiddleware, adminMiddleware, getAllUserAdmin)

router.delete("/admin/:id", authMiddleware, adminMiddleware, deleteUserAdmin)

router.get("/admin/statistics", authMiddleware, adminMiddleware, getAdminStatistics)

export default router