import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { useRefreshToken } from "../features/auth/api";

const PersistentLogin = () => {
  const { isAuthenticated, setToken } = useAuthStore(); // Get setToken here
  const { refetch, isFetching } = useRefreshToken();
  const [isLoading, setIsLoading] = useState(true);

  // will try to check the token. if there is no token it will go to another outlet
  useEffect(() => {
    const verifyUser = async () => {
      if (!isAuthenticated) {
        try {
          const { data, isSuccess } = await refetch();

          if (isSuccess && data.accessToken) {
            setToken(data.accessToken);
          }
        } catch (error) {
          console.error("Failed to refresh token:", error);
        }
      }
      setIsLoading(false);
    };

    verifyUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading session...</p>
      </div>
    );
  }

  return <Outlet />; //the path finder of probable route when setToken is existing or not
};

export default PersistentLogin;
