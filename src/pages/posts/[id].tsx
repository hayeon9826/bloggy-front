import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { Post } from "@/interface";
import axios from "axios";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { BsPersonCircle } from "react-icons/bs";
import Prism from "prismjs";
import { useEffect } from "react";

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;

  const config = {
    url: `/api/posts?id=${id}`,
  };

  const { data: post, isFetching } = useQuery(
    [config],
    async () => {
      const { data } = await axios(config);
      return data as Post;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      <Header />
      <div className="bg-white py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-base leading-7 text-gray-700 flex">
          <div className="max-w-3xl lg:min-w-[576px]">
            <div className="relative mt-8 flex items-center gap-x-4">
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
                <p className="font-normal text-xs mt-1 text-gray-500">
                  <span>
                    <span className="absolute inset-0" />
                    {post?.createdAt}
                  </span>
                </p>
              </div>
            </div>
            <h1 className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{post?.title}</h1>
            <div className="mt-6 text-xl leading-8" dangerouslySetInnerHTML={{ __html: post?.content as string }} />
          </div>
          <SideBar />
        </div>
      </div>
    </>
  );
}
