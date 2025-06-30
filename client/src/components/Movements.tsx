import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getMovements } from "../store/movement-slice";

const Movements = () => {
  const { movements, status, error } = useAppSelector(
    (state) => state.movements
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMovements({}));
    }
  }, [dispatch, isAuthenticated]);

  if (status === "loading") {
    return <p>Loading movements...</p>;
  }

  if (status === "failed") {
    return <p>Error loading movements: {error}</p>;
  }

  //// we did this because it kept returning an error which menat
  //// movement wanst an array when map was being called so we had to defensively handle it
  if (!Array.isArray(movements)) {
    console.error("Movements is not an array:", movements);
    return <p>Error: Invalid movements data</p>;
  }

  return (
    <div>
      <h2>Recent Movements</h2>
      {movements.length === 0 && <p>No movements found.</p>}
      <ul>
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
                <div
                  key={mov.id || i}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                </div>
              );
            } catch (error) {
              console.error("Error rendering movement:", mov, error);
              return <li key={i}>Error displaying movement</li>;
            }
          })}
      </ul>
    </div>
  );
};

export default Movements;
