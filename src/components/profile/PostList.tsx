import { Post } from "@/interface";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { PostListSkeleton } from "../posts/Skeleton";
import cn from "classnames";
import { useSession } from "next-auth/react";

import { BsPersonCircle } from "react-icons/bs";

export default function PostList() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClickLink = (id: string) => {
    router.push(`/posts/${id}`);
  };

  const config = {
    url: `/api/posts?email=${session?.user?.email}`,
  };

  const { data: posts, isFetching } = useQuery(
    [config],
    async () => {
      const { data } = await axios(config);
      return data as Post[];
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const RemoveHTMLTags = (html: string) => {
    var regX = /(<([^>]+)>)/gi;
    return html.replace(regX, "");
  };

  return (
    <div className="bg-white pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 lg:flex">
        <div className="mx-auto max-w-2xl mt-40 lg:mt-20">
          <div className="space-y-16 pt-10 sm:mt-12 sm:pt-16 overflow-y-scroll">
            {isFetching && <PostListSkeleton />}
            {posts && posts?.length > 0 ? (
              posts?.map((post: Post) => (
                <article
                  role="presentation"
                  onClick={() => handleClickLink(post.id)}
                  key={post.id}
                  className="flex max-w-xl flex-col items-start justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-x-4 text-xs">
                    <time dateTime={post?.createdAt} className="text-gray-500">
                      {post?.createdAt}
                    </time>
                    {/* <a href={post.category.href} className="relative z-10 rounded-full bg-gray-50 py-1.5 px-3 font-medium text-gray-600 hover:bg-gray-100">
                    {post.category.title}
                  </a> */}
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <span>
                        <span className="absolute inset-0" />
                        {post?.title}
                      </span>
                    </h3>
                    <p className="mt-5 text-sm leading-6 text-gray-600 line-clamp-3">
                      {RemoveHTMLTags(post?.content)}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="w-full lg:w-[576px] rounded p-4 border border-gray-200 text-sm text-gray-500">
                No Posts Yet 😂
              </div>
            )}
          </div>
        </div>
        <div
          className={cn(
            "mx-auto lg:max-w-xs lg:border-l border-gray-200 min-h-screen"
          )}
        >
          <div
            className={cn(
              "space-y-16 pt-10  overflow-y-scroll lg:pl-12",
              "mt-28"
            )}
          >
            <div className="text-sm leading-6">
              <div className="relative mt-4 flex items-center gap-x-4">
                {session?.user?.image ? (
                  <img
                    src={session?.user?.image}
                    alt=""
                    className="h-20 w-20 rounded-full bg-gray-50"
                  />
                ) : (
                  <BsPersonCircle className="w-20 h-20 text-gray-300" />
                )}
              </div>
              <p className="mt-4 text-sm font-medium text-gray-900">
                <div>
                  <span className="absolute inset-0" />
                  {session?.user?.email}
                </div>
                <div className="mt-2">
                  <span className="absolute inset-0" />
                  {session?.user?.name}
                </div>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
