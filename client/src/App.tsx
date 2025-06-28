import { useEffect, useState } from "react";
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

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const toast = useAppSelector((state) => state.toast);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // let age: number = 10;
  // let firstName: String = "olive";

  // firstName = "mike";

  // let user: { name: string; age: number; id: number } = {
  //   name: "mario",
  //   age: 33,
  //   id: 1,
  // };

  // console.log(user);

  // console.log(age, firstName);

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

  return (
    <>
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
    </>
  );
}

export default App;
