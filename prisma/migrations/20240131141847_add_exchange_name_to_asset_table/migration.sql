/*
  Warnings:

  - Added the required column `exchange` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "exchange" TEXT NOT NULL;
