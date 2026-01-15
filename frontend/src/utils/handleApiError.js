import { toast } from "react-hot-toast";

export function handleApiError(err) {
  // Ignore aborted / canceled requests for toast
  if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") {
    return;
  }

  const status = err?.response?.status;
  const message = err?.response?.data?.message || "Something went wrong. Please try again.";

  // rate limiting error
  if (status === 429) {
    toast.error(message);
    return;
  }

  toast.error(message);
}
