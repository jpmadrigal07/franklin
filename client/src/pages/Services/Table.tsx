import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import DataTable from "../../components/Table";
import _constructTableActions from "../../utils/constructTableActions";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { verifyPassword } from "../../utils/user";
import { deleteWash, getAllWash } from "../../utils/wash";
import { deleteDry, getAllDry } from "../../utils/dry";
import { deleteAddOn, getAllAddOn } from "../../utils/addOn";
import { deleteDiscount, getAllDiscount } from "../../utils/discount";
import { deleteLaundry, getAllLaundry } from "../../utils/laundry";
import numberWithCommas from "../../utils/numberWithCommas";

type T_Header = {
  header: string;
  dataName: string;
};

const Table = (props: any) => {
  const { loggedInUserType, loggedInUserUsername } = props;
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [wash, setWash] = useState([]);
  const [dry, setDry] = useState([]);
  const [addOn, setAddOn] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [laundry, setLaundry] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [selectedServicesId, setSelectedServicesId] = useState("");
  const [selectedServicesName, setSelectedServicesName] = useState("");
  const [selectedServicesCategory, setSelectedServicesCategory] = useState("");

  const {
    data: washData,
    isLoading: isWashDataLoading,
    refetch: refetchWashData,
  } = useQuery("wash", () => getAllWash());

  const {
    data: dryData,
    isLoading: isDryDataLoading,
    refetch: refetchDryData,
  } = useQuery("dry", () => getAllDry());

  const {
    data: addOnData,
    isLoading: isAddOnDataLoading,
    refetch: refetchAddOnData,
  } = useQuery("addOn", () => getAllAddOn());

  const {
    data: discountsData,
    isLoading: isDiscountsDataLoading,
    refetch: refetchDiscountsData,
  } = useQuery("discount", () => getAllDiscount());

  const { data: laundryData, isLoading: isLaundryDataLoading } = useQuery(
    "laundry",
    () => getAllLaundry()
  );

  const deleteData = (id: string) => {
    if (selectedServicesCategory === "wash") {
      return deleteWash(id);
    } else if (selectedServicesCategory === "dry") {
      return deleteDry(id);
    } else if (selectedServicesCategory === "") {
      return deleteAddOn(id);
    } else if (selectedServicesCategory === "discount") {
      return deleteDiscount(id);
    }
  };

  const activeCategoryText = () => {
    if (selectedServicesCategory === "wash") {
      return "Wash";
    } else if (selectedServicesCategory === "dry") {
      return "Dry";
    } else if (selectedServicesCategory === "") {
      return "Service";
    } else if (selectedServicesCategory === "discount") {
      return "Discount";
    }
  };

  const { mutate: triggerDeleteServices, isLoading: isDeleteServicesLoading } =
    useMutation(async (services: any) => deleteData(services), {
      onSuccess: async () => {
        setIsAdminPasswordModal(false);
        if (selectedServicesCategory === "wash") {
          refetchWashData();
        } else if (selectedServicesCategory === "dry") {
          refetchDryData();
        } else if (selectedServicesCategory === "") {
          refetchAddOnData();
        } else if (selectedServicesCategory === "discount") {
          refetchDiscountsData();
        }
        setAdminPassword("");
        MySwal.fire({
          title: "Services deleted!",
          text: "Services data will not be retrieved",
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
        triggerDeleteServices(selectedServicesId);
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
    if (washData && washData.length > 0) {
      setWash(_remappedData(washData, "wash"));
    }
  }, [washData]);

  useEffect(() => {
    if (dryData && dryData.length > 0) {
      setDry(_remappedData(dryData, "dry"));
    }
  }, [dryData]);

  useEffect(() => {
    if (addOnData && addOnData.length > 0) {
      setAddOn(_remappedData(addOnData, ""));
    }
  }, [addOnData]);

  useEffect(() => {
    if (discountsData && discountsData.length > 0) {
      setDiscounts(_remappedData(discountsData, "discount"));
    }
  }, [discountsData]);

  useEffect(() => {
    if (laundryData && laundryData.length > 0) {
      setLaundry(_remappedData(laundryData, "dropofffee"));
    }
  }, [laundryData]);

  const _deleteItem = (id: string, name: string, category: string) => {
    setIsDeleteModalOpen(true);
    setSelectedServicesId(id);
    setSelectedServicesName(name);
    setSelectedServicesCategory(category);
  };

  const _openAdminPassword = () => {
    setIsDeleteModalOpen(false);
    setIsAdminPasswordModal(true);
  };

  const tableHeader = [
    { header: "Type", dataName: "type" },
    { header: "Price", dataName: "price" },
    { header: "Action", dataName: "endActions" },
  ];

  const tableEndActions = ["Edit", "Delete"];

  const _remappedData = (data: any, category: string) => {
    const newData = data.map((res: any) => {
      const mainData = tableHeader.map((res2: any) => {
        let value;
        if (res2.dataName === "endActions") {
          const actions = tableEndActions.map((res3: any) => {
            if (res3 === "Edit" && loggedInUserType === "Admin") {
              const editCategory = category !== "" ? `${category}/` : "";
              return _constructTableActions(
                res3,
                () => navigate(`/services/edit/${editCategory}${res._id}`),
                category === "dropofffee"
              );
            } else if (
              res3 === "Delete" &&
              loggedInUserType === "Admin" &&
              category !== "dropofffee"
            ) {
              return _constructTableActions(
                res3,
                () => _deleteItem(res._id, res.type, category),
                true
              );
            }
          });
          const filteredActions = actions.filter((res3: any) => res3);
          value =
            filteredActions && filteredActions.length > 0
              ? filteredActions
              : null;
        } else if (res2.dataName === "price") {
          value = res[res2.dataName]
            ? `₱${numberWithCommas(res[res2.dataName])}`
            : res[res2.dataName] === 0
            ? `₱0.00`
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
        View Services
      </h1>
      <div className="flex flex-row">
        <div className="basis-1/2 mr-7">
          <div className="flex justify-between mt-11">
            <h4 className="text-primary font-bold">Wash</h4>
            {loggedInUserType === "Admin" ? (
              <button
                className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl"
                onClick={() => navigate("/services/add/wash")}
              >
                Add New
              </button>
            ) : null}
          </div>
          <DataTable
            header={tableHeader}
            isLoading={isWashDataLoading}
            data={wash}
          />
        </div>
        <div className="basis-1/2 ml-7">
          <div className="flex justify-between mt-11">
            <h4 className="text-primary font-bold">Dry</h4>
            {loggedInUserType === "Admin" ? (
              <button
                className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl"
                onClick={() => navigate("/services/add/dry")}
              >
                Add New
              </button>
            ) : null}
          </div>
          <DataTable
            header={tableHeader}
            isLoading={isDryDataLoading}
            data={dry}
          />
        </div>
      </div>
      <div className="flex flex-row">
        <div className="basis-1/2 mr-7">
          <div className="flex justify-between mt-11">
            <h4 className="text-primary font-bold">Add-on Services</h4>
            {loggedInUserType === "Admin" ? (
              <button
                className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl"
                onClick={() => navigate("/services/add")}
              >
                Add New
              </button>
            ) : null}
          </div>
          <DataTable
            header={tableHeader}
            isLoading={isAddOnDataLoading}
            data={addOn}
          />
        </div>
        <div className="basis-1/2 ml-7">
          <div className="flex justify-between mt-11">
            <h4 className="text-primary font-bold">Discounts</h4>
            {loggedInUserType === "Admin" ? (
              <button
                className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl"
                onClick={() => navigate("/services/add/discount")}
              >
                Add New
              </button>
            ) : null}
          </div>
          <DataTable
            header={tableHeader}
            isLoading={isDiscountsDataLoading}
            data={discounts}
            customTextColor="red"
            columnWithCustomText="price"
          />
        </div>
      </div>
      <div className="flex flex-row">
        <div className="basis-1/2 mr-7">
          <div className="flex justify-between mt-11">
            <h4 className="text-primary font-bold">Drop-off Fee</h4>
          </div>
          <DataTable
            header={tableHeader}
            isLoading={isLaundryDataLoading}
            data={laundry}
            hideColumn="type"
          />
        </div>
        <div className="basis-1/2 ml-7"></div>
      </div>
      <Modal
        state={isDeleteModalOpen}
        toggle={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        title={<h3>Delete {activeCategoryText()}</h3>}
        content={
          <h5>{`Are you sure you want to delete ${selectedServicesName}?`}</h5>
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
            disabled={isVerifyPasswordLoading || isDeleteServicesLoading}
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
              disabled={isVerifyPasswordLoading || isDeleteServicesLoading}
            >
              Confirm
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              onClick={() => {
                setIsAdminPasswordModal(!isAdminPasswordModalOpen);
                setAdminPassword("");
              }}
              disabled={isVerifyPasswordLoading || isDeleteServicesLoading}
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
  loggedInUserUsername: global.authenticatedUser.user.username,
});

export default connect(mapStateToProps)(Table);
