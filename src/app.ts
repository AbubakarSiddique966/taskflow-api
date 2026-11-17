import express from "express"
import {router} from "./routes/authRouts"
import projectRoutes from "./routes/projectRoutes"

const app = express() 


app.use(express.json())

app.use("/api", router)

app.use("/api/project", projectRoutes)

export default app