import express from "express";
import { check, validationResult } from "express-validator";
import User from "../../models/User.js";   
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import auth from "../../middleware/auth.js";



const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
// authenticate user & user token

router.post("/",
  [
    check("email", "Valid email is required").isEmail(),
    check("password", "Enter Password").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Check if user already exists
      let userEmail = await User.findOne({ email });
      
      const userPass = await bcrypt.compare(password, userEmail.password)

      if (!userEmail || !userPass) {
        return res.status(400).json({ message: "invalid Credentials" });
      }
      


      const payload = {
        user:{
        id: userEmail.id
        }
      }
      const secret = process.env.SECRET
      jwt.sign(payload, secret,{expiresIn: 36000} , (err,token) => {
        if(err) throw err
        res.status(200).send(token)
      } )

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

export default router;
