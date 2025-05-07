import jwt from "jsonwebtoken"
export const generateToken = (res, user, message) => {
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" })
    res.status(200).cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000             //1day
    });
    return res.status(200).json({
        success: true,
        message,
        user
    })
}

