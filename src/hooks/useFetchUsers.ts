import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";

export default function useFetchUsers() {
  const [userParams, setUserParams] = useState({});
  const { data: users } = useQuery(
    ["objects", userParams],
    async () => {
      const result = await axios.get("/api/admin/objects", {
        params: userParams,
      });
      return result.data;
    },
    {
      enabled: !!userParams,
    }
  );

  useEffect(() => {
    setUserParams({
      model: "user",
      limit: 100,
      orderBy: {
        createdAt: "desc",
      },
    });
  }, []);

  return {
    users,
  };
}
