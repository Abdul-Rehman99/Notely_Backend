import jwt from 'jsonwebtoken'

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization').split(" ")[1];
  if (!token) 
    return res.status(401).json({ message: 'No token provided. Access denied.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(Date.now().toString()+" authenticateJWT : ", decoded)
    req.user = decoded;
    next();
  } 
  catch (error) {
    res.status(403).json({ message: 'Invalid token.' });
  }
};

export default authenticateJWT;
