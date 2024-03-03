/*
  Warnings:

  - The `numberSystem` column on the `Preference` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Preference" DROP COLUMN "numberSystem",
ADD COLUMN     "numberSystem" TEXT NOT NULL DEFAULT 'Indian';

-- DropEnum
DROP TYPE "NumberSystem";
