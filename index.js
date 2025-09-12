import express from "express";
import ConnectDB from "./config/dbConnection.js";
import dotenv from "dotenv";
import register from "./routes/api/users.js"
import auth from "./routes/api/auth.js"
import Profile from "./routes/api/profile.js";


dotenv.config();

const app = express()

const port = process.env.PORT || 5000;

ConnectDB()
app.use(express.json())


app.get("/", (req, res) => {
    res.send("app is running")
})
app.use('/api/users', register);
app.use("/api/auth", auth)
app.use("/api/profile", Profile)

app.listen(port, ()=> {
    console.log("app is listening")
})
