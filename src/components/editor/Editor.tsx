import React, { useState } from "react";

import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import FullPageLoader from "../FullPageLoader";
import ReactQuill from "react-quill";

import hljs from "highlight.js";

hljs.configure({
  languages: ["javascript", "ruby", "python", "rust", "node", "typescript", "jsx"],
});

const QuillWrapper = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return function comp({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  {
    ssr: false,
    loading: () => <FullPageLoader />,
  }
);

const modules = {
  syntax: {
    highlight: (text: string) => hljs.highlightAuto(text).value,
  },
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video"],
    ["clean", "code-block"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "code-block",
];

interface Props {
  contentValue?: any;
  handleChangeEditor: (value: string) => void;
  quillRef: React.MutableRefObject<ReactQuill | null>;
}

export default function Editor({ handleChangeEditor, quillRef }: Props) {
  return (
    <QuillWrapper forwardedRef={quillRef} theme="snow" onChange={handleChangeEditor} modules={modules} formats={formats} placeholder="Write your story..." />
  );
}
