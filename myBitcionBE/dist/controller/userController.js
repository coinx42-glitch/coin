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
        const { password, email } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (user) {
            const checkCode = yield bcrypt_1.default.compare(password, user.password);
            if (checkCode) {
                if (user.verify && user.token === "") {
                    const encrypted = jsonwebtoken_1.default.sign({ id: user._id, status: user.status }, "jAs", {
                        expiresIn: "1d",
                    });
                    req.session.isAuth = true;
                    req.session.data = user._id;
                    req.session.save((err) => {
  if (err) {
    console.log('Session save error: ', err);
  } else {
    console.log('Session saved successfully');
  }
});
                    return res.status(201 /* HTTP.CREATED */).json({
                        message: "This user has successfully been logged-in",
                        data: encrypted,
                        status: 201,
                    });
                }
                else {
                    return res.status(400 /* HTTP.BAD */).json({
                        message: "Sorry!! Verify your account.",
                        status: 404,
                    });
                }
            }
            else {
                return res.status(400 /* HTTP.BAD */).json({
                    message: "Sorry!! Password is incorrect.",
                    status: 404,
                });
            }
        }
        else {
            return res.status(400 /* HTTP.BAD */).json({
                message: "Sorry!! Email doesn't exist.",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(400 /* HTTP.BAD */).json({
            message: "Sorry!! User not created. There was an error with this request.",
            status: 404,
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
    try {
        const data = req.session.data;
        const read = req.session.cookie;
        return res.status(200 /* HTTP.OK */).json({
            message: "user cookie data",
            data: { data, read },
        });
    }
    catch (error) {
        return res.status(400 /* HTTP.BAD */).json({
            message: "Error creating user: ",
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
