
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#1f1f1f] text-white py-8 px-5 text-center w-full flex flex-col justify-center items-center shadow-[0_-2px_10px_rgba(0,0,0,0.3)]">
      <h2 className="mb-2.5 font-semibold text-xl">Opscart.in</h2>
      <p className="mb-2.5 text-sm text-[#bbb]">
        Your trusted place to buy & sell cars
      </p>
      <p className="text-xs text-[#888]">
        &copy; {new Date().getFullYear()} Opscart.in. All rights reserved.
      </p>
    </footer>
  );
}
