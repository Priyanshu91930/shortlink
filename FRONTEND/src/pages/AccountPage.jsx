import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  LogOut,
  Shield,
  Link2,
  MousePointerClick,
  Key,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui";
import { logoutUser } from "../store/slices/authSlice";
import userService from "../services/userService";

const AccountPage = () => {
  const [animate, setAnimate] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  const { urls } = useSelector((state) => state.url);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    fetchApiKey();
    return () => clearTimeout(timer);
  }, []);

  const fetchApiKey = async () => {
    try {
      const data = await userService.getApiKey();
      setApiKey(data.apiKey || "");
    } catch (err) {
      console.error("Failed to fetch API key", err);
    }
  };

  const handleGenerateKey = async () => {
    if (apiKey && !window.confirm("Generating a new API key will invalidate your current one. This will break any bots using the old key. Continue?")) {
      return;
    }

    setIsGenerating(true);
    setError("");
    try {
      const data = await userService.generateApiKey();
      setApiKey(data.apiKey);
      setShowKey(true);
    } catch (err) {
      setError("Failed to generate API key");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await dispatch(logoutUser());
      navigate("/");
    }
  };

  // Calculate stats
  const totalLinks = urls?.length || 0;
  const totalClicks =
    urls?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-[Inter]">
      <Navbar />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div
            className={`
              text-center mb-12 transition-all duration-500 ease-out
              ${
                animate
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }
            `}
          >
            <h1 className="text-5xl md:text-6xl font-[Open Sans] font-semibold tracking-tight mb-4">
              Your{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-purple-600">
                Account
              </span>
            </h1>
            <p className="text-lg text-gray-400">
              Manage your profile and API integrations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Card */}
              <div
                className={`
                  rounded-3xl bg-white/5 backdrop-blur-xl border border-stone-800 
                  p-8 transition-all duration-500 ease-out delay-100
                  ${animate ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                `}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center">
                      <User className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-[Open Sans] font-semibold tracking-tight mb-1">
                        {user?.name || "User"}
                      </h2>
                      <p className="text-sm text-gray-400">Account Settings</p>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4 text-red-600 font-bold" />
                    Logout
                  </Button>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-stone-800 hover:bg-white/[0.04] transition-all duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-purple-400" />
                      <span className="text-sm text-gray-400">Email Address</span>
                    </div>
                    <p className="text-white font-medium break-all">
                      {user?.email || "N/A"}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-stone-800 hover:bg-white/[0.04] transition-all duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm text-gray-400">Phone Number</span>
                    </div>
                    <p className="text-white font-medium">
                      {user?.phone || "Not provided"}
                    </p>
                  </div>

                  {/* Member Since */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-stone-800 hover:bg-white/[0.04] transition-all duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-gray-400">Member Since</span>
                    </div>
                    <p className="text-white font-medium">
                      {formatDate(user?.createdAt)}
                    </p>
                  </div>

                  {/* Account Status */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-stone-800 hover:bg-white/[0.04] transition-all duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-orange-400" />
                      <span className="text-sm text-gray-400">Account Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <p className="text-white font-medium">Active</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Integration Card */}
              <div
                className={`
                  rounded-3xl bg-white/5 backdrop-blur-xl border border-stone-800 
                  p-8 transition-all duration-500 ease-out delay-200
                  ${animate ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                `}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-blue-600/10">
                    <Key className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-[Open Sans] font-semibold tracking-tight">
                      API & Bot Integration
                    </h3>
                    <p className="text-sm text-gray-400">Use this key to connect Telegram bots or other apps</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {apiKey ? (
                    <div className="space-y-4">
                      <div className="relative group">
                        <div className="p-4 bg-black/40 rounded-2xl border border-stone-800 font-mono text-sm break-all flex items-center justify-between gap-4">
                          <span className="text-gray-300">
                            {showKey ? apiKey : "•".repeat(40)}
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setShowKey(!showKey)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400"
                              title={showKey ? "Hide Key" : "Show Key"}
                            >
                              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={handleCopy}
                              className={`p-2 rounded-lg transition-all ${
                                copied ? "bg-emerald-500/20 text-emerald-400" : "hover:bg-white/10 text-gray-400"
                              }`}
                              title="Copy to Clipboard"
                            >
                              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                          Warning: Keep your API key secret and secure.
                        </p>
                        <button
                          onClick={handleGenerateKey}
                          disabled={isGenerating}
                          className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${isGenerating ? "animate-spin" : ""}`} />
                          Regenerate Key
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 border-2 border-dashed border-stone-800 rounded-3xl">
                      <p className="text-gray-400 mb-4">No API key generated yet</p>
                      <Button
                        onClick={handleGenerateKey}
                        isLoading={isGenerating}
                        className="bg-blue-600 hover:bg-blue-500 text-white"
                      >
                        Generate API Key
                      </Button>
                    </div>
                  )}

                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
              </div>
            </div>

            {/* Sidebar Stats & Actions */}
            <div className="space-y-8">
              {/* Stats Mini Cards */}
              <div
                className={`
                  rounded-3xl bg-white/5 backdrop-blur-xl border border-stone-800 p-6 space-y-6
                  transition-all duration-500 ease-out delay-300
                  ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
                `}
              >
                <h3 className="text-lg font-semibold border-b border-stone-800 pb-4">Activity Stats</h3>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-purple-600/10 shrink-0">
                    <Link2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalLinks}</p>
                    <p className="text-xs text-gray-500">Short Links</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-600/10 shrink-0">
                    <MousePointerClick className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Clicks</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions Sidebar */}
              <div
                className={`
                  rounded-3xl bg-white/5 backdrop-blur-xl border border-stone-800 p-6
                  transition-all duration-500 ease-out delay-400
                  ${animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
                `}
              >
                <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-stone-800 hover:bg-white/5 hover:border-purple-500/30 transition-all font-medium text-sm text-left"
                  >
                    <Link2 className="w-5 h-5 text-purple-400" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate("/contact")}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-stone-800 hover:bg-white/5 hover:border-blue-500/30 transition-all font-medium text-sm text-left"
                  >
                    <Mail className="w-5 h-5 text-blue-400" />
                    Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountPage;
