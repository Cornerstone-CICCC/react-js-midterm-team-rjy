import { Request, Response } from "express";
import {User} from "../models/user.model";

/**
 * Sign up a new user
 */

export const signUp = async (req: Request, res: Response) => {
    try{
        const { fullname, email, password } = req.body;

        if(!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newUser = await User.create({ fullname, email, password });

        if(req.session) {
            req.session.userId = newUser._id.toString();
            req.session.isLoggedIn = true;
        }

        res.status(201).json({ message: "User created successfully", id: newUser._id,
           fullname: newUser.fullname, email: newUser.email }); 
    } catch (error) {
        console.error("Signup error: ",error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Log in an existing user
 */

export const logIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return  res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if(req.session) {
            req.session.userId = user._id.toString();
            req.session.isLoggedIn = true;
        }

      res.status(200).json({
      message: "Login successful",
      user: { id: user._id, fullname: user.fullname, email: user.email },
    });

    }catch (error) {
        console.error("Login error: ",error);
        res.status(500).json({ message: "Internal server error" });
    }
}


/**
 * Get current logged-in user
 */

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const userId = req.session?.userId;
        if(!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User.findById(userId).select("-password");
        if(!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ user });

    }catch (error) {
        console.error("Get current user error: ",error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Log out the current user
 */
export const logOut = (req: Request, res: Response) => {
  if (req.session) (req.session as any) = null;
  res.status(200).json({ message: "Logout successful!" });
};

/**
 * Change password for the logged-in user
 */
export const updateProfile = async (req: Request, res: Response) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { fullname, email, address } = req.body;

  const updated = await User.findByIdAndUpdate(
    req.session.userId,
    {
      fullname: fullname || "",
      email: email || "",
      address: address || "",
    },
    { new: true }
  );

  res.status(200).json({
    message: "Profile updated",
    user: updated,
  });
};


export default {
    signUp,
    logIn,
    getCurrentUser,
    logOut,
    updateProfile
}