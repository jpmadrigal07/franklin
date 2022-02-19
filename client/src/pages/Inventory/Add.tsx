import { useState } from "react";
import { useMutation } from "react-query";
import { addInventory } from "../../utils/inventory";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [stockCode, setStockCode] = useState("");
  const [name, setName] = useState("");
  const [stock, setStock] = useState(0);
  const [unitCost, setUnitCost] = useState(0);

  const { mutate: triggerAddInventory, isLoading: isAddInventoryLoading } =
    useMutation(async (inventory: any) => addInventory(inventory), {
      onSuccess: async () => {
        MySwal.fire({
          title: "Stock created!",
          text: "You will be redirected",
          icon: "success",
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          navigate("/inventory");
        });
      },
      onError: async (err: any) => {
        MySwal.fire({
          title: "Ooops!",
          text: err,
          icon: "warning",
          confirmButtonText: "Okay",
          confirmButtonColor: "#274c77",
        });
      },
    });

  const _addInventory = () => {
    triggerAddInventory({
      type,
      stockCode,
      name,
      stock,
      unitCost,
    });
  };

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10 mb-10">
        Add Customer
      </h1>
      <form className="w-full">
        <div className="flex flex-row">
          <div className="basis-1/2 mr-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Item Type
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setType(e.target.value)}
              disabled={isAddInventoryLoading}
            />
          </div>
          <div className="basis-1/2 ml-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Stock Code
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setStockCode(e.target.value)}
              disabled={isAddInventoryLoading}
            />
          </div>
        </div>
        <div className="mt-5">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Item Name
          </label>
          <input
            className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
            id="grid-first-name"
            type="text"
            onChange={(e: any) => setName(e.target.value)}
            disabled={isAddInventoryLoading}
          />
        </div>
        <div className="flex flex-row mt-5">
          <div className="basis-1/2 mr-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Stock
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
              id="grid-first-name"
              type="number"
              autoComplete="off"
              onChange={(e: any) => setStock(e.target.value)}
              disabled={isAddInventoryLoading}
            />
          </div>
          <div className="basis-1/2 ml-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Price
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
              id="grid-first-name"
              type="number"
              autoComplete="off"
              onChange={(e: any) => setUnitCost(e.target.value)}
              disabled={isAddInventoryLoading}
            />
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-4"
            type="button"
            onClick={() => _addInventory()}
            disabled={isAddInventoryLoading}
          >
            Save
          </button>
          <button
            className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
            type="button"
            disabled={isAddInventoryLoading}
            onClick={() => navigate("/inventory")}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default Add;
