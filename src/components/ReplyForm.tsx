import React, { useState } from "react";
import { addDoc, collection, updateDoc, increment } from "firebase/firestore";
import { db, auth } from "../firebase";
import { toast } from "react-toastify";

interface ReplyInputProps {
  parentId: string;
  onReplyAdded: () => void;
}

const ReplyInput: React.FC<ReplyInputProps> = ({ parentId, onReplyAdded }) => {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, "comments"), {
        text: replyText,
        createdAt: new Date(),
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName,
        userPhoto: auth.currentUser.photoURL,
        parentId,
        reactions: {
          "👍": 0,
          "❤️": 0,
          "😊": 0,
          "😢": 0,
        },
      });

      const parentCommentRef = doc(db, "comments", parentId);
      await updateDoc(parentCommentRef, {
        replyCount: increment(1),
      });

      setReplyText("");
      onReplyAdded();
      toast.success("Reply added successfully!");
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Write a reply..."
      />
      <button
        type="submit"
        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
      >
        Post Reply
      </button>
    </form>
  );
};

export default ReplyInput;
