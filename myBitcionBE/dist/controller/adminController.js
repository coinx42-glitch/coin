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
exports.getCookieAdmin = exports.deleteAdmin = exports.updateAdmin = exports.getAdminById = exports.getAllAdmins = exports.signInAdmin = exports.verifyAdmin = exports.createAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminModel_1 = __importDefault(require("../model/adminModel"));
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, adminName, address, avatar, avatarID } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const token = crypto_1.default.randomBytes(4).toString("hex");
        const admin = yield adminModel_1.default.create({
            adminName,
            email,
            password: hashed,
            address,
            avatar,
            avatarID,
            token,
        });
        return res.status(201 /* HTTP.CREATED */).json({
            message: "Admin created successfully.",
            data: admin,
            status: 201,
        });
    }
    catch (error) {
        return res.status(400 /* HTTP.BAD */).json({
            message: "Sorry! Admin not created.",
            data: error === null || error === void 0 ? void 0 : error.message,
            status: 404,
        });
    }
});
exports.createAdmin = createAdmin;
const verifyAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        const admin = yield adminModel_1.default.findOne({ token });
        if (admin) {
            const updatedAdmin = yield adminModel_1.default.findByIdAndUpdate(admin._id, { token: "", verify: true }, { new: true });
            return res.status(200 /* HTTP.OK */).json({
                message: "Admin successfully verified.",
                data: updatedAdmin,
                status: 200,
            });
        }
        else {
            return res.status(400 /* HTTP.BAD */).json({
                message: "Invalid or expired token.",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(400 /* HTTP.BAD */).json({
            message: "Error verifying admin.",
            data: error === null || error === void 0 ? void 0 : error.message,
            status: 404,
        });
    }
});
exports.verifyAdmin = verifyAdmin;
const signInAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const admin = yield adminModel_1.default.findOne({ email });
        if (!admin) {
            return res.status(404 /* HTTP.NOT_FOUND */).json({
                message: "Admin not found.",
                status: 404 /* HTTP.NOT_FOUND */,
            });
        }
        const isMatch = yield bcrypt_1.default.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401 /* HTTP.UNAUTHORIZED */).json({
                message: "Incorrect password.",
                status: 401 /* HTTP.UNAUTHORIZED */,
            });
        }
        if (!admin.verify) {
            return res.status(401 /* HTTP.UNAUTHORIZED */).json({
                message: "Admin not verified.",
                status: 401 /* HTTP.UNAUTHORIZED */,
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin._id, status: admin.status }, "secretKey", { expiresIn: "1d" });
        req.session.isAuth = true;
        req.session.isAdmin = true;
        req.session.data = admin._id;
        return res.status(200 /* HTTP.OK */).json({
            message: "Admin signed in successfully.",
            token,
            status: 200 /* HTTP.OK */,
        });
    }
    catch (error) {
        return res.status(500 /* HTTP.INTERNAL_SERVER_ERROR */).json({
            message: "Error signing in admin.",
            data: error === null || error === void 0 ? void 0 : error.message,
            status: 500 /* HTTP.INTERNAL_SERVER_ERROR */,
        });
    }
});
exports.signInAdmin = signInAdmin;
const getAllAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield adminModel_1.default.find();
        return res.status(200 /* HTTP.OK */).json({
            message: "Viewing all admins.",
            data: admins,
            status: 200,
        });
    }
    catch (error) {
        return res.status(400 /* HTTP.BAD */).json({
            message: "Error fetching admins.",
            data: error === null || error === void 0 ? void 0 : error.message,
            status: 404,
        });
    }
});
exports.getAllAdmins = getAllAdmins;
const getAdminById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const admin = yield adminModel_1.default.findById(adminID);
        if (admin) {
            return res.status(200 /* HTTP.OK */).json({
                message: "Viewing admin details.",
                data: admin,
                status: 200,
            });
        }
        else {
            return res.status(404 /* HTTP.NOT_FOUND */).json({
                message: "Admin not found.",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(400 /* HTTP.BAD */).json({
            message: "  .",
            data: error === null || error === void 0 ? void 0 : error.message,
            status: 404,
        });
    }
});
exports.getAdminById = getAdminById;
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        const updates = req.body;
        const updatedAdmin = yield adminModel_1.default.findByIdAndUpdate(adminID, updates, {
            new: true,
        });
        return res.status(200 /* HTTP.OK */).json({
            message: "Admin updated successfully.",
            data: updatedAdmin,
            status: 200,
        });
    }
    catch (error) {
        return res.status(400 /* HTTP.BAD */).json({
            message: "Error updating admin.",
            data: error === null || error === void 0 ? void 0 : error.message,
            status: 404,
        });
    }
});
exports.updateAdmin = updateAdmin;
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID } = req.params;
        yield adminModel_1.default.findByIdAndDelete(adminID);
        return res.status(200 /* HTTP.OK */).json({
            message: "Admin deleted successfully.",
            status: 200,
        });
    }
    catch (error) {
        return res.status(400 /* HTTP.BAD */).json({
            message: "Error deleting admin.",
            data: error === null || error === void 0 ? void 0 : error.message,
            status: 404,
        });
    }
});
exports.deleteAdmin = deleteAdmin;
const getCookieAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.session.data;
        const isAdmin = req.session.isAdmin;
        return res.status(200 /* HTTP.OK */).json({
            message: "user cookie data",
            data: { data, isAdmin },
        });
    }
    catch (error) {
        console.log(error === null || error === void 0 ? void 0 : error.message);
        return res.status(400 /* HTTP.BAD */).json({
            message: "Error creating user: ",
        });
    }
});
exports.getCookieAdmin = getCookieAdmin;
