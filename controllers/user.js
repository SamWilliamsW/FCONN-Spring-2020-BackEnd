import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UserModal from '../models/user.js';
import RestaurantsModel from '../models/restaurants.js';

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
    const { email, password, firstName, lastName} = req.body;
    try {
      const knownUser = await UserModal.findOne({ email });
  
      if (knownUser) return res.status(400).json({ message: "User already exists" });
      
      // get password length
      const passwordLength = password.length;

      if (passwordLength < 8 || passwordLength > 25){
        return res.status(400).json({ message: "Password must be between 8 and 25 characters" });
      }

      // Check if there is a number in the password
      const hasNumber = /\d/;
      if (!hasNumber.test(password)){
        return res.status(400).json({ message: "Password must contain a number" });
      }


  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`, isAdmin: false});
  
      const token = jwt.sign( { email: result.email, id: result._id }, secret.toString(), { expiresIn: "1h" } );
  
      res.status(201).json({ result, token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
      
      console.log(error);
    }
  };

  export const businesssignup = async (req, res) => {
    const { email, password, businessName, businessAddress, businessCity, businessState, businessPhoneNumber, businessZip, businessDescription, businessHoursStartSun, businessHoursStartMon, businessHoursStartTue, businessHoursStartWed, businessHoursStartThu, businessHoursStartFri, businessHoursStartSat, businessHoursEndSun, businessHoursEndMon, businessHoursEndTue, businessHoursEndWed, businessHoursEndThu, businessHoursEndFri, businessHoursEndSat, businessTags, businessDelivery, businessTakeout, businessDineIn, businessMenuLink, businessPhoto} = req.body;
    try {
      const knownUser = await UserModal.findOne({ email });

      if (knownUser) return res.status(400).json({ message: "User already exists" });

      // get password length
      const passwordLength = password.length;

      if (passwordLength < 8 || passwordLength > 25){
        return res.status(400).json({ message: "Password must be between 8 and 25 characters" });
      }

      // Check if there is a number in the password
      const hasNumber = /\d/;
      if (!hasNumber.test(password)){
        return res.status(400).json({ message: "Password must contain a number" });
      }

      const businessHoursStartArray = [businessHoursStartSun, businessHoursStartMon, businessHoursStartTue, businessHoursStartWed, businessHoursStartThu, businessHoursStartFri, businessHoursStartSat]
      const businessHoursEndArray = [businessHoursEndSun, businessHoursEndMon, businessHoursEndTue, businessHoursEndWed, businessHoursEndThu, businessHoursEndFri, businessHoursEndSat]
      
      // Remove spaces then split by ,
      //const businessHoursStartArray = businessHoursStart.replace(/\s/g, '').split(',');
      //const businessHoursEndArray = businessHoursEnd.replace(/\s/g, '').split(',');
      

      const tagsArray = businessTags.replace(/\s/g, '').split(',');

      const hashedPassword = await bcrypt.hash(password, 12);

      const approved = false;
  
      const result = await UserModal.create({ email, password: hashedPassword, name: businessName, isAdmin: false});
      const restaurantresult = await RestaurantsModel.create({ name: businessName, address: businessAddress, city: businessCity, state: businessState, zip: businessZip, phone: businessPhoneNumber, description: businessDescription, businessHoursStart: businessHoursStartArray, businessHoursEnd: businessHoursEndArray, tags: tagsArray, delivery: businessDelivery, takeout: businessTakeout, dinein: businessDineIn, comments: [], menuLink: businessMenuLink, photo: businessPhoto, approved: approved, userId: result._id });
      const token = jwt.sign( { email: result.email, id: result._id }, secret.toString(), { expiresIn: "1h" } );
  
      res.status(201).json({ result, token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
      
      console.log(error);
    }
  };
  