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

const Table = (props: any) => {
  const { userType: loggedInUserType } = props;
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
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
        setCustomers(customerData);
      }
    } else {
      if (customerData && customerData.length > 0) {
        const filteredCustomerData = customerData.filter(
          (res: any) =>
            res.firstName.toLowerCase().includes(searchPhrase.toLowerCase()) ||
            res.lastName.toLowerCase().includes(searchPhrase.toLowerCase())
        );
        setCustomers(filteredCustomerData);
      }
    }
  }, [searchPhrase, customerData]);

  useEffect(() => {
    if (customerData && customerData.length > 0) {
      setCustomers(customerData);
    }
  }, [customerData]);

  const _openAdminPassword = () => {
    setIsDeleteModalOpen(false);
    setIsAdminPasswordModal(true);
  };

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10 mb-10">
        View Customers
      </h1>
      <p className="text-center">
        Staff users can add and edit customers but cannot delete. Staff can also
        view specific customer to see more details such as notes and past
        orders.
      </p>
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
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="border-b-2">
                  <tr>
                    <th
                      scope="col"
                      className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                    ></th>
                    <th
                      scope="col"
                      className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                    >
                      Mobile No.
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                    >
                      Landline
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                    >
                      Birthdate
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isCustomerDataLoading ? (
                    <p className="mt-3">Loading...</p>
                  ) : customerData &&
                    customerData.length > 0 &&
                    customers.length > 0 ? (
                    customers.map((res: any, index: number) => {
                      const dateString = res.bdMonth
                        ? moment(
                            `${res.bdMonth}/${res.bdDay}/${res.bdYear}`
                          ).format("MMM D, YYYY")
                        : "--- --- ---";
                      return (
                        <>
                          <tr
                            className={`border-b ${
                              index !== customers.length - 1
                                ? "border-accent"
                                : "border-light"
                            } ${index % 2 !== 0 ? "bg-accent" : ""}`}
                          >
                            <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                              <span className="hover:cursor-pointer text-primary hover:underline font-bold">
                                New DIY
                              </span>
                              {" | "}
                              <span className="hover:cursor-pointer text-primary hover:underline font-bold">
                                New DO
                              </span>
                            </td>
                            <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                              {res.firstName} {res.lastName}
                            </td>
                            <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                              {res.contactNumber}
                            </td>
                            <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                              {res.email}
                            </td>
                            <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                              {res.landline}
                            </td>
                            <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                              {res.street}
                            </td>
                            <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                              {dateString}
                            </td>
                            <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                              <span
                                onClick={() =>
                                  navigate(`/customers/${res._id}`)
                                }
                                className="hover:cursor-pointer text-primary hover:underline font-bold"
                              >
                                View
                              </span>
                              {" | "}
                              <span
                                onClick={() =>
                                  navigate(`/customers/edit/${res._id}`)
                                }
                                className="hover:cursor-pointer text-primary hover:underline font-bold"
                              >
                                Edit
                              </span>

                              {loggedInUserType === "Admin" ? (
                                <>
                                  {" | "}
                                  <span
                                    onClick={() => {
                                      setIsDeleteModalOpen(true);
                                      setSelectedCustomerId(res._id);
                                      setSelectedCustomerName(
                                        `${res.firstName} ${res.lastName}`
                                      );
                                    }}
                                    className="hover:cursor-pointer text-primary hover:underline font-bold"
                                  >
                                    Delete
                                  </span>
                                </>
                              ) : null}
                            </td>
                          </tr>
                        </>
                      );
                    })
                  ) : (
                    <p className="mt-3">No data found</p>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
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
            disabled={isVerifyPasswordLoading || isDeleteCustomerLoading}
          />
        }
        clickOutsideClose={!isVerifyPasswordLoading}
        footer={
          <>
            <button
              className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-3"
              onClick={() => triggerVerifyPassword({ password: adminPassword })}
              disabled={isVerifyPasswordLoading || isDeleteCustomerLoading}
            >
              Confirm
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              onClick={() => setIsAdminPasswordModal(!isAdminPasswordModalOpen)}
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
  userType: global.authenticatedUser.user.userType,
});

export default connect(mapStateToProps)(Table);
