import RegisterForm from "../features/auth/components/RegisterForm";
import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div>
        <h1 className="text-4xl font-bold mb-10">Notes Application</h1>
      </div>
      <RegisterForm />
      <p className="mt-4 text-center  text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-black hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
