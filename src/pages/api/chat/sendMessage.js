import { OpenAIEdgeStream } from "openai-edge-stream";

export const config = {
    runtime: "edge",
};

const handler = async (req) => {
    try {

        const { message } = await req.json();
        console.log("Received message: ", message);

        const initialChatMessage = {
            role: "system",
            content:
                "Your name is Chatty AI Assistant. An incredibly intelligent and quick-thinking AI, that always replies with an enthusiastic and positive energy. You were created by WebDevEducation. Your response must be formatted as markdown.",
        };

        const response = await fetch(`${req.headers.get("origin")}/api/chat/createNewChat`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                cookie: req.headers.get("cookie"),
            },
            body: JSON.stringify({ message }),
        });

        console.log("Received Response: ", response);
        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const jsonData = await response.json();
        console.log("JSON DATA: ", jsonData);
        const chatId = jsonData._id;

        const stream = await OpenAIEdgeStream(
            "https://api.openai.com/v1/chat/completions",
            {
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY_V1}`,
                },
                method: "POST",
                body: JSON.stringify({
                    model: "gpt-3.5-turbo-16k",
                    messages: [
                        initialChatMessage,
                        { "role": "user", "content": message }
                    ],
                    stream: true
                }),
            },
            {
                onBeforeStream: ({ emit }) => {
                    emit(chatId, "newChatId");
                },
                onAfterStream: async ({ fullContent }) => {
                    await fetch(
                        `${req.headers.get("origin")}/api/chat/addMessageToChat`,
                        {
                            method: "POST",
                            headers: {
                                "content-type": "application/json",
                                cookie: req.headers.get("cookie"),
                            },
                            body: JSON.stringify({
                                chatId,
                                role: "assistant",
                                content: fullContent,
                            }),
                        }
                    );
                },
            }
        );

        // Log the response stream status
        console.log("Stream opened successfully");

        return new Response(stream);
    } catch (e) {
        console.error("Error occurred:", e.message);
        return new Response(
            { message: "An error occurred in sendMessage" },
            { status: 500, statusText: "Internal Server Error" }
        );
    }
};

export default handler;

// export default async function handler(req) {
//     console.log("IN HERE!");

//     try {
//         const { chatId: chatIdFromParam, message } = await req.json();

//         // validate message data
//         if (!message || typeof message !== "string" || message.length > 200) {
//             return new Response(
//                 {
//                     message: "message is required and must be less than 200 characters",
//                 },
//                 {
//                     status: 422,
//                 }
//             );
//         }

//         let chatId = chatIdFromParam;
//         console.log("MESSAGE: ", message);
//         const initialChatMessage = {
//             role: "system",
//             content:
//                 "Your name is Chatty AI Assistant. An incredibly intelligent and quick-thinking AI, that always replies with an enthusiastic and positive energy. You were created by WebDevEducation. Your response must be formatted as markdown.",
//         };

//         let newChatId;
//         let chatMessages = [];

//         if (chatId) {
//             // add message to chat
//             const response = await fetch(
//                 `${req.headers.get("origin")}/api/chat/addMessageToChat`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "content-type": "application/json",
//                         cookie: req.headers.get("cookie"),
//                     },
//                     body: JSON.stringify({
//                         chatId,
//                         role: "user",
//                         content: message,
//                     }),
//                 }
//             );
//             const json = await response.json();
//             chatMessages = json.chat.messages || [];
//         } else {
//             const response = await fetch(
//                 `${req.headers.get("origin")}/api/chat/createNewChat`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "content-type": "application/json",
//                         cookie: req.headers.get("cookie"),
//                     },
//                     body: JSON.stringify({
//                         message,
//                     }),
//                 }
//             );
//             const json = await response.json();
//             chatId = json._id;
//             newChatId = json._id;
//             chatMessages = json.messages || [];
//         }

//         const messagesToInclude = [];
//         chatMessages.reverse();
//         let usedTokens = 0;
//         for (let chatMessage of chatMessages) {
//             const messageTokens = chatMessage.content.length / 4;
//             usedTokens = usedTokens + messageTokens;
//             if (usedTokens <= 2000) {
//                 messagesToInclude.push(chatMessage);
//             } else {
//                 break;
//             }
//         }

//         messagesToInclude.reverse();

//         console.log(messagesToInclude);

//         const stream = await OpenAIEdgeStream(
//             "https://api.openai.com/v1/chat/completions",
//             {
//                 headers: {
//                     "content-type": "application/json",
//                     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//                 },
//                 method: "POST",
//                 body: JSON.stringify({
//                     model: "gpt-3.5-turbo",
//                     messages: [initialChatMessage, ...messagesToInclude],
//                     stream: true,
//                 }),
//             },
//             {
//                 onBeforeStream: ({ emit }) => {
//                     if (newChatId) {
//                         emit(newChatId, "newChatId");
//                     }
//                 },
//                 onAfterStream: async ({ fullContent }) => {
//                     await fetch(
//                         `${req.headers.get("origin")}/api/chat/addMessageToChat`,
//                         {
//                             method: "POST",
//                             headers: {
//                                 "content-type": "application/json",
//                                 cookie: req.headers.get("cookie"),
//                             },
//                             body: JSON.stringify({
//                                 chatId,
//                                 role: "assistant",
//                                 content: fullContent,
//                             }),
//                         }
//                     );
//                 },
//             }
//         );
//         return new Response(stream);
//     } catch (e) {
//         return new Response(
//             { message: "An error occurred in sendMessage" },
//             {
//                 status: 500,
//             }
//         );
//     }
// }
