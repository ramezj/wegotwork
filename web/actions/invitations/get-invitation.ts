// "use server"
// import { auth } from "@/auth";
// import prisma from "@/lib/db";
// import { Session } from "next-auth";
// import { redirect } from "next/navigation";

// export async function GetInvitation(invitationId: string) {
//     const session:Session | null = await auth();
//     try {
//         const invitation = await prisma.workspaceInvite.findFirst({
//             where: {
//                 id: invitationId,
//             },
//             include: {
//                 workspace: true
//             }
//         })
//         if(!invitation) {
//             return {
//                 error:true,
//                 message:"Invitation Expired or doesn't exist"
//             }
//         }
//         const userAlreadyMember = await prisma.workspaceUser.findFirst({
//             where: {
//                 userId: session?.user?.id,
//                 workspaceId: invitation.workspaceId
//             }
//         })
//         if(userAlreadyMember) {
//             return {
//                 error: true,
//                 message:"You are already a member of this organization."
//             }
//         }
//         return { 
//             error:false,
//             invitation: invitation
//          }
//     } catch (error) {
//         console.error(error);
//     }
// }