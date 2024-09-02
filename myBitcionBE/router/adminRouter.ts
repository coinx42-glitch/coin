import { Router } from "express";
import {
  createAdmin,
  verifyAdmin,
  signInAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getAdminById,
  getCookieAdmin,
} from "../controller/adminController";

const router = Router();

router.post("/create", createAdmin);

router.post("/verify", verifyAdmin);

router.post("/signin", signInAdmin);

router.get("/all", getAllAdmins);

router.get("/getById/:adminID", getAdminById);

router.get("/get-admin-cookie", getCookieAdmin);
router.patch("/:adminID/update", updateAdmin);

router.delete("/:adminID/delete", deleteAdmin);

export default router;
