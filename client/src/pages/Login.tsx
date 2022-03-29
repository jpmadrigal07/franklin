import { useState } from "react";
import { connect } from "react-redux";
import { useMutation, useQuery } from "react-query";
import { login } from "../utils/auth";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import { setAuthenticatedUser } from "../actions/authenticatedUserActions";
import Cookies from "js-cookie";
import NavBar from "../components/NavBar";
import { getAllFolder, addFolder } from "../utils/folder";
import { getAllStaff } from "../utils/staff";
import { updateUser } from "../utils/user";
import Modal from "../components/Modal";
import moment from "moment";

const Login = (props: any) => {
  const { setAuthenticatedUser } = props;
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [loggedInId, setLoggedInId] = useState("");
  const [loggedInUserType, setLoggedInUserType] = useState("");
  const [loggedInName, setLoggedInName] = useState("");
  const [loggedInToken, setLoggedInToken] = useState("");
  const [loggedInUsername, setLoggedInUsername] = useState("");

  const sessionToken = Cookies.get("sessionToken");

  const start = new Date().setHours(0, 0, 0, 0);
  const end = new Date().setHours(23, 59, 59, 999);

  const foldersCondition = `{ "createdAt": { "$gte": "${start}", "$lt": "${end}" } }`;

  const {
    data: folderData,
    isLoading: isFolderDataLoading,
    refetch: refetchFolderData,
  } = useQuery("folders", () => getAllFolder(encodeURI(foldersCondition)));

  const { data: staffData, refetch: refetchStaffData } = useQuery(
    "staffs",
    () => getAllStaff(),
    { enabled: false }
  );

  const { mutate: triggerLogin, isLoading: isLoginLoading } = useMutation(
    async (user: any) => login(user),
    {
      onSuccess: async (data) => {
        const { _id, userType, username } = data.user;
        if (folderData && folderData.length === 0) {
          setLoggedInId(_id);
          setLoggedInUserType(userType);
          setLoggedInUsername(username);
          setLoggedInToken(data.token);
          setLoggedInName(data.name);
          refetchStaffData();
          setIsFolderModalOpen(true);
        } else {
          Cookies.set("sessionToken", data.token);
          setLoggedInId(_id);
          setAuthenticatedUser({
            id: _id,
            type: userType,
            name: data.name,
            username: username,
          });
          triggerLastLogin({ lastLoggedIn: moment() });
        }
      },
      onError: async (err: any) => {
        MySwal.fire({
          title: "Ooops!",
          text: err,
          icon: "error",
          confirmButtonText: "Okay",
          confirmButtonColor: "#274c77",
        });
      },
    }
  );
  const { mutate: triggerLastLogin } = useMutation(
    async (user: any) => updateUser(user, loggedInId),
    {
      onSuccess: async () => {
        if (isFolderModalOpen) {
          MySwal.fire({
            title: "Folder of the day has been set!",
            text: "You are now authenticated",
            icon: "success",
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 3000,
          }).then(() => {
            Cookies.set("sessionToken", loggedInToken);
            setAuthenticatedUser({
              id: loggedInId,
              type: loggedInUserType,
              name: loggedInName,
              username: loggedInUsername,
            });
            navigate("/dashboard");
          });
        } else {
          navigate("/dashboard");
        }
      },
      onError: async (err: any) => {
        MySwal.fire({
          title: "Ooops!",
          text: err,
          icon: "error",
          confirmButtonText: "Okay",
          confirmButtonColor: "#274c77",
        });
      },
    }
  );
  const { mutate: triggerAddFolder, isLoading: isAddFolderLoading } =
    useMutation(async (folder: any) => addFolder(folder), {
      onSuccess: async () => {
        triggerLastLogin({ lastLoggedIn: moment() });
      },
      onError: async (err: any) => {
        MySwal.fire({
          title: "Ooops!",
          text: err,
          icon: "error",
          confirmButtonText: "Okay",
          confirmButtonColor: "#274c77",
        });
      },
    });
  const _removeSessionToken = () => {
    if (sessionToken) {
      Cookies.remove("sessionToken");
      setAuthenticatedUser({});
    }
    window.location.reload();
  };
  const _login = async (e: any) => {
    e.preventDefault();
    await refetchFolderData();
    triggerLogin({
      username,
      password,
    });
  };
  const _addFolder = () => {
    if (selectedFolderId === "") {
      MySwal.fire({
        title: "Ooops!",
        text: "Please select a staff",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#274c77",
      });
    } else {
      triggerAddFolder({
        staffId: selectedFolderId,
      });
    }
  };
  return (
    <div>
      <NavBar isLogin={true} />
      <div className="grid place-content-center">
        <form
          className="bg-white shadow-md rounded-xl px-8 pt-6 pb-8 mb-4 max-w-[400px] mt-[180px]"
          onSubmit={_login}
        >
          <div className="mb-8">
            <h5>
              Hello! Welcome to{" "}
              <span className="text-primary">Franklin's System.</span>
            </h5>
            <h1 className="text-primary font-bold">Log in</h1>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Username
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-semi-light"
              id="username"
              type="text"
              disabled={isLoginLoading || isFolderDataLoading}
              onChange={(e: any) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Password
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-semi-light"
              id="password"
              type="password"
              disabled={isLoginLoading || isFolderDataLoading}
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="bg-primary hover:bg-blue-700 text-white font-bold pt-1 pl-5 pb-1 pr-5 rounded-xl focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isLoginLoading || isFolderDataLoading}
            >
              Log in
            </button>
          </div>
        </form>
      </div>
      <Modal
        state={isFolderModalOpen}
        toggle={() => setIsFolderModalOpen(!isFolderModalOpen)}
        title={<h3>Folder of the day</h3>}
        clickOutsideClose={false}
        content={
          <>
            <div className="relative inline-block w-full text-gray-700">
              <select
                className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-semi-light appearance-none"
                onChange={(e: any) => setSelectedFolderId(e.target.value)}
              >
                <option>Select Staff</option>
                {staffData &&
                  staffData
                    .sort(function (a: any, b: any) {
                      return a.name.localeCompare(b.name);
                    })
                    .map((res: any) => {
                      return <option value={res._id}>{res.name}</option>;
                    })}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
          </>
        }
        footer={
          <>
            <button
              className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-3"
              disabled={isAddFolderLoading}
              onClick={() => _addFolder()}
            >
              Save
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              disabled={isAddFolderLoading}
              onClick={() => _removeSessionToken()}
            >
              Cancel
            </button>
          </>
        }
        size="sm"
      />
    </div>
  );
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, { setAuthenticatedUser })(Login);
