import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserModal from '../models/user.js';
dotenv.config();
const secret = process.env.JWT_KEY;

//Potentially need to add forgot password logic here

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
      const knownUser = await UserModal.findOne({ email });
  
      if (!knownUser) return res.status(404).json({ message: "User doesn't exist " });
  
      const isPasswordCorrect = await bcrypt.compare(password, knownUser.password);
  
      if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ email: knownUser.email, id: knownUser._id }, secret.toString(), { expiresIn: "1h" });
  
      res.status(200).json({ result: knownUser, token });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  };
  
  export const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
      const knownUser = await UserModal.findOne({ email });
  
      if (knownUser) return res.status(400).json({ message: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
  
      const token = jwt.sign( { email: result.email, id: result._id }, secret.toString(), { expiresIn: "1h" } );
  
      res.status(201).json({ result, token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
      
      console.log(error);
    }
  };