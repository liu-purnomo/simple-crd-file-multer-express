// middleware/checkAuth.js
const tokenKey = process.env.TOKEN_KEY;

const checkAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== `Bearer ${tokenKey}`) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }
  next();
};

module.exports = checkAuth;
