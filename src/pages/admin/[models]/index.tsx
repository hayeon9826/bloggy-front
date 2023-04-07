import { Layout, Header, Table } from "@/components/admin";
import axios from "axios";
import { useRouter } from "next/router";
import pluralize from "pluralize";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { camelCase } from "change-case";

const ModelsIndex = () => {
  const router = useRouter();
  const { models }: any = router.query;
  const [params, setParams] = useState({});

  const { page = "0" }: any = router.query;
  const model = models && camelCase(pluralize.singular(models));

  const { data, refetch } = useQuery(
    ["objects", params],
    async () => {
      const result = await axios.get("/api/admin/objects", {
        params,
      });
      return result.data;
    },
    {
      enabled: !!model,
    }
  );

  useEffect(() => {
    setParams({
      model,
      limit: 10,
      page,
      orderBy: {
        createdAt: "desc",
      },
      include: null,
    });
  }, [model, page]);

  return (
    <Layout>
      <Table refetch={refetch} model={model} data={data} />
    </Layout>
  );
};

export default ModelsIndex;
