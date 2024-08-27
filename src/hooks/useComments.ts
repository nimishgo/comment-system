import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../firebase";
import { Comment } from "../types/Comment";

export const useComments = (
  sortBy: "latest" | "popular",
  limitCount: number = 10,
) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      orderBy(sortBy === "latest" ? "createdAt" : "reactionCount", "desc"),
      limit(limitCount),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newComments = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            level: 0,
          }) as Comment,
      );
      setComments(newComments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sortBy, limitCount]);

  const addReply = async (
    parentId: string,
    text: string,
    file: File | null,
  ) => {
    if (!auth.currentUser) return;

    try {
      let fileUrl = "";
      if (file) {
        const storageRef = ref(storage, `comments/${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
      }

      const replyData: Omit<Comment, "id"> = {
        text,
        createdAt: serverTimestamp() as FieldValue,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || "",
        userPhoto: auth.currentUser.photoURL || "",
        fileUrl,
        reactions: {
          "👍": 0,
          "❤️": 0,
          "😊": 0,
          "😈": 0,
        },
        reactionCount: 0,
        parentId,
        replies: [],
        level: parentId ? 1 : 0,
      };

      const replyDocRef = await addDoc(collection(db, "comments"), replyData);

      if (parentId) {
        await updateDoc(doc(db, "comments", parentId), {
          replies: arrayUnion(replyDocRef.id),
        });
      }

      setComments((prevComments) => {
        const updateReplies = (comments: Comment[]): Comment[] => {
          return comments.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [
                  ...comment.replies,
                  {
                    id: replyDocRef.id,
                    ...replyData,
                    level: comment.level + 1,
                  } as Comment,
                ],
              };
            } else if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateReplies(comment.replies),
              };
            }
            return comment;
          });
        };
        return parentId
          ? updateReplies(prevComments)
          : [{ id: replyDocRef.id, ...replyData } as Comment, ...prevComments];
      });
    } catch (error) {
      console.error("Error adding reply:", error);
      throw error;
    }
  };

  return { comments, loading, addReply };
};
