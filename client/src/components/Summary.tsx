import { useEffect, useState } from "react";

const Summary = () => {
  const [timeLeft, setTimeLeft] = useState(300);

  //////setinterval is to update the time every sec
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval); //cleanup is to avoid memory leaks
  }, [timeLeft]);

  ///did this to format time to mm:ss need to learn the hh
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}: ${secs}`;
  };

  return (
    // <div>
    //   <div className="grid-row-5 flex items-baseline px-1 mt-4">
    //     <p className="text-xl font-semibold uppercase mr-2">In</p>
    //     <p className="text-4xl mr-10 text-green-500">0000€</p>
    //     <p className="text-xl font-semibold uppercase mr-2">Out</p>
    //     <p className="text-4xl mr-10 text-red-500">0000€</p>
    //     <p className="text-xl font-semibold uppercase mr-2">Interest</p>
    //     <p className="text-4xl mr-10 text-green-500">0000€</p>
    //     <button className="ml-auto border-none bg-transparent text-xl font-semibold cursor-pointer">
    //       &darr; SORT
    //     </button>
    //   </div>

    //   <div>
    //     <p className="px-1 mt-7 text-right text-xl">
    //       You will be logged out in{" "}
    //       <span className="font-semibold">{formatTime(timeLeft)}</span>
    //     </p>
    //   </div>
    // </div>
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-sm text-gray-500 uppercase tracking-wide">
              IN
            </div>
            <div className="text-2xl font-bold text-green-600">0000€</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 uppercase tracking-wide">
              OUT
            </div>
            <div className="text-2xl font-bold text-red-600">0000€</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1">
            ↓ SORT
          </button>
          <div className="text-sm text-gray-600">
            You will be logged out in{" "}
            <span className="font-medium">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
