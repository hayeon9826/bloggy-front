import Editor from "@/components/editor/Editor";
import Header from "@/components/editor/Header";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { AiOutlineWarning, AiFillCheckCircle } from "react-icons/ai";
import axios from "axios";
import { Post } from "@/interface";
import { useSession } from "next-auth/react";
import { useState } from "react";
import FullPageLoader from "@/components/FullPageLoader";

export default function PostNewPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
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

  const handleClickAiButton = async () => {
    console.log("click!");
    const val = getValues("title");

    console.log(val, val.length);
    if (val.length > 0) {
      try {
        setLoading(true);

        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: val }),
        };

        const res = await fetch(`/api/gpt`, requestOptions);
        console.log(res, "@@RES");
        if (!res.ok) {
          throw new Error("Something went wrong");
        }

        const { message } = await res.json();
        console.log(message, "@@@message");
        setValue("content", message);
        trigger("content");
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log("err", err);
      }
      console.log("prompt", prompt);
    }
  };

  console.log(loading);

  return (
    <>
      {loading && <FullPageLoader />}
      <form
        onSubmit={handleSubmit(async (data) => {
          console.log(data);
          const res = await axios.post<Post>("/api/posts", { ...data, email: session?.user?.email });

          console.log(res);
          if (res.data) {
            router.replace("/");
          }
        })}
      >
        <Header />
        <div className="relative hidden md:block">
          <Editor handleChangeEditor={handleChangeEditor} />
          <button
            onClick={handleClickAiButton}
            type="button"
            className="absolute top-[60px] right-10 rounded-md bg-black text-white px-4 py-1.5 text-sm flex gap-2 items-center"
          >
            <AiFillCheckCircle />
            AI Content Generator
          </button>
          <input
            required
            {...register("title", { required: true })}
            className="absolute top-[100px] inset-x-0 mx-auto w-full px-8 lg:px-0 max-w-5xl text-2xl border-transparent focus:border-transparent focus:ring-0 !outline-none placeholder:text-gray-400"
            placeholder="Title"
          />
        </div>
        <div className="min-h-screen md:hidden flex flex-col justify-center bg-black/50">
          <div className="bg-white rounded-lg w-[80vw] mx-auto text-center shadow px-8 py-12">
            <div className="text-2xl text-yellow-400 font-bold">Ooooops!</div>
            <div className="mt-2 text-base text-gray-800">Please use PC to continue with Bloggy Editor</div>
            <AiOutlineWarning className="mx-auto w-20 h-20 mt-8 text-gray-600" />
            <button type="button" className="bg-black text-sm rounded-md px-4 py-2 mt-8 text-white shadow" onClick={handleClickMain}>
              Back to main page
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
