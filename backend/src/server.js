import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import companyRoutes from "./routes/company.routes.js";
import groupRoutes from "./routes/group.routes.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/companies", companyRoutes);
app.use("/groups", groupRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "OK" });
});

app.listen(3000,()=>{
    console.log("Port on 3000");
})