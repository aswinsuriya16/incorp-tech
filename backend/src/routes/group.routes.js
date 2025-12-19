import { Router } from "express";
import {auth} from "../middleware/auth.js";
import prisma from "../config/prisma.js";

const router = Router();

router.use(auth);

router.get("/", async (req, res) => {
  const groups = await prisma.companyGroup.findMany({
    include: { companies: true }
  });
  res.json(groups);
});

export default router;
