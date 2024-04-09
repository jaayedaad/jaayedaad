/*
  Warnings:

  - You are about to drop the column `email` on the `InvitedUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `InvitedUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `InvitedUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "InvitedUser_email_key";

-- AlterTable
ALTER TABLE "InvitedUser" DROP COLUMN "email",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InvitedUser_userId_key" ON "InvitedUser"("userId");
