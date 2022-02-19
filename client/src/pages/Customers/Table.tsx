import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getAllCustomer } from "../../utils/customer";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Table = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const { data: customerData, isLoading: isCustomerDataLoading } = useQuery(
    "customers",
    () => getAllCustomer()
  );

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
  }, [searchPhrase]);

  useEffect(() => {
    if (customerData && customerData.length > 0) {
      setCustomers(customerData);
    }
  }, [customerData]);

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
                    customers.map((res: any) => {
                      const dateString = res.bdMonth
                        ? moment(
                            `${res.bdMonth}/${res.bdDay}/${res.bdYear}`
                          ).format("MMM D, YYYY")
                        : "--- --- ---";
                      return (
                        <>
                          <tr className="border-b border-accent">
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
                              {" | "}
                              <span className="hover:cursor-pointer text-primary hover:underline font-bold">
                                New DIY
                              </span>
                              {" | "}
                              <span className="hover:cursor-pointer text-primary hover:underline font-bold">
                                New DO
                              </span>
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
    </>
  );
};

export default Table;
