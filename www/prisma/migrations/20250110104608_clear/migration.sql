/*
  Warnings:

  - You are about to drop the column `email` on the `WorkspaceInvite` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "WorkspaceInvite_email_key";

-- AlterTable
ALTER TABLE "WorkspaceInvite" DROP COLUMN "email";
