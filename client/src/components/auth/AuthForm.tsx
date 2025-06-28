import { useEffect, useState } from "react";

// components/AuthModal.tsx
type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (data: AuthFormData) => void;
  onSwitchMode: () => void;
}

interface AuthFormData {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
}

export const AuthForm = ({ mode, onSubmit, onSwitchMode }: AuthFormProps) => {
  const [formData, setFormData] = useState<AuthFormData>({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
  });

  // Reset form when mode changes
  useEffect(() => {
    setFormData({
      firstname: "",
      lastname: "",
      username: "",
      password: "",
    });
  }, [mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <>
          <div>
            <label htmlFor="firstname" className="block mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="lastname" className="block mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="username" className="block mb-1">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          minLength={8}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        {mode === "login" ? "Login" : "Register"}
      </button>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onSwitchMode}
          className="text-blue-500 hover:underline"
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </form>
  );
};
