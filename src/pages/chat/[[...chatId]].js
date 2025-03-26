import { ChatSidebar } from "@/components/ChatSidebar";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { streamReader } from "openai-edge-stream";
import { v4 as uuid } from "uuid";
import { Message } from "@/components/Message";

export default function ChatPage({ chatId, title, messages = [] }) {

  console.log("props: ", title, messages);
  const [incomingMessage, setIncomingMessage] = useState("");
  const [messageText, setMessageText] = useState("");
  const [newChatMessages, setNewChatMessages] = useState([]);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [newChatId, setNewChatId] = useState(null);
  const [fullMessage, setFullMessage] = useState("");
  const [originalChatId, setOriginalChatId] = useState(chatId);
  const router = useRouter();

  // if we've created a new chat
  useEffect(() => {
    if (!generatingResponse && newChatId) {
      setNewChatId(null);
      router.push(`/chat/${newChatId}`);
    }
  }, [newChatId, generatingResponse, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(`Message sent: ${messageText}`);

    setGeneratingResponse(true);

    setNewChatMessages((prev) => {
      const newChatMessages = [
        ...prev,
        {
          _id: uuid(),
          role: "user",
          content: messageText,
        },
      ];

      return newChatMessages;
    });

    console.log("Message sent: ", messageText);
    setMessageText("");

    const response = await fetch(`/api/chat/sendMessage`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ message: messageText }),
    });

    console.log("Received Response: ", response);
    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = response.body;

    if (!data) {
      console.error("No data received");
      return;
    }

    const reader = data.getReader();
    await streamReader(reader, async (message) => {
      console.log("MESSAGE: ", message);

      if (message.event === "newChatId") {
        setNewChatId(message.content);
      } else {
        setIncomingMessage((s) => `${s}${message.content}`);
      }
    });

    setGeneratingResponse(false);
  };

  // const allMessages = [...messages, ...newChatMessages];

  return (
    <>
      <Head>
        <title>New Chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar chatId={chatId} />
        <div className="flex flex-col overflow-hidden bg-gray-700 text-white">
          <div className="bg-gray-600 text-white">Header</div>
          <div className='flex-1 text-white overflow-auto'>

            {newChatMessages.map((message) => (
              <Message key={message._id} role={message.role} content={message.content} />
            ))}

            {!!incomingMessage && (<Message role="assistant" content={incomingMessage} />)}
          </div>
          <footer className='bg-gray-800 p-10 text-white'>
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2" disabled={generatingResponse}>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={generatingResponse ? "" : "Send a message..."}
                  className="w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500"
                />
                <button type="submit" className="btn">
                  Send
                </button>
              </fieldset>
            </form>
          </footer>
        </div>
      </div>
    </>
  );
}


export const getServerSideProps = async (ctx) => {
  const chatId = ctx.params?.chatId?.[0] || null;

  if (chatId) {
    let objectId;

    try {
      objectId = new ObjectId(chatId);
    } catch (e) {
      return {
        redirect: {
          destination: "/chat",
        },
      };
    }

    const { user } = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("ChattyPete");
    const chat = await db.collection("chats").findOne({
      userId: user.sub,
      _id: objectId,
    });

    if (!chat) {
      return {
        redirect: {
          destination: "/chat",
        },
      };
    }

    return {
      props: {
        chatId,
        title: chat.title,
        messages: chat.messages.map((message) => ({
          ...message,
          _id: uuid(),
        })),
      },
    };
  }
  return {
    props: {},
  };
};
