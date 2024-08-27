import React, { useState } from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db, auth } from "../firebase";
import { toast } from "react-toastify";

interface ReactionButtonsProps {
  commentId: string;
  reactions: { [key: string]: number };
}

const ReactionButtons: React.FC<ReactionButtonsProps> = ({
  commentId,
  reactions,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleReaction = async (emoji: string) => {
    if (!auth.currentUser) {
      toast.error("You must be logged in to react to comments.");
      return;
    }
    try {
      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, {
        [`reactions.${emoji}`]: increment(1),
      });
      toast.success("Reaction added!");
    } catch (error) {
      console.error("Error adding reaction:", error);
      toast.error("Failed to add reaction. Please try again.");
    }
  };

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span role="img" aria-label="Reactions">
          😀
        </span>
        <span>{totalReactions}</span>
      </button>

      {isOpen && (
        <div className="absolute flex left-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1 flex" role="menu">
            {Object.entries(reactions).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => {
                  handleReaction(emoji);
                  setIsOpen(false);
                }}
                className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                <span className="flex items-center">
                  <span role="img" aria-label={emoji} className="mr-2">
                    {emoji}
                  </span>
                  <span>{count}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionButtons;
