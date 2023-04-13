import Sidebar from "@/components/chat/SideBar";
import { ChatListLayout, Layout } from "@/components/chat";
import ChatForm from "@/components/chat/ChatForm";
import ChatList, { MessageData } from "@/components/chat/ChatList";
import { useSession } from "next-auth/react";
import FullPageLoader from "@/components/FullPageLoader";
import { useState } from "react";

const chats = [
  { id: "1", title: "what is the longest word in the world?", userId: "eeeee" },
  { id: "2", title: "user inquery summary", userId: "eeeee" },
  { id: "3", title: "코딩 잘하는 법", userId: "eeeee" },
  { id: "4", title: "3행시 지어줘", userId: "eeeee" },
  { id: "5", title: "test", userId: "eeeee" },
  { id: "6", title: "hi", userId: "eeeee" },
];

const messages: MessageData[] = [
  { id: 1, type: "USER", chat: "Hi" },
  { id: 2, type: "AI", chat: "Hello! How can I assist you today?" },
  {
    id: 3,
    type: "USER",
    chat: "what should I do to become a good front-end engineer?",
  },
  {
    id: 4,
    type: "AI",
    chat: `Becoming a good front-end engineer involves a combination of technical skills and soft skills. Here are some steps you can take to improve your skills and become a successful front-end engineer:

Learn HTML, CSS, and JavaScript: These are the foundational languages of front-end development. Take online courses or attend in-person classes to learn these languages and how they work together.

Practice coding: Practice building websites and web applications using HTML, CSS, and JavaScript. This will help you to become more proficient in these languages and to understand how they work in real-world scenarios.

Keep up with industry trends: Follow blogs, newsletters, and online communities to stay up-to-date on the latest trends and technologies in front-end development.

Learn a front-end framework: Frameworks like React, Vue, and Angular are widely used in the industry. Choose one and learn it well.

Build a portfolio: Create a portfolio of your work to showcase your skills and experience to potential employers. Include a variety of projects that demonstrate your proficiency in front-end development.

Collaborate with others: Work with other developers, designers, and stakeholders to gAIn experience in collaborating on projects and working as part of a team.

Improve your soft skills: Effective communication, time management, and problem-solving skills are essential for success as a front-end engineer. Practice these skills in your work and personal life.

By following these steps, you can become a skilled and successful front-end engineer. Good luck!`,
  },
  {
    id: 5,
    type: "USER",
    chat: "then which language should I use? Vue.js, react.js, svelte.js? any recommendations?",
  },
  {
    id: 6,
    type: "AI",
    chat: `Each front-end framework you mentioned (Vue.js, React.js, Svelte.js) has its own strengths and weaknesses, and the choice of which one to use often depends on the specific needs of your project and your personal preferences. Here are some general considerations that may help you decide:

Learning curve: React.js and Vue.js have larger communities and more resources available online, making them easier to learn for beginners. Svelte.js, on the other hand, is relatively new and has a smaller community.

Performance: Svelte.js has been praised for its performance and small bundle size, which can result in faster load times and better user experiences.

Flexibility: React.js is known for its flexibility and ability to handle complex projects, while Vue.js is often chosen for its ease of use and flexibility in integrating with other libraries.

Component-based approach: All three frameworks use a component-based approach, but the way they implement it varies. React.js uses a virtual DOM, Vue.js has a template-based syntax, and Svelte.js compiles components to highly efficient imperative code.

Ultimately, you should choose the framework that you feel most comfortable working with and that best fits the needs of your project. You can also consider looking at job postings in your area to see which frameworks are in high demand.`,
  },
];

function App() {
  const { data: session } = useSession();

  if (!session?.user?.email) return <FullPageLoader />;

  return (
    <>
      <Layout>
        <Sidebar chats={chats} />
        <ChatListLayout>
          <ChatList data={null} />
          <ChatForm />
        </ChatListLayout>
      </Layout>
    </>
  );
}

export default App;
