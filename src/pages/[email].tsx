import Header from "@/components/Header";
import Banner from "@/components/Banner";
import PostList from "@/components/profile/PostList";
import { useRouter } from "next/router";

function ProfilePage() {
  const router = useRouter();
  const { email } = router.query;

  email?.slice(1);
  return (
    <>
      <Header />
      <Banner />
      <PostList />
    </>
  );
}

export default ProfilePage;
