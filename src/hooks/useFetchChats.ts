import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";

export default function useFetchChats() {
  const [chatParams, setChatParams] = useState({});
  const { data: chats } = useQuery(
    ["objects", chatParams],
    async () => {
      const result = await axios.get("/api/admin/objects", {
        params: chatParams,
      });
      return result.data;
    },
    {
      enabled: !!chatParams,
    }
  );

  useEffect(() => {
    setChatParams({
      model: "chat",
      limit: 100,
      orderBy: {
        createdAt: "desc",
      },
    });
  }, []);

  return {
    chats,
  };
}
