import jwt from "jsonwebtoken";

const verifyUser = (req, res, next) => {
  try {
    let token = null;

    // 1️⃣ Check cookies first
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // 2️⃣ Check Authorization header (Bearer <token>)
    else if (req.headers?.authorization) {
      const parts = req.headers.authorization.split(" ");

      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      } else {
        return res.status(400).json({ message: "Invalid Authorization header format" });
      }
    }

    // 3️⃣ No token found
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 5️⃣ Attach user data to request object
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    return res.status(401).json({
      message:
        error.name === "TokenExpiredError"
          ? "Token expired, please login again"
          : "Invalid token",
    });
  }
};

export default verifyUser;
