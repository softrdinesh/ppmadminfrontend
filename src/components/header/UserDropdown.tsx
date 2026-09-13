import { useState, useEffect, useRef } from "react";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";
import { logout } from "../../utils/auth"; // adjust path as needed
import { useNavigate } from "react-router";
export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
const navigate = useNavigate();

const handleLogoutClick = () => {
  logout(navigate); // pass a message as the 2nd argument if you want a toast, e.g. logout(navigate, "Logged out successfully")
};
  function toggleDropdown() {
    setIsOpen(!isOpen);
     setIsActive(true)
  }

  // function closeDropdown() {
  //   setIsOpen(false);
  // }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
   <button
  onClick={toggleDropdown}
  className="relative flex items-center text-gray-700 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 dark:text-gray-400 group"
  aria-label="User menu"
>
  {/* Avatar Image */}
      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-500/20 dark:ring-blue-400/20">
              <img src="/images/user/usr.png" alt="User" className="w-full h-full object-cover" />
            </div>

  {/* Status Indicator */}
  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5">
    {/* Status Dot */}
    <span 
      className={`absolute inset-0 rounded-full border-2 border-white transition-all duration-300 dark:border-gray-900 ${
        isActive 
          ? "bg-green-500 shadow-lg shadow-green-500/50" 
          : "bg-gray-400 dark:bg-gray-600"
      }`} 
    />
    
    {/* Pulse Animation (only when active) */}
    {isActive && (
      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
    )}
  </span>
</button>

      <div
        className={`
          absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-xl border border-gray-200 bg-white p-2.5 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark
          transition-all duration-300 ease-out origin-top-right
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 rotate-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-3 rotate-[-2deg] pointer-events-none"
          }
        `}
      >
        {/* User Profile Section with Active Status */}
        <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-500/20 dark:ring-blue-400/20">
              <img src="/images/user/usr.png" alt="User" className="w-full h-full object-cover" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5">
              <span className={`absolute inset-0 rounded-full border-2 border-white dark:border-gray-900 transition-all duration-300 ${
                isActive 
                  ? "bg-green-500 shadow-lg shadow-green-500/50" 
                  : "bg-gray-400"
              }`} />
              {isActive && (
                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
              )}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
             _
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
_            </p>
            <div className="flex items-center gap-1.5 mt-1">
              {/* <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`} /> */}
              {/* <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                {isActive ? "● Active Now" : "● Offline"}
              </span> */}
            </div>
          </div>
        </div>

        {/* <ul className="flex flex-col gap-1 pt-3 pb-2.5 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-all duration-200 hover:pl-6 hover:bg-blue-50 dark:hover:bg-blue-950/30"
            >
              <svg
                className="fill-gray-500 group-hover:fill-blue-600 dark:fill-gray-400 dark:group-hover:fill-blue-400 transition-all duration-200 group-hover:scale-110"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z"
                  fill=""
                />
              </svg>
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">Edit Profile</span>
            </DropdownItem>
          </li>
          
        </ul>
         */}
        <Link
        to=""
      onClick={handleLogoutClick}
          className="flex items-center gap-3 px-3 py-2 mt-2.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg group text-theme-sm hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 hover:pl-6"
        >
          <svg
            className="fill-red-500 group-hover:fill-red-600 dark:fill-red-400 dark:group-hover:fill-red-300 transition-all duration-200 group-hover:scale-110 group-hover:rotate-6"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
              fill=""
            />
          </svg>
          <span className="group-hover:translate-x-0.5 transition-transform duration-200">Log Out</span>
        </Link>
      </div>
    </div>
  );
}