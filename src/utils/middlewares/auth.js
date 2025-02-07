import jwt from "jsonwebtoken";
import { secret } from "../../config/config.js";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      error: {
        es: "Acceso denegado, se requiere un token",
        en: "Access denied, token required",
      },
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        es: "Token inválido o expirado",
        en: "Invalid or expired token",
      },
    });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      error: {
        es: "Acceso denegado, permisos insuficientes",
        en: "Access denied, insufficient permissions",
      },
    });
  }
  next();
};
