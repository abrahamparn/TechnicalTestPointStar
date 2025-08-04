import { React, useState, useEffect } from "react";
import { useVerifyEmail } from "../features/auth/api";
import { Link, useSearchParams } from "react-router-dom";

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { mutate, isPending, isSuccess, isError, error } = useVerifyEmail();

  useEffect(() => {
    if (token) {
      mutate(token);
    }
  }, [token, mutate]);

  const renderContent = () => {
    if (isPending) {
      return <p className="text-lg">Verifying your email, please wait...</p>;
    }
    if (isError) {
      return (
        <>
          <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
          <p className="mt-2">This verification link is invalid or has expired.</p>
          <Link
            to="/login"
            className="mt-6 inline-block px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Go to Login
          </Link>
        </>
      );
    }
    if (isSuccess) {
      return (
        <>
          <h2 className="text-2xl font-bold text-green-600">Thank you! Email is verified!</h2>
          <p className="mt-2">
            Thank you for verifying your email. You can now log in to your account and create as
            many notes as you want.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Proceed to Login
          </Link>
        </>
      );
    }
    // Default case if there's no token in the URL
    return <p className="text-red-600">No verification token found.</p>;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
