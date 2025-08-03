import { LoginForm } from "../features/auth/components/LoginForm";
import { Link } from "react-router-dom";
const LoginPage = () => {
  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen bg-gray-100 ">
      <h1 className="text-4xl font-bold">Notes Application</h1>
      <LoginForm />
      <p className="font-normal">
        Don't have an account?{" "}
        <Link to="/register" className="hover:underline">
          Register now
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
