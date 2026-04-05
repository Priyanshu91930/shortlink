import React, { useState, useEffect } from "react";
import settingsService from "../services/settingsService";
import { toast } from "react-hot-toast";

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    adPagesCount: 0,
    adTimer: 10,
    adScript: "",
    rootFileName: "",
    rootFileContent: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const s = await settingsService.getSettings();
        setSettings(s);
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: name === "adPagesCount" || name === "adTimer" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.updateSettings(settings);
      toast.success("Settings updated successfully!");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 text-white bg-[#0f172a] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Ad & System Settings</h1>
          <p className="text-slate-400 mt-1">Configure your ad-flow and redirection logic</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ad Flow Configuration */}
        <section className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Ad Redirection Flow
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Number of Ad Pages</label>
              <select
                name="adPagesCount"
                value={settings.adPagesCount}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value={0}>Direct Redirect (Disabled)</option>
                <option value={1}>Single Ad Page</option>
                <option value={2}>2 Ad Pages</option>
                <option value={3}>3 Ad Pages</option>
                <option value={4}>4 Ad Pages</option>
              </select>
              <p className="mt-2 text-xs text-slate-500">Number of interstitial pages before destination</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Timer Duration (Seconds)</label>
              <input
                type="number"
                name="adTimer"
                value={settings.adTimer}
                onChange={handleChange}
                min="3"
                max="60"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <p className="mt-2 text-xs text-slate-500">How long users must wait on each ad page</p>
            </div>
          </div>
        </section>

        {/* Ad Script Injection */}
        <section className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl flex flex-col">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Ad Script (Injected in Head)
          </h2>
          <textarea
            name="adScript"
            value={settings.adScript}
            onChange={handleChange}
            placeholder="Paste your <script> tags here..."
            className="flex-grow min-h-[300px] w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm resize-none"
          />
        </section>

        {/* Root File Serving */}
        <section className="md:col-span-2 bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Ad Verification File (Root Directory)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">File Name (e.g. ads.txt)</label>
              <input
                type="text"
                name="rootFileName"
                value={settings.rootFileName}
                onChange={handleChange}
                placeholder="ads.txt"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">File Content</label>
              <textarea
                name="rootFileContent"
                value={settings.rootFileContent}
                onChange={handleChange}
                placeholder="Paste file content here..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono text-sm h-32 resize-none"
              />
            </div>
          </div>
          <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-4">
            <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-emerald-300 text-sm">
              Use this if your ad network requires you to "upload a file to your root directory". 
              Example: if you set Name to <strong>ads.txt</strong>, it will be served at <strong>yourdomain.com/ads.txt</strong>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
