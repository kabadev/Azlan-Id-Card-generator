"use client";
import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <header className="flex fixed border-b z-30  h-[70px] w-full bg-card top-0 items-center justify-between px-10">
      <div className="flex items-center gap-2">
        <Image
          src={"/azlanlogo.png"}
          alt="logo"
          width={100}
          height={100}
          className="h-12 w-12 object-contain"
        />
        <h2 className="font-semibold text-lg">Azlan ID Card Generator</h2>
      </div>
      <Image
        src={"/keita.png"}
        alt="logo"
        width={100}
        height={100}
        className="h-12 w-12 rounded-full border object-contain cursor-pointer"
      />
    </header>
  );
};

export default Navbar;
