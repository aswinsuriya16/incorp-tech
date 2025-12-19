import * as invoiceService from "../services/invoice.service.js";

export const createInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.createInvoice(req.body, req.user);
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const submitInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.submitInvoice(req.params.id, req.user);
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const approveInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.approveInvoice(
      req.params.id,
      req.body.remarks,
      req.user
    );
    res.json(invoice);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

export const rejectInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.rejectInvoice(
      req.params.id,
      req.body.remarks,
      req.user
    );
    res.json(invoice);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.getInvoicesForUser(req.user);
    res.json(invoices);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};
