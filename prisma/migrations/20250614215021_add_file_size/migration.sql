/*
  Warnings:

  - Added the required column `size` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "size" INTEGER NOT NULL;
