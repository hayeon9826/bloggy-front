import { useState } from "react";

import Sidebar from "@/components/chat/SideBar";
import { ChatListLayout, Layout } from "@/components/chat";
import ChatForm from "@/components/chat/ChatForm";
import ChatList from "@/components/chat/ChatList";
import { useSession } from "next-auth/react";
import FullPageLoader from "@/components/FullPageLoader";

function App() {
  const { data: session } = useSession();
  const [inputPrompt, setInputPrompt] = useState<string>("");

  if (!session?.user?.email) return <FullPageLoader />;

  return (
    <>
      <Layout>
        <Sidebar />
        <ChatListLayout>
          <ChatList inputPrompt={inputPrompt} />
          <ChatForm setInputPrompt={setInputPrompt} />
        </ChatListLayout>
      </Layout>
    </>
  );
}

export default App;
