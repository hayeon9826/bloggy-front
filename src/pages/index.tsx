import Banner from "@/components/Banner";
import PostList from "@/components/PostList";
import { useSession } from "next-auth/react";
import HeroSection from "@/components/HeroSection";
import { Layout } from "@/components";

function App() {
  const { status } = useSession();
  return (
    <>
      <Layout>
        {status === "unauthenticated" && <HeroSection />}
        <Banner />
        <PostList />
      </Layout>
    </>
  );
}

export default App;
