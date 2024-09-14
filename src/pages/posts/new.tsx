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
import useAmplitude from "@/hooks/useAmplitude";

export default function PostNewPage() {
  const { data: session, status } = useSession();
  const { amplitude } = useAmplitude({ session });
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const quillRef = useRef<ReactQuill | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();

  const handleClickMain = () => {
    router.push("/");
  };

  const config = {
    url: `/api/users?email=${session?.user?.email}`,
  };

  const { data: user, isFetching: fetchingUser } = useQuery(
    ["user"],
    async () => {
      const { data } = await axios(config);
      return data as User;
    },
    {
      enabled: !!session?.user?.email,
      refetchOnWindowFocus: true,
    }
  );

  const handleChangeEditor = useCallback(
    (value: String) => {
      setValue("content", value === "<p><br></p>" ? "" : value);
      trigger("content");
    },
    [setValue, trigger]
  );

  const handleTranslateKoreanToEnglish = async () => {
    const eventProperties = {
      btn: "KoreanToEnglish",
    };
    amplitude.track(`posts_new`, eventProperties);

    const quill = quillRef.current?.getEditor();
    if (!quill) {
      toast.error("Editor not available");
      return;
    }

    // Safely retrieve the selection
    const selection = quill.getSelection();
    if (!selection || selection.length === 0) {
      toast.error("Please select text to translate.");
      return;
    }

    // Extract selected text safely
    const selectedText = quill.getText(selection.index, selection.length);
    if (!selectedText || selectedText.trim() === "") {
      toast.error("Please select text to translate.");
      return;
    }

    try {
      // Send selected text to the translation API
      const response = await axios.post("/api/translate", {
        text: selectedText,
        source: "ko",
        target: "en-US",
      });

      const { translatedText } = response.data;

      if (!translatedText) {
        throw new Error("No translation received.");
      }

      // Insert translated text back into the editor
      quill.deleteText(selection.index, selection.length);
      quill.insertText(selection.index, translatedText);

      // Notify the user
      toast.success("Translation completed successfully.");
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Translation failed. Please try again.");
    }
  };

  const handleTranslateEnglishToKorean = async () => {
    const eventProperties = {
      btn: "EnglishToKorean",
    };
    amplitude.track(`posts_new`, eventProperties);

    const quill = quillRef.current?.getEditor();
    if (!quill) {
      toast.error("Editor not available");
      return;
    }

    // Safely retrieve the selection
    const selection = quill.getSelection();
    if (!selection || selection.length === 0) {
      toast.error("Please select text to translate.");
      return;
    }

    // Extract selected text safely
    const selectedText = quill.getText(selection.index, selection.length);
    if (!selectedText || selectedText.trim() === "") {
      toast.error("Please select text to translate.");
      return;
    }

    try {
      // Send selected text to the translation API
      const response = await axios.post("/api/translate", {
        text: selectedText,
        source: "en",
        target: "ko",
      });

      const { translatedText } = response.data;

      if (!translatedText) {
        throw new Error("No translation received.");
      }

      // Insert translated text back into the editor
      quill.deleteText(selection.index, selection.length);
      quill.insertText(selection.index, translatedText);

      // Notify the user
      toast.success("Translation completed successfully.");
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Translation failed. Please try again.");
    }
  };

  const handleRequestAccess = async () => {
    const eventProperties = {
      btn: "request_access",
    };

    const res = await axios.post("/api/waitLists", {
      email: session?.user?.email,
    });

    if (res?.data) {
      amplitude.track(`[SUCCESS_request_access]_posts_new`, eventProperties);
      toast.success("Successfully joined the waitlist!");
    } else {
      amplitude.track(`[ERR_request_access]_posts_new`, eventProperties);
      toast.error("Sorry, something went worng... Please try again");
    }

    setOpen(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please login to continue");
      router.replace("/users/login");
    }
  }, [router, status]);

  useEffect(() => {
    amplitude.track(`post_new`);
  }, []);

  return (
    <>
      {loading && <FullPageLoader />}
      <form
        onSubmit={handleSubmit(async (data) => {
          const res = await axios.post<Post>("/api/posts", {
            ...data,
            email: session?.user?.email,
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
            <Tooltip rounded content="Publish your blog post!" color="primary">
              <button
                disabled={fetchingUser}
                onClick={handleSubmit(async (data) => {
                  const res = await axios.post<Post>("/api/posts", {
                    ...data,
                    email: session?.user?.email,
                  });

                  if (res.data) {
                    toast.success("Successfully created!");
                    router.replace("/");
                  }
                })}
                id="create-blog-btn"
                type="button"
                className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm flex gap-2 items-center hover:bg-blue-600/75"
              >
                <AiFillCheckCircle />
                Publish
              </button>
            </Tooltip>
            <Tooltip
              rounded
              content={`Select the paragraph that you want to translate (Ko -> En)`}
              color="invert"
            >
              <button
                disabled={fetchingUser}
                onClick={handleTranslateKoreanToEnglish}
                id="continue-writing-btn"
                type="button"
                className="rounded-md bg-black text-white px-4 py-2 text-sm flex gap-2 items-center hover:bg-black/75"
              >
                <AiFillCheckCircle />
                Translate Korean to English
              </button>
            </Tooltip>
            <Tooltip
              rounded
              content={`Select the paragraph that you want to translate (En -> Ko)`}
              color="invert"
            >
              <button
                disabled={fetchingUser}
                onClick={handleTranslateEnglishToKorean}
                id="enhancement-btn"
                type="button"
                className="rounded-md bg-black text-white px-4 py-2 text-sm flex gap-2 items-center hover:bg-black/75"
              >
                <AiFillCheckCircle />
                Translate English to Korean
              </button>
            </Tooltip>
          </div>
          <input
            required
            {...register("title", { required: true })}
            className="absolute top-[-100px] inset-x-0 mx-auto w-full px-8 lg:px-0 max-w-5xl text-2xl border-transparent focus:border-transparent focus:ring-0 !outline-none focus:bg-gray-50 py-1.5 placeholder:text-gray-400"
            placeholder="Title"
          />
          <input
            required
            {...register("summary", { required: true })}
            className="absolute top-[-50px] inset-x-0 mx-auto w-full px-8 lg:px-0 max-w-5xl border-transparent focus:border-transparent focus:ring-0 !outline-none focus:bg-gray-50 py-1.5 placeholder:text-gray-400"
            placeholder="Summarize your post in one sentence."
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
      <Modal open={open} setOpen={setOpen}>
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="text-base font-semibold leading-6 text-gray-900"
            >
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
