"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { FcGoogle } from "react-icons/fc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebaseConfig";

type SignUpModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  openLogin: () => void;
};

export default function SignUpModal({
  open,
  onOpenChange,
  openLogin,
}: SignUpModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [formErr, setFormErr] = useState("");
  const [submittingGoogle, setSubmittingGoogle] = useState(false);
  const [googleErr, setGoogleErr] = useState("");

  const handleGoogleSignUp = async () => {
    setGoogleErr("");
    try {
      setSubmittingGoogle(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      onOpenChange(false);
      router.push("/for-you");
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        const code = e.code;
        if (code === "auth/popup-closed-by-user") setGoogleErr("Popup closed before completing sign up.");
        else if (code === "auth/account-exists-with-different-credential") setGoogleErr("Email already used with another sign-in method. Please log in with that method.");
        else if (code === "auth/popup-blocked") setGoogleErr("Popup was blocked. Please allow popups and try again.");
        else if (code === "auth/cancelled-popup-request") setGoogleErr("Popup canceled. Try again.");
        else setGoogleErr("Unable to sign up with Google. Please try again.");
      } else {
        setGoogleErr("Unexpected error. Please try again.");
      }
    } finally {
      setSubmittingGoogle(false);
    }
  };

  const handleSignUp = async () => {
    setEmailErr("");
    setPasswordErr("");
    setFormErr("");
    const emailOk =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.length <= 254;
    if (!emailOk) {
      setEmailErr("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setPasswordErr("Password must be at least 6 characters.");
      return;
    }
    try {
      setSubmitting(true);
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      onOpenChange(false);
      router.push("/for-you");
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        const code = e.code;
        if (code === "auth/invalid-email") setEmailErr("Email address is invalid.");
        else if (code === "auth/email-already-in-use") setFormErr("This email is already registered.");
        else if (code === "auth/weak-password") setPasswordErr("Password is too weak.");
        else setFormErr("Unable to sign up. Please try again.");
      } else {
        setFormErr("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 p-0 sm:max-w-[420px] rounded-xl"
        aria-describedby={undefined}
      >
        <DialogClose
          className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-700"
          aria-label="Close"
        >
          ✕
        </DialogClose>

        <DialogHeader className="px-6 pt-8 pb-4">
          <DialogTitle className="text-center text-[20px] font-semibold text-[#032B41]">
            Sign up to Summarist
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          <Button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={submittingGoogle}
            className="w-full h-11 rounded-md bg-[#3B82F6] hover:bg-[#2F6FD6] text-white font-medium flex items-center justify-center gap-3 disabled:opacity-70"
            variant="default"
          >
            <FcGoogle className="text-xl bg-white rounded-[2px]" />
            <span>{submittingGoogle ? "Signing up..." : "Sign up with Google"}</span>
          </Button>
          {googleErr && <p className="mt-2 text-sm text-red-600 text-center">{googleErr}</p>}

          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-zinc-200" />
            <span className="text-zinc-400 text-sm">or</span>
            <span className="h-px flex-1 bg-zinc-200" />
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailErr("");
                setFormErr("");
              }}
              className={`h-11 rounded-md border ${emailErr ? "border-red-500 focus-visible:ring-red-500" : "border-zinc-300 focus-visible:ring-0 focus-visible:ring-offset-0"}`}
            />
            {emailErr && <p className="mt-1 text-sm text-red-600">{emailErr}</p>}
          </div>

          <div className="mt-3">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordErr("");
                setFormErr("");
              }}
              className={`h-11 rounded-md border ${passwordErr ? "border-red-500 focus-visible:ring-red-500" : "border-zinc-300 focus-visible:ring-0 focus-visible:ring-offset-0"}`}
            />
            {passwordErr && <p className="mt-1 text-sm text-red-600">{passwordErr}</p>}
          </div>

          {formErr && <p className="mt-3 text-sm text-red-600 text-center">{formErr}</p>}

          <Button
            type="button"
            onClick={handleSignUp}
            disabled={submitting}
            className="mt-4 w-full h-11 rounded-md bg-[#2BD97C] hover:bg-[#20BA68] text-[#032B41] font-medium disabled:opacity-70"
          >
            {submitting ? "Signing up..." : "Sign up"}
          </Button>
        </div>

        <div className="rounded-b-xl bg-zinc-100 px-6 py-4 text-center text-zinc-600">
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              openLogin();
            }}
            className="text-[#2563EB] hover:underline"
          >
            Already have an account?
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}