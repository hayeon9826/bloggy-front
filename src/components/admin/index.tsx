import { useCurrentUser } from "@/lib";
import { signOut } from "next-auth/react";
import { NextSeo } from "next-seo";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { IoIosMenu, IoIosClose } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import pluralize from "pluralize";

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

const menus = [
  {
    name: "Dashboard",
    path: "/admin",
  },
  {
    name: "Users",
    path: "/admin/users",
  },
  {
    name: "Posts",
    path: "/admin/posts",
    menus: [
      {
        name: "Ai Records",
        path: "/admin/ai_records",
      },
    ],
  },
  {
    name: "Wait Lists",
    path: "/admin/wait_lists",
  },
];

export const Meta = (props: MetaProps) => (
  <>
    <Head>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1"
        key="viewport"
      />
      {/* <link rel="apple-touch-icon" href={`${process.env.baseUrl}/apple-touch-icon.png`} key="apple" /> */}
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

export const Layout = ({
  meta = <Meta title="Bloggy Admin" description="Bloggy Admin" />,
  children,
}: LayoutProps) => {
  const { currentUser, isFetching } = useCurrentUser();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const Icon = showMenu ? IoIosClose : IoIosMenu;

  const isActive = (path: string) =>
    (path !== "/admin" && router.asPath.includes(path)) ||
    (router.asPath === "/admin" && path === "/admin");

  useEffect(() => {
    console.log(currentUser, isFetching);
    if (currentUser && currentUser?.adminType === "NONE" && !isFetching) {
      toast.error("Not Authenticated");
      router.push("/");
    }
  }, [currentUser, isFetching, router]);

  return (
    <>
      {currentUser && (
        <>
          {meta}
          <div
            className="h-screen flex overflow-hidden bg-gray-100"
            style={{ zIndex: 10000 }}
          >
            <button
              onClick={() => {
                setShowMenu(!showMenu);
              }}
              className={`md:hidden h-16 w-16 justify-center items-center flex fixed top-0 ${
                showMenu && "left-64"
              }`}
            >
              <Icon className="text-gray-500 text-3xl" />
            </button>
            <div
              className={`h-screen fixed ${
                !showMenu && "hidden"
              } md:static md:flex bg-indigo-800`}
            >
              <div className="w-64 overflow-y-auto">
                <div className="text-2xl text-white font-bold p-4 ">Bloggy</div>
                {menus.map((menu) => (
                  <>
                    <Link href={menu.path} key={menu.path}>
                      <span
                        className={`flex justify-between items-center text-white text-xm py-3 px-4 ${
                          isActive(menu.path) && "bg-indigo-900"
                        }`}
                      >
                        {menu.name}
                        {menu.menus && <MdOutlineKeyboardArrowDown />}
                      </span>
                    </Link>
                    {menu.menus && (
                      <div
                        className={`flex-col ${
                          !isActive(menu.path) &&
                          !menu.menus.some((subMenu) =>
                            isActive(subMenu.path)
                          ) &&
                          "hidden"
                        }`}
                      >
                        {menu.menus.map((subMenu) => (
                          <Link href={subMenu.path} key={subMenu.path}>
                            <span
                              className={`block text-gray-100 text-xm py-3 px-8 ${
                                isActive(subMenu.path) && "bg-indigo-900"
                              }`}
                            >
                              {subMenu.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ))}
                <div className="p-4">
                  <button
                    className="button text-white font-semibold underline"
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
            <div className="flex-1 overflow-auto">{children}</div>
          </div>
        </>
      )}
    </>
  );
};

export const Header = ({
  title = "",
  children = null,
  model = null,
}: HeaderProps) => {
  return (
    <div className="bg-white border-b flex h-16 items-center p-4 justify-between">
      <h2 className="text-xl font-bold pl-12 md:pl-0">{title || `Data`}</h2>
      <div className="space-x-3 text-sm">
        {children}
        {model && (
          <div className="flex">
            <Link href={`/admin/${pluralize(model)}/new`}>
              <span className="button flex items-center justify-center px-4 h-10 w-40">
                Create
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
