import Header from "@/components/Header";
import Banner from "@/components/Banner";
import PostList from "@/components/PostList";
import { useSession } from "next-auth/react";
import HeroSection from "@/components/HeroSection";

function App() {
  const { status } = useSession();
  return (
    <>
      <Header />
      {status === "unauthenticated" && <HeroSection />}
      <Banner />
      <PostList />
    </>
  );
}

export default App;
