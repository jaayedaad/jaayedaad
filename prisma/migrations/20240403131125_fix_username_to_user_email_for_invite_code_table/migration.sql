-- DropForeignKey
ALTER TABLE "InviteCode" DROP CONSTRAINT "InviteCode_senderEmail_fkey";

-- AddForeignKey
ALTER TABLE "InviteCode" ADD CONSTRAINT "InviteCode_senderEmail_fkey" FOREIGN KEY ("senderEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
