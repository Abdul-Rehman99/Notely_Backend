import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
  password: {
    type: String,
    required: true
  },
  // todos: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Todo'
  // }]
}, {timestamps: true});

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } 
  catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);
export default User;
