import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    try {
        const { user } = await getSession(req, res);
        const client = await clientPromise;
        const db = client.db("ChattyPete");

        const { chatId, role, content } = req.body;

        // let objectId;

        // try {
        //     // Validate that chatId is a valid hexadecimal string of length 24 (12 bytes)
        //     if (!ObjectId.isValid(chatId)) {
        //         throw new Error('Invalid chat ID');
        //     }

        //     // Create ObjectId instance
        //     objectId = new ObjectId(chatId);
        // } catch (e) {
        //     res.status(422).json({
        //         message: "Invalid chat ID",
        //     });
        //     return;
        // }

        // // validate content data
        // if (!content || typeof content !== "string" || (role === "user" && content.length > 200) || (role === "assistant" && content.length > 100000)) {
        //     res.status(422).json({
        //         message: "content is required and must be less than 200 characters",
        //     });
        //     return;
        // }

        // // validate role
        // if (role !== "user" && role !== "assistant") {
        //     res.status(422).json({
        //         message: "role must be either 'assistant' or 'user'",
        //     });
        //     return;
        // }

        const chat = await db.collection("chats").findOneAndUpdate(
            { _id: ObjectId.createFromHexString(chatId), userId: user.sub, },
            {
                $push: {
                    messages: { role, content, },
                },
            },
            {
                returnDocument: "after",
            }
        );

        // console.log("Chat: ", chat, " Value: ", chat.value,);

        res.status(200).json({
            chat: { ...chat, _id: chat?._id.toString(), },
        });
    } catch (e) {
        console.error("Error occurred:", e.message);
        res
            .status(500)
            .json({ message: "An error occurred when adding a message to a chat" });
    }
}
