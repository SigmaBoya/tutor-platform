import { db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";

export async function createNotification({
  userId,
  type,
  text,
}: {
  userId: string;
  type: "booking" | "message";
  text: string;
}) {
  await addDoc(collection(db, "notifications"), {
    userId,
    type,
    text,
    read: false,
    createdAt: Date.now(),
  });
}