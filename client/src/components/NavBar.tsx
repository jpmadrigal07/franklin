import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Icon } from "@iconify/react";
import moment from "moment";
import { NAVBAR_MENU } from "../constants";
import { useMutation, useQuery } from "react-query";
import { getAllFolder } from "../utils/api/folder";
import { verify } from "../utils/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthenticatedUser } from "../actions/authenticatedUserActions";
import Cookies from "js-cookie";
import { updateUser } from "../utils/user";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

type T_MENU = {
  page: string;
  path: string;
  isAdmin?: boolean;
};

const NavBar = (props: any) => {
  const { setAuthenticatedUser, loggedInName, loggedInId, isLogin } = props;
  const MySwal = withReactContent(Swal);
  const router = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("");
  const [time, setTime] = useState(new Date().getTime());
  const [loggedInUserType, setLoggedInUserType] = useState("");

  const sessionToken = Cookies.get("sessionToken");

  const updatedName = loggedInName ? loggedInName : "Admin";

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

  const start = new Date().setHours(0, 0, 0, 0);
  const end = new Date().setHours(23, 59, 59, 999);

  const foldersCondition = `{ "createdAt": { "$gte": "${start}", "$lt": "${end}" }, "timeOut": { "$exists": false } }`;

  const { data: folderData, isLoading: isFolderDataLoading } = useQuery(
    "folders",
    () => getAllFolder(foldersCondition)
  );

  useEffect(() => {
    triggerTokenVerify({ token: sessionToken });
  }, [sessionToken, triggerTokenVerify]);

  // setInterval(() => {
  //   setTime(new Date().getTime());
  // }, 1000);

  const { mutate: triggerLastLogin } = useMutation(
    async (user: any) => updateUser(user, loggedInId),
    {
      onSuccess: async () => {
        window.location.href = "/";
      },
      onError: async (err: any) => {
        MySwal.fire({
          title: "Ooops!",
          text: err,
          icon: "error",
          confirmButtonColor: "#274c77",
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          window.location.href = "/";
        });
      },
    }
  );

  useEffect(() => {
    setCurrentPage(router.pathname);
  }, [router.pathname]);

  const _removeSessionToken = () => {
    if (sessionToken) {
      Cookies.remove("sessionToken");
      setAuthenticatedUser({});
      triggerLastLogin({ lastLoggedOut: moment() });
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
                {isFolderDataLoading
                  ? "Loading..."
                  : `(Folder: ${
                      folderData[0] ? folderData[0]?.staffId?.name : "---"
                    })`}
              </span>
              <span className="font-bold ml-6">
                {isTokenVerifyLoading ? "Loading..." : `Hello ${updatedName}!`}
              </span>
              <Icon
                icon="bi:gear"
                className="inline ml-6 hover:cursor-pointer"
                height={24}
                onClick={() =>
                  navigate(`/${loggedInUserType.toLowerCase()}settings`)
                }
              />
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
          className={`h-[50px] flex flex-row content-center ml-[25px] mr-[25px] text-white text-center`}
        >
          {!isLogin &&
            NAVBAR_MENU.map((res: T_MENU, index: number) => {
              if (res.isAdmin && loggedInUserType === "Admin") {
                return (
                  <span
                    key={index}
                    onClick={() => navigate(res.path)}
                    className={`hover:cursor-pointer basis-1/4 pt-[3px] my-2 ${
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
                    className={`hover:cursor-pointer basis-1/4 pt-[3px] my-2 ${
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
  loggedInName: global.authenticatedUser.user.name,
  loggedInId: global.authenticatedUser.user.id,
});

export default connect(mapStateToProps, { setAuthenticatedUser })(NavBar);
