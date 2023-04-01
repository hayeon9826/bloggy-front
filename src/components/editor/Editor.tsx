import React, { useState } from "react";

import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import FullPageLoader from "../FullPageLoader";

import hljs from "highlight.js";

hljs.configure({
  languages: ["javascript", "ruby", "python", "rust", "node", "typescript", "jsx"],
});

const QuillWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <FullPageLoader />,
});

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
    matchVisual: false,
  },
};

interface Props {
  handleChangeEditor: (value: string) => void;
}

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

export default function Editor({ handleChangeEditor }: Props) {
  const [value, setValue] = useState("");
  return <QuillWrapper theme="snow" onChange={handleChangeEditor} modules={modules} formats={formats} placeholder="Write your story..." />;
}
