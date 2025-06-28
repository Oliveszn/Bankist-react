import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getMovements } from "../store/movement-slice";

const Movements = () => {
  const movements = useAppSelector((state) => state.movs.movement);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMovements());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div>
      <h2>Recent Movements</h2>
      {movements.length === 0 && <p>No movements found.</p>}
      <ul>
        {movements.map((mov, i) => (
          <li key={i}>
            <strong>{mov.type.toUpperCase()}</strong> — ₦{mov.amount} on{" "}
            {new Date(mov.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Movements;
