import { useEffect, useState } from "react";

import { Form, Layout } from "@/components/admin";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { camelCase } from "change-case";
import pluralize from "pluralize";
import axios from "axios";
import { modelFields } from "@/lib/admin/fields";

const ModelPage = () => {
  const router = useRouter();
  const { models }: any = router.query;
  const { page = "0" }: any = router.query;
  const model = models && camelCase(pluralize.singular(models));
  const [userParams, setUserParams] = useState({});

  const { data: users } = useQuery(["objects", userParams], async () => {
    const result = await axios.get("/api/admin/objects", {
      params: userParams,
    });
    return result.data;
  });

  useEffect(() => {
    setUserParams({
      model: "user",
      limit: 100,
      orderBy: {
        createdAt: "desc",
      },
    });
  }, [model, page]);

  return (
    <Layout>
      <Form model={model} data={null} fields={modelFields?.[model]} />
    </Layout>
  );
};

export default ModelPage;
