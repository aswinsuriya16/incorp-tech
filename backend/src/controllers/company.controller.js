import { createCompanyService } from "../services/company.service.js";

export const createCompany = async (req, res) => {
  try {
    const company = await createCompanyService(req.body);
    res.status(201).json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
