import axios from "axios";
import { Header, Layout } from "@/components/admin";
import React from "react";
import { useQuery } from "react-query";
import Link from "next/link";
import pluralize from "pluralize";
import { snakeCase } from "change-case";

const Page: React.FC = (props) => {
  const { data } = useQuery<any>(["objects"], async () => {
    const result = await axios("/api/admin/objects?model=models");
    return result.data;
  });

  return (
    <Layout>
      <Header title="Dashboard" />
      <div className="m-4">
        <h2 className="text-lg font-bold">Tables</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {data?.map((model: any) => (
            <Link key={model.id} href={`/admin/${pluralize(snakeCase(model.name))}`}>
              <div key={model.id} className="block rounded bg-white border p-4">
                <h3 className="font-bold mb-2">{model.name}</h3>
                <div className="">
                  {model.fields.map((field: any) => (
                    <span key={field.name} className="inline-block px-2 py-1 rounded-full bg-gray-100 text-xs m-1">
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
