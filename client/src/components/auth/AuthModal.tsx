// components/AuthModal.tsx
import { authUser } from "../../store/auth-slice";
import { useAppDispatch } from "../../store/hooks";
import { showToast } from "../../store/ui-slice/toast-slice";
import { AuthForm } from "./AuthForm";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthModalProps {
  mode: "login" | "register";
  onClose: () => void;
}

interface AuthFormData {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
}

export const AuthModal = ({ mode, onClose }: AuthModalProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (data: AuthFormData) => {
    try {
      const result = await dispatch(
        authUser({ formData: data, isLogin: mode === "login" })
      ).unwrap();

      if (result.success) {
        onClose();
        dispatch(
          showToast({
            message:
              mode === "login" ? "Login Successful" : "Registration Successful",
            type: "success",
          })
        );
        navigate("/dashboard");
      } else {
        dispatch(
          showToast({
            message: result.message || "Authentication failed",
            type: "error",
          })
        );
      }
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "An unexpected error occurred";
      dispatch(
        showToast({
          message: message,
          type: "error",
        })
      );
    }
  };

  const handleSwitchMode = () => {
    /// this preserves the from state (knows where you are coming from)
    const newPath = mode === "login" ? "/register" : "/login";
    navigate(newPath, { state: location.state });
  };

  // Handle ESC key and background click
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 shadow-2xl"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === "login" ? "Login to Your Account" : "Create New Account"}
        </h2>

        <AuthForm
          mode={mode}
          onSubmit={handleSubmit}
          onSwitchMode={handleSwitchMode}
        />
      </div>
    </div>
  );
};
