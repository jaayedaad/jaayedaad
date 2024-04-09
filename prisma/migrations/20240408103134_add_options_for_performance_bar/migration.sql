-- CreateEnum
CREATE TYPE "PerformanceBarParameter" AS ENUM ('totalInvestment', 'totalValue', 'percentageChange');

-- AlterTable
ALTER TABLE "Preference" ADD COLUMN     "performanceBarParameter" "PerformanceBarParameter" NOT NULL DEFAULT 'percentageChange';
