-- AlterTable
ALTER TABLE "Preference" ADD COLUMN     "showHoldings" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showMetrics" BOOLEAN NOT NULL DEFAULT false;
