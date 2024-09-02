import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import adminModel from "../model/adminModel";
import { HTTP } from "../utils/enums";

export const createAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password, adminName, address, avatar, avatarID } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const token = crypto.randomBytes(4).toString("hex");

    const admin = await adminModel.create({
      adminName,
      email,
      password: hashed,
      address,
      avatar,
      avatarID,
      token,
    });

    return res.status(HTTP.CREATED).json({
      message: "Admin created successfully.",
      data: admin,
      status: 201,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Sorry! Admin not created.",
      data: error?.message,
      status: 404,
    });
  }
};

export const verifyAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token } = req.body;
    const admin = await adminModel.findOne({ token });

    if (admin) {
      const updatedAdmin = await adminModel.findByIdAndUpdate(
        admin._id,
        { token: "", verify: true },
        { new: true }
      );

      return res.status(HTTP.OK).json({
        message: "Admin successfully verified.",
        data: updatedAdmin,
        status: 200,
      });
    } else {
      return res.status(HTTP.BAD).json({
        message: "Invalid or expired token.",
        status: 404,
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error verifying admin.",
      data: error?.message,
      status: 404,
    });
  }
};

export const signInAdmin = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(HTTP.NOT_FOUND).json({
        message: "Admin not found.",
        status: HTTP.NOT_FOUND,
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(HTTP.UNAUTHORIZED).json({
        message: "Incorrect password.",
        status: HTTP.UNAUTHORIZED,
      });
    }

    if (!admin.verify) {
      return res.status(HTTP.UNAUTHORIZED).json({
        message: "Admin not verified.",
        status: HTTP.UNAUTHORIZED,
      });
    }

    const token = jwt.sign(
      { id: admin._id, status: admin.status },
      "secretKey",
      { expiresIn: "1d" }
    );

    req.session.isAuth = true;
    req.session.isAdmin = true;
    req.session.data = admin._id;

    return res.status(HTTP.OK).json({
      message: "Admin signed in successfully.",
      token,
      status: HTTP.OK,
    });
  } catch (error: any) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: "Error signing in admin.",
      data: error?.message,
      status: HTTP.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getAllAdmins = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const admins = await adminModel.find();

    return res.status(HTTP.OK).json({
      message: "Viewing all admins.",
      data: admins,
      status: 200,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error fetching admins.",
      data: error?.message,
      status: 404,
    });
  }
};

export const getAdminById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { adminID } = req.params;
    const admin = await adminModel.findById(adminID);

    if (admin) {
      return res.status(HTTP.OK).json({
        message: "Viewing admin details.",
        data: admin,
        status: 200,
      });
    } else {
      return res.status(HTTP.NOT_FOUND).json({
        message: "Admin not found.",
        status: 404,
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "  .",
      data: error?.message,
      status: 404,
    });
  }
};

export const updateAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { adminID } = req.params;
    const updates = req.body;

    const updatedAdmin = await adminModel.findByIdAndUpdate(adminID, updates, {
      new: true,
    });

    return res.status(HTTP.OK).json({
      message: "Admin updated successfully.",
      data: updatedAdmin,
      status: 200,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error updating admin.",
      data: error?.message,
      status: 404,
    });
  }
};

export const deleteAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { adminID } = req.params;
    await adminModel.findByIdAndDelete(adminID);

    return res.status(HTTP.OK).json({
      message: "Admin deleted successfully.",
      status: 200,
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: "Error deleting admin.",
      data: error?.message,
      status: 404,
    });
  }
};

export const getCookieAdmin = async (req: any, res: Response) => {
  try {
    const data = req.session.data;
    const isAdmin = req.session.isAdmin;

    return res.status(HTTP.OK).json({
      message: "user cookie data",
      data: { data, isAdmin },
    });
  } catch (error: any) {
    console.log(error?.message);
    return res.status(HTTP.BAD).json({
      message: "Error creating user: ",
    });
  }
};
