import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useParams } from "react-router-dom";
import { updateInventory, getAllInventory } from "../../utils/inventory";
import Asterisk from "../../components/Asterisk";
import validate from "../../validation/inventory";
import getErrorsFromValidation from "../../utils/getErrorsFromValidation";
import findInputError from "../../utils/findInputError";
import clean from "../../utils/cleanObject";

const Update = (props: any) => {
  const { loggedInUserType } = props;
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: paramId } = useParams();
  const [type, setType] = useState("");
  const [stockCode, setStockCode] = useState("");
  const [name, setName] = useState("");
  const [stock, setStock] = useState<number | undefined>();
  const [unitCost, setUnitCost] = useState<number | undefined>();

  const [formErrors, setFormErrors] = useState<any[]>([]);

  const { data: inventoryData, isLoading: isInventoryDataLoading } = useQuery(
    "editInventory",
    () => getAllInventory(`{"_id":"${paramId}"}`)
  );

  const {
    mutate: triggerUpdateInventory,
    isLoading: isUpdateInventoryLoading,
  } = useMutation(
    async (inventory: any) => updateInventory(inventory, paramId),
    {
      onSuccess: async () => {
        MySwal.fire({
          title: "Stock updated!",
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
    }
  );

  useEffect(() => {
    if (inventoryData && inventoryData.length > 0) {
      const { type, stockCode, name, stock, unitCost } = inventoryData[0];
      setType(type);
      setStockCode(stockCode);
      setName(name);
      setStock(stock);
      setUnitCost(unitCost);
    }
  }, [inventoryData]);

  const _updateInventory = () => {
    if (loggedInUserType === "Admin") {
      const values = {
        type,
        stockCode,
        name,
        stock,
        unitCost,
      };
      const filteredValues = clean(values);
      const validatedData: any = validate(filteredValues);

      if (!validatedData) {
        triggerUpdateInventory(filteredValues);
      } else {
        // if the error is 0 stock, let the admin update
        if (
          validatedData &&
          validatedData.length === 1 &&
          validatedData[0].instancePath === "/stock"
        ) {
          triggerUpdateInventory(filteredValues);
        } else {
          setFormErrors(getErrorsFromValidation(validatedData));
        }
      }
    } else {
      MySwal.fire({
        title: "Ooops!",
        text: "Only the Admin can make an action for this",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#274c77",
      });
    }
  };

  const _cancel = () => {
    queryClient.removeQueries("editInventory", { exact: true });
    navigate("/inventory");
  };

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10 mb-10">
        Update Inventory
      </h1>
      <form className="w-full">
        <div className="flex flex-row">
          <div className="basis-1/2 mr-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Item Type
              <Asterisk />
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "type")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setType(e.target.value)}
              value={type}
              disabled={
                isUpdateInventoryLoading ||
                isInventoryDataLoading ||
                !inventoryData
              }
            />
            {findInputError(formErrors, "type") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "type")}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="basis-1/2 ml-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Stock Code
              <Asterisk />
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "stockCode")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="text"
              value={stockCode}
              onChange={(e: any) => setStockCode(e.target.value)}
              disabled={
                isUpdateInventoryLoading ||
                isInventoryDataLoading ||
                !inventoryData
              }
            />
            {findInputError(formErrors, "stockCode") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "stockCode")}
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="mt-5">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Item Name
            <Asterisk />
          </label>
          <input
            className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
              findInputError(formErrors, "name")
                ? "border-red"
                : "border-accent"
            }`}
            id="grid-first-name"
            type="text"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            disabled={
              isUpdateInventoryLoading ||
              isInventoryDataLoading ||
              !inventoryData
            }
          />
          {findInputError(formErrors, "name") ? (
            <p className="text-[12px] text-red">
              {findInputError(formErrors, "name")}
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="flex flex-row mt-5">
          <div className="basis-1/2 mr-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Stock
              <Asterisk />
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "stock")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="number"
              autoComplete="off"
              value={stock}
              onChange={(e: any) => setStock(parseInt(e.target.value))}
              disabled={true}
            />
            {findInputError(formErrors, "stock") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "stock")}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="basis-1/2 ml-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Price
              <Asterisk />
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "unitCost")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="number"
              autoComplete="off"
              value={unitCost}
              onChange={(e: any) => setUnitCost(parseFloat(e.target.value))}
              disabled={
                isUpdateInventoryLoading ||
                isInventoryDataLoading ||
                !inventoryData
              }
            />
            {findInputError(formErrors, "unitCost") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "unitCost")}
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-4"
            type="button"
            onClick={() => _updateInventory()}
            disabled={
              isUpdateInventoryLoading ||
              isInventoryDataLoading ||
              !inventoryData
            }
          >
            Save
          </button>
          <button
            className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
            type="button"
            disabled={isUpdateInventoryLoading}
            onClick={() => _cancel()}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

const mapStateToProps = (global: any) => ({
  loggedInUserType: global.authenticatedUser.user.type,
});

export default connect(mapStateToProps)(Update);
