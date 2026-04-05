import { User, Menu, X, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [animateWords, setAnimateWords] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isLoggedIn = isAuthenticated;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const timer = setTimeout(() => setAnimateWords(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <nav
      className="
        fixed top-5 left-1/2 -translate-x-1/2 z-50 
        bg-neutral-900/40 backdrop-blur-xl 
        border border-stone-800 
        rounded-full px-6 py-3 shadow-sm 
        text-white font-sans
      "
    >
      <div className="flex items-center justify-between gap-6">
        {/* Logo */}
        <div 
          onClick={() => navigate(ROUTES.HOME)}
          className="flex items-center select-none cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-white"></span>
          </div>

          {/* Brand Name – Word by Word scale animation */}
          <h1 className="ml-2 flex text-sm font-semibold tracking-tight font-[Open Sans]">
            {"Shortly".split("").map((letter, index) => (
              <span
                key={index}
                className={`
                  inline-block transition-all 
                  ${
                    animateWords
                      ? "scale-100 opacity-100"
                      : "scale-50 opacity-0"
                  }
                `}
                style={{
                  transitionDuration: "0.25s",
                  transitionDelay: `${index * 0.05}s`,
                  transitionTimingFunction: "ease-in",
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-xs text-gray-300">
          <a href="/" className="hover:text-white transition">
            Home
          </a>
          <a href="/contact" className="hover:text-white transition">
            Contact
          </a>

          {isLoggedIn && (
            <a
              href="/dashboard"
              className="hover:text-white transition flex items-center gap-1"
            >
              <LayoutDashboard className="w-3 h-3" />
              Dashboard
            </a>
          )}

          {isAdmin && (
            <a
              href="/admin/settings"
              className="hover:text-white transition flex items-center gap-1 text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 rounded-full"
            >
              <LayoutDashboard className="w-3 h-3" />
              Admin Panel
            </a>
          )}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoggedIn && (
            <a
              href="/register"
              className="
                inline-flex items-center gap-1 text-xs 
                text-white bg-white/10 border border-stone-800 
                hover:bg-white/20 transition px-3 py-1.5 rounded-full
              "
            >
              <UserPlus className="w-3 h-3" />
              Register
            </a>
          )}

          <a
            href={isLoggedIn ? "/account" : "/login"}
            className="
              inline-flex items-center gap-1 text-xs 
              bg-white text-black 
              hover:bg-gray-200 px-3 py-1.5 rounded-full 
              transition font-medium
            "
          >
            {isLoggedIn ? (
              <>
                <User className="w-3 h-3" /> Account
              </>
            ) : (
              <>
                <LogIn className="w-3 h-3" /> Login
              </>
            )}
          </a>
        </div>

        {/* Mobile Burger */}
        <button
          className="md:hidden inline-flex"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div
          className="
            mt-3 md:hidden bg-neutral-900/60 backdrop-blur-xl 
            border border-stone-800 rounded-xl p-4 space-y-3 shadow-sm
          "
        >
          <a href="/" className="block text-sm text-gray-300 hover:text-white">
            Home
          </a>
          <a
            href="/contact"
            className="block text-sm text-gray-300 hover:text-white"
          >
            Contact
          </a>

          {isLoggedIn && (
            <a
              href="/dashboard"
              className="block text-sm text-gray-300 hover:text-white"
            >
              Dashboard
            </a>
          )}

          {isAdmin && (
            <a
              href="/admin/settings"
              className="block text-sm text-blue-400 hover:text-blue-300"
            >
              Admin Settings
            </a>
          )}

          {!isLoggedIn ? (
            <a
              href="/register"
              className="
                block text-sm px-3 py-2 rounded-lg text-white 
                bg-white/10 border border-stone-800 mt-2
              "
            >
              Register
            </a>
          ) : null}

          <a
            href={isLoggedIn ? "/account" : "/login"}
            className="
              block text-sm px-3 py-2 rounded-lg 
              bg-white text-black font-medium mt-2
            "
          >
            {isLoggedIn ? "Account" : "Login"}
          </a>
        </div>
      )}
    </nav>
  );
}
