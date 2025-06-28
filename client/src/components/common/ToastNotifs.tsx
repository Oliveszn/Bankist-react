import { AlertCircle, CheckCircle, X } from "lucide-react";

const ToastNotifs = ({
  toast,
  hideToast,
}: {
  toast: { show: boolean; message: string; type: "success" | "error" };
  hideToast: () => void;
}) => {
  return (
    <div
      className={`fixed top-4 right-10 z-50 flex items-center gap-3 ${
        toast.type === "success" ? "bg-emerald-500/90" : "bg-rose-500/90"
      } backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-lg border border-white/10 animate-slide-in transition-all duration-300`}
      style={{
        boxShadow:
          toast.type === "success"
            ? `0 8px 32px rgba(52, 211, 153, 0.2) inset 0 1px 0 rgba(255, 255, 255 0.1)`
            : `0 8px 32px rgba(244, 63, 94, 0.2) inset 0 1px 0 rgba(255, 255, 255 0.1)`,
      }}
    >
      {toast.type === "success" ? (
        <CheckCircle className="w-5 h-5 text-white/90" />
      ) : (
        <AlertCircle className="w-5 h-5 text-white/90" />
      )}
      <span className="font-medium">{toast.message}</span>
      <button className="ml-2 hover:bg-white/20 rounded-full p-1.5 transition-colors duration-200">
        <X className="w-4 h-4" onClick={hideToast} />
      </button>
    </div>
  );
};

export default ToastNotifs;
