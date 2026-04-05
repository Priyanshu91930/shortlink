import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import settingsService from "../services/settingsService";
import api from "../services/api";

const AdInterstitialPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageIndex = parseInt(searchParams.get("p") || "1");

  const [settings, setSettings] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [canContinue, setCanContinue] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Inject User Provided Ad Script
    const script = document.createElement("script");
    script.src = "https://quge5.com/88/tag.min.js";
    script.setAttribute("data-zone", "226622");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.head.appendChild(script);

    const fetchData = async () => {
      try {
        const s = await settingsService.getSettings();
        setSettings(s);
        setTimeLeft(s.adTimer || 10);

        // Inject Dynamic Ad Script from Settings if exists
        if (s.adScript) {
          const dynamicScript = document.createElement("script");
          // If it's a full tag, we might need a different injection method,
          // but for now, we'll keep the existing logic or improve it.
          dynamicScript.innerHTML = s.adScript;
          document.head.appendChild(dynamicScript);
        }
      } catch (err) {
        setError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (loading || error || timeLeft <= 0) {
      if (timeLeft === 0) setCanContinue(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, error, timeLeft]);

  const handleContinue = async () => {
    if (pageIndex < settings.adPagesCount) {
      // Go to next ad page
      window.location.href = `/ad/${slug}?p=${pageIndex + 1}`;
    } else {
      // Final destination
      try {
        const res = await api.get(`/links/slug/${slug}`);
        window.location.href = res.data.originalUrl;
      } catch (err) {
        setError("Destination link not found");
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
      <div className="text-center p-8 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-slate-300">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 border border-slate-700 shadow-2xl text-center">
        <div className="mb-6">
          <div className="inline-block p-3 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Your link is almost ready!
          </h1>
          <p className="text-slate-400 mt-2">
            Step {pageIndex} of {settings.adPagesCount}
          </p>
        </div>

        <div className="my-10 flex flex-col items-center">
          {!canContinue ? (
            <div className="relative flex items-center justify-center w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 * (1 - timeLeft / settings.adTimer)}
                  className="text-blue-500 transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute text-4xl font-bold font-mono">
                {timeLeft}s
              </div>
            </div>
          ) : (
            <div className="w-full animate-bounce">
              <button
                onClick={handleContinue}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Click to Continue
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 uppercase tracking-widest mt-4">
          Advertisement
        </p>
        
        {/* Ad Placeholder (Admin script will be injected above) */}
        <div id="ad-container" className="mt-4 min-h-[200px] border border-dashed border-slate-700 rounded-lg flex items-center justify-center bg-slate-900/50">
          <span className="text-slate-600 italic">Advertisement Content</span>
        </div>
      </div>
    </div>
  );
};

export default AdInterstitialPage;
