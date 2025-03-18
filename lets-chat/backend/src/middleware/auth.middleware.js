import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        console.log("Cookies:", req.cookies); // Add this line to log the cookies
        const token = req.cookies.jwt; // we already named the cookie as jwt in utils so we should call same word
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("error found in middleware", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};