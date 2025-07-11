import User from "../models/User.js";

export const home = async(req,res)=>{
    try {
        res.status(200).send("student management system home pages");
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

export const login = async(req,res)=>{
    try {
         res.status(200).send("login pages");
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}
export const adduser = async(req,res)=>{
    const { name, email, password, role } = req.body;
    try {
         // Check for existing user
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = new User({ name, email, password, role });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
}
