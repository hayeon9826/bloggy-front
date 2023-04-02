import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { Post } from "@/interface";
import axios from "axios";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { BsPersonCircle } from "react-icons/bs";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
dayjs().format();

export default function PostPage() {
  const { data: session } = useSession();
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
        <div className="mx-auto max-w-7xl text-base leading-7 text-gray-700 md:flex">
          <div className="max-w-2xl lg:min-w-[576px] pr-8 lg:pr-0">
            <div className="flex justify-between mt-8 items-center">
              <div className="relative flex items-center gap-x-4">
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
                      {dayjs(post?.createdAt).format("YYYY-MM-DD")}
                    </span>
                  </p>
                </div>
              </div>
              {session?.user?.email === post?.user?.email && (
                <div className="flex gap-x-4 items-center text-xs text-gray-400 pr-4">
                  <button onClick={() => router.push(`/posts/${post?.id}/edit`)} type="button" className="hover:text-gray-500">
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await axios.delete(`/api/posts?id=${post?.id}`);
                        toast.success("삭제되었습니다.");
                        router.replace("/");
                      } catch (error) {
                        toast.error("삭제에 실패하였습니다.");
                      }
                    }}
                    className="hover:text-gray-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <h1 className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{post?.title}</h1>
            <div className="mt-6 leading-7 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: post?.content as string }} />
          </div>
          <SideBar />
        </div>
      </div>
    </>
  );
}
