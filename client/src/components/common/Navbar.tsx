import logo from "/logo.png?url";
import { logoutUser } from "../../store/auth-slice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let links = [
    { name: "Home", link: "/shop" },
    { name: "About", link: "/about" },
    { name: "Contact Us", link: "/store" },
  ];

  const handleLogOut = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="w-full shadow-bottom bg-[#ffffff]">
      <div className=" flex justify-between items-center py-4 px-6">
        {user ? (
          <p className="font-medium"> Welcome back,{user.username}</p>
        ) : (
          <img src={logo} alt="logo" className="h-12" />
        )}

        <div>
          <ul className="flex flex-row items-center gap-6">
            {links.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.link}
                  key={item.name}
                  className="relative hover:opacity-50"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between items-center gap-4">
          {user && (
            <div>
              <button onClick={handleLogOut}>Log out</button>
            </div>
          )}
          {!user && (
            <div>
              <button
                onClick={() =>
                  navigate("/login", { state: { from: location.pathname } })
                }
                className="bg-emerald-700 text-white px-4 py-3 rounded-full cursor-pointer hover:opacity-50 whitespace-nowrap shadow-lg"
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
