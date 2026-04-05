import { Instagram, Twitter, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-neutral-300 ">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-semibold font-[Open Sans] mb-4">
              Shortly
            </h3>
            <p className="text-neutral-400 leading-relaxed text-sm">
              A clean, fast, and intelligent URL shortening platform with
              analytics and custom domains.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-semibold font-[Open Sans] mb-4">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <a href="/" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-white transition">
                  Analytics
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold font-[Open Sans] mb-4">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <a href="/contact" className="hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition">
                  API Docs
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Status
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold font-[Open Sans] mb-4">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-neutral-800 my-12"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-neutral-500">
          <p>© 2025 Shortly. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-neutral-300 transition">
              Security
            </a>
            <a href="#" className="hover:text-neutral-300 transition">
              Roadmap
            </a>
            <a href="#" className="hover:text-neutral-300 transition">
              Changelog
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
