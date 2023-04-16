import Sidebar from "@/components/chat/SideBar";
import { ChatListLayout, Layout } from "@/components/chat";
import ChatForm from "@/components/chat/ChatForm";
import ChatList from "@/components/chat/ChatList";
import { useSession } from "next-auth/react";
import FullPageLoader from "@/components/FullPageLoader";
import { useState } from "react";

function App() {
  const { data: session } = useSession();

  if (!session?.user?.email) return <FullPageLoader />;

  return (
    <>
      <Layout>
        <Sidebar />
        <ChatListLayout>
          <ChatList />
          <ChatForm />
        </ChatListLayout>
      </Layout>
    </>
  );
}

export default App;
