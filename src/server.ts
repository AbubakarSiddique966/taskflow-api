import app from "./app"
import dotenv from "dotenv"
import connectDb  from "./db/database"


dotenv.config() 


connectDb()

app.listen(process.env.PORT, () => {
    console.log("Server is started at 3000 port")
})