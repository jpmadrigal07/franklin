import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { getAllStaff } from "../../utils/staff";

const Table = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [userName, setUsername] = useState("");

  const { data: staffData } = useQuery("viewStaff", () =>
    getAllStaff(`{"_id":"${paramId}"}`)
  );

  useEffect(() => {
    if (staffData && staffData.length > 0) {
      const { name, userId } = staffData[0];
      setName(name);
      setUsername(userId.username);
    }
  }, [staffData]);

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10">
        View Customer
      </h1>
      <h3 className="font-bold text-primary text-center mb-10">Past Actions</h3>
      <div>
        <div>
          <p className="font-bold">
            <span className="font-bold text-primary">Name:</span>
            {` ${name}`}
          </p>
        </div>
        <div>
          <p className="font-bold">
            <span className="font-bold text-primary">Username:</span>
            {` ${userName}`}
          </p>
        </div>
        <div className="flex justify-end mt-7">
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl"
            type="button"
            onClick={() => navigate("/staffs")}
          >
            Back
          </button>
        </div>
        <div className="flex flex-col mt-7">
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
                        Date
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                      >
                        JO
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                      >
                        Work
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
                        View | Delete
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
                        View | Delete
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
                        View | Delete
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
