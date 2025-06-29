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
          message: "Input a valid number",
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
    console.log(transferFormData);
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
    <div>
      <div className="rounded-lg p-12 text-gray-700 bg-gradient-to-tl from-yellow-500 to-yellow-400 my-6 sm:my-0">
        <h2 className="mb-6 text-3xl font-semibold text-gray-700">
          Transfer money
        </h2>
        <form
          className="grid grid-cols-3 grid-rows-auto gap-y-1 gap-x-4 md:grid-cols-3 md:grid-rows-auto md:gap-x-4 md:gap-y-1"
          onSubmit={handleTransfer}
        >
          <input
            type="text"
            placeholder="Recipient Username"
            id="recipientUsername"
            name="recipientUsername"
            value={transferFormData.recipientUsername}
            onChange={handleTransferChange}
            disabled={isLoading}
            required
            className="w-full bg-white bg-opacity-40 font-inherit text-center text-2xl text-gray-700 rounded-lg px-4 py-1 transition duration-300 focus:outline-none focus:bg-white focus:bg-opacity-60 form__input--to"
          />
          <input
            type="number"
            placeholder="amount"
            id="amount"
            name="amount"
            value={transferFormData.amount}
            onChange={handleTransferChange}
            disabled={isLoading}
            className="w-full bg-white bg-opacity-40 font-inherit text-center text-2xl text-gray-700 rounded-lg px-4 py-1 transition duration-300 focus:outline-none focus:bg-white focus:bg-opacity-60 form__input--amount"
          />
          <button
            className="border-none rounded-lg text-3xl bg-white cursor-pointer transition duration-300 focus:outline-none focus:bg-white focus:bg-opacity-80 form__btn--transfer"
            disabled={isLoading}
          >
            &rarr;
          </button>
          <label className="text-xl text-center">Transfer to</label>
          <label className="text-xl text-center">Amount</label>
        </form>
      </div>
      {/* LOAN */}
      <div className="rounded-lg p-12 text-gray-700 bg-gradient-to-tl from-emerald-400 to-lime-500 my-6 sm:my-0">
        <h2 className="mb-6 text-3xl font-semibold text-gray-700">
          Request loan
        </h2>
        <form
          className="grid grid-cols-3 grid-rows-auto gap-y-1 gap-x-4 md:grid-cols-3 md:grid-rows-auto md:gap-x-4 md:gap-y-1"
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
            className="w-full bg-white bg-opacity-40 font-inherit text-center text-2xl text-gray-700 rounded-lg px-4 py-1 transition duration-300 focus:outline-none focus:bg-white focus:bg-opacity-60 form__input--loan-amount"
          />
          <button
            className="border-none rounded-lg text-3xl bg-white cursor-pointer transition duration-300 focus:outline-none focus:bg-white focus:bg-opacity-80 form__btn--loan"
            disabled={isLoading}
          >
            &rarr;
          </button>

          <label className="text-xl text-center md:row-start-2">Amount</label>
        </form>
      </div>

      {/* CLOSE */}
      <div className="rounded-lg p-12 text-gray-700 bg-gradient-to-tl from-rose-500 to-red-500 my-6 sm:my-0">
        <h2 className="mb-6 text-3xl font-semibold text-gray-700">
          Close account
        </h2>
        <form className="grid grid-cols-3 grid-rows-auto gap-y-1 gap-x-4 md:grid-cols-3 md:grid-rows-auto md:gap-x-4 md:gap-y-1">
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-white bg-opacity-40 font-inherit text-center text-2xl text-gray-700 rounded-lg px-4 py-1 transition duration-300 focus:outline-none focus:bg-white focus:bg-opacity-60 form__input--user"
          />

          <button
            type="submit"
            className="border-none rounded-lg text-3xl bg-white cursor-pointer transition duration-300 focus:outline-none focus:bg-white focus:bg-opacity-80 form__btn--close"
          >
            &rarr;
          </button>
          <label className="text-xl text-center">Confirm user</label>
          <label className="text-xl text-center">Confirm PIN</label>
        </form>
      </div>
    </div>
  );
};

export default Transaction;
