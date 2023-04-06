import Editor from "@/components/editor/Editor";
import Header from "@/components/editor/Header";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { AiOutlineWarning, AiFillCheckCircle } from "react-icons/ai";
import axios from "axios";
import { Post, User } from "@/interface";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import FullPageLoader from "@/components/FullPageLoader";
import ReactQuill from "react-quill";
import { toast } from "react-hot-toast";
import { Tooltip } from "@nextui-org/react";
import { useQuery } from "react-query";
import Modal from "@/components/Modal";
import { Dialog } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import * as amplitude from "@amplitude/analytics-browser";

export default function PostNewPage() {
  const { data: session, status } = useSession();
  const [quillLoaded, setQuillLoaded] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const quillRef = useRef<ReactQuill | null>(null);
  const { id } = router.query;

  const config = {
    url: `/api/posts?id=${id}`,
  };

  const { data: post, isFetching } = useQuery(
    [`post-${id}`],
    async () => {
      const { data } = await axios(config);
      return data as Post;
    },
    {
      enabled: !!quillLoaded && !!id,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (quillRef?.current?.editor) {
          const delta = quillRef?.current?.editor?.clipboard?.convert(data?.content);
          quillRef?.current?.editor?.setContents(delta, "silent");
          handleChangeEditor(data?.content as string);
          setValue("title", data?.title);
          trigger("title");
        }
      },
    }
  );

  // console.log(post);

  const { data: user, isFetching: fetchingUser } = useQuery(
    ["user"],
    async () => {
      const { data } = await axios(config);
      return data as User;
    },
    {
      enabled: !!session?.user?.email,
      refetchOnWindowFocus: false,
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

  const handleRequestAccess = async () => {
    const eventProperties = {
      btn: "request_access",
    };

    const res = await axios.post("/api/waitLists", {
      email: session?.user?.email,
    });

    if (res?.data) {
      amplitude.track(`[SUCCESS_request_access]_posts_edit`, eventProperties);
      toast.success("Successfully joined the waitlist!");
    } else {
      amplitude.track(`[ERR_request_access]_posts_edit`, eventProperties);
      toast.error("Sorry, something went worng... Please try again");
    }

    setOpen(false);
  };

  const handleChangeEditor = (value: String) => {
    setValue("content", value === "<p><br></p>" ? "" : value);
    trigger("content");
  };

  const handleClickCreatePost = useCallback(async () => {
    const eventProperties = {
      id: id,
      btn: "create_post",
    };
    amplitude.track(`posts_edit`, eventProperties);
    if (user?.userType === "FREE" && user?.ai_records && user?.ai_records?.length >= 10) {
      setOpen(true);
      amplitude.track(`[request_access]_posts_edit`, eventProperties);
      return false;
    }
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
          amplitude.track(`[ERR_create_post]_posts_edit`, eventProperties);
          throw new Error("Something went wrong");
        }
        const { message } = res.data;
        if (quillRef?.current?.editor) {
          quillRef?.current?.editor.insertText(0, message);
        }
        handleChangeEditor(message);
        trigger("content");

        amplitude.track(`[SUCCESS_create_post]_posts_edit`, eventProperties);
      } catch (err: any) {
        if (err?.response?.data?.error) {
          toast.error(err?.response?.data?.error);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      }
      setLoading(false);
      console.log("prompt", prompt);
    } else {
      toast.error("Please fill in the title.");
    }
  }, []);

  const handleClickContinue = () => {
    const eventProperties = {
      id: id,
      btn: "continue",
    };
    toast("Please upgrade your account to continue");
    amplitude.track(`posts_edit`, eventProperties);
  };

  const handleClickEnhancement = () => {
    const eventProperties = {
      id: id,
      btn: "enhancement",
    };
    toast("Please upgrade your account to continue");
    amplitude.track(`posts_edit`, eventProperties);
  };

  const handleClickSummarize = () => {
    const eventProperties = {
      id: id,
      btn: "summarize",
    };
    toast("Please upgrade your account to continue");
    amplitude.track(`posts_edit`, eventProperties);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please login to continue");
      router.replace("/users/login");
      amplitude.track(`[unauth_err]_posts_edit`);
    }
  }, [router, status]);

  useEffect(() => {
    setTimeout(() => {
      setQuillLoaded(true);
    }, 500);
  }, []);

  useEffect(() => {
    const eventProperties = {
      id: id,
    };

    amplitude.track(`posts_edit`, eventProperties);
  }, [id]);

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
            <Tooltip rounded content="Fill in the title to create a blog post" color="primary">
              <button
                disabled={fetchingUser}
                onClick={handleClickCreatePost}
                id="create-blog-btn"
                type="button"
                className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm flex gap-2 items-center hover:bg-blue-600/75"
              >
                <AiFillCheckCircle />
                Write blog post
              </button>
            </Tooltip>
            <Tooltip rounded content={`Select the paragraph that you want to start continue writing`} color="invert">
              <button
                disabled={fetchingUser}
                onClick={handleClickContinue}
                id="continue-writing-btn"
                type="button"
                className="rounded-md bg-black text-white px-4 py-2 text-sm flex gap-2 items-center hover:bg-black/75"
              >
                <AiFillCheckCircle />
                Continue writing
              </button>
            </Tooltip>
            <Tooltip rounded content={`Select the paragraph that you want to enhance`} color="invert">
              <button
                disabled={fetchingUser}
                onClick={handleClickEnhancement}
                id="enhancement-btn"
                type="button"
                className="rounded-md bg-black text-white px-4 py-2 text-sm flex gap-2 items-center hover:bg-black/75"
              >
                <AiFillCheckCircle />
                Enhancement
              </button>
            </Tooltip>
            <Tooltip rounded content={`Select the paragraph that you want to summarize`} color="invert">
              <button
                disabled={fetchingUser}
                onClick={handleClickSummarize}
                id="summarize-btn"
                type="button"
                className="rounded-md bg-black text-white px-4 py-2 text-sm flex gap-2 items-center hover:bg-black/75"
              >
                <AiFillCheckCircle />
                Summarize
              </button>
            </Tooltip>
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
            <div className="mt-2 text-base text-gray-800">Please use PC to continue with Bloggy Editor</div>
            <AiOutlineWarning className="mx-auto w-20 h-20 mt-8 text-gray-600" />
            <button type="button" className="bg-black text-sm rounded-md px-4 py-2 mt-8 text-white shadow" onClick={handleClickMain}>
              Back to main page
            </button>
          </div>
        </div>
      </form>
      <Modal open={open} setOpen={setOpen}>
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
              Join the waitlist
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Your free trial has expired!
                <br />
                Join the waitlist for advanced features.
                <br />
                We{`'`}ll send you an email for updated features soon.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
            onClick={handleRequestAccess}
          >
            Request Access
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}
