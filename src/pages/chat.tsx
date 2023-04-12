import { useEffect, useState } from "react";
import axios from "axios";
import { TbLoader } from "react-icons/tb";
import RegenerateIcon from "@/components/icons/RegenerateIcon";
import ClickIcon from "@/components/icons/ClickIcon";
import Sidebar from "@/components/chat/SideBar";
import { Layout } from "@/components/chat";

const testStrings = ["TEST", "TEST2", "TEST3", "TEST4", "TEST5", "TEST6", "TEST7", "TEST8"];

function App() {
  const [prompt, updatePrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");

  const sendPrompt = async (event: any) => {
    if (event.key !== "Enter") {
      return;
    }

    console.log(prompt, "##PROMPT");

    try {
      setLoading(true);

      const res = await axios.post(
        `/api/chat`,
        {
          prompt: prompt,
          type: "NONE",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPEN_API_KEY}`,
          },
        }
      );

      if (!res.data) {
        throw new Error("Something went wrong");
      }

      const { message } = res.data;
      setAnswer(message);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("err", err);
    }
  };

  useEffect(() => {
    if (prompt != null && prompt.trim() === "") {
      setAnswer("");
    }
  }, [prompt]);

  return (
    <>
      <Layout>
        <Sidebar datas={testStrings} />
        <div className="flex h-full max-w-full flex-1 flex-col">
          <main className="bg-gray-800 w-full h-screen relative">
            <div>{answer && <p>{answer}</p>}</div>
            <form className="stretch flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl absolute w-full bottom-10 inset-x-0 mx-auto">
              <div className="relative lg:flex h-full flex-1 md:flex-col">
                <div className="flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
                  <button className="px-4 py-2.5 rounded-md relative  border-0 md:border text-white">
                    <div className="flex w-full items-center justify-center gap-2">
                      <RegenerateIcon />
                      Regenerate response
                    </div>
                  </button>
                </div>
                <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                  <textarea
                    rows={1}
                    disabled={loading}
                    onChange={(e) => updatePrompt(e.target.value)}
                    onKeyDown={(e) => sendPrompt(e)}
                    placeholder="Send a message..."
                    className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
                    style={{ maxHeight: "200px", height: "24px", overflowY: "hidden" }}
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
          </main>
        </div>
      </Layout>
    </>
  );
}

export default App;
