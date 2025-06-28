import { useEffect, useState } from "react";
import { checkAuth } from "./store/auth-slice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import CheckAuth from "./components/common/CheckAuth";
import AuthLayout from "./components/auth/AuthLayout";
import AuthRegister from "./pages/auth/AuthRegister";
import AuthLogin from "./pages/auth/AuthLogin";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { AuthModal } from "./components/auth/AuthModal";
import Navbar from "./components/common/Navbar";

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
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
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      <Navbar />
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
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
      </Routes>
      {/* <button
        onClick={() =>
          navigate("/login", { state: { from: location.pathname } })
        }
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg"
      >
        Login
      </button> */}
    </>
  );
}

export default App;
