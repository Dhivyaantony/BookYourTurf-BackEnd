const users = require('../Model/userModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const doSignUp = async (req, res) => {
    try {
      const { fName, lName, email, password } = req.body;
  
      // Validate required fields
      if (!fName || typeof fName !== 'string' || fName.trim() === '') {
        return res.status(400).json({ message: 'First name is required' });
      }
      
      // Check if email already exists
      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }

      const hash = await bcrypt.hash(password, saltRounds);
  
      const newUser = new users({
        fName: fName.trim(),
        lName,
        email,
        password: hash,
      });
  
      await newUser.save();
  
      res.status(200).json({ message: 'User created' });
    } catch (error) {
      console.error("An error occurred during signup:", error);
  
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  
const doLogin = async (req, res) => {
    try {
        console.log('Login attempt for email:', req.body.email);
        const user = await users.findOne({ email: req.body.email });

        if (user) {
            const result = await bcrypt.compare(req.body.password, user.password);
            if (result) {
                console.log("Login successful for email:", user.email);
                const token = jwt.sign({
                    userId: user._id,
                    email: user.email,
                    fName: user.fName,
                    lName: user.lName,
                    role: user.role
                }, process.env.JWT_PASSWORD);
user.password=undefined
                res.status(200).json({ message: 'Login successful', token: token ,user:user});
            } else {
                console.log("Incorrect password for email:", user.email);
                res.status(401).json({ message: 'Invalid credentials', token: null });
            }
        } else {
            console.log("User not found for email:", req.body.email);
            res.status(401).json({ message: 'Invalid credentials', token: null });
        }
    } catch (error) {
        console.error("An error occurred during login:", error);
        res.status(500).json({ message: 'Internal server error', token: null });
    }
};

module.exports = { doSignUp, doLogin };
