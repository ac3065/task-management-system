import React from "react";
import { BRAND_NAME, BRAND_SUBTEXT, BRAND_TAGLINE } from "../../utils/brand";

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#e8eef9]">
      {/* Soft atmosphere — full page, no split */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#c9daf8_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_#dbe7ff_0%,_transparent_45%),linear-gradient(180deg,#eef3fb_0%,#e4ecf8_100%)]" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#1a66ff]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#0b3db8]/12 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-5 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {BRAND_NAME}
          </h1>
          <p className="mt-2 text-sm font-medium text-primary">{BRAND_TAGLINE}</p>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-slate-600">
            {BRAND_SUBTEXT}
          </p>
        </div>

        {/* Form panel = interaction container */}
        <div className="w-full rounded-2xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
