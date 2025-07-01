import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import CheckAuth from "./components/common/CheckAuth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { AuthModal } from "./components/auth/AuthModal";
import Navbar from "./components/common/Navbar";
import ToastNotifs from "./components/common/ToastNotifs";
import { hideToast } from "./store/ui-slice/toast-slice";
import { setDarkMode, toggleDarkMode } from "./store/ui-slice/theme-slice";

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const toast = useAppSelector((state) => state.toast);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCloseModal = () => {
    // this is to make the use go back to where they came from, or home as fallback
    const from = location.state?.from || "/";
    navigate(from);
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => dispatch(hideToast()), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show, dispatch]);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  ///darkmode
  const darkMode = useAppSelector((state) => state.theme.theme);
  useEffect(() => {
    // const savedMode = localStorage.getItem('darkMode') === 'true';
    const savedMode = localStorage.getItem("theme") === "true";
    dispatch(setDarkMode(savedMode));
  }, [dispatch]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Navbar />
      {toast.show && (
        <ToastNotifs toast={toast} hideToast={() => dispatch(hideToast())} />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<AuthModal mode="login" onClose={handleCloseModal} />}
        />
        <Route
          path="/register"
          element={<AuthModal mode="register" onClose={handleCloseModal} />}
        />
        <Route
          path="/dashboard"
          element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              <Dashboard />
            </CheckAuth>
          }
        />
      </Routes>
      <button onClick={() => dispatch(toggleDarkMode())}>
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
    </div>
  );
}

export default App;
