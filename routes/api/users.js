import express from "express";
import { check, validationResult } from "express-validator";
import User from "../../models/User.js";   
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const router = express.Router();

router.post("/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid email is required").isEmail(),
    check("password", "Password should be at least 8 characters long").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Get user's gravatar
      const avatar = gravatar.url(email, {
        s: "200", // Size
        r: "pg",  // Rating
        d: "mm",  // Default
      });

      // Create new user instance
      const newUser = new User({
        name,
        email,
        avatar,
        password,
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);

      // Save to DB
      await newUser.save();

      const payload = {
        user: {
        id: newUser.id
      }
      }
      const secret = process.env.SECRET
      jwt.sign(payload, secret,{expiresIn: 36000} , (err,token) => {
        if(err) throw err
        res.json({token})
      } )

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

export default router;
