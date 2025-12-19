import prisma from "../config/prisma.js";

export const createGroupService = async ({ name, managerId }) => {
  if (!name || !managerId)
    throw new Error("name and managerId are required");

  return prisma.companyGroup.create({
    data: {
      name,
      managerId
    }
  });
};
