/*
  Warnings:

  - The `performanceBarOrder` column on the `Preference` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PerformanceBarOrder" AS ENUM ('Ascending', 'Descending');

-- AlterTable
ALTER TABLE "Preference" DROP COLUMN "performanceBarOrder",
ADD COLUMN     "performanceBarOrder" "PerformanceBarOrder" NOT NULL DEFAULT 'Ascending';
