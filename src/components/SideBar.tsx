import { useRouter } from "next/router";
import cn from "classnames";

const posts = [
  {
    id: 1,
    title: "Boost your conversion rate",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel iusto corrupti dicta laboris incididunt.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 2,
    title: "Boost your conversion rate",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel iusto corrupti dicta laboris incididunt.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 3,
    title: "Boost your conversion rate",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel iusto corrupti dicta laboris incididunt.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
];

export default function SideBar({ className = "" }) {
  const router = useRouter();

  const handleClickLink = (id: number) => {
    router.push(`/posts/${id}`);
  };

  return (
    <div className={cn("mx-auto lg:max-w-xs md:border-l border-gray-200 min-h-screen hidden md:block pl-8 lg:pl-0")}>
      <div className={cn("space-y-4 pt-10  overflow-y-scroll lg:pl-12", className)}>
        <h3 className="font-semibold">Recommendations</h3>
        {posts.map((post) => (
          <article
            role="presentation"
            onClick={() => handleClickLink(post.id)}
            key={post.id}
            className="flex max-w-xl flex-col items-start justify-between cursor-pointer"
          >
            <div className="flex items-center gap-x-4 text-xs">
              <time dateTime={post.datetime} className="text-gray-500">
                {post.date}
              </time>
            </div>
            <div className="group relative">
              <h3 className="mt-3 text-base font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                <span>
                  <span className="absolute inset-0" />
                  {post.title}
                </span>
              </h3>
            </div>
            <div className="relative mt-2 flex items-center gap-x-4">
              <img src={post.author.imageUrl} alt="" className="h-8 w-8 rounded-full bg-gray-50" />
              <div className="text-sm leading-6">
                <p className="font-semibold text-gray-900">
                  <span>
                    <span className="absolute inset-0" />
                    {post.author.name}
                  </span>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className={cn("space-y-4 overflow-y-scroll lg:pl-12 mt-12")}>
        <h3 className="font-semibold">Recent</h3>
        {posts.map((post) => (
          <article
            role="presentation"
            onClick={() => handleClickLink(post.id)}
            key={post.id}
            className="flex max-w-xl flex-col items-start justify-between cursor-pointer"
          >
            <div className="flex items-center gap-x-4 text-xs">
              <time dateTime={post.datetime} className="text-gray-500">
                {post.date}
              </time>
            </div>
            <div className="group relative">
              <h3 className="mt-3 text-base font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                <span>
                  <span className="absolute inset-0" />
                  {post.title}
                </span>
              </h3>
            </div>
            <div className="relative mt-2 flex items-center gap-x-4">
              <img src={post.author.imageUrl} alt="" className="h-8 w-8 rounded-full bg-gray-50" />
              <div className="text-sm leading-6">
                <p className="font-semibold text-gray-900">
                  <span>
                    <span className="absolute inset-0" />
                    {post.author.name}
                  </span>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
