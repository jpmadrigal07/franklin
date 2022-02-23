import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const MainLayout = () => {
  return (
    <>
      <NavBar />
      <div className="ml-[25px] mr-[25px] mt-[25px] mb-[25px]">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
