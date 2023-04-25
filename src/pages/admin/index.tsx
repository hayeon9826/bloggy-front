import axios from "axios";
import { Header, Layout } from "@/components/admin";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import Link from "next/link";
import pluralize from "pluralize";
import { snakeCase } from "change-case";
import { useCurrentUser } from "@/lib";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

const Page: React.FC = () => {
  const { currentUser, isFetching } = useCurrentUser();
  const router = useRouter();

  const { data } = useQuery<any>(
    ["objects"],
    async () => {
      const result = await axios("/api/admin/objects?model=models");
      return result.data;
    },
    {
      enabled: !!currentUser,
    }
  );

  return (
    <Layout>
      <Header title="Dashboard" />
      <div className="m-4">
        <h2 className="text-lg font-bold">Tables</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {data?.map((model: any) => (
            <Link
              key={model.name}
              href={`/admin/${pluralize(snakeCase(model.name))}`}
            >
              <div key={model.id} className="block rounded bg-white border p-4">
                <h3 className="font-bold mb-2">{model.name}</h3>
                <div className="">
                  {model.fields.map((field: any) => (
                    <span
                      key={field.name}
                      className="inline-block px-2 py-1 rounded-full bg-gray-200 text-xs m-1"
                    >
                      {field.name}: {field.type}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Page;
