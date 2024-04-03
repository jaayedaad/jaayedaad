/*
  Warnings:

  - You are about to drop the column `userId` on the `InviteCode` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[senderUsername]` on the table `InviteCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `senderUsername` to the `InviteCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InviteCode" DROP CONSTRAINT "InviteCode_userId_fkey";

-- DropIndex
DROP INDEX "InviteCode_userId_key";

-- AlterTable
ALTER TABLE "InviteCode" DROP COLUMN "userId",
ADD COLUMN     "senderUsername" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InviteCode_senderUsername_key" ON "InviteCode"("senderUsername");

-- AddForeignKey
ALTER TABLE "InviteCode" ADD CONSTRAINT "InviteCode_senderUsername_fkey" FOREIGN KEY ("senderUsername") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
