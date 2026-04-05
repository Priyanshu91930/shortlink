import { ArrowRight, Link as LinkIcon, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants";

export default function Hero() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Delay trigger for sequential animation
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className="
        relative w-full h-screen 
        bg-neutral-900 text-white 
        flex items-center justify-center px-6
        overflow-hidden font-sans
      "
    >
      {/* Soft Background Glow */}
      <div className="absolute inset-0 bg-linear-to-b from-neutral-900 via-neutral-900/90 to-black opacity-80 pointer-events-none"></div>

      {/* Subtle Blur Circles - iOS style */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[180px] top-20 left-20"></div>
      <div className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[200px] bottom-20 right-20"></div>

      <div className="relative z-20 max-w-3xl text-center">
        {/* Pill Badge */}
        <div
          className={`
            inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            border border-stone-800 bg-neutral-800/40 text-sm text-slate-300
            mb-6 transition-all
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
          `}
          style={{
            transitionDuration: "0.2s",
            transitionDelay: "0.3s",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <Sparkles className="w-4 h-4 text-sky-400" />
          URL Shortener • Fast • Reliable
        </div>

        {/* Heading */}
        <h1
          className={`
            font-light tracking-tight font-[Geist] 
            text-4xl sm:text-6xl md:text-7xl mb-4 
            transition-all
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
          style={{
            transitionDuration: "0.2s",
            transitionDelay: "0.5s",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          Shorten URLs.
          <span className="block text-slate-300">
            Track clicks.
            <span className="text-white">Grow smarter.</span>
          </span>
        </h1>

        {/* Subtext */}
        <p
          className={`
            text-slate-400 text-base sm:text-lg max-w-xl mx-auto
            transition-all 
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
          style={{
            transitionDuration: "0.2s",
            transitionDelay: "0.7s",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          Convert long, messy URLs into short, clean, shareable links — while
          tracking how people use them.
        </p>

        {/* CTA Buttons */}
        <div
          className={`
            flex flex-col sm:flex-row gap-3 justify-center mt-10 
            transition-all
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
          style={{
            transitionDuration: "0.2s",
            transitionDelay: "0.9s",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* Primary Button */}
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="
              inline-flex items-center gap-2 px-6 py-3 rounded-xl 
              bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium
              transition-all active:scale-95 shadow-md shadow-blue-600/20
            "
          >
            Start Shortening
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary Button */}
          <button
            onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}
            className="
              inline-flex items-center gap-2 px-6 py-3 rounded-xl 
              bg-neutral-800/50 border border-stone-800 
              hover:bg-neutral-700/50 text-slate-300 text-sm font-medium
              transition-all active:scale-95
            "
          >
            <LinkIcon className="w-4 h-4" />
            See How It Works
          </button>
        </div>

        {/* Small Social Proof */}
        <div
          className={`
            flex items-center justify-center gap-2 mt-8 text-sm text-slate-500
            transition-all
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
          `}
          style={{
            transitionDuration: "0.2s",
            transitionDelay: "1.1s",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className="flex -space-x-2">
            <img
              className="w-8 h-8 rounded-full ring-2 ring-neutral-900 object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80"
              alt=""
            />
            <img
              className="w-8 h-8 rounded-full ring-2 ring-neutral-900 object-cover"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80"
              alt=""
            />
            <img
              className="w-8 h-8 rounded-full ring-2 ring-neutral-900 object-cover"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80"
              alt=""
            />
          </div>
          <span>Trusted by Friends & Developers</span>
        </div>
      </div>
    </section>
  );
}
