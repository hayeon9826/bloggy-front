import { ReactNode, useEffect, useState, useMemo } from "react";

import { useCurrentUser } from "@/lib";
import { signOut } from "next-auth/react";
import { NextSeo } from "next-seo";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { toast } from "react-hot-toast";
import { IoIosMenu, IoIosClose } from "react-icons/io";
import { AiOutlineDoubleRight, AiOutlineDoubleLeft } from "react-icons/ai";
import pluralize from "pluralize";
import { useQuery } from "react-query";
import axios from "axios";
import { snakeCase } from "change-case";
import FullPageLoader from "../FullPageLoader";
import cn from "classnames";

import { useForm } from "react-hook-form";
import useFetchUsers from "@/hooks/useFetchUsers";

export interface MetaProps {
  title: string;
  description: string;
  canonical?: string;
}

interface LayoutProps {
  meta?: ReactNode;
  children?: ReactNode;
}

interface HeaderProps {
  title: string;
  children?: ReactNode;
  model?: string | null;
}

interface TableProps {
  model: string;
  data: any;
  refetch: () => void;
}

interface ShowProps {
  model: string;
  data: any;
}

interface PaginationProps {
  model: string;
  data: any;
  page: string;
}

interface FormProps {
  model: string;
  data?: any | null;
  fields: any; // type 정의 필요
}

export const Meta = (props: MetaProps) => (
  <>
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" key="viewport" />
    </Head>
    <NextSeo
      title={props.title}
      description={props.description}
      canonical={props.canonical}
      openGraph={{
        title: props.title,
        description: props.description,
        url: props.canonical,
        locale: "kr",
        site_name: "Bloggy",
      }}
    />
  </>
);

