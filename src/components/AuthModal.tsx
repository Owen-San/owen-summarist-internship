"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { FaUser } from "react-icons/fa";
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
import SignUpModal from "./SignUpModal";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const router = useRouter();
  const [submittingGuest, setSubmittingGuest] = useState(false);
  const [submittingLogin, setSubmittingLogin] = useState(false);
  const [submittingGoogle, setSubmittingGoogle] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [formErr, setFormErr] = useState("");
  const [googleErr, setGoogleErr] = useState("");

  const handleGuestLogin = async () => {
    try {
      setSubmittingGuest(true);
      await signInAnonymously(auth);
      onOpenChange(false);
      router.push("/foryou");
    } catch {
      setFormErr("Guest login failed. Please try again.");
    } finally {
      setSubmittingGuest(false);
    }
  };

  const handleEmailLogin = async () => {
    setEmailErr("");
    setPasswordErr("");
    setFormErr("");
    const emailOk =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.length <= 254;
    if (!emailOk) {
      setEmailErr("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setPasswordErr("Please enter your password.");
      return;
    }
    try {
      setSubmittingLogin(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      onOpenChange(false);
      router.push("/foryou");
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        const code = e.code;
        if (code === "auth/invalid-email") setEmailErr("Email address is invalid.");
        else if (code === "auth/user-not-found") setFormErr("No account found with this email.");
        else if (code === "auth/wrong-password") setPasswordErr("Incorrect password.");
        else if (code === "auth/too-many-requests") setFormErr("Too many attempts. Try again later.");
        else setFormErr("The Email or Password is incorrect. Please try again.");
      } else {
        setFormErr("Unable to log in. Please try again.");
      }
    } finally {
      setSubmittingLogin(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleErr("");
    try {
      setSubmittingGoogle(true);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      onOpenChange(false);
      router.push("/foryou");
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        const code = e.code;
        if (code === "auth/popup-closed-by-user") setGoogleErr("Popup closed before completing sign in.");
        else if (code === "auth/account-exists-with-different-credential") setGoogleErr("Email already used with another sign-in method. Please use that method.");
        else if (code === "auth/popup-blocked") setGoogleErr("Popup was blocked. Please allow popups and try again.");
        else if (code === "auth/cancelled-popup-request") setGoogleErr("Popup canceled. Try again.");
        else setGoogleErr("Unable to sign in with Google. Please try again.");
      } else {
        setGoogleErr("Unexpected error. Please try again.");
      }
    } finally {
      setSubmittingGoogle(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="gap-0 p-0 sm:max-w-[420px] rounded-xl"
          aria-describedby={undefined}
        >

          <DialogHeader className="px-6 pt-8 pb-4">
            <DialogTitle className="text-center text-[20px] font-semibold text-[#032B41]">
              Log in to Summarist
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 pb-6">
            <Button
              type="button"
              onClick={handleGuestLogin}
              disabled={submittingGuest}
              className="w-full h-11 rounded-md bg-[#2F3E92] hover:bg-[#26357F] text-white font-medium flex items-center justify-center gap-3 disabled:opacity-70"
              variant="default"
            >
              <FaUser className="text-white" />
              <span>{submittingGuest ? "Logging in..." : "Login as a Guest"}</span>
            </Button>

            <div className="my-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-zinc-200" />
              <span className="text-zinc-400 text-sm">or</span>
              <span className="h-px flex-1 bg-zinc-200" />
            </div>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={submittingGoogle}
              className="w-full h-11 rounded-md bg-[#3B82F6] hover:bg-[#2F6FD6] text-white font-medium flex items-center justify-center gap-3 disabled:opacity-70"
              variant="default"
            >
              <FcGoogle className="text-xl bg-white rounded-[2px]" />
              <span>{submittingGoogle ? "Signing in..." : "Login with Google"}</span>
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
              onClick={handleEmailLogin}
              disabled={submittingLogin}
              className="mt-4 w-full h-11 rounded-md bg-[#2BD97C] hover:bg-[#20BA68] text-[#032B41] font-medium disabled:opacity-70"
            >
              {submittingLogin ? "Logging in..." : "Login"}
            </Button>

            <div className="mt-3 text-center">
              <button
                type="button"
                className="text-[#2563EB] text-sm hover:underline"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div className="rounded-b-xl bg-zinc-100 px-6 py-4 text-center text-zinc-600">
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                setSignUpOpen(true);
              }}
              className="text-[#2563EB] hover:underline"
            >
              Don&apos;t have an account?
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <SignUpModal
        open={signUpOpen}
        onOpenChange={setSignUpOpen}
        openLogin={() => {
          setSignUpOpen(false);
          onOpenChange(true);
        }}
      />
    </>
  );
}