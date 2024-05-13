import { getServerSession } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from 'next-auth'
import mongoose from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid;
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user
    
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message:"Not Authenticated"
            },{status:400}
        )
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            {$pull:{messages:{_id:messageId}}}
        )
        if (updateResult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message:"message not found or already deleted"
                },{status:404}
            )
        }
        return Response.json(
            {
                success: true,
                message:"message deleted"
            },{status:200}
        )
    } catch (error) {
        console.log("Error while deleting message", error);
        return Response.json(
            {
                success: false,
                message:"Error while deleting message"
            },{status:500}
        )
    }
   
}