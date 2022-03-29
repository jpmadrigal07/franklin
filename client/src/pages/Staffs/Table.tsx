import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getAllStaff, deleteStaff } from "../../utils/staff";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import DataTable from "../../components/Table";
import _constructTableActions from "../../utils/constructTableActions";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { verifyPassword } from "../../utils/user";
import moment from "moment";

type T_Header = {
  header: string;
  dataName: string;
};

const Table = (props: any) => {
  const { loggedInUserType } = props;
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [staff, setStaff] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModal] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [stock, setStock] = useState(0);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedStaffName, setSelectedStaffName] = useState("");
  const [selectedStaffStock, setSelectedStaffStock] = useState(0);
  const {
    data: staffData,
    isLoading: isStaffDataLoading,
    refetch: refetchStaffData,
  } = useQuery("staffs", () => getAllStaff());

  const { mutate: triggerDeleteStaff, isLoading: isDeleteStaffLoading } =
    useMutation(async (staff: any) => deleteStaff(staff), {
      onSuccess: async () => {
        setIsAdminPasswordModal(false);
        refetchStaffData();
        setAdminPassword("");
        MySwal.fire({
          title: "Staff deleted!",
          text: "Staff data will not be retrieved",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
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
        triggerDeleteStaff(selectedStaffId);
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

  useEffect(() => {
    if (searchPhrase === "") {
      if (staffData && staffData.length > 0) {
        setStaff(_remappedData(staffData));
      }
    } else {
      if (staffData && staffData.length > 0) {
        const filteredStaffData = staffData.filter((res: any) =>
          res.name.toLowerCase().includes(searchPhrase.toLowerCase())
        );
        setStaff(_remappedData(filteredStaffData));
      }
    }
  }, [searchPhrase, staffData]);

  useEffect(() => {
    if (staffData && staffData.length > 0) {
      setStaff(_remappedData(staffData));
    }
  }, [staffData]);

  const _addStaffStock = (id: string, name: string, stock: number) => {
    setIsAddStockModalOpen(true);
    setSelectedStaffId(id);
    setSelectedStaffName(name);
    setSelectedStaffStock(stock);
  };

  const _deleteItem = (id: string, name: string) => {
    setIsDeleteModalOpen(true);
    setSelectedStaffId(id);
    setSelectedStaffName(name);
  };

  const _openAdminPassword = () => {
    setIsDeleteModalOpen(false);
    setIsAdminPasswordModal(true);
  };

  const tableHeader = [
    { header: "Staff Name", dataName: "name" },
    { header: "Last Logged In", dataName: "lastLoggedIn" },
    { header: "Last Logged Out", dataName: "lastLoggedOut" },
    { header: "Action", dataName: "endActions" },
  ];

  const tableEndActions = ["View", "Edit", "Delete"];

  const _remappedData = (data: any) => {
    const newData = data.map((res: any) => {
      const mainData = tableHeader.map((res2: any) => {
        let value;
        if (res2.dataName === "endActions") {
          value = tableEndActions.map((res3: any) => {
            if (res3 === "View") {
              return _constructTableActions(
                res3,
                () => _addStaffStock(res._id, res.name, res.stock),
                false
              );
            } else if (res3 === "Edit" && loggedInUserType === "Admin") {
              return _constructTableActions(
                res3,
                () => navigate(`/staffs/edit/${res._id}`),
                false
              );
            } else if (res3 === "Delete" && loggedInUserType === "Admin") {
              return _constructTableActions(
                res3,
                () => _deleteItem(res._id, res.name),
                true
              );
            }
          });
        } else if (
          res2.dataName === "lastLoggedIn" ||
          res2.dataName === "lastLoggedOut"
        ) {
          value = res[res2.dataName]
            ? moment(res[res2.dataName]).format("DD/MM/YYYY h:mm A")
            : "";
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
  };

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10 mb-10">
        View Staff
      </h1>
      <div className="flex justify-between mt-11">
        <div>
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl"
            onClick={() => navigate("/staffs/add")}
          >
            Add New
          </button>
        </div>
        <div>
          <input
            type="text"
            className="pt-1 pb-1 pl-2 rounded-sm mr-2"
            placeholder="Search"
            onChange={(e: any) => setSearchPhrase(e.target.value)}
          />
          <Icon icon="bi:search" className="inline" height={24} />
        </div>
      </div>
      <DataTable
        header={tableHeader}
        isLoading={isStaffDataLoading}
        data={staff}
      />
      <Modal
        state={isDeleteModalOpen}
        toggle={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        title={<h3>Delete Staff</h3>}
        content={
          <h5>{`Are you sure you want to delete ${selectedStaffName}?`}</h5>
        }
        footer={
          <>
            <button
              className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-3"
              onClick={() => _openAdminPassword()}
            >
              Yes
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              onClick={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
            >
              No
            </button>
          </>
        }
        size="sm"
      />
      <Modal
        state={isAdminPasswordModalOpen}
        toggle={() => setIsAdminPasswordModal(!isAdminPasswordModalOpen)}
        title={<h3>Enter Password</h3>}
        content={
          <input
            className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
            id="grid-first-name"
            type="password"
            autoComplete="off"
            onChange={(e: any) => setAdminPassword(e.target.value)}
            value={adminPassword}
            disabled={isVerifyPasswordLoading || isDeleteStaffLoading}
          />
        }
        clickOutsideClose={!isVerifyPasswordLoading}
        footer={
          <>
            <button
              className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-3"
              onClick={() => triggerVerifyPassword({ password: adminPassword })}
              disabled={isVerifyPasswordLoading || isDeleteStaffLoading}
            >
              Confirm
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              onClick={() => {
                setIsAdminPasswordModal(!isAdminPasswordModalOpen);
                setAdminPassword("");
              }}
              disabled={isVerifyPasswordLoading || isDeleteStaffLoading}
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
  loggedInUserType: global.authenticatedUser.user.type,
});

export default connect(mapStateToProps)(Table);
