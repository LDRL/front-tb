type SessionExpiredHandler = () => void;

let handler: SessionExpiredHandler | null = null;

export const setSessionExpiredHandler = (next: SessionExpiredHandler | null) => {
  handler = next;
};

export const notifySessionExpired = () => {
  handler?.();
};
