import prisma from "../config/prisma.js";

export const createCompanyService = async ({ name, groupId }) => {
  if (!name || !groupId)
    throw new Error("name and groupId are required");

  return prisma.company.create({
    data: {
      name,
      groupId
    }
  });
};
