/*
  Warnings:

  - Changed the type of `decision` on the `InvoiceApproval` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ApprovalDecision" AS ENUM ('APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."InvoiceApproval" DROP COLUMN "decision",
ADD COLUMN     "decision" "public"."ApprovalDecision" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "companyId" TEXT;

-- CreateIndex
CREATE INDEX "Invoice_buId_idx" ON "public"."Invoice"("buId");

-- CreateIndex
CREATE INDEX "Invoice_originalCompanyId_idx" ON "public"."Invoice"("originalCompanyId");

-- CreateIndex
CREATE INDEX "Invoice_carryCompanyId_idx" ON "public"."Invoice"("carryCompanyId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "public"."Invoice"("status");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
