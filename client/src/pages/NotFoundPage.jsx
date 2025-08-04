import { Link } from "react-router-dom";

//simple notfoundpage will be shown when user add weird endpoint
const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-gray-600">The page you are looking for does not exist. </p>
      <Link to="/" className="mt-6 text-blue-500 hover:underline">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
