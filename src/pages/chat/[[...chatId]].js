import { ChatSidebar } from "@/components/ChatSidebar";
import Head from "next/head";

export default function Chat() {
  return (
    <>
      <Head>
        <title>New Chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar />
        <div className=" flex flex-col bg-gray-700">
          <div className="bg-gray-600 text-white">Header</div>
          <div className="flex-1 bg-gray-500">Messages</div>
          <footer className="bg-gray-800 p-10">Footer</footer>
        </div>
      </div>
    </>
  );
}
