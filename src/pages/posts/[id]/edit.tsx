import Editor from "@/components/editor/Editor";
import Header from "@/components/editor/Header";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { AiOutlineWarning, AiFillCheckCircle } from "react-icons/ai";
import axios from "axios";
import { Post } from "@/interface";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import FullPageLoader from "@/components/FullPageLoader";
import ReactQuill from "react-quill";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import { useQuery } from "react-query";

export default function PostNewPage() {
  const { data: session, status } = useSession();
  const [quillLoaded, setQuillLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const quillRef = useRef<ReactQuill | null>(null);
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
      enabled: !!quillLoaded,
      onSuccess: () => {
        if (quillRef?.current?.editor) {
          const delta = quillRef?.current?.editor?.clipboard?.convert(
            post?.content
          );
          quillRef?.current?.editor?.setContents(delta, "silent");
          handleChangeEditor(post?.content as string);
          setValue("title", post?.title);
          trigger("title");
        }
      },
    }
  );

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm();

  const handleClickMain = () => {
    router.push("/");
  };

  const handleChangeEditor = (value: String) => {
    setValue("content", value === "<p><br></p>" ? "" : value);
    //onChange 됐는지 안됐는지 react-hook-form에 notice
    trigger("content");
  };

  const handleClickCreatePost = useCallback(async () => {
    const val = getValues("title");
    if (val.length > 0) {
      try {
        setLoading(true);
        const res = await axios.post("/api/aiRecords", {
          prompt: val,
          type: "CREATE_POST",
          email: session?.user?.email,
        });
        if (!res.data) {
          throw new Error("Something went wrong");
        }
        const { message } = res.data;
        if (quillRef?.current?.editor) {
          quillRef?.current?.editor.insertText(0, message);
        }
        handleChangeEditor(message);
        trigger("content");
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log("err", err);
      }
      console.log("prompt", prompt);
    } else {
      toast.error("Please fill in the title.");
    }
  }, []);

  const handleClickContinue = () => {
    toast("Please upgrade your account to continue");
  };

  const handleClickEnhancement = () => {
    toast("Please upgrade your account to continue");
  };

  const handleClickSummarize = () => {
    toast("Please upgrade your account to continue");
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please login to continue");
      router.replace("/users/login");
    }
  }, [router, status]);

  useEffect(() => {
    setTimeout(() => {
      setQuillLoaded(true);
    }, 500);
  }, []);

  return (
    <>
      {(loading || isFetching || !quillLoaded) && <FullPageLoader />}
      <form
        onSubmit={handleSubmit(async (data) => {
          const res = await axios.put<Post>("/api/posts", {
            ...data,
            email: session?.user?.email,
            id: post?.id,
          });

          if (res.data) {
            toast.success("Successfully created!");
            router.replace("/");
          }
        })}
      >
        <Header />
        <div className="relative hidden md:block">
          <Editor handleChangeEditor={handleChangeEditor} quillRef={quillRef} />
          <div className="w-full mx-auto fixed inset-x-0 flex gap-4 justify-center bottom-[60px]">
            <button
              onClick={handleClickCreatePost}
              id="create-blog-btn"
              type="button"
              className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm flex gap-2 items-center hover:bg-blue-600/75"
            >
              <AiFillCheckCircle />
              Write blog post
            </button>
            <button
              onClick={handleClickContinue}
              id="continue-writing-btn"
              type="button"
              className="rounded-md bg-black text-white px-4 py-2 text-sm flex gap-2 items-center hover:bg-black/75"
            >
              <AiFillCheckCircle />
              Continue writing
            </button>

            <button
              onClick={handleClickEnhancement}
              id="enhancement-btn"
              type="button"
              className="rounded-md bg-black text-white px-4 py-2 text-sm flex gap-2 items-center hover:bg-black/75"
            >
              <AiFillCheckCircle />
              Enhancement
            </button>
            <button
              onClick={handleClickSummarize}
              id="summarize-btn"
              type="button"
              className="rounded-md bg-black text-white px-4 py-2 text-sm flex gap-2 items-center hover:bg-black/75"
            >
              <AiFillCheckCircle />
              Summarize
            </button>
            <Tooltip
              anchorSelect="#create-blog-btn"
              place="top"
              content="Fill in the title to create a blog post"
            />
            <Tooltip
              anchorSelect="#continue-writing-btn"
              place="top"
              content={`Select the paragraph that you want to start continue writing`}
            />
            <Tooltip
              anchorSelect="#enhancement-btn"
              place="top"
              content={`Select the paragraph that you want to enhance`}
            />
            <Tooltip
              anchorSelect="#summarize-btn"
              place="top"
              content={`Select the paragraph that you want to summarize`}
            />
          </div>

          <input
            required
            defaultValue={getValues("title")}
            {...register("title", { required: true })}
            className="absolute top-[100px] inset-x-0 mx-auto w-full px-8 lg:px-0 max-w-5xl text-2xl border-transparent focus:border-transparent focus:ring-0 !outline-none placeholder:text-gray-400"
            placeholder="Title"
          />
        </div>
        <div className="min-h-screen md:hidden flex flex-col justify-center bg-black/50">
          <div className="bg-white rounded-lg w-[80vw] mx-auto text-center shadow px-8 py-12">
            <div className="text-2xl text-yellow-400 font-bold">Ooooops!</div>
            <div className="mt-2 text-base text-gray-800">
              Please use PC to continue with Bloggy Editor
            </div>
            <AiOutlineWarning className="mx-auto w-20 h-20 mt-8 text-gray-600" />
            <button
              type="button"
              className="bg-black text-sm rounded-md px-4 py-2 mt-8 text-white shadow"
              onClick={handleClickMain}
            >
              Back to main page
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
