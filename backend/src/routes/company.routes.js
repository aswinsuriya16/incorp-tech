import { Router } from "express";
import {auth} from "../middleware/auth.js";
import prisma from "../config/prisma.js";

const router = Router();

router.use(auth);

router.get("/", async (req, res) => {
  const companies = await prisma.company.findMany();
  res.json(companies);
});

export default router;
