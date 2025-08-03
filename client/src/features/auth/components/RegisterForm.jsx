import { zodResolver } from "@hookform/resolvers/zod";
import { userRegister } from "../api";
import { useForm } from "react-hook-form";
import { z } from "zod";

//! Later on, if have time, move to centralized validation
const registerSchema = z.object({
  email: z.string().email("A valid email is required"),
  password: z.string().min(8, "Password must be atleast 8 characters long"),
  name: z.string().min(2, "Name is required"),
  username: z.string().min(5, "username must be 5 characters minimum"),
});

const RegisterForm = () => {
  //mutate function and loading state
  const { mutate: registerUser, isPending } = userRegister();

  // useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    registerUser(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-8 rounded-lg shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">Create an account</h2>

      {/* name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          {...register("name")}
          id="name"
          className="mt-1 block w-full border border-gray-200 rounded-md placeholder-gray-200 focus:outline-none focus:ring-green-300 focus:border-green-300"
          placeholder="Enter your name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>

      {/* email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="text"
          {...register("email")}
          id="email"
          className="mt-1 block w-full border border-gray-200 rounded-md placeholder-gray-200 focus:outline-none focus:ring-green-300 focus:border-green-300"
          placeholder="Enter your email"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      {/* email */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          {...register("username")}
          id="username"
          className="mt-1 block w-full border border-gray-200 rounded-md placeholder-gray-200 focus:outline-none focus:ring-green-300 focus:border-green-300"
          placeholder="Enter your email"
        />
        {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>}
      </div>

      {/* password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          id="password"
          className="mt-1 block w-full border border-gray-200 rounded-md placeholder-gray-200 focus:outline-none focus:ring-green-300 focus:border-green-300 
          "
          placeholder="Enter your email"
        />
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
      </div>

      {/* submit button */}
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl bg-blue-300 text-white  hover:bg-gray-400 hover:text-black"
        disabled={isPending}
      >
        {isPending ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};

export default RegisterForm;
