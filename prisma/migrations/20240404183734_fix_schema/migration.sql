/*
  Warnings:

  - You are about to drop the column `publicProfile` on the `Preference` table. All the data in the column will be lost.
  - You are about to drop the column `showHoldings` on the `Preference` table. All the data in the column will be lost.
  - You are about to drop the column `showMetrics` on the `Preference` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Preference" DROP COLUMN "publicProfile",
DROP COLUMN "showHoldings",
DROP COLUMN "showMetrics",
ADD COLUMN     "publicVisibility" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showHoldingsInPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showMetricsInPublic" BOOLEAN NOT NULL DEFAULT false;
