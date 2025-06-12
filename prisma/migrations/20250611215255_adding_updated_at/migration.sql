/*
  Warnings:

  - Added the required column `updatedAt` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Folders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Folders" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
