import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLocalStorage from "../utils/hooks/useLocalStorage";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../redux/features/UserSlice";
import toast from "react-hot-toast";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const user_data = useSelector((store) => store.user);
  const [userId, setUserId] = useLocalStorage("authToken");

  const user_pending_deposit = useSelector(
    (store) => store.user.userPendingDeposit
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("user id", user_data);

  // Add event listener to detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100); // Check if scrolled down
    };
    if(!userId){
      navigate('/login')
    }else{
      navigate("/machine_listing")
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);


  }, []);

  const handleLogout = () => {
    setUserId(null); // Clear the token from local storage
    dispatch(removeUser()); // Remove user from Redux store
    toast.success("Loggout  successfully");

    navigate("/login"); // Redirect to the login page
  };

  return (
    <header
    className={`top-0 left-0 w-full z-50 transition-all duration-300 ${
      user_data.isLoggedIn
        ? " bg-[#1C1F2E]"  // Header is fixed and has a specific background color when logged in
        : isScrolled
        ? "fixed bg-[#271A84] shadow-lg" // If not logged in and scrolled, change background color and add shadow
        : "fixed bg-opacity-60" // If not logged in and not scrolled, use a transparent background
    }`}
  >
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-white text-xl font-bold">
        <Link to={user_data.isLoggedIn ? "/machine_listing": "/"}>
          <img src="/Images/logo.jpg" className="w-16 h-16" alt="Logo" />
        </Link>
      </div>
      <div className="flex gap-2 sm:gap-5">
        {/* Register / Login Buttons */}
        <div className="border border-[#7D60F9] text-white px-3 sm:px-5 py-2 hover:bg-[#7D60F9] rounded-full transition duration-300">
          {user_data.isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">Register / Login</Link>
          )}
        </div>
        <div className={`relative ${user_data.isLoggedIn ? "border border-[#7D60F9]" : ""}  text-white px-3 sm:px-5 py-2 hover:bg-[#7D60F9] rounded-full transition duration-300`}>
          {user_data.isLoggedIn ? (
            <Link to="/user_pending_deposit" className="relative text-[14px]">
              Pending Deposit
              {user_pending_deposit && user_pending_deposit.length > 0 && (
                <span className="absolute bottom-5 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {user_pending_deposit.length}
                </span>
              )}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  </header>
  
  );
}

export default Header;
