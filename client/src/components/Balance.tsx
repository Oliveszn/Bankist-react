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
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-lg font-medium text-gray-700">Current balance</h2>
          <p className="text-sm text-gray-500">
            As of <span className="">{new Date().toLocaleDateString()}</span>
          </p>
        </div>
        {user && (
          <div className="text-3xl font-bold text-gray-800"> ₦{balance}</div>
        )}
      </div>
    </div>
  );
};

export default Balance;
