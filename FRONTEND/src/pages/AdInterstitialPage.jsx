import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import settingsService from "../services/settingsService";
import api from "../services/api";
import AdBanner from "../components/AdBanner";
import NativeAd from "../components/NativeAd";

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
    // Inject Popunder script
    const popunderScript = document.createElement("script");
    popunderScript.src = "https://pantomimemailman.com/5a/e3/cc/5ae3cc847bff081fa121b9d7f91b79f7.js";
    popunderScript.async = true;
    document.head.appendChild(popunderScript);

    // Inject Social Bar script
    const socialBarScript = document.createElement("script");
    socialBarScript.src = "https://pantomimemailman.com/51/cc/95/51cc9541a8b11a127d4ecc3130b4b0dd.js";
    socialBarScript.async = true;
    document.body.appendChild(socialBarScript);

    // Monetag Monetization Script
    const script = document.createElement("script");
    script.src = "https://quge5.com/88/tag.min.js";
    script.setAttribute("data-zone", "226622");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.head.appendChild(script);

    const fetchData = async () => {
      try {
        console.log("Fetching settings...");
        const s = await settingsService.getSettings();
        console.log("Settings loaded:", s);
        setSettings(s);
        setTimeLeft(s?.adTimer || 10);

        if (s?.adScript) {
          console.log("Injecting dynamic ad script...");
          const dynamicScript = document.createElement("script");
          dynamicScript.innerHTML = s.adScript;
          document.head.appendChild(dynamicScript);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
        setError("Failed to load settings. Please check your API connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      if (document.head.contains(popunderScript)) document.head.removeChild(popunderScript);
      if (document.body.contains(socialBarScript)) document.body.removeChild(socialBarScript);
      if (document.head.contains(script)) document.head.removeChild(script);
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
    console.log("Handle continue clicked. Slug:", slug);
    if (settings && pageIndex < settings.adPagesCount) {
      const nextUrl = `/ad/${slug}?p=${pageIndex + 1}`;
      console.log("Redirecting to next ad page:", nextUrl);
      window.location.href = nextUrl;
    } else {
      try {
        console.log("Fetching original URL from API...");
        const res = await api.get(`/links/slug/${slug}`);
        console.log("API Response:", res.data);
        if (res.data && res.data.originalUrl) {
          console.log("Redirecting to destination:", res.data.originalUrl);
          window.location.href = res.data.originalUrl;
        } else {
          throw new Error("Invalid response structure from API");
        }
      } catch (err) {
        console.error("Redirection error:", err);
        setError("Destination link not found or API is unavailable.");
      }
    }
  };

  const handleSmartlinkClick = () => {
    console.log("Smartlink clicked.");
    window.open("https://pantomimemailman.com/uup5m3s20e?key=1a79220bfe4ecc934ef8323e13fe9331", "_blank");
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
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center p-4">
      {/* Top Ledgerboard Ad */}
      <div className="w-full max-w-4xl pt-8 pb-4 flex justify-center">
        <AdBanner id="c0cf3af0e98a7c8c1ca0ccce1dfd3f9b" width={728} height={90} />
      </div>

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

        {/* Medium Rectangle Ad */}
        <AdBanner id="c0db5ed1b035f4273a3264f19bcba464" width={300} height={250} />

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
            <div className="w-full space-y-4">
              <button
                onClick={handleContinue}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Click to Continue
              </button>
              
              {/* Specialized Smartlink button */}
              <button
                onClick={handleSmartlinkClick}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-xl border border-slate-600 transition-all text-sm animate-pulse"
              >
                Click to Continue (Special)
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 uppercase tracking-widest mt-4">
          Advertisement
        </p>
        
        {/* Native Ad Banner */}
        <div className="mt-4 border border-dashed border-slate-700 rounded-lg bg-slate-900/50 p-2">
           <NativeAd id="aa1438decb39d7c83d497ac4459118f8" />
        </div>
      </div>

      {/* Bottom Ad */}
      <div className="w-full max-w-4xl py-8 flex justify-center">
        <AdBanner id="279ae18c7eae12288a2d3f4983d58272" width={468} height={60} />
      </div>
    </div>
  );
};

export default AdInterstitialPage;

