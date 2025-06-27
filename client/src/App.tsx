import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Route, Routes } from "react-router-dom";
import CheckAuth from "./components/common/CheckAuth";
import AuthLayout from "./components/auth/AuthLayout";
import AuthRegister from "./pages/auth/AuthRegister";
import AuthLogin from "./pages/auth/AuthLogin";
import Home from "./pages/Home";

function App() {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  // const dispatch = useDispatch()
  let age: number = 10;
  let firstName: String = "olive";

  firstName = "mike";

  // let user: { name: string; age: number; id: number } = {
  //   name: "mario",
  //   age: 33,
  //   id: 1,
  // };

  // console.log(user);

  console.log(age, firstName);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
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
    </>
  );
}

export default App;
