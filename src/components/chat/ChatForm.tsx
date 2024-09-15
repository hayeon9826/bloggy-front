import RegenerateIcon from "@/components/icons/RegenerateIcon";
import { TbLoader } from "react-icons/tb";
import ClickIcon from "@/components/icons/ClickIcon";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import axios from "axios";
import Loader from "@/components/Loader";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useQueryClient } from "react-query";
import cn from "classnames";

const FAQS = [
  "How to use Bloggy?",
  "Does Bloggy support multiple languages?",
  "What is Bloggy?",
  "What is Deepl?",
  "What is Clova Chat AI?",
  "How do I start a new chat on Bloggy?",
  "What are the limitations of Clova Chat AI?",
  "What is the pricing of the service?",
  "Is Bloggy secure?",
  "How do I get help on Bloggy?",
  "What makes Bloggy different from other platforms?",
];

interface Props {
  setInputPrompt: Dispatch<SetStateAction<string>>;
}

export default function ChatForm({ setInputPrompt }: Props) {
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showFaqs, setShowFaqs] = useState<boolean>(false);
  const textareaRef = useRef<any>(null);
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const submitPrompt = async (event: any) => {
    if (event.key !== "Enter") {
      return;
    }

    try {
      setLoading(true);
      if (id) {
        const res = await axios.post(`/api/messages`, {
          prompt: prompt,
          type: "CHAT",
          chatId: id,
          chatType: "USER",
          email: session?.user?.email,
        });
        if (!res.data) {
          throw new Error("Something went wrong");
        }
        queryClient.invalidateQueries([`chat-${id}`]);
      } else {
        const chatRes = await axios.post(`/api/chat`, {
          prompt: prompt,
          type: "CREATE_TITLE",
          email: session?.user?.email,
        });
        if (!chatRes.data) {
          throw new Error("Something went wrong");
        }
        const { id } = chatRes.data;
        const res = await axios.post(`api/messages`, {
          prompt: prompt,
          type: "CHAT",
          chatId: id,
          chatType: "USER",
          email: session?.user?.email,
        });
        if (!res.data) {
          throw new Error("Something went wrong");
        }

        setPrompt("");
        queryClient.invalidateQueries([`chat-${id}`]);
        router.replace(`/chats/${id}`);
      }
      setPrompt("");
      setLoading(false);
      () => setInputPrompt("");
    } catch (err) {
      setLoading(false);
      () => setInputPrompt("");
      console.log("err", err);
    }
  };

  return (
    <form className="stretch z-10 flex flex-row gap-3 pb-2 absolute w-full bottom-0 inset-x-0 mx-auto bg-gradient-to-t from-gray-800 to-gray-800/0">
      <div className="relative lg:flex h-full flex-1 md:flex-col lg:mx-auto lg:max-w-2xl xl:max-w-3xl mx-4 last:mb-6 ">
        {showFaqs ? (
          <div className="w-full flex gap-4 overflow-x-scroll mb-4 items-center">
            {FAQS?.map((faq) => (
              <button
                type="button"
                onClick={() => {
                  setPrompt(faq);
                  setShowFaqs((val) => !val);
                }}
                className="min-w-[200px] min-h-[24px] px-4 py-2 rounded-lg relative text-sm border border-white/50 text-white bg-gray-800 hover:bg-gray-900"
              >
                <div className="flex w-full items-center justify-center gap-2">
                  {faq}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex ml-1 md:w-full md:m-auto md:mb-2 mb-2 gap-0 md:gap-2 justify-center">
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowFaqs((val) => !val)}
              className="min-w-[183px] min-h-[38px] px-3 py-2 rounded-md relative text-sm border border-white/50 text-white bg-gray-800 hover:bg-gray-900"
            >
              <div className="flex w-full items-center justify-center gap-2">
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    {" "}
                    <AiOutlineQuestionCircle />
                    Frequently asked questions
                  </>
                )}
              </div>
            </button>
          </div>
        )}

        <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-gray-700 dark:border-gray-900/50 text-white rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
          <textarea
            ref={textareaRef}
            rows={1}
            disabled={loading}
            autoFocus
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            onKeyDown={(e) => {
              submitPrompt(e);
              if (e.key === "Enter") {
                () => setInputPrompt(prompt);
              }
            }}
            placeholder="Send a message..."
            className={cn(
              "m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0",
              {
                "text-transparent": loading,
              }
            )}
            style={{
              maxHeight: "200px",
              height: "24px",
              overflowY: "hidden",
            }}
          />
          <button
            disabled={false}
            className="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40"
          >
            {loading ? <TbLoader className="h-4 w-4 mr-1" /> : <ClickIcon />}
          </button>
        </div>
      </div>
    </form>
  );
}
