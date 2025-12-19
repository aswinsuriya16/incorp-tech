import express from "express";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/rbac.js";
import {
  createInvoice,
  submitInvoice,
  approveInvoice,
  rejectInvoice,
  getMyInvoices
} from "../controllers/invoice.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(["BU"]),
  createInvoice
);

router.post(
  "/:id/submit",
  authenticate,
  authorize(["BU"]),
  submitInvoice
);

router.post(
  "/:id/approve",
  authenticate,
  authorize(["BU_MANAGER", "COMPANY"]),
  approveInvoice
);

router.post(
  "/:id/reject",
  authenticate,
  authorize(["BU_MANAGER", "COMPANY"]),
  rejectInvoice
);

router.get(
  "/my",
  authenticate,
  getMyInvoices
);

export default router;
