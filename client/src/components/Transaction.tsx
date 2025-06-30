import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { showToast } from "../store/ui-slice/toast-slice";
import {
  getLoan,
  transferMoney,
  clearError,
  resetStatus,
  getMovements,
} from "../store/movement-slice";
import type { LoanFormData, TransferFormData } from "../utils/types";

const Transaction = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.movements);

  const [loanFormData, setLoanFormData] = useState<LoanFormData>({
    amount: "",
  });

  const [transferFormData, setTransferFormData] = useState<TransferFormData>({
    amount: 0,
    recipientUsername: "",
  });

  // Handle status changes and show toasts
  useEffect(() => {
    if (status === "succeeded") {
      // Reset forms on success
      setLoanFormData({ amount: "" });
      setTransferFormData({ amount: 0, recipientUsername: "" });

      // Reset status after a short delay
      setTimeout(() => {
        dispatch(resetStatus());
      }, 100);
    }
  }, [status, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      dispatch(
        showToast({
          message: error,
          type: "error",
        })
      );
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleLoanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoanFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransferChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransferFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(loanFormData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return dispatch(
        showToast({
          message: "Input a valid amount",
          type: "error",
        })
      );
    }

    try {
      const result = await dispatch(getLoan(loanFormData)).unwrap();
      dispatch(getMovements({ page: 1 }));
      dispatch(
        showToast({
          message: result.message,
          type: "success",
        })
      );
    } catch (error: any) {
      console.error("Loan request failed:", error);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (transferFormData.amount || transferFormData.amount <= 0) {
      return dispatch(
        showToast({
          message: "Input a valid number",
          type: "error",
        })
      );
    }

    try {
      const result = await dispatch(transferMoney(transferFormData)).unwrap();
      dispatch(getMovements({ page: 1 }));
      dispatch(
        showToast({
          message: result.message,
          type: "success",
        })
      );
    } catch (error: any) {
      console.error("Transfer failed:", error);
    }
  };

  const isLoading = status === "loading";
  return (
    <div className="space-y-4">
      <div className="rounded-lg p-6 bg-gradient-to-tl from-yellow-500 to-yellow-400 my-6 ">
        <h2 className="mb-6 text-lg font-semibold text-gray-800">
          Transfer money
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
          onSubmit={handleTransfer}
        >
          <input
            type="text"
            placeholder="Transfer to"
            id="recipientUsername"
            name="recipientUsername"
            value={transferFormData.recipientUsername}
            onChange={handleTransferChange}
            disabled={isLoading}
            required
            className="w-full p-3 rounded-md bg-yellow-300 bg-opacity-50 placeholder-gray-600 text-gray-800 border-0 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="number"
            placeholder="amount"
            id="amount"
            name="amount"
            value={transferFormData.amount}
            onChange={handleTransferChange}
            disabled={isLoading}
            className="w-full p-3 rounded-md bg-yellow-300 bg-opacity-50 placeholder-gray-600 text-gray-800 border-0 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            className="border-none rounded-lg text-3xl bg-white cursor-pointer transition duration-300 focus:outline-none focus:bg-white focus:bg-opacity-80 form__btn--transfer"
            disabled={isLoading}
          >
            &rarr;
          </button>
          <label className="text-sm text-gray-700 mt-1 hidden md:block">
            Transfer to
          </label>
          <label className="text-sm text-gray-700 mt-1 hidden md:block">
            Amount
          </label>
        </form>
      </div>
      {/* LOAN */}
      <div className="rounded-lg p-6 bg-gradient-to-tl from-emerald-400 to-lime-500 my-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Request loan
        </h2>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-3 "
          onSubmit={handleLoanSubmit}
        >
          <input
            type="number"
            placeholder="Amount"
            id="amount"
            name="amount"
            value={loanFormData.amount}
            onChange={handleLoanChange}
            disabled={isLoading}
            required
            className="w-full p-3 rounded-md bg-green-300 bg-opacity-50 placeholder-gray-600 text-gray-800 border-0 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            className="border-none rounded-lg text-3xl bg-white cursor-pointer transition duration-300 focus:outline-none focus:bg-white focus:bg-opacity-80 form__btn--loan"
            disabled={isLoading}
          >
            &rarr;
          </button>

          <label className="text-sm text-gray-700 mt-1 hidden md:block">
            Amount
          </label>
        </form>
      </div>

      {/* CLOSE */}
      <div className="rounded-lg p-6 bg-gradient-to-tl from-rose-500 to-red-500 my-6 sm:my-0">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Close account
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-md bg-red-300 bg-opacity-50 placeholder-gray-600 text-gray-800 border-0 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            className="border-none rounded-lg text-3xl bg-white cursor-pointer transition duration-300 focus:outline-none focus:bg-white focus:bg-opacity-80 form__btn--close"
          >
            &rarr;
          </button>
          <label className="text-sm text-gray-700 mt-1 hidden md:block">
            Confirm user
          </label>
        </form>
      </div>
    </div>
  );
};

export default Transaction;
