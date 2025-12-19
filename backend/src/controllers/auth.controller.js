import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const login = async (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where : {
        email : email
    }
  })

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      companyId: user.companyId || null
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};


export const signup = async (req, res) => {
  const { name, email, role, companyId } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Prevent random role abuse
  if (!["BU", "BU_MANAGER", "COMPANY"].includes(role)) {
    return res.status(403).json({ error: "Invalid role for signup" });
  }

  if (role === "COMPANY" && !companyId) {
    return res.status(400).json({ error: "companyId required for COMPANY user" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "User already exists" });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      role,
      companyId: role === "COMPANY" ? companyId : null
    }
  });

  const token = jwt.sign(
    { id: user.id, role: user.role, companyId: user.companyId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(201).json({ token });
};