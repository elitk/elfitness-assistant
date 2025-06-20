// src/lib/api.ts
import { auth, db } from "@/lib/firebase/firebaseClient";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function signInWithOAuth(
  provider: "google" | "facebook" | "github"
) {
  try {
    let firebaseProvider;
    switch (provider) {
      case "google":
        firebaseProvider = new GoogleAuthProvider();
        break;
      case "facebook":
        firebaseProvider = new FacebookAuthProvider();
        break;
      case "github":
        firebaseProvider = new GithubAuthProvider();
        break;
    }

    const result = await signInWithPopup(auth, firebaseProvider);
    const user = result.user;

    // Create/update profile in Firestore
    await setDoc(
      doc(db, "profiles", user.uid),
      {
        name: user.displayName ?? "",
        email: user.email ?? "",
        photoURL: user.photoURL ?? "",
        provider: provider,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    ); // Merge to avoid overwriting existing data

    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    return { error };
  }
}
