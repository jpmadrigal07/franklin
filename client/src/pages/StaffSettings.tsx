import { useState } from "react";
import { connect } from "react-redux";
import { useMutation } from "react-query";
import { changePassword } from "../utils/user";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Asterisk from "../components/Asterisk";

const StaffSettings = (props: any) => {
  const { loggedInUserUsername, loggedInUserId, loggedInUserType } = props;
  const MySwal = withReactContent(Swal);
  const [isChangePasswordFormVisible, setIsChangePasswordFormVisible] =
    useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const { mutate: triggerUpdateUser, isLoading: isUpdateUserLoading } =
    useMutation(async (user: any) => changePassword(user), {
      onSuccess: async () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setIsChangePasswordFormVisible(false);
        MySwal.fire({
          title: "Success!",
          text: "Password has been changed",
          icon: "success",
          confirmButtonText: "Okay",
          confirmButtonColor: "#274c77",
        });
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
  const _changePassword = (e: any) => {
    e.preventDefault();
    if (loggedInUserType === "Admin") {
      MySwal.fire({
        title: "Ooops!",
        text: "Only the Staff can make an action for this",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#274c77",
      });
    } else if (
      currentPassword === "" ||
      newPassword === "" ||
      confirmNewPassword === ""
    ) {
      MySwal.fire({
        title: "Ooops!",
        text: "Required values are empty",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#274c77",
      });
    } else if (newPassword !== confirmNewPassword) {
      MySwal.fire({
        title: "Ooops!",
        text: "New password didn't match",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#274c77",
      });
    } else if (currentPassword === newPassword) {
      MySwal.fire({
        title: "Ooops!",
        text: "Please select new password",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#274c77",
      });
    } else {
      triggerUpdateUser({
        id: loggedInUserId,
        currentPassword,
        newPassword,
      });
    }
  };

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10">
        Staff Profile
      </h1>
      <h2 className="text-primary text-center mb-10">Change Password</h2>
      <div className="mx-[400px]">
        <p className="font-bold">
          <span className="font-bold text-primary">
            Username: <span className="text-black">{loggedInUserUsername}</span>
          </span>
        </p>
        <div className="flex justify-between mb-6">
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">
                Password: <span className="text-black">********</span>
              </span>
            </p>
          </div>
          <div>
            <span
              className="font-bold text-secondary hover:cursor-pointer"
              onClick={() =>
                setIsChangePasswordFormVisible(!isChangePasswordFormVisible)
              }
            >
              Change Password
            </span>
          </div>
        </div>
        {isChangePasswordFormVisible && (
          <form onSubmit={_changePassword}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">
                Current Password
                <Asterisk />
              </label>
              <input
                className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-semi-light"
                id="password"
                type="password"
                onChange={(e: any) => setCurrentPassword(e.target.value)}
                disabled={isUpdateUserLoading}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">
                New Password
                <Asterisk />
              </label>
              <input
                className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-semi-light"
                id="password"
                type="password"
                onChange={(e: any) => setNewPassword(e.target.value)}
                disabled={isUpdateUserLoading}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">
                Confirm New Password
                <Asterisk />
              </label>
              <input
                className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-semi-light"
                id="password"
                type="password"
                onChange={(e: any) => setConfirmNewPassword(e.target.value)}
                disabled={isUpdateUserLoading}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-primary hover:bg-blue-700 text-white font-bold pt-1 pl-5 pb-1 pr-5 rounded-xl focus:outline-none focus:shadow-outline mr-3"
                type="submit"
              >
                Save
              </button>
              <button
                className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
                onClick={() =>
                  setIsChangePasswordFormVisible(!isChangePasswordFormVisible)
                }
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (global: any) => ({
  loggedInUserType: global.authenticatedUser.user.type,
  loggedInUserId: global.authenticatedUser.user.id,
  loggedInUserUsername: global.authenticatedUser.user.username,
});

export default connect(mapStateToProps)(StaffSettings);
