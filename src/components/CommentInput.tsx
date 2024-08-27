import React, { useState } from "react";
import ReactQuill from "react-quill";
import { MentionsInput, Mention } from "react-mentions";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { auth } from "../firebase";

interface User {
  id: string;
  display: string;
}

interface CommentInputProps {
  onSubmit: (
    text: string,
    file: File | null,
    parentId?: string | null,
  ) => Promise<void>;
  isReply?: boolean;
  parentId?: string | null;
}

const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  isReply = false,
  parentId = null,
}) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fetchUsers = async (
    query: string,
    callback: (users: User[]) => void,
  ) => {
    const users: User[] = [
      { id: "1", display: "johndoe" },
      { id: "2", display: "janedoe" },
    ];
    callback(
      users.filter((user) =>
        user.display.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      const cleanedText = text.replace(/<p>/g, "").replace(/<\/p>/g, "");

      await onSubmit(cleanedText, file, parentId);

      toast.success(
        isReply ? "Reply posted successfully!" : "Comment posted successfully!",
      );
      setText("");
      setFile(null);
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  const modules = {
    toolbar: [["bold", "italic", "underline"]],
  };

  return (
    <form onSubmit={handleSubmit} className={`mt-4 ${isReply ? "ml-8" : ""}`}>
      <ReactQuill
        value={text}
        onChange={setText}
        modules={modules}
        className="bg-white mt-16 flex flex-col-reverse border-2 border-solid border-zinc-200"
      />

      <label className="inline-block flex p-1 relative bottom-9 left-24 w-7 h-7 bg-white rounded-lg cursor-pointer items-center justify-center">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept="image/*"
          className="hidden"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
          />
        </svg>
      </label>
      <button
        type="submit"
        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isReply ? "Post Reply" : "Post Comment"}
      </button>
    </form>
  );
};

export default CommentInput;
