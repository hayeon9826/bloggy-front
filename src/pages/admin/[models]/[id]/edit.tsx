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
  const { id, models }: any = router.query;
  const { page = "0" }: any = router.query;
  const model = models && camelCase(pluralize.singular(models));
  const [params, setParams] = useState({});
  const [userParams, setUserParams] = useState({});

  const { data, refetch } = useQuery(
    ["objects", params],
    async () => {
      const result = await axios.get("/api/admin/objects", {
        params,
      });
      return result.data;
    },
    {
      enabled: !!id,
    }
  );

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
    setParams({
      id: id,
      model,
      limit: 10,
      page,
      orderBy: {
        createdAt: "desc",
      },
      include: null,
    });

    setUserParams({
      model: "user",
      limit: 100,
      orderBy: {
        createdAt: "desc",
      },
    });
  }, [id, model, page]);

  return (
    <Layout>
      <Form model={model} data={data} fields={modelFields?.[model]} />
    </Layout>
  );
};

export default ModelPage;
