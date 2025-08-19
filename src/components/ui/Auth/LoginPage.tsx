"use client";

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* 🔹 Logo Placeholder */}
        <div className="flex justify-center">
          <div className="w-16 h-8 bg-gray-600 rounded-md" />
        </div>

        {/* 🔹 Title */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Log in to your account
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* 🔹 Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input id="email" name="email" type="email" required placeholder="Enter your email" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-emerald-500 px-4 py-2 text-white font-medium shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Sign in
          </button>
        </form>

        {/* 🔹 Footer Links */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Don’t have an account?{" "}
            <a href="/auth/signup" className="text-emerald-600 font-medium hover:underline">
              Sign up
            </a>
          </p>
          <p className="mt-1">
            <a href="/auth/forgot-password" className="text-emerald-600 font-medium hover:underline">
              Forgot password
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
