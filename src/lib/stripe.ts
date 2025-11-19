import {
  getStripePayments,
  createCheckoutSession,
} from "@invertase/firestore-stripe-payments";
import { getFunctions, httpsCallable } from "firebase/functions";
import app from "./firebaseConfig";

const payments = getStripePayments(app, {
  productsCollection: "products",
  customersCollection: "customers",
});

export const loadCheckout = async (priceId: string) => {
  try {
    const snapshot = await createCheckoutSession(payments, {
      price: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    });

    window.location.assign(snapshot.url);
  } catch (error) {
    console.log(error);
  }
};

type BillingPortalResponse = {
  url: string;
};

export const goToBillingPortal = async () => {
  const instance = getFunctions(app, "us-central1");

  const createPortalLink = httpsCallable<
    { returnUrl: string },
    BillingPortalResponse
  >(instance, "ext-firestore-stripe-payments-createPortalLink");

  try {
    const result = await createPortalLink({
      returnUrl: `${window.location.origin}/settings`,
    });

    window.location.assign(result.data.url);
  } catch (error) {
    console.log(error);
  }
};

export default payments;
