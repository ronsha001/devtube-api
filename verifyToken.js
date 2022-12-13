import jwt from "jsonwebtoken";

import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }
  
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_JWT_KEY);
  } catch (err) {
    next(err);
  }
  if (!decodedToken) {
    return next(createError(403, "Token is not valid!"));
  }

  req.user = decodedToken;
  next();

};
