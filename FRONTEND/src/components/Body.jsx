import { Link2, Globe, BarChart2, QrCode } from "lucide-react";
import { useEffect, useState } from "react";

export default function Body() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Link2,
      title: "Instant URL Shortening",
      description:
        "Shorten long URLs instantly with clean, fast, and secure redirects optimized for performance.",
    },
    {
      icon: Globe,
      title: "Custom Domains",
      description:
        "Add your own custom domain to create branded short links that build trust and professionalism.",
    },
    {
      icon: BarChart2,
      title: "Click Analytics",
      description:
        "Track clicks, referrers, user devices, and daily traffic with minimal yet powerful analytics.",
    },
    {
      icon: QrCode,
      title: "QR Code Generation",
      description:
        "Every short link gets an auto-generated QR code that you can download and use anywhere.",
    },
  ];

  return (
    <section id="features" className="relative min-h-screen bg-black text-white flex items-center justify-center px-6 py-24 font-[Inter]">
      <div className="max-w-7xl w-full">
        {/* Heading */}
        <div
          className={`
            text-center mb-16 transition-all duration-500 ease-out
            ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          <h2 className="text-4xl md:text-5xl font-[Open Sans] font-semibold tracking-tight mb-4">
            Powerful Features That Make
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-purple-600">
              Shortening Smarter
            </span>
          </h2>
          <p className="text-lg text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            Everything you need to shorten, track, and manage your links in a
            single elegant dashboard.
          </p>
        </div>

        {/* 2x2 Grid with Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`
                  group rounded-3xl bg-white/5 backdrop-blur-xl border border-stone-800 
                  p-8 transition-all duration-300 ease-out
                  hover:bg-white/[0.07] hover:border-stone-700 hover:scale-[1.02]
                  ${animate ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-2xl bg-purple-600/10 shrink-0 group-hover:bg-purple-600/20 transition-all duration-200">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-[Open Sans] font-semibold tracking-tight mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
