/*
  Warnings:

  - You are about to drop the column `isManualEntry` on the `Asset` table. All the data in the column will be lost.
  - Added the required column `source` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssetSource" AS ENUM ('manual', 'twelveData', 'mfapi', 'binance', 'yahooFinance');

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "isManualEntry",
ADD COLUMN     "source" "AssetSource" NOT NULL;
