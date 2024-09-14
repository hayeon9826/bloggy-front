import { Post } from "@/interface";
import { BsPersonCircle } from "react-icons/bs";
import dayjs from "dayjs";
import { RemoveHTMLTags } from "@/utils";
import { useRouter } from "next/router";
dayjs().format();

interface Props {
  post: Post;
}

export default function PostArticle({ post }: Props) {
  const router = useRouter();
  const handleClickLink = (id: string) => {
    router.push(`/posts/${id}`);
  };

  return (
    <article
      role="presentation"
      onClick={() => handleClickLink(post.id)}
      key={post.id}
      className="flex lg:min-w-[576px] max-w-2xl flex-col items-start justify-between cursor-pointer hover:bg-gray-100/50 p-4"
    >
      <div className="flex items-center gap-x-4 text-xs">
        <time dateTime={post?.createdAt} className="text-gray-500">
          {dayjs(post?.createdAt).format("YYYY-MM-DD")}
        </time>
      </div>
      <div className="group relative">
        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
          <span>
            <span className="absolute inset-0" />
            {post?.title}
          </span>
        </h3>
        <p className="mt-5 text-sm leading-6 text-gray-600 line-clamp-3">
          {post?.summary}
        </p>
      </div>
      <div className="relative mt-4 flex items-center gap-x-4">
        {post?.user?.imageUrl ? (
          <img
            src={post?.user?.imageUrl}
            alt=""
            className="h-10 w-10 rounded-full bg-gray-50"
          />
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
  );
}
