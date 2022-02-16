import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import moment from "moment";
import { NAVBAR_MENU } from "../constants";
import { useRouter } from "next/router";
import Link from "next/link";

type T_MENU = {
  page: string;
  path: string;
};

const Navbar = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState("");
  const [time, setTime] = useState(new Date().getTime());
  setInterval(() => {
    setTime(new Date().getTime());
  }, 1000);

  useEffect(() => {
    setCurrentPage(router.pathname);
  }, [router.pathname]);

  return (
    <>
      <div className="bg-light">
        <div className="h-[50px] grid grid-cols-8 gap-4 content-center ml-[200px] mr-[200px] text-primary">
          <p className="font-bold">{"Franklin's"}</p>
          <p className="col-span-2">
            {moment(time).format(" h:mm:ss A, D MMMM YYYY")}
          </p>
          <div className="col-span-5 text-right">
            <span className="font-bold">Hello Staff!</span>
            <a className="ml-10" href="#">
              <Icon
                icon="bi:box-arrow-in-right"
                className="inline"
                height={24}
              />
            </a>
          </div>
        </div>
      </div>
      <div className="bg-primary">
        <div className="h-[50px] grid grid-cols-7 gap-4 content-center ml-[200px] mr-[200px] text-white text-center">
          {NAVBAR_MENU.map((res: T_MENU, index: number) => {
            return (
              <Link key={index} href={res.path} passHref={true}>
                <span
                  className={`hover:cursor-pointer ${
                    res.path === currentPage ? "border-2 border-white" : ""
                  }`}
                >
                  {res.page}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
