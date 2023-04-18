import { useCallback, useEffect, useRef } from "react";

import { Post } from "@/interface";
import axios from "axios";
import { useInfiniteQuery } from "react-query";
import { PostListSkeleton } from "../posts/Skeleton";
import cn from "classnames";
import { useSession } from "next-auth/react";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import dayjs from "dayjs";
dayjs().format();

import { BsPersonCircle } from "react-icons/bs";
import Loader from "../Loader";
import PostArticle from "../posts/PostArticle";

interface Props {
  email: string;
}

export default function PostList({ email }: Props) {
  const { data: session } = useSession();
  const listRef = useRef<HTMLDivElement | null>(null);
  const listEnd = useIntersectionObserver(listRef, {});
  const isEndPage = !!listEnd?.isIntersecting;

  const {
    data: posts,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    hasNextPage,
  } = useInfiniteQuery(
    [`posts-${email}`],
    async ({ pageParam = 0 }) => {
      const result = await axios("/api/posts", {
        params: {
          limit: 10,
          page: pageParam,
          email,
        },
      });

      return result.data;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      getNextPageParam: (lastPage: any) => (lastPage.objects?.length > 0 ? lastPage.page + 1 : undefined),
    }
  );

  const fetchNext = useCallback(async () => {
    const res = await fetchNextPage();
    if (res.isError) {
      console.log(res.error);
    }
  }, [fetchNextPage]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (isEndPage && hasNextPage) {
      timerId = setTimeout(() => {
        fetchNext();
      }, 500);
    }

    return () => clearTimeout(timerId);
  }, [fetchNext, hasNextPage, isEndPage]);

  return (
    <div className="bg-white pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 lg:flex">
        <div className="mx-auto max-w-2xl mt-32 lg:mt-20">
          <div className="space-y-16 pt-10 sm:pt-16 overflow-y-scroll">
            {isFetching && <PostListSkeleton />}
            {isSuccess && posts?.pages?.length > 0 ? (
              posts?.pages?.map((page) => page?.objects?.map((post: Post) => <PostArticle key={post.id} post={post} />))
            ) : (
              <>{!isFetching && <div className="w-full lg:w-[576px] rounded p-4 border border-gray-200 text-sm text-gray-500">No Posts Yet 😂</div>}</>
            )}
            {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
            <div className="w-full touch-none h-10" ref={listRef} />
          </div>
        </div>
        <div className={cn("mx-auto lg:max-w-xs lg:border-l border-gray-200 min-h-screen")}>
          <div className={cn("space-y-16 pt-10  overflow-y-scroll lg:pl-12", "mt-28")}>
            <div className="text-sm leading-6">
              <div className="relative mt-4 flex items-center gap-x-4">
                {session?.user?.image ? (
                  <img src={session?.user?.image} alt="" className="h-20 w-20 rounded-full bg-gray-50" />
                ) : (
                  <BsPersonCircle className="w-20 h-20 text-gray-300" />
                )}
              </div>
              <div className="mt-4 text-sm font-medium text-gray-900">
                <div>{session?.user?.email}</div>
                <div className="mt-2">{session?.user?.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
