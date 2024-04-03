/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `InvitedUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `InvitedUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvitedUser" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InvitedUser_email_key" ON "InvitedUser"("email");
