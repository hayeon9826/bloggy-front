import { useCallback, useEffect, useRef } from "react";

import { Post } from "@/interface";
import axios from "axios";
import { useInfiniteQuery } from "react-query";
import { PostListSkeleton } from "./posts/Skeleton";

import dayjs from "dayjs";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import PostArticle from "./posts/PostArticle";

import Loader from "./Loader";
import { useRouter } from "next/router";
dayjs().format();

export default function PostList() {
  const listRef = useRef<HTMLDivElement | null>(null);
  const listEnd = useIntersectionObserver(listRef, {});
  const isEndPage = !!listEnd?.isIntersecting;
  const router = useRouter();
  const { search } = router.query;

  const {
    data: posts,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    hasNextPage,
  } = useInfiniteQuery(
    [`posts-${search}`],
    async ({ pageParam = 0 }) => {
      const result = await axios("/api/posts", {
        params: {
          limit: 10,
          page: pageParam,
          q: search,
        },
      });

      return result.data;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      getNextPageParam: (lastPage: any) =>
        lastPage.objects?.length > 0 ? lastPage.page + 1 : undefined,
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
      <div className="mx-auto max-w-7xl px-6 lg:px-8 md:flex">
        <div className="mx-auto w-full max-w-2xl mt-32 lg:mt-20 pr-8 lg:pr-0">
          <div className="space-y-4 pt-10 sm:pt-16 overflow-y-scroll">
            {isFetching && <PostListSkeleton />}
            {isSuccess && posts?.pages?.length > 1 ? (
              posts?.pages?.map((page) =>
                page?.objects?.map((post: Post) => (
                  <PostArticle key={post.id} post={post} />
                ))
              )
            ) : (
              <>
                {isSuccess && posts?.pages?.length === 0 && (
                  <div className="w-full lg:w-[576px] rounded p-4 border border-gray-200 text-sm text-gray-500">
                    No Posts Yet 😂
                  </div>
                )}
              </>
            )}
            {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
            <div className="w-full touch-none h-10" ref={listRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
