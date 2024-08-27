import { Timestamp, FieldValue } from "firebase/firestore";

export interface Comment {
  id: string;
  text: string;
  createdAt: Timestamp | FieldValue;
  userId: string;
  userName: string;
  userPhoto: string;
  fileUrl: string;
  reactions: {
    "👍": number;
    "❤️": number;
    "😊": number;
    "😈": number;
    [key: string]: number;
  };
  reactionCount: number;
  parentId: string | null;
  replies: Comment[];
  level: number;
}
