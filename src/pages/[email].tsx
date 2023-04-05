import Header from "@/components/Header";
import Banner from "@/components/Banner";
import PostList from "@/components/profile/PostList";
import { useRouter } from "next/router";
import * as amplitude from "@amplitude/analytics-browser";

function ProfilePage() {
  const router = useRouter();
  const { email } = router.query;

  amplitude.track(`Profile view ${email}`);

  return (
    <>
      <Header />
      <Banner />
      <PostList email={email as string} />
    </>
  );
}

export default ProfilePage;
