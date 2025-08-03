import { LoginForm } from "../features/auth/components/LoginForm";
import { Link } from "react-router-dom";
const LoginPage = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-gray-100 ">
      <h1 className="text-5xl font-bold">Login Page</h1>
      <LoginForm />
      <p className="font-bold">
        Don't have an account?{" "}
        <Link to="/register" className="hover:underline">
          Register now
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
