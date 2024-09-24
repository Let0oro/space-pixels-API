import  jwt from "jsonwebtoken";

const auth = async  (req, res, next) => {
  if (req.session && req.session.userId)
    return next();
  else
    return res.status(401).json({message: "User not authorized"});
};

export { auth }