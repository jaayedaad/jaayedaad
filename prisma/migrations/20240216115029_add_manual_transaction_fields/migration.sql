-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "currentPrice" TEXT,
ADD COLUMN     "isManualEntry" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "symbol" DROP NOT NULL,
ALTER COLUMN "exchange" DROP NOT NULL;
