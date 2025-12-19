/*
  Warnings:

  - A unique constraint covering the columns `[buId,groupId]` on the table `BUGroupAssignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,groupId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,managerId]` on the table `CompanyGroup` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invoiceId,approverId]` on the table `InvoiceApproval` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Invoice" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "public"."InvoiceApproval" ALTER COLUMN "remarks" SET DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "BUGroupAssignment_buId_groupId_key" ON "public"."BUGroupAssignment"("buId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_groupId_key" ON "public"."Company"("name", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyGroup_name_managerId_key" ON "public"."CompanyGroup"("name", "managerId");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceApproval_invoiceId_approverId_key" ON "public"."InvoiceApproval"("invoiceId", "approverId");

-- AddForeignKey
ALTER TABLE "public"."CompanyGroup" ADD CONSTRAINT "CompanyGroup_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Company" ADD CONSTRAINT "Company_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."CompanyGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BUGroupAssignment" ADD CONSTRAINT "BUGroupAssignment_buId_fkey" FOREIGN KEY ("buId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BUGroupAssignment" ADD CONSTRAINT "BUGroupAssignment_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."CompanyGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_originalCompanyId_fkey" FOREIGN KEY ("originalCompanyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_carryCompanyId_fkey" FOREIGN KEY ("carryCompanyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_buId_fkey" FOREIGN KEY ("buId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvoiceApproval" ADD CONSTRAINT "InvoiceApproval_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvoiceApproval" ADD CONSTRAINT "InvoiceApproval_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
