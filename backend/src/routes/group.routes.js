import express from "express";
import {auth} from "../middleware/auth.js";
import {rbac} from "../middleware/rbac.js";
import { createGroup } from "../controllers/group.controller.js";

const router = express.Router();

router.post(
  "/",
  auth,
  rbac("SUPER_ADMIN"),
  createGroup
);

export default router;
