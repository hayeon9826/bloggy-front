import cn from "classnames";
import { BiUser, BiLoader } from "react-icons/bi";
import { BsRobot } from "react-icons/bs";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { BsSun } from "react-icons/bs";
import { AiOutlineWarning } from "react-icons/ai";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useEffect, useRef } from "react";

export interface MessageData {
  id: number;
  chatType: "USER" | "AI";
  body: string;
}

interface Props {
  inputPrompt: string;
}

export default function ChatList({ inputPrompt }: Props) {
  const router = useRouter();
  const { id } = router.query;
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const config = {
    url: `/api/chat?id=${id}`,
  };

  const { data: chat, isFetching } = useQuery(
    [`chat-${id}`],
    async () => {
      const { data } = await axios(config);
      return data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const handleCopyClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, inputPrompt]);

  return (
    <div className="text-white pb-28 w-full min-h-screen mt-10 lg:mt-0">
      {chat?.messages?.length === 0 || !chat ? (
        <>
          <div className="flex flex-col items-center text-sm bg-gray-800">
            <div className="w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 text-gray-100">
              <h1 className="text-3xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center">
                BloggChat
              </h1>
              <div className="md:flex items-start text-center gap-3.5">
                <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                  <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                    <BsSun />
                    Examples
                  </h2>
                  <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                    <button
                      className="w-full bg-gray-50 bg-white/5 p-3 rounded-md hover:bg-gray-900"
                      onClick={() =>
                        handleCopyClipBoard("Hi, What's your name?")
                      }
                    >{`"Hi, What's your name?" →`}</button>
                    <button
                      className="w-full bg-gray-50 bg-white/5 p-3 rounded-md hover:bg-gray-900"
                      onClick={() =>
                        handleCopyClipBoard("Tell me about Bloggy")
                      }
                    >
                      {` "Tell me about Bloggy" →`}
                    </button>
                    <button
                      className="w-full bg-gray-50 bg-white/5 p-3 rounded-md hover:bg-gray-900"
                      onClick={() =>
                        handleCopyClipBoard("Is Bloggy suitable for beginners?")
                      }
                    >
                      {`"Is Bloggy suitable for beginners?" →`}
                    </button>
                  </ul>
                </div>
                <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                  <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                    <AiOutlineWarning />
                    Limitations
                  </h2>
                  <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                    <li className="w-full bg-gray-50 bg-white/5 p-3 rounded-md">
                      May occasionally generate incorrect information
                    </li>
                    <li className="w-full bg-gray-50 bg-white/5 p-3 rounded-md">
                      Could sometimes offer incomplete instructions
                    </li>
                    <li className="w-full bg-gray-50 bg-white/5 p-3 rounded-md">
                      Responses are based on trained data only
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        chat?.messages?.map((message: MessageData, index: number) => (
          <div
            key={message.id}
            className={cn("min-h-[85px]", {
              "bg-gray-700": index % 2 === 1,
            })}
          >
            <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
              <div
                className={cn(
                  "w-[30px] h-[30px] flex flex-col relative items-end rounded-sm flex-shrink-0",
                  { "bg-green-300/60": message.chatType === "USER" },
                  { "bg-blue-300/60": message.chatType === "AI" }
                )}
              >
                {message.chatType === "USER" && <BiUser className="m-auto" />}
                {message.chatType === "AI" && <BsRobot className="m-auto" />}
              </div>
              <div className="whitespace-pre-wrap w-full text-sm">
                {message.body}
              </div>
            </div>
          </div>
        ))
      )}
      {inputPrompt && inputPrompt?.length > 0 && (
        <div className={cn("min-h-[85px] bg-gray-700")}>
          <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
            <div
              className={cn(
                "bg-green-300/60 w-[30px] h-[30px] flex flex-col relative items-end rounded-sm flex-shrink-0"
              )}
            >
              {<BiUser className="m-auto" />}
            </div>
            <div className="whitespace-pre-wrap w-full text-sm">
              {inputPrompt}
            </div>
            <div className="flex gap-2 relative items-start rounded-sm flex-shrink-0">
              <FiThumbsUp />
              <FiThumbsDown />
            </div>
          </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
}
