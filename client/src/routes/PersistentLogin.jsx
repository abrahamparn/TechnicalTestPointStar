import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { useRefreshToken } from "../features/auth/api";

const PersistentLogin = () => {
  const { isAuthenticated, setToken } = useAuthStore(); // Get setToken here
  const { refetch, isFetching } = useRefreshToken();
  const [isLoading, setIsLoading] = useState(true);

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

  return <Outlet />;
};

export default PersistentLogin;
