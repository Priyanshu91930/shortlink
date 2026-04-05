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
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui";
import { logoutUser } from "../store/slices/authSlice";

const AccountPage = () => {
  const [animate, setAnimate] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  const { urls } = useSelector((state) => state.url);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
              Manage your profile and view your activity
            </p>
          </div>

          {/* Profile Card */}
          <div
            className={`
              rounded-3xl bg-white/5 backdrop-blur-xl border border-stone-800 
              p-8 mb-8 transition-all duration-500 ease-out delay-100
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

          {/* Stats Cards */}
          <div
            className={`
              grid grid-cols-1 md:grid-cols-2 gap-6 mb-8
              transition-all duration-500 ease-out delay-200
              ${animate ? "opacity-100 scale-100" : "opacity-0 scale-95"}
            `}
          >
            {/* Total Links */}
            <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-stone-800 p-8 hover:bg-white/[0.07] transition-all duration-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-purple-600/10">
                  <Link2 className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-gray-400">Total Links Created</span>
              </div>
              <p className="text-5xl font-semibold tracking-tight mb-2">
                {totalLinks}
              </p>
              <p className="text-sm text-gray-500">Short links generated</p>
            </div>

            {/* Total Clicks */}
            <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-stone-800 p-8 hover:bg-white/[0.07] transition-all duration-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-emerald-600/10">
                  <MousePointerClick className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-gray-400">Total Clicks</span>
              </div>
              <p className="text-5xl font-semibold tracking-tight mb-2">
                {totalClicks.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Across all your links</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div
            className={`
              rounded-3xl bg-white/5 backdrop-blur-xl border border-stone-800 p-8
              transition-all duration-500 ease-out delay-300
              ${animate ? "opacity-100 scale-100" : "opacity-0 scale-95"}
            `}
          >
            <h3 className="text-xl font-[Open Sans] font-semibold tracking-tight mb-6">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="
                  p-5 rounded-2xl bg-white/[0.02] border border-stone-800 
                  hover:bg-white/5 hover:border-purple-500/30 hover:scale-[1.02]
                  transition-all duration-200 text-left
                "
              >
                <Link2 className="w-6 h-6 text-purple-400 mb-3" />
                <h4 className="font-[Open Sans] font-semibold mb-1">
                  View Dashboard
                </h4>
                <p className="text-sm text-gray-400">Manage your links</p>
              </button>

              <button
                className="
                  p-5 rounded-2xl bg-white/[0.02] border border-stone-800 
                  hover:bg-white/5 hover:border-emerald-500/30 hover:scale-[1.02]
                  transition-all duration-200 text-left
                "
              >
                <Shield className="w-6 h-6 text-emerald-400 mb-3" />
                <h4 className="font-[Open Sans] font-semibold mb-1">
                  Change Password
                </h4>
                <p className="text-sm text-gray-400">Update your security</p>
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="
                  p-5 rounded-2xl bg-white/[0.02] border border-stone-800 
                  hover:bg-white/5 hover:border-blue-500/30 hover:scale-[1.02]
                  transition-all duration-200 text-left
                "
              >
                <Mail className="w-6 h-6 text-blue-400 mb-3" />
                <h4 className="font-[Open Sans] font-semibold mb-1">
                  Contact Support
                </h4>
                <p className="text-sm text-gray-400">Get help with your account</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountPage;
