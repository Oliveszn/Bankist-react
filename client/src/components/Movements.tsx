import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getMovements } from "../store/movement-slice";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const Movements = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const { movements, status, error, currentPage, totalPages, totalCount } =
    useAppSelector((state) => state.movements);

  useEffect(() => {
    if (isAuthenticated) {
      /////and persist on reload
      const pageFromURL = parseInt(searchParams.get("page") || "1", 10);
      dispatch(getMovements({ page: pageFromURL }));
    }
  }, [dispatch, isAuthenticated]);

  if (status === "loading") {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="ml-2">Loading movements...</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="text-center text-red-600">
          <p>Error loading movements: {error}</p>
          <button
            onClick={() => dispatch(getMovements({}))}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  //// we did this because it kept returning an error which menat
  //// movement wanst an array when map was being called so we had to defensively handle it
  if (!Array.isArray(movements)) {
    console.error("Movements is not an array:", movements);
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-red-600">Error: Invalid movements data</p>
      </div>
    );
  }

  ///function for handling page changing
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      ////added search params to store current page in url
      setSearchParams({ page: newPage.toString() });
      dispatch(getMovements({ page: newPage }));
    }
  };

  ////gettong page numbers
  const getPageNumbers = () => {
    const pages = [];

    ////show up to 5 page number
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    ////adjust the start page if we are close to end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    // <>
    <div className="bg-white rounded-lg shadow-md p-4 w-full sm:max-w-lg md:max-w-2xl mx-auto">
      <h2>
        {movements.length} of {totalCount} transactions
      </h2>
      {movements.length === 0 && <p>No movements found.</p>}
      <div className="h-[300px] overflow-y-auto rounded-md">
        <ul className="divide-y divide-gray-200">
          {movements
            .filter((mov) => {
              if (!mov || typeof mov !== "object") return false;
              if (!mov.type || !mov.amount) return false;
              return true;
            })
            .map((mov, i) => {
              try {
                const amount =
                  typeof mov.amount === "string"
                    ? parseFloat(mov.amount)
                    : mov.amount;
                const displayAmount = Math.abs(amount);
                const date = mov.created_at || mov.date;

                return (
                  <li
                    key={mov.id || i}
                    className="flex items-center justify-between py-2 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                          mov.type === "deposit"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {mov.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(date).toLocaleDateString()}
                      </span>
                    </div>
                    <span
                      className={`font-medium ${
                        displayAmount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {displayAmount > 0 ? "+" : ""}
                      {displayAmount}€
                    </span>
                  </li>
                );
              } catch (error) {
                console.error("Error rendering movement:", mov, error);
                return (
                  <div key={i} className="p-4 text-red-500">
                    Error displaying movement
                  </div>
                );
              }
            })}
        </ul>
      </div>
      {totalPages >= 1 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center space-x-2">
              {/* //////Previous Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {/* //// Page Numbers */}
              {getPageNumbers().map((pageNum, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    pageNum === currentPage
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              {/* ///// next button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    // </>
  );
};

export default Movements;
