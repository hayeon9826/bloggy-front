import ChatIcon from "@/components/icons/ChatIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import LogOutIcon from "@/components/icons/LogOutIcon";
import GetHelpIcon from "@/components/icons/GetHelpIcon";
import EditIcon from "@/components/icons/EditIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AiOutlineMenu, AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import cn from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Chat {
  id: string;
  title: string;
  userId: string;
}

export interface ChatData {
  objects: Chat[];
  totalCount: number;
}

export default function Sidebar() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [page, setPage] = useState<number>(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const config = {
    url: `/api/chat?email=${session?.user?.email}&page=${page}&limit=12`,
  };

  const {
    data: chats,
    refetch,
    isFetching,
  } = useQuery(
    ["chats", page],
    async () => {
      const { data } = await axios(config);
      return data as ChatData;
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  const handleShowMore = async () => {
    setPage((prevPage) => prevPage + 1);
    await refetch();
  };

  useEffect(() => {
    if (page > 1) {
      queryClient.prefetchQuery(["chats", page + 1], async () => {
        const { data } = await axios(
          `/api/chat?email=${session?.user?.email}&page=${page + 1}&limit=12`
        );
        return data;
      });
    }
  }, [page, queryClient, session?.user?.email]);

  return (
    <header>
      <div
        className={cn(
          "dark hidden bg-gray-900 md:flex md:w-[260px] md:flex-col"
        )}
      >
        <div className="flex h-screen min-h-0 flex-col">
          <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
            <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
              <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
                <div
                  role="presentation"
                  onClick={() => router.push("/chats")}
                  className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
                >
                  <PlusIcon />
                  New chat
                </div>
                <div className="flex-col flex-1 overflow-y-auto border-b border-white/20 -mr-2">
                  <div className="flex flex-col gap-2 text-gray-100 text-sm">
                    {chats?.objects?.map((data) =>
                      data?.id === id ? (
                        <a
                          key={data?.id}
                          className="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-14 mr-2.5 bg-gray-800 hover:bg-gray-800 group animate-flash"
                        >
                          <ChatIcon />
                          <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                            {data?.title}
                          </div>
                        </a>
                      ) : (
                        <div
                          onClick={() => router.push(`/chats/${data?.id}`)}
                          role="setActiveChatId"
                          key={data?.id}
                          className="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group"
                        >
                          <ChatIcon />
                          <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                            {data?.title}
                            <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]"></div>
                          </div>
                        </div>
                      )
                    )}
                    {chats &&
                      chats?.totalCount > 0 &&
                      chats?.totalCount > chats?.objects?.length && (
                        <button
                          className="btn relative btn-dark btn-small m-auto mb-2 disabled:text-gray-500"
                          onClick={handleShowMore}
                          disabled={isFetching}
                        >
                          <div className="flex w-full items-center justify-center gap-2">
                            Show more
                          </div>
                        </button>
                      )}
                  </div>
                </div>
                <Link href="/">
                  <span className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                    <GetHelpIcon />
                    Go to main
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    signOut({
                      callbackUrl: "/",
                    })
                  }
                >
                  <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                    <LogOutIcon />
                    Log out
                  </a>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 border-b border-gray-500 fixed top-0 w-full z-10 h-10 flex justify-between px-4 items-center md:hidden">
        <button type="button" onClick={() => setMobileMenuOpen(true)}>
          <AiOutlineMenu className="my-auto text-white text-lg" />
        </button>
        <button type="button" onClick={() => router.push("/chats")}>
          <AiOutlinePlus className="my-auto text-white text-lg" />
        </button>
      </div>
      {mobileMenuOpen && (
        <div
          className={cn("fixed w-full z-[100] bg-gray-900 overflow-y-scroll")}
        >
          <div className="px-4 pb-2 pt-4 flex flex-row-reverse">
            <button type="button" onClick={() => setMobileMenuOpen(false)}>
              <AiOutlineClose className="my-auto text-white text-lg" />
            </button>
          </div>
          <div className="flex min-h-screen flex-col">
            <div className="flex h-full w-full flex-1 items-start border-white/20">
              <div className="flex h-full w-full flex-1 items-start border-white/20">
                <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
                  <div
                    role="presentation"
                    onClick={() => router.push("/chats")}
                    className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
                  >
                    <PlusIcon />
                    New chat
                  </div>
                  <div className="flex-col flex-1  overflow-y-scroll border-b border-white/20 -mr-2">
                    <div className="flex flex-col gap-2 text-gray-100 text-sm">
                      {chats?.objects?.map((data) =>
                        data?.id === id ? (
                          <a
                            key={data?.id}
                            className="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-14 mr-2.5 bg-gray-800 hover:bg-gray-800 group animate-flash"
                          >
                            <ChatIcon />
                            <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                              {data?.title}
                            </div>
                            <div className="absolute flex right-1 z-10 text-gray-300 visible">
                              <button className="p-1 hover:text-white">
                                <EditIcon />
                              </button>
                              <button className="p-1 hover:text-white">
                                <TrashIcon />
                              </button>
                            </div>
                          </a>
                        ) : (
                          <div
                            onClick={() => router.push(`/chats/${data?.id}`)}
                            role="setActiveChatId"
                            key={data?.id}
                            className="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group"
                          >
                            <ChatIcon />
                            <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                              {data?.title}
                              <div className="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-900 group-hover:from-[#2A2B32]"></div>
                            </div>
                          </div>
                        )
                      )}
                      {chats &&
                        chats?.totalCount > 0 &&
                        chats?.totalCount > chats?.objects?.length && (
                          <button
                            className="btn relative btn-dark btn-small m-auto mb-2 disabled:text-gray-500"
                            onClick={handleShowMore}
                            disabled={isFetching}
                          >
                            <div className="flex w-full items-center justify-center gap-2">
                              Show more
                            </div>
                          </button>
                        )}
                    </div>
                  </div>
                  <div className="pt-4">
                    <Link href="/">
                      <span className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                        <GetHelpIcon />
                        Go to main
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        signOut({
                          callbackUrl: "/",
                        })
                      }
                    >
                      <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                        <LogOutIcon />
                        Log out
                      </a>
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
