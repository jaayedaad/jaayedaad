/*
  Warnings:

  - You are about to drop the column `senderUsername` on the `InviteCode` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[senderEmail]` on the table `InviteCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `senderEmail` to the `InviteCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InviteCode" DROP CONSTRAINT "InviteCode_senderUsername_fkey";

-- DropForeignKey
ALTER TABLE "InvitedUser" DROP CONSTRAINT "InvitedUser_id_fkey";

-- DropIndex
DROP INDEX "InviteCode_senderUsername_key";

-- DropIndex
DROP INDEX "InvitedUser_id_key";

-- AlterTable
ALTER TABLE "InviteCode" DROP COLUMN "senderUsername",
ADD COLUMN     "senderEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InvitedUser" ADD CONSTRAINT "InvitedUser_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "InviteCode_senderEmail_key" ON "InviteCode"("senderEmail");

-- AddForeignKey
ALTER TABLE "InviteCode" ADD CONSTRAINT "InviteCode_senderEmail_fkey" FOREIGN KEY ("senderEmail") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;
