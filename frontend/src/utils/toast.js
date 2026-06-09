import { toast } from "sonner";

/**
 * Show a success toast notification
 */
export function showSuccess(message, description) {
  toast.success(message, {
    description,
    duration: 4000,
  });
}

/**
 * Show an error toast notification
 */
export function showError(message, description) {
  toast.error(message, {
    description,
    duration: 5000,
  });
}

/**
 * Show an info toast notification
 */
export function showInfo(message, description) {
  toast.info(message, {
    description,
    duration: 3000,
  });
}

/**
 * Show a warning toast notification
 */
export function showWarning(message, description) {
  toast.warning(message, {
    description,
    duration: 4000,
  });
}

/**
 * Show a promise toast (loading → success/error)
 */
export function showPromise(promise, { loading, success, error }) {
  toast.promise(promise, {
    loading,
    success,
    error,
  });
}
