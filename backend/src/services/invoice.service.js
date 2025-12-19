import prisma from "../config/prisma.js";

// Helper: Check if two companies are in the same group
const areCompaniesInSameGroup = async (originalCompanyId, carryCompanyId) => {
  if (!carryCompanyId) return true; // Regular invoice

  const [original, carry] = await Promise.all([
    prisma.company.findUnique({ where: { id: originalCompanyId }, select: { groupId: true } }),
    prisma.company.findUnique({ where: { id: carryCompanyId }, select: { groupId: true } })
  ]);

  return original?.groupId === carry?.groupId;
};

// Create draft invoice
export const createInvoice = async (data, user) => {
  if (user.role !== "BU") throw new Error("Only BU can create invoices");

  const { type, originalCompanyId, carryCompanyId } = data;

  // Validate: BU must be assigned to the group of originalCompany
  const company = await prisma.company.findUnique({
    where: { id: originalCompanyId },
    include: { group: { include: { assignments: true } } }
  });

  if (!company) throw new Error("Company not found");

  const isAssigned = company.group.assignments.some(assignment => assignment.buId === user.id);
  if (!isAssigned) throw new Error("You are not assigned to this company group");

  // For carry invoices: validate sibling company
  if (type === "CARRY") {
    if (!carryCompanyId) throw new Error("carryCompanyId required for CARRY invoice");
    const sameGroup = await areCompaniesInSameGroup(originalCompanyId, carryCompanyId);
    if (!sameGroup) throw new Error("Carry company must be in the same group");
  }

  return prisma.invoice.create({
    data: {
      type,
      originalCompanyId,
      carryCompanyId: type === "CARRY" ? carryCompanyId : null,
      buId: user.id,
      status: "DRAFT"
    },
    include: { originalCompany: true, carryCompany: true }
  });
};

// Submit invoice (from DRAFT)
export const submitInvoice = async (invoiceId, user) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId }
  });

  if (!invoice || invoice.buId !== user.id)
    throw new Error("Unauthorized or invoice not found");

  if (invoice.status !== "DRAFT")
    throw new Error("Only DRAFT invoices can be submitted");

  if (invoice.type === "REGULAR") {
    return prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: "SUBMITTED" }
    });
  }

  // CARRY → goes to BU Manager
  return prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: "PENDING_BU_MANAGER_APPROVAL" }
  });
};

// Approve or Reject (shared logic)
const handleApprovalDecision = async (invoiceId, decision, remarks, user) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      originalCompany: { include: { group: true } },
      approvals: true
    }
  });

  if (!invoice) throw new Error("Invoice not found");
  if (invoice.type !== "CARRY") throw new Error("Only CARRY invoices need approval");
  if (invoice.status === "APPROVED" || invoice.status === "REJECTED")
    throw new Error("Invoice already finalized");

  // Check if user already approved/rejected
  const alreadyActed = invoice.approvals.some(a => a.approverId === user.id);
  if (alreadyActed) throw new Error("You have already acted on this invoice");

  // Record approval action
  await prisma.invoiceApproval.create({
    data: {
      invoiceId,
      approverId: user.id,
      role: user.role,
      decision,
      remarks: remarks || ""
    }
  });

  // BU Manager approval
  if (user.role === "BU_MANAGER" && invoice.status === "PENDING_BU_MANAGER_APPROVAL") {
    // Validate: BU Manager must manage the group
    const isManagerOfGroup = invoice.originalCompany.group.managerId === user.id;
    if (!isManagerOfGroup) throw new Error("You don't manage this group");

    if (decision === "APPROVED") {
      return prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: "PENDING_CARRY_COMPANY_APPROVAL" }
      });
    }
  }

  // Carry Company approval
  if (user.role === "COMPANY" && invoice.status === "PENDING_CARRY_COMPANY_APPROVAL") {
    // You'll need to link COMPANY users to a company — assuming user.companyId exists
    if (invoice.carryCompanyId !== user.companyId)
      throw new Error("You are not the carry company for this invoice");

    if (decision === "APPROVED") {
      return prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: "APPROVED" }
      });
    }
  }

  throw new Error("Unauthorized or invalid state for this action");
};

export const approveInvoice = async (invoiceId, remarks, user) => {
  return handleApprovalDecision(invoiceId, "APPROVED", remarks, user);
};

export const rejectInvoice = async (invoiceId, remarks, user) => {
  const result = await handleApprovalDecision(invoiceId, "REJECTED", remarks, user);
  // On reject → always go to REJECTED
  return prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: "REJECTED" }
  });
};

// Get invoices visible to the user
export const getInvoicesForUser = async (user) => {
  if (user.role === "SUPER_ADMIN") {
    return prisma.invoice.findMany({
      include: { originalCompany: true, carryCompany: true, creator: true, approvals: true }
    });
  }

  if (user.role === "BU") {
    return prisma.invoice.findMany({
      where: { buId: user.id },
      include: { originalCompany: true, carryCompany: true, approvals: true }
    });
  }

  if (user.role === "BU_MANAGER") {
    // Only invoices from groups managed by this BU Manager
    const managedGroupIds = await prisma.companyGroup.findMany({
      where: { managerId: user.id },
      select: { id: true }
    }).then(groups => groups.map(g => g.id));

    return prisma.invoice.findMany({
      where: {
        originalCompany: { groupId: { in: managedGroupIds } }
      },
      include: { originalCompany: true, carryCompany: true, creator: true, approvals: true }
    });
  }

  if (user.role === "COMPANY") {
    // COMPANY users need a companyId field — adjust based on your User model
    if (!user.companyId) throw new Error("Company user must be linked to a company");

    return prisma.invoice.findMany({
      where: {
        OR: [
          { originalCompanyId: user.companyId },
          { carryCompanyId: user.companyId }
        ]
      },
      include: { originalCompany: true, carryCompany: true, creator: true, approvals: true }
    });
  }

  throw new Error("Invalid role");
};