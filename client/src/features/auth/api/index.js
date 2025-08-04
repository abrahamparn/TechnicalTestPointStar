import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../api";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notify } from "../../../lib/notify";

//axios post to create user
// Will receive data of name, email username, and password
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
      notify.success(
        "Registration successful! Please check in your email for verification instructions."
      );
      //if successfull will navigate to login
      navigate("/login");
    },
    onError: (error) => {
      notify.error(`Registration failed: ${error.response?.data?.error || error.message}`);
    },
  });
};

// api hit to login
// need to have password and email
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
      notify.success("Welcome back!");

      if (data.accessToken) {
        setToken(data.accessToken);
      }
      navigate("/"); // after successfull will go to dashboard
    },
    onError: (error) => {
      console.error("Login failed:", error);
      notify.error(`Login failed: ${error.response?.data?.error || error.message}`);
    },
  });
};

// Will be called whenever you reload
// will be taking the cookie
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
      if (data.accessToken) {
        setToken(data.accessToken);
      }
    },
    onError: (error) => {
      console.error("Session expired or invalid:", error); //user is logged out
      notify.error(`Login failed: ${error.response?.data?.error || error.message}`);
    },
  });
};

//Logging out
// will get to the logout api
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
      logout(); // removing the accesstoken
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

      notify.error(`Logout failed: ${error?.response?.data?.error || error.message}`);
    },
  });
};

//User verification email hook
const verifyEmailToken = async (token) => {
  const { data } = await apiClient.get(`/auth/verify-email?token=${token}`);
  return data;
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmailToken,
  });
};
