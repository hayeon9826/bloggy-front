import Editor from "@/components/editor/Editor";
import Header from "@/components/editor/Header";

export default function PostNewPage() {
  return (
    <>
      <Header />
      <div className="relative">
        <Editor />
        <input
          required
          className="absolute top-[100px] inset-x-0 mx-auto w-full max-w-5xl text-2xl border-transparent focus:border-transparent focus:ring-0 !outline-none placeholder:text-gray-400"
          placeholder="Title"
        />
      </div>
    </>
  );
}
