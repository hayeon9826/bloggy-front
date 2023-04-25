import { useEffect, useState } from "react";

import { Layout, Show } from "@/components/admin";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { camelCase } from "change-case";
import pluralize from "pluralize";
import axios from "axios";
import { IncludeFields } from "@/lib/admin/fields";

const ModelPage = () => {
  const router = useRouter();
  const { id, models }: any = router.query;
  const { page = "0" }: any = router.query;
  const model = models && camelCase(pluralize.singular(models));
  const [params, setParams] = useState({});

  const { data, refetch } = useQuery(
    ["objects", params],
    async () => {
      const result = await axios.get("/api/admin/objects", {
        params,
      });
      return result.data;
    },
    {
      enabled: !!id && !!model,
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
      include: IncludeFields?.[model]
        ? JSON.stringify(IncludeFields?.[model])
        : "",
    });
  }, [id, model, page]);

  return (
    <Layout>
      <Show model={model} data={data} />
    </Layout>
  );
};

export default ModelPage;
