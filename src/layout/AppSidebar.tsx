import { useCallback } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  GridIcon,
  UserIcon,
  PaymentIcon,
  FeedbackIcon
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
// import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <FeedbackIcon />,
    name: "FeedbackList",
    path: "/FeedbackList",
  },
  {
    icon: <UserIcon />,
    name: "Onboarding",
    path: "/Onboarding",
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PaymentIcon />,
    name: "Payment List",
    path: "/payment",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-1.5">
      {items.map((nav) => {
        const active = isActive(nav.path);
        const showText = isExpanded || isHovered || isMobileOpen;
        
        return (
          <li key={nav.name}>
            <Link
              to={nav.path}
              className={`menu-item group relative flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 ${
                active
                  ? "menu-item-active bg-white/30 dark:bg-white/10 text-white shadow-lg shadow-black/10"
                  : "menu-item-inactive text-white/70 hover:text-white hover:bg-white/10 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
              } ${
                !showText
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size flex-shrink-0 ${
                  active
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 [&_svg]:w-[20px] [&_svg]:h-[20px] [&_svg]:fill-current [&_svg]:stroke-current ${
                    active
                      ? "bg-white/40 dark:bg-white/20 text-white shadow-md ring-2 ring-white/30 dark:ring-white/20"
                      : "bg-transparent text-white/60 group-hover:text-white group-hover:bg-white/15 group-hover:scale-105"
                  }`}
                >
                  {nav.icon}
                </span>
              </span>
              {showText && (
                <span
                  className={`menu-item-text text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${
                    active
                      ? "text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                      : "text-white/80 group-hover:text-white"
                  }`}
                >
                  {nav.name}
                </span>
              )}
              {active && (
                <>
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-r-full shadow-lg shadow-white/30 dark:shadow-white/20"></span>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/60 dark:bg-white/40 animate-pulse"></span>
                </>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-4 left-0 bg-[#1878b1] dark:bg-[#0F1828] text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 shadow-2xl shadow-black/20
        ${
          isExpanded || isMobileOpen
            ? "w-[280px]"
            : isHovered
            ? "w-[280px]"
            : "w-[80px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => {
        if (!isExpanded && !isMobileOpen) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        if (!isExpanded && !isMobileOpen) {
          setIsHovered(false);
        }
      }}
    >
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent dark:from-white/5 pointer-events-none"></div>
      
      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/10 to-transparent dark:from-black/20 pointer-events-none"></div>
      
      <div
        className={`py-8 flex !bg-white dark:!bg-[#0F1828] -mx-5 px-5 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="relative">
              <div className="absolute -inset-2 bg-white/10 dark:bg-white/5 rounded-2xl blur-xl opacity-50"></div>
              <img
                className="dark:hidden relative"
                src="/images/logo/logo-pp.png"
                alt="Logo"
                width={160}
                height={45}
              />
              <img
                className="hidden dark:block relative"
                src="/images/logo/logo-pp-dark.png"
                alt="Logo"
                width={160}
                height={45}
              />
            </div>
          ) : (
            <div className="relative">
              <div className="absolute -inset-2 bg-white/20 dark:bg-white/10 rounded-full blur-2xl opacity-60"></div>
              <img
                src="/images/logo/logo-pp-small.png"
                alt="Logo"
                width={44}
                height={44}
                className="relative z-10"
              />
            </div>
          )}
      </div>
      
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar p-2 flex-1 relative z-10">
        <nav className="mb-6">
          <div className="flex flex-col gap-6">
            <div>
              {renderMenuItems(navItems)}
            </div>
            <div className="pt-4 relative">
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"></div>
              {renderMenuItems(othersItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;