export const Layout = ({ meta = <Meta title="Bloggy Admin" description="Bloggy Admin" />, children }: LayoutProps) => {
  const { currentUser, isFetching } = useCurrentUser();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const Icon = showMenu ? IoIosClose : IoIosMenu;
  interface menuInterface {
    name: string;
    path: string;
  }

  const isActive = (path: string) => (path !== "/admin" && router.asPath.includes(path)) || (router.asPath === "/admin" && path === "/admin");

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

  const menus: menuInterface[] = useMemo(
    () =>
      data?.map((model: any) => ({
        name: `${model.name}`,
        path: `/admin/${pluralize(snakeCase(model.name))}`,
      })),
    [data]
  );

  useEffect(() => {
    if (currentUser && currentUser?.adminType === "NONE" && !isFetching) {
      toast.error("Not Authenticated");
      router.push("/");
    }
  }, [currentUser, isFetching, router]);

  return (
    <>
      {currentUser ? (
        <>
          {meta}
          <div className="h-screen flex overflow-hidden bg-gray-100" style={{ zIndex: 10000 }}>
            <button
              onClick={() => {
                setShowMenu(!showMenu);
              }}
              className={`md:hidden h-16 w-16 justify-center items-center flex fixed top-0 ${showMenu && "left-64"}`}
            >
              <Icon className="text-gray-500 text-3xl" />
            </button>
            <div className={`h-screen fixed ${!showMenu && "hidden"} md:static md:flex bg-blue-800`}>
              <div className={cn("overflow-y-auto relative", { "w-64": isOpen }, { "w-20": !isOpen })}>
                <div className="text-2xl text-white font-bold p-4 flex justify-between items-center">
                  <div className={cn({ hidden: !isOpen }, { block: isOpen })}>
                    <Link href="/">Bloggy</Link>
                  </div>

                  <button
                    className={cn(
                      "button rounded-full bg-white/75 hover:bg-white mx-auto w-8 h-8 text-white text-sm font-semibold underline",
                      { hidden: isOpen },
                      { block: !isOpen }
                    )}
                    onClick={() => setIsOpen(true)}
                  >
                    <AiOutlineDoubleRight className="text-blue-900 m-auto font-bold text-lg" />
                  </button>
                  <button
                    className={cn(
                      "button rounded-full bg-white/75 hover:bg-white w-8 h-8 text-white text-sm font-semibold underline",
                      { hidden: !isOpen },
                      { block: isOpen }
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <AiOutlineDoubleLeft className="text-blue-900 m-auto font-bold text-lg" />
                  </button>
                </div>
                <div className={cn({ hidden: !isOpen }, { block: isOpen })}>
                  <Link href="/admin">
                    <span className={`flex justify-between items-center text-white text-xm py-3 px-4 ${isActive("/admin") && "bg-blue-900"}`}>Admin</span>
                  </Link>
                  {menus &&
                    menus.map((menu: menuInterface) => (
                      <Link href={menu.path} key={menu.path}>
                        <span className={`flex justify-between items-center text-white text-xm py-3 px-4 ${isActive(menu.path) && "bg-blue-900"}`}>
                          {menu.name}
                        </span>
                      </Link>
                    ))}
                </div>

                <div className="pl-3 absolute bottom-4 w-full text-left">
                  <button
                    className="button text-white text-sm font-semibold underline"
                    onClick={() =>
                      signOut({
                        callbackUrl: "/",
                      })
                    }
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-auto relative">{children}</div>
          </div>
        </>
      ) : (
        <FullPageLoader />
      )}
    </>
  );
};

export const Header = ({ title = "", children = null, model = null }: HeaderProps) => {
  return (
    <div className="bg-white border-b flex h-16 items-center p-4 justify-between">
      <h2 className="text-xl font-bold pl-12 md:pl-0">{title || `Data`}</h2>
      <div className="space-x-3 text-sm">
        {children}
        {model && (
          <div className="flex">
            <Link href={`/admin/${pluralize(model)}/new`}>
              <span className="button flex items-center justify-center px-4 h-10 w-40">Create</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export const Pagination = ({ model, data, page }: PaginationProps) => {
  const router = useRouter();
  return (
    <>
      {model && (
        <div className="fixed bottom-0 py-6 w-full px-10 flex justify-start bg-white shadow border">
          {[...Array(data?.total_pages)].map((x, i) => (
            <Link
              href={{
                pathname: `/admin/${pluralize(model)}`,
                query: { ...router.query, page: i },
              }}
              key={i}
            >
              <span className={`px-3 py-2 rounded border shadow-sm bg-white mr-2 ${parseInt(page, 10) === i ? "text-blue-600 font-bold" : "text-gray-300"}`}>
                {i + 1}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export const Table = ({ model, data, refetch }: TableProps) => {
  const router = useRouter();
  return (
    <div className="py-10 px-4 bg-white min-h-screen mb-10 lg:mb-0">
      <h1 className="mb-4 w-full flex justify-between px-4 items-center">
        <div className="text-xl font-semibold ">{model}</div>
        <button
          type="button"
          className="bg-blue-500 text-white hover:bg-blue-600 rounded-md px-4 py-2 text-sm"
          onClick={() => router.push(`/admin/${pluralize(model)}/new`)}
        >
          Create new {model}
        </button>
      </h1>
      {data?.objects?.length > 0 ? (
        <table className="bg-white divide-y divide-gray-300 w-full overflow-x-scroll">
          <thead>
            <tr>
              {Object?.keys(data?.objects?.[0])?.map((key: string) => (
                <th key={key} scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  {snakeCase(key)}
                </th>
              ))}

              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-xs">
                Settings
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.objects?.map((object: any, index: number) => (
              <tr key={object.id}>
                {Object.entries(object).map(([key, value], index) => (
                  <td key={index} className="whitespace-wrap px-4 py-4 text-sm text-gray-700">
                    {key?.includes("Id") ? (
                      <Link href={`/admin/${pluralize(key?.split("Id")[0])}/${value}`}>
                        <span className="underline text-blue-700">{value as string}</span>
                      </Link>
                    ) : typeof value == "string" && value?.length > 200 ? (
                      value?.substring(0, 200) + "..."
                    ) : (
                      (value as string)
                    )}
                  </td>
                ))}
                <td className="whitespace-nowrap px-3 py-4 text-xs text-gray-700">
                  <Link href={`/admin/${pluralize(model)}/${object.id}`}>
                    <span className="text-gray-800 font-semibold underline">More</span>
                  </Link>
                  <Link href={`/admin/${pluralize(model)}/${object.id}/edit`}>
                    <span className="text-gray-600 font-semibold underline ml-2">Edit</span>
                  </Link>
                  <button
                    className="ml-2 text-red-600 font-semibold underline"
                    onClick={async () => {
                      if (confirm("Delete the data permanently?")) {
                        await axios.delete(`/api/admin/objects`, {
                          params: { id: object.id, model },
                        });
                      }
                      refetch();
                      toast.success("Successfully Deleted");
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <FullPageLoader />
      )}
    </div>
  );
};

export const Show = ({ model, data }: ShowProps) => {
  console.log(data);
  return (
    <div className="bg-white min-h-screen px-10 py-20">
      {data ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-semibold leading-6 text-gray-900">{snakeCase(model)} Info</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed info about and {snakeCase(model)}</p>
            </div>
            <button className="bg-blue-500 text-white rounded-md px-4 py-1.5 h-10 hover:bg-blue-600 focus:bg-blue-600" type="button">
              <Link href={`/admin/${pluralize(model)}/${data.id}/edit`}>Edit {model}</Link>
            </button>
          </div>
          <div className="mt-5 border-t border-gray-200">
            <dl className="sm:divide-y sm:divide-gray-200">
              {Object?.entries(data).map(([key, value], index) => (
                <div key={index} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt className="text-sm font-medium text-gray-500">{key}</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                    {key?.includes("Id") ? (
                      <Link href={`/admin/${pluralize(key?.split("Id")[0])}/${value}`}>
                        <span className="underline text-blue-700">{value as string}</span>
                      </Link>
                    ) : (
                      (value as string)
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </>
      ) : (
        <FullPageLoader />
      )}
    </div>
  );
};

export const Form = ({ model, data = null, fields }: FormProps) => {
  const { users } = useFetchUsers();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm();

  useEffect(() => {
    if (data) {
      Object.keys(fields).forEach((key) => {
        if (fields[key] === "select") {
          setValue(key, data[key]);
        } else {
          setValue(key, data[key]);
        }
      });
    }
  }, [data, fields, setValue]);

  const checkFields = ({ key }: any) => {
    let field;
    if (fields[key]?.type === "text") {
      field = (
        <input
          className="w-full border border-gray-300 rounded-md"
          type={fields[key].type}
          {...register(key, {
            required: fields[key].required ? "Required field" : false,
            valueAsNumber: fields[key].type === "number",
          })}
        />
      );
    }
    if (fields[key]?.type === "textarea") {
      field = <textarea rows={10} className="w-full border border-gray-300 rounded-md" {...register(key, { required: "Required field" })} />;
    }
    if (fields[key]?.type === "select") {
      field = (
        <select className="w-full border border-gray-300 rounded-md" {...register(key, { required: "필수 입력 항목입니다" })}>
          <option value="">Select</option>
          {fields?.[key]?.options &&
            fields?.[key]?.options?.map((option: any) => (
              <option key={option[0]} value={option[0]}>
                {option[1]}
              </option>
            ))}
        </select>
      );
    }
    if (fields[key]?.type === "relations") {
      switch (key) {
        case "userId":
          field = (
            <select className="w-full border border-gray-300 rounded-md" {...register(key, { required: "필수 입력 항목입니다" })}>
              <option value="">Select</option>
              {users &&
                users?.map((user: any) => (
                  <option key={user?.name} value={user?.id}>
                    {user?.name}
                  </option>
                ))}
            </select>
          );
      }
    }

    return field;
  };

  return (
    <div className="bg-white min-h-screen px-10 py-20">
      {model ? (
        <form
          onSubmit={handleSubmit(async (props) => {
            const submitData: any = {
              id: data ? data.id : null,
              model,
              ...props,
            };

            const result = await axios[data ? "put" : "post"](`/api/admin/objects`, submitData);

            if (result) {
              toast?.success(`Successfully ${data ? "updated" : "created"} ${model}`);
            } else {
              toast?.error("Something went wrong. Please try again.");
            }

            router.replace(`/admin/${pluralize(model)}`);
          })}
        >
          <div>
            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              {data === null ? "Create" : "Edit"} {snakeCase(model)}
            </h3>
          </div>
          <div className="mt-5 border-t border-gray-200">
            <dl className="sm:divide-y sm:divide-gray-200">
              {data ? (
                Object?.entries(data).map(([key, value], index) => (
                  <div key={index} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                    <dt className="text-sm font-medium text-gray-500">{key}</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">
                      {fields?.[key] ? checkFields({ key }) : (value as string)}
                    </dd>
                  </div>
                ))
              ) : (
                <>
                  {Object.keys(fields).map((key) => (
                    <div key={key} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                      <dt className="text-sm font-medium text-gray-500">{key}</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 whitespace-pre-wrap">{fields?.[key] && checkFields({ key })}</dd>
                    </div>
                  ))}
                </>
              )}
            </dl>
          </div>

          <button
            type="submit"
            className={`bg-blue-500 text-white rounded-md px-4 py-2 float-right mt-4 ${(isSubmitting || isSubmitted) && "bg-gray-300"}`}
            disabled={isSubmitting || isSubmitted}
          >
            {data?.id ? "Edit" : "Create"} {model}
          </button>
        </form>
      ) : (
        <FullPageLoader />
      )}
    </div>
  );
};
