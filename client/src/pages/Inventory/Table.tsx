import { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  getAllInventory,
  deleteInventory,
  updateInventory,
} from "../../utils/inventory";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import DataTable from "../../components/Table";
import _constructTableActions from "../../utils/constructTableActions";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { verifyPassword } from "../../utils/user";
import numberWithCommas from "../../utils/numberWithCommas";

type T_Header = {
  header: string;
  dataName: string;
};

const Table = (props: any) => {
  const { loggedInUserType, loggedInUserUsername } = props;
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [inventory, setInventory] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModal] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [stock, setStock] = useState(0);
  const [selectedInventoryId, setSelectedInventoryId] = useState("");
  const [selectedInventoryName, setSelectedInventoryName] = useState("");
  const [selectedInventoryStock, setSelectedInventoryStock] = useState(0);
  const {
    data: inventoryData,
    isLoading: isInventoryDataLoading,
    refetch: refetchInventoryData,
  } = useQuery("inventory", () => getAllInventory());

  const {
    mutate: triggerDeleteInventory,
    isLoading: isDeleteInventoryLoading,
  } = useMutation(async (inventory: any) => deleteInventory(inventory), {
    onSuccess: async () => {
      setIsAdminPasswordModal(false);
      refetchInventoryData();
      setAdminPassword("");
      MySwal.fire({
        title: "Inventory deleted!",
        text: "Inventory data will not be retrieved",
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

  const {
    mutate: triggerAddInventoryStock,
    isLoading: isAddInventoryStockLoading,
  } = useMutation(
    async (inventory: any) => updateInventory(inventory, selectedInventoryId),
    {
      onSuccess: async () => {
        setIsAdminPasswordModal(false);
        refetchInventoryData();
        setAdminPassword("");
        MySwal.fire({
          title: "Inventory stock updated!",
          text: "Inventory stock changes value",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        }).then(() => {
          setIsAddStockModalOpen(false);
          setStock(0);
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

  const { mutate: triggerVerifyPassword, isLoading: isVerifyPasswordLoading } =
    useMutation(async (password: any) => verifyPassword(password), {
      onSuccess: async () => {
        triggerDeleteInventory(selectedInventoryId);
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
      if (inventoryData && inventoryData.length > 0) {
        setInventory(_remappedData(inventoryData));
      }
    } else {
      if (inventoryData && inventoryData.length > 0) {
        const filteredInventoryData = inventoryData.filter((res: any) =>
          res.name.toLowerCase().includes(searchPhrase.toLowerCase())
        );
        setInventory(_remappedData(filteredInventoryData));
      }
    }
  }, [searchPhrase, inventoryData]);

  useEffect(() => {
    if (inventoryData && inventoryData.length > 0) {
      setInventory(_remappedData(inventoryData));
    }
  }, [inventoryData]);

  const _triggerAddInventoryStock = () => {
    const total = selectedInventoryStock + stock;
    if (total < 0 && loggedInUserType === "Admin") {
      MySwal.fire({
        title: "Ooopssssss!",
        text: "Insuficient stocks",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#274c77",
      });
    } else if (stock < 0 && loggedInUserType === "Staff") {
      MySwal.fire({
        title: "Ooopssssss!",
        text: "Only Admin can deduct stocks",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#274c77",
      });
    } else if (!Number.isInteger(total)) {
      MySwal.fire({
        title: "Ooopssssss!",
        text: "Stock value needs to be a whole number",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#274c77",
      });
    } else {
      triggerAddInventoryStock({ stock: total });
    }
  };

  const _addInventoryStock = (id: string, name: string, stock: number) => {
    setIsAddStockModalOpen(true);
    setSelectedInventoryId(id);
    setSelectedInventoryName(name);
    setSelectedInventoryStock(stock);
  };

  const _deleteItem = (id: string, name: string) => {
    setIsDeleteModalOpen(true);
    setSelectedInventoryId(id);
    setSelectedInventoryName(name);
  };

  const _openAdminPassword = () => {
    setIsDeleteModalOpen(false);
    setIsAdminPasswordModal(true);
  };

  const tableHeader = [
    { header: "Item Type", dataName: "type" },
    { header: "Stock Code", dataName: "stockCode" },
    { header: "Item Name", dataName: "name" },
    { header: "Price", dataName: "unitCost" },
    { header: "Front Stock", dataName: "stock" },
    { header: "Action", dataName: "endActions" },
  ];

  const tableEndActions = ["Add Stock", "Edit", "Delete"];

  const _remappedData = (data: any) => {
    const newData = data.map((res: any) => {
      const mainData = tableHeader.map((res2: any) => {
        let value;
        if (res2.dataName === "endActions") {
          value = tableEndActions.map((res3: any) => {
            if (res3 === "Add Stock") {
              return _constructTableActions(
                res3,
                () => _addInventoryStock(res._id, res.name, res.stock),
                loggedInUserType === "Staff"
              );
            } else if (res3 === "Edit" && loggedInUserType === "Admin") {
              return _constructTableActions(
                res3,
                () => navigate(`/inventory/edit/${res._id}`),
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
        } else if (res2.dataName === "unitCost") {
          value = res[res2.dataName]
            ? `₱${numberWithCommas(res[res2.dataName])}`
            : res[res2.dataName] === 0
            ? `₱0.00`
            : "";
        } else if (res2.dataName === "stock") {
          value = res[res2.dataName]
            ? res[res2.dataName]
            : res[res2.dataName] === 0
            ? 0
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
      <DataTable
        header={tableHeader}
        isLoading={isInventoryDataLoading}
        data={inventory}
      />
      <Modal
        state={isDeleteModalOpen}
        toggle={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        title={<h3>Delete Inventory</h3>}
        content={
          <h5>{`Are you sure you want to delete ${selectedInventoryName}?`}</h5>
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
            disabled={isVerifyPasswordLoading || isDeleteInventoryLoading}
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
              disabled={isVerifyPasswordLoading || isDeleteInventoryLoading}
            >
              Confirm
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              onClick={() => {
                setIsAdminPasswordModal(!isAdminPasswordModalOpen);
                setAdminPassword("");
              }}
              disabled={isVerifyPasswordLoading || isDeleteInventoryLoading}
            >
              Cancel
            </button>
          </>
        }
        size="sm"
      />
      <Modal
        state={isAddStockModalOpen}
        toggle={() => setIsAddStockModalOpen(!isAddStockModalOpen)}
        title={<h3>Add Stock</h3>}
        content={
          <>
            <h5>{selectedInventoryName}</h5>
            <h5>Front Stock: {selectedInventoryStock}</h5>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent mt-5"
              id="grid-first-name"
              type="number"
              autoComplete="off"
              onChange={(e: any) => setStock(parseFloat(e.target.value))}
              value={stock === 0 ? "" : stock}
              disabled={isAddInventoryStockLoading}
            />
          </>
        }
        clickOutsideClose={!isAddInventoryStockLoading}
        footer={
          <>
            <button
              className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-3"
              onClick={() => _triggerAddInventoryStock()}
              disabled={isAddInventoryStockLoading}
            >
              Save
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              onClick={() => setIsAddStockModalOpen(!isAddStockModalOpen)}
              disabled={isAddInventoryStockLoading}
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
