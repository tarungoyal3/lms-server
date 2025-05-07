import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        // Decode the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Attach the userId from the decoded token to the request
        req.id = decoded.userId;

        // Continue with the request
        next();
    } catch (error) {
        // If JWT verification fails, respond with an error
        console.error("Authentication error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default isAuthenticated;
