import { Comment } from "../types/Comment";
import ReactionButtons from "./ReactionButton";
import { formatDistanceToNow } from "date-fns";

interface CommentItemProps {
  comment: Comment;
  onSubmit: (
    text: string,
    file: File | null,
    parentId: string | null,
  ) => Promise<void>;
  onReaction: (commentId: string, reaction: string) => Promise<void>;
  depth: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReaction,
  depth,
}) => {
  return (
    <div
      className={`flex space-x-3 p-4 bg-white shadow rounded-lg mt-4 ${depth > 0 ? "ml-8" : ""}`}
    >
      <img
        className="h-10 w-10 rounded-full"
        src={comment.userPhoto}
        alt={comment.userName}
      />
      <div className="flex-grow">
        <div className="text-sm font-medium text-gray-900">
          {comment.userName}
        </div>
        <div className="mt-1 text-sm text-gray-700">{comment.text}</div>
        {comment.fileUrl && (
          <img
            src={comment.fileUrl}
            alt="Attached file"
            className="mt-2 max-w-xs rounded"
          />
        )}
        <div className="mt-2 text-sm text-gray-500">
          {comment.createdAt instanceof Date
            ? formatDistanceToNow(comment.createdAt, { addSuffix: true })
            : "Just now"}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <ReactionButtons
            commentId={comment.id}
            reactions={comment.reactions}
          />
          {Object.entries(comment.reactions).map(
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

export default CommentItem;
