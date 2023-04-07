import Header from "@/components/Header";
import Banner from "@/components/Banner";
import PostList from "@/components/profile/PostList";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import useAmplitude from "@/hooks/useAmplitude";

function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { email } = router.query;
  const { amplitude } = useAmplitude({ session });

  useEffect(() => {
    const eventProperties = {
      email: email,
    };
    amplitude.track(`profile_view`, eventProperties);
  }, [amplitude, email]);

  return (
    <>
      <Header />
      <Banner />
      <PostList email={email as string} />
    </>
  );
}

export default ProfilePage;
