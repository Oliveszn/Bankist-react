import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getUser } from "../store/user-slice";

const Balance = () => {
  const balance = useAppSelector((state) => state.user.balance);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUser());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="col-span-2 flex items-end justify-between mb-8">
      <div>
        <p className="">Current balance</p>
        <p className="">
          As of <span className="">{new Date().toLocaleDateString()}</span>
        </p>
      </div>
      <div>{user && <span className="">₦{balance}</span>}</div>
    </div>
  );
};

export default Balance;
