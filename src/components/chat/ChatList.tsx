import cn from "classnames";
import { BiUser } from "react-icons/bi";
import { BsRobot } from "react-icons/bs";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { BsSun } from "react-icons/bs";
import { AiOutlineThunderbolt, AiOutlineWarning } from "react-icons/ai";

export interface MessageData {
  id: number;
  type: "USER" | "AI";
  chat: string;
}

interface ChatProps {
  data?: MessageData[] | null;
}

export default function ChatList({ data }: ChatProps) {
  return (
    <div className="text-white pb-28 w-full min-h-screen">
      {data === null ? (
        <>
          <div className="flex flex-col items-center text-sm bg-gray-800">
            <div className="w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 text-gray-100">
              <h1 className="text-3xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center">
                ChatGPT
              </h1>
              <div className="md:flex items-start text-center gap-3.5">
                <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                  <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                    <BsSun />
                    Examples
                  </h2>
                  <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                    <button className="w-full bg-gray-50 bg-white/5 p-3 rounded-md hover:bg-gray-900">{`"Explain quantum computing in simple terms" →`}</button>
                    <button className="w-full bg-gray-50 bg-white/5 p-3 rounded-md hover:bg-gray-900">
                      {` "Got any creative ideas for a 10 year old’s birthday?" →`}
                    </button>
                    <button className="w-full bg-gray-50 bg-white/5 p-3 rounded-md hover:bg-gray-900">
                      {`"How do I make an HTTP request in Javascript?" →`}
                    </button>
                  </ul>
                </div>
                <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                  <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                    <AiOutlineThunderbolt />
                    Capabilities
                  </h2>
                  <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                    <li className="w-full bg-gray-50 bg-white/5 p-3 rounded-md">Remembers what user said earlier in the conversation</li>
                    <li className="w-full bg-gray-50 bg-white/5 p-3 rounded-md">Allows user to provide follow-up corrections</li>
                    <li className="w-full bg-gray-50 bg-white/5 p-3 rounded-md">Trained to decline inappropriate requests</li>
                  </ul>
                </div>
                <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                  <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                    <AiOutlineWarning />
                    Limitations
                  </h2>
                  <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                    <li className="w-full bg-gray-50 bg-white/5 p-3 rounded-md">May occasionally generate incorrect information</li>
                    <li className="w-full bg-gray-50 bg-white/5 p-3 rounded-md">May occasionally produce harmful instructions</li>
                    <li className="w-full bg-gray-50 bg-white/5 p-3 rounded-md">Limited knowledge of world and events after 2021</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        data?.map((chat, index) => (
          <div
            key={chat.id}
            className={cn("min-h-[85px]", {
              "bg-gray-700": index % 2 === 0,
            })}
          >
            <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
              <div
                className={cn(
                  "w-[30px] h-[30px] flex flex-col relative items-end rounded-sm flex-shrink-0",
                  { "bg-green-300/60": chat.type === "USER" },
                  { "bg-blue-300/60": chat.type === "AI" }
                )}
              >
                {chat.type === "USER" && <BiUser className="m-auto" />}
                {chat.type === "AI" && <BsRobot className="m-auto" />}
              </div>
              <div className="whitespace-pre-wrap w-full text-sm">{chat.chat}</div>
              <div className="flex gap-2 relative items-start rounded-sm flex-shrink-0">
                <FiThumbsUp />
                <FiThumbsDown />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
