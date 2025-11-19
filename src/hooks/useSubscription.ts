"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";

type StripeSubscription = {
  status?: string;
  role?: string;
};

type UseSubscriptionResult = {
  user: User | null;
  loading: boolean;
  isActive: boolean;
  planLabel: string;
};

export function useSubscription(): UseSubscriptionResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [planLabel, setPlanLabel] = useState("Basic");

  useEffect(() => {
    let unsubscribeSubs: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (unsubscribeSubs) {
        unsubscribeSubs();
        unsubscribeSubs = null;
      }

      if (!firebaseUser) {
        setIsActive(false);
        setPlanLabel("Basic");
        setLoading(false);
        return;
      }

      setLoading(true);

      const customerRef = doc(db, "customers", firebaseUser.uid);
      const subCol = collection(customerRef, "subscriptions");

      unsubscribeSubs = onSnapshot(
        subCol,
        (snapshot) => {
          if (snapshot.empty) {
            setIsActive(false);
            setPlanLabel("Basic");
            setLoading(false);
            return;
          }

          const subDoc = snapshot.docs[0];
          const data = subDoc.data() as StripeSubscription;

          const activeStatuses = ["active", "trialing", "past_due"];
          const status = data.status ?? "";
          const hasActive = activeStatuses.includes(status);

          setIsActive(hasActive);
          setPlanLabel(hasActive ? data.role ?? "Premium" : "Basic");
          setLoading(false);
        },
        () => {
          setIsActive(false);
          setPlanLabel("Basic");
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSubs) unsubscribeSubs();
    };
  }, []);

  return { user, loading, isActive, planLabel };
}
