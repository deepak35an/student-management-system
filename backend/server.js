import express from "express";
import mongoose from "mongoose";
import router from "./router/auth-router.js"
import { ConnectDb } from "./utils/db.js";


const app = express();

app.use(express.json());

app.use("/api/auth", router);

// app.get("/", (req,res)=>{
//     res.status(200).send("student management system home pages");
// })
// app.get("/login", (req,res)=>{
//     res.status(200).send("login pages");
// })

const PORT = 5005
ConnectDb().then(() => {
    app.listen(PORT, () => {
        console.log("server is running on port 5005");
    });
})
