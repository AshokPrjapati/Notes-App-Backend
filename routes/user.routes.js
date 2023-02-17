const express = require("express");
const UserModel = require("../model/user.model");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const auth = express.Router();
require("dotenv").config();

auth.get("/", async (req, res) => {
    try {
        let users = await UserModel.find();
        res.send(users);
    } catch (e) {
        res.send({ error: e.message })
    }
})

auth.post("/register", async (req, res) => {
    const payload = req.body;
    try {
        // Check if the user already exists
        let user = await UserModel.findOne({ email: payload.email });
        if (user) return res.status(401).send({ message: "User already exists" });

        // Hash the password
        const saltRounds = 5;
        const hashedPassword = await bcrypt.hash(payload.pass, saltRounds);
        payload.pass = hashedPassword;

        // Create a new user with the hashed password
        let newUser = new UserModel(payload);
        await newUser.save();
        res.send({ message: "New user has been registered" });

    } catch (e) {
        res.status(500).send({ error: e.message })
    }
});

auth.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    try {
        const user = await UserModel.find({ email });
        if (user.length) {
            bcrypt.compare(pass, user[0].pass, (err, result) => {
                if (result) {
                    let token = jwt.sign({ userId: user[0]._id }, process.env.SECRET_KEY);
                    res.status(200).send({ message: "Login Success", token });
                } else {
                    res.send({ message: "Wrong Password" })
                }
            })
        }
        else res.status(401).send({ message: "Wrong Credentials" })
    } catch (e) {
        res.send({ error: e.message });
    }

});

module.exports = auth