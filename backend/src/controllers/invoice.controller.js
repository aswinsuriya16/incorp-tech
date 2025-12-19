import * as invoiceService from "../services/invoice.service.js";

export const createInvoice = async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.body, req.user);
  res.status(201).json(invoice);
};

export const submitInvoice = async (req, res) => {
  const invoice = await invoiceService.submitInvoice(req.params.id, req.user);
  res.json(invoice);
};

export const approveInvoice = async (req, res) => {
  const invoice = await invoiceService.approveInvoice(
    req.params.id,
    req.body.remarks,
    req.user
  );
  res.json(invoice);
};

export const rejectInvoice = async (req, res) => {
  const invoice = await invoiceService.rejectInvoice(
    req.params.id,
    req.body.remarks,
    req.user
  );
  res.json(invoice);
};

export const getMyInvoices = async (req, res) => {
  const invoices = await invoiceService.getInvoicesForUser(req.user);
  res.json(invoices);
};
