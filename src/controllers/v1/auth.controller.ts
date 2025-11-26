import { Request, Response } from "express";
import * as logger from "../../utils/logger";
import * as authService from "../../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        status: "error",
        message: "Email, password, and name are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email format",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long",
      });
    }

    // Create user
    const user = await authService.createUser({ email, password, name });

    // Generate token
    const token = authService.generateToken(user.id);

    logger.info(`User registered successfully: ${email}`);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error: any) {
    logger.error("Registration error:", error);

    if (error.message === "User already exists") {
      return res.status(409).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Internal server error during registration",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    // Authenticate user
    const user = await authService.authenticateUser({ email, password });

    // Generate token
    const token = authService.generateToken(user.id);

    logger.info(`User logged in successfully: ${email}`);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user,
        token,
      },
    });
  } catch (error: any) {
    logger.error("Login error:", error);

    if (error.message === "Invalid credentials") {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Internal server error during login",
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // User is attached to request by auth middleware
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    const user = await authService.getUserById(req.user.userId);

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error: any) {
    logger.error("Get profile error:", error);

    if (error.message === "User not found") {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
