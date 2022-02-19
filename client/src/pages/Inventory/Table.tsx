import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getAllInventory } from "../../utils/inventory";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const Table = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const { data: inventoryData, isLoading: isInventoryDataLoading } = useQuery(
    "inventories",
    () => getAllInventory()
  );

  useEffect(() => {
    if (searchPhrase === "") {
      if (inventoryData && inventoryData.length > 0) {
        setInventory(inventoryData);
      }
    } else {
      if (inventoryData && inventoryData.length > 0) {
        const filteredInventoryData = inventoryData.filter((res: any) =>
          res.name.toLowerCase().includes(searchPhrase.toLowerCase())
        );
        setInventory(filteredInventoryData);
      }
    }
  }, [searchPhrase, inventoryData]);

  useEffect(() => {
    if (inventoryData && inventoryData.length > 0) {
      setInventory(inventoryData);
    }
  }, [inventoryData]);

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10 mb-10">
        View Inventory
      </h1>
      <div className="flex justify-between mt-11">
        <div>
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl"
            onClick={() => navigate("/inventory/add")}
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
                      Item Type
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                    >
                      Stock Code
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                    >
                      Item Name
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                    >
                      Front Stock
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isInventoryDataLoading ? (
                    <p className="mt-3">Loading...</p>
                  ) : inventoryData &&
                    inventoryData.length > 0 &&
                    inventory.length > 0 ? (
                    inventory.map((res: any) => {
                      return (
                        <>
                          <tr className="border-b border-accent">
                            <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                              {res.type}
                            </td>
                            <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                              {res.stockCode}
                            </td>
                            <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                              {res.name}
                            </td>
                            <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                              ₱{res.unitCost}
                            </td>
                            <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                              {res.stock} pcs
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
