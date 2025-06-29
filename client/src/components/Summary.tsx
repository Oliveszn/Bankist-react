const Summary = () => {
  return (
    <div>
      <div className="grid-row-5 flex items-baseline px-1 mt-4">
        <p className="text-xl font-semibold uppercase mr-2">In</p>
        <p className="text-4xl mr-10 text-green-500">0000€</p>
        <p className="text-xl font-semibold uppercase mr-2">Out</p>
        <p className="text-4xl mr-10 text-red-500">0000€</p>
        <p className="text-xl font-semibold uppercase mr-2">Interest</p>
        <p className="text-4xl mr-10 text-green-500">0000€</p>
        <button className="ml-auto border-none bg-transparent text-xl font-semibold cursor-pointer">
          &darr; SORT
        </button>
      </div>

      <div>
        <p className="px-1 mt-7 text-right text-xl">
          You will be logged out in <span className="font-semibold">05:00</span>
        </p>
      </div>
    </div>
  );
};

export default Summary;
