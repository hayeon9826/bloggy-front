import { useEffect, useState } from "react";
import axios from "axios";
import { TbLoader } from "react-icons/tb";
import RegenerateIcon from "@/components/icons/RegenerateIcon";
import ClickIcon from "@/components/icons/ClickIcon";
import Sidebar from "@/components/chat/SideBar";
import { Layout } from "@/components/chat";
import cn from "classnames";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { BiUser } from "react-icons/bi";
import { BsRobot } from "react-icons/bs";

const testStrings = [
  "TEST",
  "TEST2",
  "TEST3",
  "TEST4",
  "TEST5",
  "TEST6",
  "TEST7",
  "TEST8",
];
const testChats = [
  { id: 1, type: "user", chat: "Hi" },
  { id: 2, type: "ai", chat: "Hello! How can I assist you today?" },
  {
    id: 3,
    type: "user",
    chat: "what should I do to become a good front-end engineer?",
  },
  {
    id: 4,
    type: "ai",
    chat: `Becoming a good front-end engineer involves a combination of technical skills and soft skills. Here are some steps you can take to improve your skills and become a successful front-end engineer:

Learn HTML, CSS, and JavaScript: These are the foundational languages of front-end development. Take online courses or attend in-person classes to learn these languages and how they work together.

Practice coding: Practice building websites and web applications using HTML, CSS, and JavaScript. This will help you to become more proficient in these languages and to understand how they work in real-world scenarios.

Keep up with industry trends: Follow blogs, newsletters, and online communities to stay up-to-date on the latest trends and technologies in front-end development.

Learn a front-end framework: Frameworks like React, Vue, and Angular are widely used in the industry. Choose one and learn it well.

Build a portfolio: Create a portfolio of your work to showcase your skills and experience to potential employers. Include a variety of projects that demonstrate your proficiency in front-end development.

Collaborate with others: Work with other developers, designers, and stakeholders to gain experience in collaborating on projects and working as part of a team.

Improve your soft skills: Effective communication, time management, and problem-solving skills are essential for success as a front-end engineer. Practice these skills in your work and personal life.

By following these steps, you can become a skilled and successful front-end engineer. Good luck!`,
  },
  {
    id: 5,
    type: "user",
    chat: "then which language should I use? Vue.js, react.js, svelte.js? any recommendations?",
  },
  {
    id: 6,
    type: "ai",
    chat: `Each front-end framework you mentioned (Vue.js, React.js, Svelte.js) has its own strengths and weaknesses, and the choice of which one to use often depends on the specific needs of your project and your personal preferences. Here are some general considerations that may help you decide:

Learning curve: React.js and Vue.js have larger communities and more resources available online, making them easier to learn for beginners. Svelte.js, on the other hand, is relatively new and has a smaller community.

Performance: Svelte.js has been praised for its performance and small bundle size, which can result in faster load times and better user experiences.

Flexibility: React.js is known for its flexibility and ability to handle complex projects, while Vue.js is often chosen for its ease of use and flexibility in integrating with other libraries.

Component-based approach: All three frameworks use a component-based approach, but the way they implement it varies. React.js uses a virtual DOM, Vue.js has a template-based syntax, and Svelte.js compiles components to highly efficient imperative code.

Ultimately, you should choose the framework that you feel most comfortable working with and that best fits the needs of your project. You can also consider looking at job postings in your area to see which frameworks are in high demand.`,
  },
];

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

      const res = await axios.post(`/api/chat`, {
        prompt: prompt,
        type: "NONE",
      });

      console.log(res, "@@@RES");

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
        <div className="flex h-full max-w-full flex-1 flex-col relative">
          <main className="bg-gray-800 w-full h-screen overflow-y-scroll">
            {/* <div>{answer && <p>{answer}</p>}</div> */}
            <div className="text-white pb-28 w-full min-h-screen">
              {testChats?.map((chat, index) => (
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
                        { "bg-green-300/60": index % 2 === 0 },
                        { "bg-blue-300/60": index % 2 === 1 }
                      )}
                    >
                      {index % 2 === 0 && <BiUser className="m-auto" />}
                      {index % 2 === 1 && <BsRobot className="m-auto" />}
                    </div>
                    <div className="whitespace-pre-wrap w-full text-sm">
                      {chat.chat}
                    </div>
                    <div className="flex gap-2 relative items-start rounded-sm flex-shrink-0">
                      <FiThumbsUp />
                      <FiThumbsDown />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <form className="stretch z-10 flex flex-row gap-3 pb-2 absolute w-full bottom-0 inset-x-0 mx-auto bg-gradient-to-t from-gray-800 to-gray-800/20">
              <div className="relative lg:flex h-full flex-1 md:flex-col lg:mx-auto lg:max-w-2xl xl:max-w-3xl mx-4 last:mb-6 ">
                <div className="flex ml-1 md:w-full md:m-auto md:mb-2 mb-2 gap-0 md:gap-2 justify-center">
                  <button className="px-3 py-2 rounded-md relative text-sm border border-white/50 text-white bg-gray-800">
                    <div className="flex w-full items-center justify-center gap-2">
                      <RegenerateIcon />
                      Regenerate response
                    </div>
                  </button>
                </div>
                <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-gray-700 dark:border-gray-900/50 text-white rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                  <textarea
                    rows={1}
                    disabled={loading}
                    onChange={(e) => updatePrompt(e.target.value)}
                    onKeyDown={(e) => sendPrompt(e)}
                    placeholder="Send a message..."
                    className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
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
                    {loading ? (
                      <TbLoader className="h-4 w-4 mr-1" />
                    ) : (
                      <ClickIcon />
                    )}
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
