"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const adminModel = new mongoose_2.Schema({
    avatar: {
        type: String,
    },
    avatarID: {
        type: String,
    },
    address: {
        type: String,
    },
    password: {
        type: String,
    },
    adminName: {
        type: String,
    },
    status: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    complain: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "complains",
        },
    ],
    users: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "users",
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_2.model)("admin", adminModel);
