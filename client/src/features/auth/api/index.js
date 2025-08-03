import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../api";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notify } from "../../../lib/notify";

//axios post to create user
const registerUser = async (data) => {
  const { userData } = await apiClient.post("/auth/", data);
  return userData;
};

//manage server side state change
export const userRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      //! remove this in production
      console.log("Registration successfull:", data);
      notify.success(
        "Registration successful! Please check in your email for verification instructions."
      );
      navigate("/login");
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      notify.error(`Registration failed: ${error.response?.data?.error || error.message}`); //! Change this later
    },
  });
};

const loginUser = async (userData) => {
  const { data } = await apiClient.post("/auth/login", userData, { withCredentials: true });
  return data;
};
export const userLogin = () => {
  const navigate = useNavigate();

  const { setToken } = useAuthStore.getState();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Login successfull:", data);
      notify.success("Welcome back!");

      if (data.accessToken) {
        setToken(data.accessToken);
      }
      navigate("/");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      notify.error(`Login failed: ${error.response?.data?.error || error.message}`);
    },
  });
};

const refreshToken = async () => {
  const { data } = await apiClient.post("/auth/refresh");
  console.log("data refreshToken", data);
  return data;
};

export const useRefreshToken = () => {
  const { setToken } = useAuthStore.getState();

  return useQuery({
    queryKey: ["refreshToken"],
    queryFn: refreshToken,
    enabled: false,
    retry: false,
    onSuccess: (data) => {
      console.log("data onSuccess", data);
      console.log("data onSuccess");
      if (data.accessToken) {
        setToken(data.accessToken);
      }
    },
    onError: (error) => {
      console.log("onError", error);
      console.error("Session expired or invalid:", error); //user is logged out
      notify.error(`Login failed: ${error.response?.data?.error || error.message}`);
    },
  });
};

const doLogOut = async () => {
  const { data } = await apiClient.post("/auth/logOut");
  return data;
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout } = useAuthStore.getState();

  return useMutation({
    mutationFn: doLogOut,
    onSuccess: () => {
      queryClient.clear();
      logout();
      console.log("navigating to login");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      const status = error?.response?.status;
      if (status === 401 || status === 419) {
        logout();
        queryClient.clear();
        navigate("/login", { replace: true });
        return;
      }

      console.error("Logout failed:", error);
      notify.error(`Logout failed: ${error?.response?.data?.error || error.message}`);
    },
  });
};
