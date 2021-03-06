import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useMutation, useQuery } from "react-query";
import { getAllCustomer, deleteCustomer } from "../../utils/customer";
import { verifyPassword } from "../../utils/user";
import Modal from "../../components/Modal";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DataTable from "../../components/Table";
import _constructTableActions from "../../utils/constructTableActions";

type T_Header = {
  header: string;
  dataName: string;
};

const Table = (props: any) => {
  const { loggedInUserType, loggedInUserUsername } = props;
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [sortedData, setSortedData] = useState<any>({});
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedCustomerName, setSelectedCustomerName] = useState("");

  const {
    data: customerData,
    isLoading: isCustomerDataLoading,
    refetch: refetchCustomerData,
  } = useQuery("customers", () => getAllCustomer());

  const { mutate: triggerDeleteCustomer, isLoading: isDeleteCustomerLoading } =
    useMutation(async (customer: any) => deleteCustomer(customer), {
      onSuccess: async () => {
        setIsAdminPasswordModal(false);
        refetchCustomerData();
        setAdminPassword("");
        MySwal.fire({
          title: "Customer deleted!",
          text: "Customer data will not be retrieved",
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
        triggerDeleteCustomer(selectedCustomerId);
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
      if (customerData && customerData.length > 0) {
        setCustomers(_remappedData(customerData));
      }
    } else {
      if (customerData && customerData.length > 0) {
        const filteredCustomerData = customerData.filter(
          (res: any) =>
            res.firstName.toLowerCase().includes(searchPhrase.toLowerCase()) ||
            res.lastName.toLowerCase().includes(searchPhrase.toLowerCase()) ||
            res.contactNumber.toLowerCase().includes(searchPhrase.toLowerCase())
        );
        setCustomers(_remappedData(filteredCustomerData));
      }
    }
  }, [searchPhrase, customerData]);

  const _openAdminPassword = () => {
    setIsDeleteModalOpen(false);
    setIsAdminPasswordModal(true);
  };

  useEffect(() => {
    if (customerData && customerData.length > 0) {
      let customerDataSorted = customerData;
      if (sortedData?.data && sortedData?.data === "name") {
        customerDataSorted = customerDataSorted?.sort((a: any, b: any) => {
          return sortedData?.sort === "up"
            ? a.lastName.localeCompare(b.lastName)
            : b.lastName.localeCompare(a.lastName);
        });
      }
      if (sortedData?.data && sortedData?.data === "contactNumber") {
        customerDataSorted = customerDataSorted?.sort((a: any, b: any) => {
          return sortedData?.sort === "up"
            ? a.contactNumber.localeCompare(b.contactNumber)
            : b.contactNumber.localeCompare(a.contactNumber);
        });
      }
      if (sortedData?.data && sortedData?.data === "email") {
        customerDataSorted = customerDataSorted?.sort((a: any, b: any) => {
          const firstEmail = a.email ? a.email : "";
          const secondEmail = b.email ? b.email : "";
          return sortedData?.sort === "up"
            ? firstEmail.localeCompare(secondEmail)
            : secondEmail.localeCompare(firstEmail);
        });
      }
      if (sortedData?.data && sortedData?.data === "landline") {
        customerDataSorted = customerDataSorted?.sort((a: any, b: any) => {
          const firstLandline = a.landline ? a.landline : "";
          const secondLandline = b.landline ? b.landline : "";
          return sortedData?.sort === "up"
            ? firstLandline.localeCompare(secondLandline)
            : secondLandline.localeCompare(firstLandline);
        });
      }
      if (sortedData?.data && sortedData?.data === "street") {
        customerDataSorted = customerDataSorted?.sort((a: any, b: any) => {
          const firstStreet = a.street ? a.street : "";
          const secondStreet = b.street ? b.street : "";
          return sortedData?.sort === "up"
            ? firstStreet.localeCompare(secondStreet)
            : secondStreet.localeCompare(firstStreet);
        });
      }
      if (sortedData?.data && sortedData?.data === "birthDate") {
        customerDataSorted = customerDataSorted?.sort((a: any, b: any) => {
          let sort = a;
          if (b.bdYear) {
            sort =
              sortedData?.sort === "up"
                ? a.bdYear.localeCompare(b.bdYear)
                : b.bdYear.localeCompare(a.bdYear);
          } else {
            sort =
              sortedData?.sort === "up"
                ? a.bdMonth.localeCompare(b.bdMonth)
                : b.bdMonth.localeCompare(a.bdMonth);
          }
          return sort;
        });
      }
      setCustomers(_remappedData(customerDataSorted));
    }
  }, [customerData, sortedData]);

  const tableHeader = [
    { header: "", dataName: "frontActions" },
    { header: "Name", dataName: "name" },
    { header: "Mobile No.", dataName: "contactNumber" },
    { header: "Email", dataName: "email" },
    { header: "Landline", dataName: "landline" },
    { header: "Address", dataName: "street" },
    { header: "Birthdate", dataName: "birthDate" },
    { header: "Action", dataName: "endActions" },
  ];

  const tableFrontActions = ["New DIY", "New DO"];

  const tableEndActions = ["View", "Edit", "Delete"];

  const _deleteItem = (id: string, name: string) => {
    setIsDeleteModalOpen(true);
    setSelectedCustomerId(id);
    setSelectedCustomerName(name);
  };

  const _remappedData = (data: any) => {
    const newData = data.map((res: any) => {
      const mainData = tableHeader.map((res2: any) => {
        let value;
        if (res2.dataName === "name") {
          value = `${res.lastName} ${res.firstName}${res.notes ? "*" : ""}`;
        } else if (res2.dataName === "birthDate") {
          value = moment(
            `${res.bdMonth}/${res.bdDay}/${res.bdYear ? res.bdYear : "1970"}`
          ).format(`${res.bdYear ? "MMM D, YYYY" : "MMM D"}`);
        } else if (res2.dataName === "frontActions") {
          value = tableFrontActions.map((res3: any) => {
            if (res3 === "New DIY") {
              return _constructTableActions(
                res3,
                () => navigate(`/orders/diy/add?customerId=${res._id}`),
                false
              );
            } else if (res3 === "New DO") {
              return _constructTableActions(
                res3,
                () => navigate(`/orders/dropoff/add?customerId=${res._id}`),
                true
              );
            }
          });
        } else if (res2.dataName === "endActions") {
          value = tableEndActions.map((res3: any) => {
            if (res3 === "View") {
              return _constructTableActions(
                res3,
                () => navigate(`/customers/${res._id}`),
                false
              );
            } else if (res3 === "Edit") {
              return _constructTableActions(
                res3,
                () => navigate(`/customers/edit/${res._id}`),
                loggedInUserType === "Staff"
              );
            } else if (res3 === "Delete" && loggedInUserType === "Admin") {
              return _constructTableActions(
                res3,
                () => _deleteItem(res._id, `${res.firstName} ${res.lastName}`),
                true
              );
            }
          });
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
        View Customers
      </h1>
      <div className="flex justify-between mt-11">
        <div>
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl"
            onClick={() => navigate("/customers/add")}
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
        isLoading={isCustomerDataLoading}
        data={customers}
        columnSort={(e: any) =>
          setSortedData({
            sort: sortedData?.sort === "up" ? "down" : "up",
            data: e,
          })
        }
        columnSortIcon={sortedData}
      />
      <Modal
        state={isDeleteModalOpen}
        toggle={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        title={<h3>Delete Customer</h3>}
        content={
          <h5>{`Are you sure you want to delete ${selectedCustomerName}?`}</h5>
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
            disabled={isVerifyPasswordLoading || isDeleteCustomerLoading}
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
              disabled={isVerifyPasswordLoading || isDeleteCustomerLoading}
            >
              Confirm
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              onClick={() => {
                setIsAdminPasswordModal(!isAdminPasswordModalOpen);
                setAdminPassword("");
              }}
              disabled={isVerifyPasswordLoading || isDeleteCustomerLoading}
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
