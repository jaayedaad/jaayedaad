/*
  Warnings:

  - Added the required column `icon` to the `UsersManualCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsersManualCategory" ADD COLUMN     "icon" TEXT NOT NULL;
