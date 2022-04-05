import { useState, useEffect, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { useMutation, useQuery } from "react-query";
import { changePassword } from "../utils/user";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Asterisk from "../components/Asterisk";
import _constructTableActions from "../utils/constructTableActions";
import { getAllFolder, addFolder, updateFolder } from "../utils/api/folder";
import DataTable from "../components/Table";
import { getAllStaff } from "../utils/staff";
import { verifyPassword } from "../utils/user";
import Modal from "../components/Modal";
import moment from "moment";

type T_Header = {
  header: string;
  dataName: string;
};

const AdminSettings = (props: any) => {
  const { loggedInUserUsername, loggedInUserId, loggedInUserType } = props;
  const MySwal = withReactContent(Swal);
  const [isChangePasswordFormVisible, setIsChangePasswordFormVisible] =
    useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangePassword, setIsChangePassword] = useState(true);
  const [currentFolder, setCurrentFolder] = useState<any>({});
  const [staff, setStaff] = useState<any>([]);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedStaffName, setSelectedStaffName] = useState("");
  const [isChangeFolderModalOpen, setIsChangeFolderModalOpen] = useState(false);

  const start = new Date().setHours(0, 0, 0, 0);
  const end = new Date().setHours(23, 59, 59, 999);

  const foldersCondition = `{ "createdAt": { "$gte": "${start}", "$lt": "${end}" }, "timeOut": { "$exists": false } }`;

  const {
    data: folderData,
    isLoading: isoFolderDataLoading,
    refetch: refetchFolderData,
  } = useQuery("folders", () => getAllFolder(foldersCondition));

  const {
    data: staffData,
    isLoading: isStaffDataLoading,
    refetch: refetchStaffData,
  } = useQuery("staffs", () => getAllStaff());

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

  const { mutate: triggerVerifyPassword, isLoading: isVerifyPasswordLoading } =
    useMutation(async (password: any) => verifyPassword(password), {
      onSuccess: async () => {
        triggerUpdateFolder({
          timeOut: moment(),
        });
      },
      onError: async (err: any) => {
        MySwal.fire({
          title: "Ooopssssss!",
          text: err,
          icon: "error",
          confirmButtonText: "Okay",
          confirmButtonColor: "#274c77",
        });
      },
    });

  const { mutate: triggerUpdateFolder, isLoading: isUpdateFolderLoading } =
    useMutation(
      async (folder: any) => updateFolder(folder, currentFolder?._id),
      {
        onSuccess: async () => {
          triggerAddFolder({
            staffId: selectedStaffId,
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
      }
    );

  const { mutate: triggerAddFolder, isLoading: isAddFolderLoading } =
    useMutation(async (folder: any) => addFolder(folder), {
      onSuccess: async () => {
        setIsAdminPasswordModal(false);
        setIsChangeFolderModalOpen(false);
        refetchFolderData();
        refetchStaffData();
        MySwal.fire({
          title: "Folder of the day has been updated!",
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
    if (loggedInUserType !== "Admin") {
      MySwal.fire({
        title: "Ooops!",
        text: "Only the Admin can make an action for this",
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

  const tableHeader = useMemo(
    () => [
      { header: "Staff Name", dataName: "name" },
      { header: "Folder Status", dataName: "status" },
      { header: "Action", dataName: "endActions" },
    ],
    []
  );

  const tableEndActions = useMemo(() => ["Set as Folder"], []);

  const _remappedData = useCallback(
    (data: any) => {
      const newData = data.map((res: any) => {
        const mainData = tableHeader.map((res2: any) => {
          let value;
          const isCurrentFolder = res._id === currentFolder?.staffId?._id;
          if (res2.dataName === "endActions") {
            value = tableEndActions.map((res3: any) => {
              if (res3 === "Set as Folder") {
                return _constructTableActions(
                  res3,
                  () => _openChangeFolderModal(res._id, res.name),
                  true,
                  isCurrentFolder
                );
              }
            });
          } else if (res2.dataName === "status") {
            value = isCurrentFolder ? "Folder of the Day" : "---";
          } else {
            value = res[res2.dataName] ? res[res2.dataName] : "";
          }
          return value;
        });
        const obj: any = {};
        tableHeader.forEach((element: T_Header, index: number) => {
          obj[element.dataName] = mainData[index];
        });

        return obj;
      });

      return newData;
    },
    [currentFolder, tableEndActions, tableHeader]
  );

  const renderContent = () => {
    return isChangePassword ? (
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
    ) : (
      <DataTable
        header={tableHeader}
        isLoading={isStaffDataLoading || isoFolderDataLoading}
        data={staff}
      />
    );
  };

  useEffect(() => {
    if (folderData && folderData.length > 0) {
      setCurrentFolder(folderData[0]);
    }
  }, [folderData]);

  useEffect(() => {
    if (staffData && staffData.length > 0) {
      setStaff(_remappedData(staffData));
    }
  }, [staffData, _remappedData]);

  const _openChangeFolderModal = (staffId: string, staffName: string) => {
    setSelectedStaffId(staffId);
    setSelectedStaffName(staffName);
    setIsChangeFolderModalOpen(true);
  };

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10 mb-3">
        Admin Profile
      </h1>
      <div className="flex justify-center mb-10">
        <button
          className={`w-[90px] ${
            isChangePassword
              ? "bg-primary text-white hover:bg-primary-dark"
              : "bg-light text-primary hover:bg-accent border-2 border-primary"
          }`}
          onClick={() => setIsChangePassword(!isChangePassword)}
        >
          Password
        </button>
        <button
          className={`w-[90px] ${
            !isChangePassword
              ? "bg-primary text-white hover:bg-primary-dark"
              : "bg-light text-primary hover:bg-accent border-2 border-primary"
          }`}
          onClick={() => setIsChangePassword(!isChangePassword)}
        >
          Folder
        </button>
      </div>
      {renderContent()}
      <Modal
        state={isChangeFolderModalOpen}
        toggle={() => setIsChangeFolderModalOpen(!isChangeFolderModalOpen)}
        title={<h3>Change Folder</h3>}
        content={
          <h5>{`Are you sure you want to change the folder of the day to ${selectedStaffName}?`}</h5>
        }
        footer={
          <>
            <button
              className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-3"
              onClick={() => setIsAdminPasswordModal(!isAdminPasswordModalOpen)}
            >
              Yes
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              onClick={() =>
                setIsChangeFolderModalOpen(!isChangeFolderModalOpen)
              }
            >
              No
            </button>
          </>
        }
        size="sm"
      />
      <Modal
        state={isAdminPasswordModalOpen}
        toggle={() => {
          setIsAdminPasswordModal(!isAdminPasswordModalOpen);
          setAdminPassword("");
        }}
        title={<h3>Enter Password</h3>}
        content={
          <input
            className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
            id="grid-first-name"
            type="password"
            autoComplete="off"
            onChange={(e: any) => setAdminPassword(e.target.value)}
            value={adminPassword}
            disabled={
              isVerifyPasswordLoading ||
              isUpdateFolderLoading ||
              isAddFolderLoading
            }
          />
        }
        clickOutsideClose={!isVerifyPasswordLoading}
        footer={
          <>
            <button
              className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-3"
              onClick={() =>
                triggerVerifyPassword({
                  username: loggedInUserUsername,
                  password: adminPassword,
                })
              }
              disabled={
                isVerifyPasswordLoading ||
                isUpdateFolderLoading ||
                isAddFolderLoading
              }
            >
              Confirm
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              onClick={() => {
                setIsAdminPasswordModal(!isAdminPasswordModalOpen);
                setAdminPassword("");
              }}
              disabled={
                isVerifyPasswordLoading ||
                isUpdateFolderLoading ||
                isAddFolderLoading
              }
            >
              Cancel
            </button>
          </>
        }
        size="sm"
      />
    </>
  );
};

const mapStateToProps = (global: any) => ({
  loggedInUserUsername: global.authenticatedUser.user.username,
  loggedInUserId: global.authenticatedUser.user.id,
  loggedInUserType: global.authenticatedUser.user.type,
});

export default connect(mapStateToProps)(AdminSettings);
