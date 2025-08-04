import { toast } from "sonner";

//simple notification toast
export const notify = {
  success: (m) => toast.success(m),
  error: (m) => toast.error(m),
  info: (m) => toast(m),
};
