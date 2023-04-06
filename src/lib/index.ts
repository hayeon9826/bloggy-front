import { User } from "@/interface";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";

export const useCurrentUser = () => {
  const { data: session } = useSession();

  const {
    data: currentUser,
    isFetching,
    refetch,
  } = useQuery(
    ["currentUser"],
    async () => {
      const { data }: { data: User } = await axios.post("/api/authUser", {
        email: session?.user?.email,
      });
      return data;
    },
    {
      enabled: !!session?.user?.email,
    }
  );
  return { currentUser, isFetching, refetch };
};
