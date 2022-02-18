import React from "react";
import { Icon } from "@iconify/react";

const Login = () => {
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
          <button className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl">
            Add New
          </button>
        </div>
        <div>
          <input
            type="text"
            className="pt-1 pb-1 pl-2 rounded-sm mr-2"
            placeholder="Search"
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
                  <tr className="border-b border-accent">
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      Mark
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      Otto
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      @mdo
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      @mdo
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      @mdo
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      @mdo
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      @mdo
                    </td>
                  </tr>
                  <tr className="bg-accent border-b border-accent">
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      Mark
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      Otto
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      @mdo
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      @mdo
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      @mdo
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      @mdo
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      @mdo
                    </td>
                  </tr>
                  <tr>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      Mark
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      Otto
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      @mdo
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      @mdo
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      @mdo
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      @mdo
                    </td>
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      @mdo
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
