import React, { useState } from "react";
import { Comment } from "../types/Comment";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  onSubmit: (
    text: string,
    file: File | null,
    parentId: string | null,
  ) => Promise<void>;
  onReaction: (commentId: string, reaction: string) => Promise<void>;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onSubmit,
  onReaction,
}) => {
  const [showAllComments, setShowAllComments] = useState(false);
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "latest") {
      return b.createdAt instanceof Date && a.createdAt instanceof Date
        ? b.createdAt.getTime() - a.createdAt.getTime()
        : 0;
    } else {
      return (b.reactionCount || 0) - (a.reactionCount || 0);
    }
  });

  const displayedComments = showAllComments
    ? sortedComments
    : sortedComments.slice(0, 8);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setSortBy("latest")}
          className={`mr-2 ${
            sortBy === "latest"
              ? "text-blue-500 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => setSortBy("popular")}
          className={`${
            sortBy === "popular"
              ? "text-blue-500 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Popular
        </button>
      </div>
      {displayedComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onSubmit={onSubmit}
          onReaction={onReaction}
          depth={0}
        />
      ))}
      {sortedComments.length > 8 && !showAllComments && (
        <button
          onClick={() => setShowAllComments(true)}
          className="mt-4 text-blue-500 hover:text-blue-700"
        >
          Show more
        </button>
      )}
    </div>
  );
};

export default CommentList;
