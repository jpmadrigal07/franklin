import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Icon } from "@iconify/react";
import moment from "moment";
import { NAVBAR_MENU } from "../constants";
import { useMutation } from "react-query";
import { verify } from "../utils/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthenticatedUser } from "../actions/authenticatedUserActions";
import Cookies from "js-cookie";

type T_MENU = {
  page: string;
  path: string;
  isAdmin?: boolean;
};

const NavBar = (props: any) => {
  const { setAuthenticatedUser, name, isLogin } = props;
  const router = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("");
  const [time, setTime] = useState(new Date().getTime());
  const [loggedInUserType, setLoggedInUserType] = useState("");

  const sessionToken = Cookies.get("sessionToken");

  const loggedInName = name ? name : "Admin";

  const { mutate: triggerTokenVerify, isLoading: isTokenVerifyLoading } =
    useMutation(async (tokenVerify: any) => verify(tokenVerify), {
      onSuccess: async (data) => {
        const { _id, userType, username } = data.user;
        setLoggedInUserType(userType);
        setAuthenticatedUser({
          id: _id,
          type: userType,
          name: data.name,
          username: username,
        });
      },
      onError: async () => {
        navigate("/");
      },
    });

  useEffect(() => {
    triggerTokenVerify({ token: sessionToken });
  }, [sessionToken, triggerTokenVerify]);

  // setInterval(() => {
  //   setTime(new Date().getTime());
  // }, 1000);

  useEffect(() => {
    setCurrentPage(router.pathname);
  }, [router.pathname]);

  const _removeSessionToken = () => {
    if (sessionToken) {
      Cookies.remove("sessionToken");
      setAuthenticatedUser({});
      window.location.href = "/";
    }
  };

  return (
    <>
      <div className="bg-light">
        <div className="h-[50px] grid grid-cols-8 gap-4 content-center ml-[25px] mr-[25px] text-primary">
          <p className="font-bold">{"Franklin's"}</p>
          <p className="col-span-2">
            {moment(time).format(" h:mm:ss A, D MMMM YYYY")}
          </p>
          {!isLogin && (
            <div className="col-span-5 text-right">
              <span className="font-bold">
                {isTokenVerifyLoading ? "Loading..." : `Hello ${loggedInName}!`}
              </span>
              {loggedInUserType === "Admin" && (
                <Icon
                  icon="bi:gear"
                  className="inline ml-6 hover:cursor-pointer"
                  height={24}
                  onClick={() => navigate("/adminsettings")}
                />
              )}
              <Icon
                icon="bi:box-arrow-in-right"
                className="inline ml-6 hover:cursor-pointer"
                height={24}
                onClick={() => _removeSessionToken()}
              />
            </div>
          )}
        </div>
      </div>
      <div className="bg-primary">
        <div
          className={`h-[50px] grid grid-cols-${
            loggedInUserType === "Admin" ? 7 : 6
          } gap-4 content-center ml-[25px] mr-[25px] text-white text-center`}
        >
          {!isLogin &&
            NAVBAR_MENU.map((res: T_MENU, index: number) => {
              if (res.isAdmin && loggedInUserType === "Admin") {
                return (
                  <span
                    key={index}
                    onClick={() => navigate(res.path)}
                    className={`hover:cursor-pointer ${
                      currentPage.includes(res.path)
                        ? "border-2 border-white"
                        : ""
                    }`}
                  >
                    {res.page}
                  </span>
                );
              }

              if (!res.isAdmin) {
                return (
                  <span
                    key={index}
                    onClick={() => navigate(res.path)}
                    className={`hover:cursor-pointer ${
                      currentPage.includes(res.path)
                        ? "border-2 border-white"
                        : ""
                    }`}
                  >
                    {res.page}
                  </span>
                );
              }
            })}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (global: any) => ({
  name: global.authenticatedUser.user.name,
});

export default connect(mapStateToProps, { setAuthenticatedUser })(NavBar);
