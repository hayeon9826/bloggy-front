import Header from "@/components/Header";
import Banner from "@/components/Banner";
import PostList from "@/components/profile/PostList";
import { useRouter } from "next/router";

function ProfilePage() {
  const router = useRouter();
  const { email } = router.query;

  return (
    <>
      <Header />
      <Banner />
      <PostList email={email as string} />
    </>
  );
}

export default ProfilePage;
