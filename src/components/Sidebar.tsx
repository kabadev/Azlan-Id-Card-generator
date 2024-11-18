"use client";

import { MenuItems } from "@/constants/menu";
import Link from "next/link";
import * as React from "react";

const Sidebar = () => {
  return (
    <div className="fixed h-[calc(100vh-70px)] w-[250px] top-0 mt-[70px] border-r  bg-card -left-[250px] md:left-0 overflow-y-auto ">
      <div className="mb-6"></div>
      <div>
        {MenuItems.map((menu, i) => (
          <Link key={i} href={menu.url} className="flex items-center gap-2 p-4">
            {<menu.icon></menu.icon>}
            <h3>{menu.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
