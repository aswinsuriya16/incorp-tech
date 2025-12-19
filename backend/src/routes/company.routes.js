import express from "express";
import {auth} from "../middleware/auth.js";
import {rbac} from "../middleware/rbac.js";
import { createCompany } from "../controllers/company.controller.js";

const router = express.Router();

router.post(
  "/",
  auth,
  rbac("SUPER_ADMIN"),
  createCompany
);

export default router;
