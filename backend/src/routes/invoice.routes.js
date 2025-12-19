import { Router } from "express";
import {auth} from "../middleware/auth.js";
import {rbac} from "../middleware/rbac.js";
import * as invoiceController from "../controllers/invoice.controller.js";

const router = Router();

router.use(auth);

// BU
router.post("/", rbac(["BU"]), invoiceController.createInvoice);
router.post("/:id/submit", rbac(["BU"]), invoiceController.submitInvoice);

// Approvals
router.post(
  "/:id/approve",
  rbac(["BU_MANAGER", "COMPANY"]),
  invoiceController.approveInvoice
);

router.post(
  "/:id/reject",
  rbac(["BU_MANAGER", "COMPANY"]),
  invoiceController.rejectInvoice
);

// View
router.get(
  "/",
  rbac(["SUPER_ADMIN", "BU", "BU_MANAGER", "COMPANY"]),
  invoiceController.getInvoices
);

export default router;
