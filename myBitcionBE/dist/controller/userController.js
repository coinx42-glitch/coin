"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewUserStatusByName = exports.viewUserStatus = exports.getCookieUser = exports.logOutUser = exports.getAllUsers = exports.signInUser = exports.VerifyUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const userModel_1 = __importDefault(require("../model/userModel"));
const email_1 = require("../utils/email");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, userName } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const token = crypto_1.default.randomBytes(4).toString("hex");
        const user = yield userModel_1.default.create({
            userName,
            email,
            password: hashed,
            token,
        });
        yield (0, email_1.verifiedEmail)(user);
        return res.status(201 /* HTTP.CREATED */).json({
            message: "Accountcreated successfully.",
            data: user,
            status: 201,
        });
    }
    catch (error) {
        return res.status(400 /* HTTP.BAD */).json({
            message: "Sorry!! There was an error, User not created..",
            data: error === null || error === void 0 ? void 0 : error.message,
            status: 404,
        });
    }
});
exports.createUser = createUser;
const VerifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        const user = yield userModel_1.default.findOne({ token });
        if (user) {
            const updatedUser = yield userModel_1.default.findByIdAndUpdate(user._id, { token: "", verify: true }, { new: true });
            console.log("Updated user:", updatedUser);
            return res.status(201 /* HTTP.CREATED */).json({
                message: "This user has succeddfully been verified",
                data: user,
                status: 201,
            });
        }
        else {
            return res.status(400 /* HTTP.BAD */).json({
                message: "Sorry!! This token has already been used by you.. Or You are not registered to this platform.",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(400 /* HTTP.BAD */).json({
            message: "Sorry!! T here was an error, User not created..",
            data: error,
            status: 404,
        });
    }
});
exports.VerifyUser = VerifyUser;
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (user && (yield bcrypt_1.default.compare(password, user.password))) {
            if (user.verify && user.token === "") {
                const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: "1d",
                });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "none",
                    maxAge: 24 * 60 * 60 * 1000,
                });
                return res.status(201).json({
                    message: "User logged in successfully.",
                    status: 201,
                    token,
                });
            }
            else {
                return res.status(400).json({
                    message: "Please verify your account.",
                });
            }
        }
        else {
            return res.status(400).json({
                message: "Invalid email or password.",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "Server error.",
            error: error.message,
        });
    }
});
exports.signInUser = signInUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUsers = yield userModel_1.default.find();
        return res.status(200 /* HTTP.OK */).json({
            message: "Viewing all users",
            data: getUsers,
            length: getUsers.length,
        });
    }
    catch (error) {
        return res.status(400 /* HTTP.BAD */).json({
            message: "Error Finding Users",
            data: error,
        });
    }
});
exports.getAllUsers = getAllUsers;
const logOutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("aydee", {
            maxAge: 0,
            secure: false,
            sameSite: "lax",
        });
        req.session.destroy();
        return res.status(200 /* HTTP.OK */).json({
            message: "User has been loggged out",
        });
    }
    catch (error) {
        return res.status(400 /* HTTP.BAD */).json({
            message: "Error logging userout",
            data: error,
        });
    }
});
exports.logOutUser = logOutUser;
const getCookieUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Get the token from the Authorization header or the cookie
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
        if (!token) {
            return res.status(401).json({
                message: "No token provided. Access denied.",
            });
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Fetch user based on token information (ID from JWT)
        const user = yield userModel_1.default.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }
        // Return user information
        return res.status(200).json({
            message: "User found.",
            user,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve user.",
            error: error.message,
        });
    }
});
exports.getCookieUser = getCookieUser;
const viewUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        return res.status(200).json({
            message: "viewing user record",
            user,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying user",
        });
    }
});
exports.viewUserStatus = viewUserStatus;
const viewUserStatusByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName } = req.params;
        const user = yield userModel_1.default.findOne({ userName });
        return res.status(200).json({
            message: "viewing user record by her name",
            data: user,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying user",
        });
    }
});
exports.viewUserStatusByName = viewUserStatusByName;
