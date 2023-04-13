import ChatIcon from "@/components/icons/ChatIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import LogOutIcon from "@/components/icons/LogOutIcon";
import GetHelpIcon from "@/components/icons/GetHelpIcon";
import EditIcon from "@/components/icons/EditIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import DarkModeIcon from "@/components/icons/DarkModeIcon";
import ProfileIcon from "@/components/icons/ProfileIcon";
import { signOut } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";

export interface ChatData {
  id: string;
  title: string;
  userId: string;
}

interface Props {
  chats: ChatData[];
}

export default function Sidebar({ chats }: Props) {
  const router = useRouter();
  const { id } = router.query;

  console.log(id);
  return (
    <div className="dark hidden bg-gray-900 md:flex md:w-[260px] md:flex-col">
      <div className="flex h-screen min-h-0 flex-col">
        <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
          <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
            <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
              <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20">
                <PlusIcon />
                New chat
              </a>
              <div className="flex-col flex-1 overflow-y-auto border-b border-white/20 -mr-2">
                <div className="flex flex-col gap-2 text-gray-100 text-sm">
                  {chats?.slice(0, 12)?.map((data) => (
                    <>
                      {data?.id === id ? (
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
                      )}
                    </>
                  ))}
                  {chats?.length > 12 && (
                    <button className="btn relative btn-dark btn-small m-auto mb-2">
                      <div className="flex w-full items-center justify-center gap-2">
                        Show more
                      </div>
                    </button>
                  )}
                </div>
              </div>
              <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                <TrashIcon />
                Clear conversations
              </a>
              <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                <span className="flex w-full flex-row justify-between">
                  <span className="gold-new-button flex items-center gap-3">
                    <ProfileIcon />
                    Upgrade to Plus
                  </span>
                  <span className="rounded-md bg-yellow-200 py-0.5 px-1.5 text-xs font-medium uppercase text-gray-800">
                    NEW
                  </span>
                </span>
              </a>
              <a className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm">
                <DarkModeIcon />
                Dark mode
              </a>
              <a
                href="https://help.openai.com/en/collections/3742473-chatgpt"
                target="_blank"
                className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
              >
                <GetHelpIcon />
                Get help
              </a>
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
  );
}
