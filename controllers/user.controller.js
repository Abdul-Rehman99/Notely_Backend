import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import bcrypt from 'bcrypt'

export const signup = async (req, res) => {
    const { email } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) 
        return res.status(400).json({ message: 'Email already in use' });
      const newUser = new User(req.body);
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '10h' }
      );
      console.log({newUser, token})
      res.status(201).json({ token }); 
    } 
    catch (error) {
      res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
  };

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) 
      return res.status(400).json({ message: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
      return res.status(400).json({ message: 'Invalid email or password' });
    
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '10h' } 
    );

    console.log({user, token})
    res.status(200).json({ token });
  } 
  catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
