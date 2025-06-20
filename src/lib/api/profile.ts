import { auth, db } from "@/lib/firebase/firebaseClient";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Profile } from "@/types";

export async function getProfile() {
  const user = auth.currentUser;
  if (!user) return { data: null, error: new Error("Not authenticated") };

  try {
    const ref = doc(db, "profiles", user.uid);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return { data: null, error: new Error("Profile not found") };
    }

    return { data: snapshot.data(), error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateProfile(profile: Partial<Profile>) {
  const user = auth.currentUser;
  if (!user) return { data: null, error: new Error("Not authenticated") };

  try {
    const ref = doc(db, "profiles", user.uid);
    await updateDoc(ref, profile);

    return { data: profile, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
