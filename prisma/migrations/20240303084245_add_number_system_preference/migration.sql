-- CreateEnum
CREATE TYPE "NumberSystem" AS ENUM ('Indian', 'Standard');

-- AlterTable
ALTER TABLE "Preference" ADD COLUMN     "numberSystem" "NumberSystem" NOT NULL DEFAULT 'Indian';
