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
exports.markAsSeenComplain = exports.viewUsersComplains = exports.markResolveComplain = exports.createUserComplain = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const complainModel_1 = __importDefault(require("../model/complainModel"));
const mongoose_1 = require("mongoose");
const adminModel_1 = __importDefault(require("../model/adminModel"));
const createUserComplain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { title, importance } = req.body;
        const user = yield userModel_1.default.findById(userID);
        const admin = yield adminModel_1.default.findById(user === null || user === void 0 ? void 0 : user.adminIDs);
        if (user) {
            const complain = yield complainModel_1.default.create({
                reporterID: userID,
                title,
                importance,
            });
            user === null || user === void 0 ? void 0 : user.complain.push(new mongoose_1.Types.ObjectId(complain._id));
            user.save();
            admin === null || admin === void 0 ? void 0 : admin.complain.push(new mongoose_1.Types.ObjectId(complain._id));
            admin === null || admin === void 0 ? void 0 : admin.save();
            return res.status(201).json({
                message: "user complain posted successfully",
                data: complain,
                status: 201,
            });
        }
        else {
            return res.status(404).json({
                message: "user must exist",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating user session",
            data: error.message,
            status: 404,
        });
    }
});
exports.createUserComplain = createUserComplain;
const markResolveComplain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminID, complainID } = req.params;
        const admin = yield adminModel_1.default.findById(adminID);
        if (admin) {
            const complain = yield complainModel_1.default.findByIdAndUpdate(complainID, { resolve: true }, { new: true });
            return res.status(201).json({
                message: "mark complain resolved successfully",
                data: complain,
                status: 201,
            });
        }
        else {
            return res.status(404).json({
                message: "admin must exist",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating school session",
            data: error.message,
            status: 404,
        });
    }
});
exports.markResolveComplain = markResolveComplain;
const viewUsersComplains = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const complain = yield userModel_1.default.findById(userID).populate({
            path: "complain",
            options: {
                sort: {
                    createdAt: -1,
                },
            },
        });
        return res.status(201).json({
            message: "view complain successfully",
            data: complain,
            status: 201,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating admin session",
            data: error.message,
            status: 404,
        });
    }
});
exports.viewUsersComplains = viewUsersComplains;
const markAsSeenComplain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adimnID, complainID } = req.params;
        const admin = yield adminModel_1.default.findById(adimnID);
        if (admin) {
            const complain = yield complainModel_1.default.findByIdAndUpdate(complainID, { seen: true }, { new: true });
            return res.status(201).json({
                message: "mark complain seen successfully",
                data: complain,
                status: 201,
            });
        }
        else {
            return res.status(404).json({
                message: "school must exist",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating school session",
            data: error.message,
            status: 404,
        });
    }
});
exports.markAsSeenComplain = markAsSeenComplain;
