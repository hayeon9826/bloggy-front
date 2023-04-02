import { Post } from "@/interface";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { PostListSkeleton } from "./posts/Skeleton";
import SideBar from "./SideBar";
import { BsPersonCircle } from "react-icons/bs";
import dayjs from "dayjs";
dayjs().format();

export default function PostList() {
  const router = useRouter();

  const handleClickLink = (id: string) => {
    router.push(`/posts/${id}`);
  };

  const config = {
    url: "/api/posts",
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8 md:flex">
        <div className="mx-auto max-w-2xl mt-32 lg:mt-20 pr-8 lg:pr-0">
          <div className="space-y-16 pt-10 sm:pt-16 overflow-y-scroll">
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
                      {dayjs(post?.createdAt).format("YYYY-MM-DD")}
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
                    <p className="mt-5 text-sm leading-6 text-gray-600 line-clamp-3">{RemoveHTMLTags(post?.content)}</p>
                  </div>
                  <div className="relative mt-4 flex items-center gap-x-4">
                    {post?.user?.imageUrl ? (
                      <img src={post?.user?.imageUrl} alt="" className="h-10 w-10 rounded-full bg-gray-50" />
                    ) : (
                      <BsPersonCircle className="w-10 h-10 text-gray-300" />
                    )}
                    <div className="text-sm leading-6">
                      <p className="font-normal text-xs text-gray-900">
                        <span>
                          <span className="absolute inset-0" />
                          {post?.user?.email}
                        </span>
                      </p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="w-full lg:w-[576px] rounded p-4 border border-gray-200 text-sm text-gray-500">No Posts Yet 😂</div>
            )}
          </div>
        </div>
        <SideBar className="mt-28" />
      </div>
    </div>
  );
}
