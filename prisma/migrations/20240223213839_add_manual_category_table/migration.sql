-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "manualCategoryId" TEXT;

-- CreateTable
CREATE TABLE "UsersManualCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UsersManualCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_manualCategoryId_fkey" FOREIGN KEY ("manualCategoryId") REFERENCES "UsersManualCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersManualCategory" ADD CONSTRAINT "UsersManualCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
