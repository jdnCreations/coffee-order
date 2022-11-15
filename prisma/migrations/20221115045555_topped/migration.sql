/*
  Warnings:

  - Added the required column `toppedUp` to the `Drink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Drink" ADD COLUMN     "toppedUp" TEXT NOT NULL;
