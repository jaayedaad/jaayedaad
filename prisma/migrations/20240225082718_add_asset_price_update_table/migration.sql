-- CreateTable
CREATE TABLE "AssetPriceUpdate" (
    "id" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "AssetPriceUpdate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssetPriceUpdate" ADD CONSTRAINT "AssetPriceUpdate_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
