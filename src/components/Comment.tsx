import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import ReactionButtons from "./ReactionButton";
import { Timestamp } from "firebase/firestore";

interface CommentProps {
  comment: {
    id: string;
    text: string;
    createdAt: Timestamp | null;
    userName: string;
    userPhoto: string;
    fileUrl?: string;
    reactions?: Record<string, number>;
  };
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((prevExpanded) => !prevExpanded);

  const reactions = comment.reactions || {};
  console.log(comment);

  const hasLongText = comment.text.split("\n").length > 5;

  return (
    <div className="flex space-x-3 p-4 bg-white shadow rounded-lg mt-4">
      <img
        className="h-10 w-10 rounded-full"
        src={comment.userPhoto}
        alt={comment.userName}
      />
      <div className="flex-grow">
        <div className="text-sm font-medium text-gray-900">
          {comment.userName}
        </div>
        <div className="mt-1 text-sm text-gray-700">
          {expanded || !hasLongText
            ? comment.text
            : `${comment.text.split("\n").slice(0, 5).join("\n")}...`}
          {hasLongText && (
            <button
              onClick={toggleExpanded}
              className="text-blue-500 hover:text-blue-700 ml-2"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
        {comment.fileUrl && (
          <img
            src={comment.fileUrl}
            alt="Attached file"
            className="mt-2 max-w-xs rounded"
          />
        )}
        <div className="mt-2 text-sm text-gray-500">
          {comment.createdAt
            ? formatDistanceToNow(comment.createdAt.toDate(), {
                addSuffix: true,
              })
            : "Just now"}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <ReactionButtons commentId={comment.id} reactions={reactions} />
          {Object.entries(reactions).map(
            ([reaction, count]) =>
              count > 0 && (
                <span key={reaction} className="text-sm text-gray-500">
                  {reaction} {count}
                </span>
              ),
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
