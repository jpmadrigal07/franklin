import { useState, useEffect, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { bulkUpdateOrder, getAllOrder, updateOrder } from "../../utils/order";
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
import moment from "moment";
import Header from "../../components/Header";
import { bulkUpdateWash } from "../../utils/api/orderWash";
import { bulkUpdateDry } from "../../utils/api/orderDry";
import { getAllWash } from "../../utils/wash";
import { getAllDry } from "../../utils/dry";
import { bulkUpdateInventory, getAllInventory } from "../../utils/inventory";
import { bulkUpdateItem } from "../../utils/api/orderItem";
import TotalModal from "./TotalModal";
import ComputeTotalLoading from "./ComputeTotalLoading";
import SmallLoading from "../../components/SmallLoading";

type T_Header = {
  header: string;
  dataName: string;
};

const TableDiy = (props: any) => {
  const { loggedInUserUsername } = props;
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [order, setOrder] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSelectMultipleOpen, setIsSelectMultipleOpen] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModal] = useState(false);
  const [selectedJobOrderNumber, setSelectedJobOrderNumber] = useState("");
  const [openClaimedOrderModal, setOpenClaimedOrderModal] = useState(false);
  const [openClaimedMultiOrderModal, setOpenClaimedMultiOrderModal] =
    useState(false);
  const [isTotalModalOpen, setIsTotalModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [rowEditActive, setRowEditActive] = useState<any>([]);
  const [orderToUpdate, setOrderToUpdate] = useState<any>([]);
  const [washToUpdate, setWashToUpdate] = useState<any>([]);
  const [dryToUpdate, setDryToUpdate] = useState<any>([]);
  const [itemToUpdate, setItemToUpdate] = useState<any>([]);
  const [currentTableHeader, setCurrentTableHeader] = useState<any>([]);
  const [multiOrderToUpdate, setMultiOrderToUpdate] = useState<any>([]);
  const [adminPassword, setAdminPassword] = useState("");
  const [selectedData, setSelectedData] = useState<any>({});
  const [selectedIndex, setSelectedIndex] = useState<any>(null);
  const [toUpdateGrandTotalId, setToUpdateGrandTotalId] = useState("");
  const [inventoryStockToUpdate, setInventoryStockToUpdate] = useState<any>([]);
  const [selectedInventory, setSelectedInventory] = useState<any>([]);
  const [sortedData, setSortedData] = useState<any>({});
  const [selectedOrderItemToUpdate, setSelectedOrderToUpdate] = useState<any>(
    []
  );
  const [itemSufficiencyState, setItemSufficiencyState] = useState<any>([]);

  const { mutate: triggerVerifyPassword, isLoading: isVerifyPasswordLoading } =
    useMutation(async (password: any) => verifyPassword(password), {
      onSuccess: async () => {
        setAdminPassword("");
        triggerUpdateOrder({ orderStatus: "Canceled" });
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

  const {
    data: orderData,
    isLoading: isorderDataLoading,
    refetch: refetchOrderData,
  } = useQuery("ordersDiy", () =>
    getAllOrder(
      `{"laundryId": { "$exists": false }, "$and" : [ { "orderStatus": { "$ne": "Canceled" } }, { "orderStatus": { "$ne": "Closed" } } ] }`
    )
  );

  const { data: washData, isLoading: isWashDataLoading } = useQuery(
    "wash",
    () => getAllWash()
  );

  const { data: dryData, isLoading: isDryDataLoading } = useQuery("dry", () =>
    getAllDry()
  );

  const { data: inventoryData, isLoading: isInventoryDataLoading } = useQuery(
    "inventory",
    () => getAllInventory()
  );

  const { mutate: triggerUpdateOrder, isLoading: isUpdateOrderLoading } =
    useMutation(async (order: any) => updateOrder(order, selectedOrderId), {
      onSuccess: async () => {
        setSelectedJobOrderNumber("");
        setSelectedOrderId("");
        setIsCancelModalOpen(false);
        setOpenClaimedOrderModal(false);
        setIsAdminPasswordModal(false);
        refetchOrderData();
        if (selectedOrderItemToUpdate.length === 0) {
          MySwal.fire({
            title: "Update success!",
            text: "Order has been updated",
            icon: "success",
            timer: 2500,
            showConfirmButton: false,
          });
        } else {
          triggerBulkUpdateInventoryStock({ bulk: selectedOrderItemToUpdate });
        }
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

  const {
    mutate: triggerBulkUpdateOrder,
    isLoading: isBulkUpdateOrderLoading,
  } = useMutation(async (order: any) => bulkUpdateOrder(order), {
    onSuccess: async () => {
      setOrderToUpdate([]);
      setMultiOrderToUpdate([]);
      setOpenClaimedOrderModal(false);
      setOpenClaimedMultiOrderModal(false);
      refetchOrderData();
      setToUpdateGrandTotalId(selectedData?._id);
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

  const { mutate: triggerBulkUpdateWash, isLoading: isBulkUpdateWashLoading } =
    useMutation(async (order: any) => bulkUpdateWash(order), {
      onSuccess: async () => {
        setWashToUpdate([]);
        refetchOrderData();
        setToUpdateGrandTotalId(selectedData?._id);
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

  const { mutate: triggerBulkUpdateDry, isLoading: isBulkUpdateDryLoading } =
    useMutation(async (order: any) => bulkUpdateDry(order), {
      onSuccess: async () => {
        setDryToUpdate([]);
        refetchOrderData();
        setToUpdateGrandTotalId(selectedData?._id);
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

  const {
    mutate: triggerBulkUpdateItem,
    isLoading: isBulkUpdateItemLoading,
    reset: resetBulkUpdateItem,
  } = useMutation(async (order: any) => bulkUpdateItem(order), {
    onSuccess: async () => {
      setItemToUpdate([]);
      refetchOrderData();
      setToUpdateGrandTotalId(selectedData?._id);
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

  const {
    mutate: triggerBulkUpdateInventoryStock,
    isLoading: isBulkUpdateInventoryStockLoading,
    reset: resetBulkUpdateInventoryStock,
  } = useMutation(async (order: any) => bulkUpdateInventory(order), {
    onSuccess: async () => {
      setInventoryStockToUpdate([]);
      if (selectedOrderItemToUpdate.length > 0) {
        MySwal.fire({
          title: "Update success!",
          text: "Order has been updated",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        });
      }
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

  const tableHeader = useMemo(
    () => [
      { header: "", dataName: "checkBox" },
      { header: "JO Number", dataName: "jobOrderNumber" },
      { header: "Date", dataName: "createdAt" },
      { header: "Customer", dataName: "customer" },
      { header: "Wash", dataName: "wash" },
      { header: "WM", dataName: "wm" },
      { header: "Dry", dataName: "dry" },
      { header: "DM", dataName: "dm" },
      { header: "DET", dataName: "det" },
      { header: "FAB", dataName: "fab" },
      { header: "ZX", dataName: "zx" },
      { header: "PB", dataName: "pb" },
      { header: "Paid Status", dataName: "paidStatus" },
      { header: "Action", dataName: "endActions" },
    ],
    []
  );

  const tableEndActions = useMemo(
    () => ["Update", "Save", "Cancel", "Back"],
    []
  );

  const _updateRowEditActive = useCallback(
    (values: any, state?: boolean) => {
      // accepts single and multiple
      let newRowEditActive = rowEditActive;
      if (Array.isArray(values)) {
        values.forEach((res: number) => {
          const newState =
            typeof state !== "undefined" ? state : !newRowEditActive[res];
          newRowEditActive[res] = newState;
        });
      } else if (typeof values === "number") {
        const newState =
          typeof state !== "undefined" ? state : !newRowEditActive[values];
        newRowEditActive[values] = newState;
      }
      setRowEditActive([...newRowEditActive]);
    },
    [rowEditActive]
  );

  const _orderToUpdate = useCallback(
    (id: string, key: string, value: string) => {
      let newOrderToUpdate = orderToUpdate;
      const exist = newOrderToUpdate.find((res: any) => res.id === id);
      if (!exist) {
        let toUpdateObj: any = {};
        toUpdateObj["id"] = id;
        const isOrderDryMachineNumberExist = orderData.find(
          (item: any) => item._id === id && item.orderDry?.machineNumber
        );
        const isOrderPaid = orderData.find(
          (item: any) => item._id === id && item.paidStatus === "Paid"
        );
        if (
          key === "paidStatus" &&
          value === "Paid" &&
          isOrderDryMachineNumberExist
        ) {
          toUpdateObj["orderStatus"] = "Closed";
          toUpdateObj["updatedAt"] = moment().format();
        }
        if (key === "dryCompleted" && value !== "" && isOrderPaid) {
          toUpdateObj["orderStatus"] = "Closed";
          toUpdateObj["updatedAt"] = moment().format();
        }
        toUpdateObj[key] = value === "null" ? null : value;
        setOrderToUpdate([...newOrderToUpdate, toUpdateObj]);
      } else {
        const index = newOrderToUpdate.findIndex((res: any) => res.id === id);
        newOrderToUpdate[index][key] = value === "null" ? null : value;
        setOrderToUpdate([...newOrderToUpdate]);
      }
    },
    [orderToUpdate, orderData]
  );

  const _multiOrderToUpdate = useCallback(
    (key: string, value: string, included: boolean, id?: string) => {
      let newOrderToUpdate = multiOrderToUpdate;
      const exist = newOrderToUpdate.find((res: any) => res.id === id);
      if (key === "id" && !included) {
        setMultiOrderToUpdate([
          ...newOrderToUpdate.filter((item: any) => item.id !== value),
        ]);
      } else {
        if (!exist && key === "id") {
          let toUpdateObj: any = {};
          toUpdateObj[key] = value === "null" ? null : value;
          setMultiOrderToUpdate([...newOrderToUpdate, toUpdateObj]);
        }
        if (key !== "id" && newOrderToUpdate.length > 0) {
          const newValue = newOrderToUpdate.map((res: any) => {
            const isOrderDryMachineNumberExist = orderData.find(
              (item: any) => item._id === res.id && item.orderDry?.machineNumber
            );
            const updatedValue =
              key === "paidStatus" && value === "Paid" ? "Paid" : value;
            let toReturn = {
              ...res,
              [key]: value === "null" ? null : updatedValue,
            };
            if (
              key === "paidStatus" &&
              value === "Paid" &&
              isOrderDryMachineNumberExist
            ) {
              toReturn.orderStatus = "Closed";
            }
            return toReturn;
          });
          setMultiOrderToUpdate([...newValue]);
        }
      }
    },
    [multiOrderToUpdate, orderData]
  );

  const _washToUpdate = useCallback(
    (
      id: string,
      key: string,
      value: string | number,
      jobOrderNumber: string,
      price?: number
    ) => {
      let newWashToUpdate = washToUpdate;
      const exist = newWashToUpdate.find((res: any) => res.id === id);
      if (!exist) {
        let toUpdateObj: any = {};
        toUpdateObj["id"] = id;
        toUpdateObj["jobOrderNumber"] = jobOrderNumber;
        if (key === "washId") {
          toUpdateObj["qty"] = 1;
          toUpdateObj["total"] = price;
        }
        toUpdateObj[key] = value;
        setWashToUpdate([...newWashToUpdate, toUpdateObj]);
      } else {
        const index = newWashToUpdate.findIndex((res: any) => res.id === id);
        newWashToUpdate[index][key] = value;
        setWashToUpdate([...newWashToUpdate]);
      }
    },
    [washToUpdate]
  );

  const _dryToUpdate = useCallback(
    (
      id: string,
      key: string,
      value: string | number,
      jobOrderNumber: string,
      price?: number
    ) => {
      let newDryToUpdate = dryToUpdate;
      const exist = newDryToUpdate.find((res: any) => res.id === id);
      if (!exist) {
        let toUpdateObj: any = {};
        toUpdateObj["id"] = id;
        toUpdateObj["jobOrderNumber"] = jobOrderNumber;
        if (key === "dryId") {
          toUpdateObj["qty"] = 1;
          toUpdateObj["total"] = price;
        }
        toUpdateObj[key] = value;
        setDryToUpdate([...newDryToUpdate, toUpdateObj]);
      } else {
        const index = newDryToUpdate.findIndex((res: any) => res.id === id);
        newDryToUpdate[index][key] = value;
        setDryToUpdate([...newDryToUpdate]);
      }
    },
    [dryToUpdate]
  );

  const _itemToUpdate = useCallback(
    (
      index: number,
      id: string,
      jobOrderNumber: string,
      key: string,
      value: any,
      item: string,
      price?: number,
      inventoryId?: string
    ) => {
      let newDryToUpdate = itemToUpdate;
      const exist = newDryToUpdate.find((res: any) => res.index === index);
      const zxItem =
        inventoryData &&
        inventoryData.filter((res: any) => res.name === "Zonrox");
      const pbItem =
        inventoryData &&
        inventoryData.filter((res: any) => res.name === "Plastic Bag");
      if (!exist) {
        let toUpdateObj: any = {};
        toUpdateObj["id"] = id;
        toUpdateObj["jobOrderNumber"] = jobOrderNumber;
        if (item === "ZX") {
          toUpdateObj["inventoryId"] = zxItem ? zxItem[0]?._id : null;
        }
        if (item === "PB") {
          toUpdateObj["inventoryId"] = pbItem ? pbItem[0]?._id : null;
        }
        if ((item === "DET" || item === "FAB") && inventoryId) {
          toUpdateObj["inventoryId"] = inventoryId;
        }
        if (key === "qty" && price) {
          toUpdateObj["total"] =
            price && price > 0 ? parseInt(value) * price : null;
        }
        if (key !== "qty" && price) {
          toUpdateObj["price"] = price && price > 0 ? price : 0;
        }
        if (key === "qty" && !price && toUpdateObj["price"]) {
          toUpdateObj["total"] = parseInt(value) * toUpdateObj["price"];
        }
        toUpdateObj[key] = value;
        toUpdateObj["item"] = item;
        const newArr = [toUpdateObj];
        const wrapper = {
          index,
          data: newArr,
        };
        setItemToUpdate([...newDryToUpdate, wrapper]);
      } else {
        const arrayItem = newDryToUpdate.find(
          (res: any) => res.index === index
        );
        const isOld = arrayItem?.data.find((res: any) => res.item === item);
        if (isOld) {
          const mainItemIndex = newDryToUpdate.findIndex(
            (res: any) => res.index === index
          );
          const dataIndex = arrayItem?.data.findIndex(
            (res: any) => res.item === item
          );
          let arrayData = arrayItem?.data;
          arrayData[dataIndex][key] = value;
          if (key !== "qty" && price && arrayData[dataIndex]["qty"]) {
            arrayData[dataIndex]["total"] =
              price && price > 0 ? price * arrayData[dataIndex]["qty"] : 0;
          }
          if (key === "qty" && !price && arrayData[dataIndex]["price"]) {
            arrayData[dataIndex]["total"] =
              parseInt(value) * arrayData[dataIndex]["price"];
          }
          newDryToUpdate[mainItemIndex]["data"] = arrayData;
          setItemToUpdate([...newDryToUpdate]);
        } else {
          const mainItemIndex = newDryToUpdate.findIndex(
            (res: any) => res.index === index
          );
          let arrayData = arrayItem?.data;
          let toUpdateObj: any = {};
          toUpdateObj["id"] = id;
          toUpdateObj["jobOrderNumber"] = jobOrderNumber;
          if (item === "ZX") {
            toUpdateObj["inventoryId"] = zxItem ? zxItem[0]?._id : null;
          }
          if (item === "PB") {
            toUpdateObj["inventoryId"] = pbItem ? pbItem[0]?._id : null;
          }
          if ((item === "DET" || item === "FAB") && inventoryId) {
            toUpdateObj["inventoryId"] = inventoryId;
          }
          if (key === "qty" && price) {
            toUpdateObj["total"] =
              price && price > 0 ? parseInt(value) * price : null;
          }
          if (key !== "qty" && price) {
            toUpdateObj["price"] = price && price > 0 ? price : 0;
          }
          if (key === "qty" && !price && toUpdateObj["price"]) {
            toUpdateObj["total"] = parseInt(value) * toUpdateObj["price"];
          }
          toUpdateObj[key] = value;
          toUpdateObj["item"] = item;
          arrayData.push(toUpdateObj);
          newDryToUpdate[mainItemIndex]["data"] = arrayData;
          setItemToUpdate([...newDryToUpdate]);
        }
      }
    },
    [itemToUpdate, inventoryData]
  );

  const _inventoryStockToUpdate = useCallback(
    (id: string, newValue: number, oldValue: number) => {
      const newVal = newValue ? newValue : 0;
      const oldVal = oldValue ? oldValue : 0;
      let newInventoryToUpdate = inventoryStockToUpdate;
      const exist = newInventoryToUpdate.find((res: any) => res.id === id);
      const value = newVal > oldVal ? -(newVal - oldVal) : oldVal - newVal;
      if (!exist) {
        let toUpdateObj: any = {};
        toUpdateObj["id"] = id;
        toUpdateObj["stock"] = value;
        setInventoryStockToUpdate([...newInventoryToUpdate, toUpdateObj]);
      } else {
        const index = newInventoryToUpdate.findIndex(
          (res: any) => res.id === id
        );
        newInventoryToUpdate[index]["stock"] = value;
        setInventoryStockToUpdate([...newInventoryToUpdate]);
      }
    },
    [inventoryStockToUpdate]
  );

  const _selectedInventory = useCallback(
    (data: string, index: number, type: string) => {
      let newSelectedInventory = selectedInventory;
      const exist = newSelectedInventory.find(
        (res: any) => res.index === index
      );
      if (!exist) {
        let toUpdateObj: any = {};
        toUpdateObj["index"] = index;
        toUpdateObj[type] = data;
        setSelectedInventory([...newSelectedInventory, toUpdateObj]);
      } else {
        const indexs = newSelectedInventory.findIndex(
          (res: any) => res.index === index
        );
        newSelectedInventory[indexs][type] = data;
        setSelectedInventory([...newSelectedInventory]);
      }
    },
    [selectedInventory]
  );

  const _updateWash = useCallback(
    (index: number, id?: string) => {
      if (washToUpdate.length > 0) {
        const toUpdate = id
          ? [washToUpdate.find((res: any) => res.id === id)]
          : washToUpdate;
        const ops =
          toUpdate &&
          toUpdate.map((item: any) => {
            if (item.id) {
              return {
                updateOne: {
                  filter: { _id: item.id },
                  update: { $set: item },
                  upsert: false,
                },
              };
            } else {
              return {
                insertOne: {
                  document: item,
                },
              };
            }
          });
        if (ops && ops.length > 0) {
          triggerBulkUpdateWash({ bulk: ops });
        }
      }
    },
    [washToUpdate, triggerBulkUpdateWash]
  );

  const _updateInventoryStock = useCallback(
    (index: number, id?: string) => {
      if (inventoryStockToUpdate.length > 0) {
        const toUpdate = id
          ? [inventoryStockToUpdate.find((res: any) => res.id === id)]
          : inventoryStockToUpdate;
        const ops =
          toUpdate &&
          toUpdate.map((item: any) => {
            return {
              updateOne: {
                filter: { _id: item.id },
                update: { $inc: { stock: item.stock } },
                upsert: false,
              },
            };
          });
        if (ops && ops.length > 0) {
          triggerBulkUpdateInventoryStock({ bulk: ops });
        }
      }
    },
    [inventoryStockToUpdate, triggerBulkUpdateInventoryStock]
  );

  const _updateDry = useCallback(
    (index: number, id?: string) => {
      if (dryToUpdate.length > 0) {
        const toUpdate = id
          ? [dryToUpdate.find((res: any) => res.id === id)]
          : dryToUpdate;
        const ops =
          toUpdate &&
          toUpdate.map((item: any) => {
            if (item.id) {
              return {
                updateOne: {
                  filter: { _id: item.id },
                  update: { $set: item },
                  upsert: false,
                },
              };
            } else {
              return {
                insertOne: {
                  document: item,
                },
              };
            }
          });
        if (ops && ops.length > 0) {
          triggerBulkUpdateDry({ bulk: ops });
        }
      }
    },
    [dryToUpdate, triggerBulkUpdateDry]
  );

  const _updateItem = useCallback(
    (index: number, id?: string) => {
      const merged = itemToUpdate.find((res: any) => res.index === index);
      // .reduce(function(prev: any, next: any) {
      //   return prev.concat(next.data);
      // }, [])
      const items = merged
        ? merged?.data?.filter((res2: any) => res2.inventoryId && res2.qty)
        : [];
      if (items.length > 0) {
        const toUpdate = id ? [items.find((res: any) => res.id === id)] : items;
        const ops =
          toUpdate &&
          toUpdate.map((item: any) => {
            if (item.id) {
              return {
                updateOne: {
                  filter: { _id: item.id },
                  update: { $set: item },
                  upsert: false,
                },
              };
            } else {
              return {
                insertOne: {
                  document: item,
                },
              };
            }
          });
        if (ops && ops.length > 0) {
          triggerBulkUpdateItem({ bulk: ops });
        }
      }
    },
    [itemToUpdate, triggerBulkUpdateItem]
  );

  const _updateOrder = useCallback(
    (index: number, id?: string, data?: any) => {
      _updateWash(index, data?.orderWash._id);
      _updateDry(index, data?.orderDry._id);
      _updateItem(index, data?.orderItem._id);
      _updateInventoryStock(index);
      if (orderToUpdate.length > 0) {
        const toUpdate = id
          ? [orderToUpdate.find((res: any) => res.id === id)]
          : orderToUpdate;
        const ops =
          toUpdate &&
          toUpdate.map((item: any) => {
            return {
              updateOne: {
                filter: { _id: item.id },
                update: { $set: item },
                upsert: false,
              },
            };
          });
        if (ops && ops.length > 0) {
          triggerBulkUpdateOrder({ bulk: ops });
        }
      }
    },
    [
      orderToUpdate,
      triggerBulkUpdateOrder,
      _updateWash,
      _updateDry,
      _updateItem,
      _updateInventoryStock,
    ]
  );

  const _updateMultiOrder = useCallback(() => {
    if (multiOrderToUpdate.length > 0) {
      const ops =
        multiOrderToUpdate &&
        multiOrderToUpdate.map((item: any) => {
          return {
            updateOne: {
              filter: { _id: item.id },
              update: { $set: item },
              upsert: false,
            },
          };
        });
      if (ops && ops.length > 0) {
        setMultiOrderToUpdate([]);
        setIsSelectMultipleOpen(false);
        triggerBulkUpdateOrder({ bulk: ops });
      }
    }
  }, [triggerBulkUpdateOrder, multiOrderToUpdate]);

  const isFloat = (x: number) => {
    return !!(x % 1);
  };

  const _openClaimedOrderModal = useCallback(
    (index: number, data: any) => {
      resetBulkUpdateItem();
      resetBulkUpdateInventoryStock();
      setSelectedData(data);
      setSelectedIndex(index);
      const isRowQtysFloat = itemToUpdate.map((res: any) => {
        const floatExist = res?.data?.find((res2: any) => isFloat(res2.qty));
        return floatExist ? true : false;
      });
      if (itemSufficiencyState[index]?.toString().includes("false")) {
        MySwal.fire({
          title: "Ooops!",
          text: `Stocks insufficient - ${
            !itemSufficiencyState[index][0] ? "Detergent," : ""
          }${!itemSufficiencyState[index][1] ? "Fab Con," : ""}${
            !itemSufficiencyState[index][2] ? "Zonrox," : ""
          }${!itemSufficiencyState[index][3] ? "Plastic Bag" : ""}`,
          icon: "warning",
          confirmButtonText: "Okay",
          confirmButtonColor: "#274c77",
        });
      } else if (isRowQtysFloat?.toString().includes("true")) {
        MySwal.fire({
          title: "Ooops!",
          text: `Quantities needs to be a whole number.`,
          icon: "warning",
          confirmButtonText: "Okay",
          confirmButtonColor: "#274c77",
        });
      } else {
        const isToClose = orderToUpdate.find((res: any) => {
          const isOrderDryMachineNumberExist = orderData.find(
            (item: any) => item._id === data._id && item.orderDry?.machineNumber
          );
          const isOrderPaid = orderData.find(
            (item: any) => item._id === data._id && item.paidStatus === "Paid"
          );
          return (
            res.id === data._id &&
            ((res.paidStatus === "Paid" && isOrderDryMachineNumberExist) ||
              (res.dryCompleted && isOrderPaid))
          );
        });
        if (!isToClose) {
          _updateOrder(index, data._id, data);
        } else {
          setOpenClaimedOrderModal(true);
        }
      }
    },
    [orderToUpdate, _updateOrder, itemSufficiencyState, orderData, itemToUpdate]
  );

  const _openClaimedMultiOrderModal = useCallback(() => {
    const toCloseData = multiOrderToUpdate.filter(
      (res: any) => res?.paidStatus === "Paid" || res?.dryCompleted
    );

    const isSaveToClose = toCloseData.map((res: any) => {
      const isOrderDryMachineNumberExist = orderData.find(
        (item: any) => item._id === res.id && item.orderDry?.machineNumber
      );
      const isOrderPaid = orderData.find(
        (item: any) => item._id === res.id && item.paidStatus === "Paid"
      );
      return (res?.paidStatus === "Paid" && isOrderDryMachineNumberExist) ||
        (res?.dryCompleted && isOrderPaid)
        ? true
        : false;
    });
    if (isSaveToClose.toString().includes("true")) {
      setOpenClaimedMultiOrderModal(true);
    } else {
      _updateMultiOrder();
    }
  }, [_updateMultiOrder, multiOrderToUpdate, orderData]);

  const _remappedData = useCallback(
    (data: any) => {
      const newData = data.map((res: any, index: number) => {
        const isEditActive = rowEditActive[index];
        const mainData = currentTableHeader.map((res2: any) => {
          let value;
          if (res2.dataName === "endActions") {
            value = tableEndActions.map((res3: any) => {
              if (res3 === "Cancel" && !isEditActive) {
                const isNotCancelable =
                  res.orderStatus === "Canceled" || res.paidStatus === "Paid";
                return _constructTableActions(
                  res3,
                  () => _cancelOrder(res.jobOrderNumber, res),
                  true,
                  isNotCancelable
                );
              } else if (res3 === "Back" && isEditActive) {
                return _constructTableActions(
                  res3,
                  () => {
                    setOrderToUpdate([]);
                    setWashToUpdate([]);
                    setDryToUpdate([]);
                    setItemToUpdate([]);
                    setSelectedData({});
                    setItemSufficiencyState(
                      orderData.map(() => [true, true, true, true])
                    );
                    _updateRowEditActive(index);
                  },
                  true,
                  res.orderStatus === "Canceled"
                );
              } else if (
                res3 === "Update" &&
                !isEditActive &&
                !isSelectMultipleOpen
              ) {
                return _constructTableActions(
                  res3,
                  () => {
                    _updateRowEditActive(index);
                    setSelectedData(res);
                  },
                  false,
                  isBulkUpdateOrderLoading || res.orderStatus === "Canceled"
                );
              } else if (res3 === "Save" && isEditActive) {
                return _constructTableActions(
                  res3,
                  () => _openClaimedOrderModal(index, res),
                  false,
                  isBulkUpdateOrderLoading ||
                    isUpdateOrderLoading ||
                    isBulkUpdateItemLoading ||
                    isBulkUpdateInventoryStockLoading ||
                    res.orderStatus === "Canceled"
                );
              }
            });
          } else if (res2.dataName === "checkBox") {
            value = (
              <input
                className="w-4 h-4 mt-[5px]"
                type="checkbox"
                onChange={(e: any) =>
                  _multiOrderToUpdate("id", res._id, e.target.checked)
                }
              />
            );
          } else if (res2.dataName === "jobOrderNumber") {
            value = (
              <span
                className="font-bold text-primary hover:underline hover:cursor-pointer"
                onClick={() => navigate(`/orders/${res.jobOrderNumber}`)}
              >
                {res["jobOrderNumber"]}
              </span>
            );
          } else if (res2.dataName === "customer") {
            value = (
              <span
                className="font-bold text-primary hover:underline hover:cursor-pointer"
                onClick={() => {
                  setSelectedData(res);
                  setIsTotalModalOpen(true);
                }}
              >
                {res["customerId"]["firstName"]} {res["customerId"]["lastName"]}
              </span>
            );
          } else if (res2.dataName === "wash") {
            value =
              isEditActive && !res["orderWash"]["machineNumber"] ? (
                <select
                  className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent appearance-none`}
                  onChange={(e: any) => {
                    const washItem = washData.find(
                      (res: any) => res._id === e.target.value
                    );
                    _washToUpdate(
                      res?.orderWash?._id,
                      "washId",
                      e.target.value,
                      res?.jobOrderNumber,
                      washItem.price
                    );
                  }}
                  disabled={isWashDataLoading}
                >
                  <option value="">Select Wash</option>
                  {washData &&
                    washData.map((res2: any) => {
                      return (
                        <option
                          value={res2._id}
                          selected={res?.orderWash?.washId?._id === res2._id}
                        >
                          {res2.type}
                        </option>
                      );
                    })}
                </select>
              ) : res["orderWash"]["washId"] ? (
                res["orderWash"]["washId"]["type"]
              ) : (
                "---"
              );
          } else if (res2.dataName === "wm") {
            value =
              isEditActive &&
              !res["orderWash"]["machineNumber"] &&
              res["orderWash"]?.washId?.type ? (
                <input
                  className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-[45px] border-2 border-semi-light"
                  type="number"
                  defaultValue={res["orderWash"]["machineNumber"]}
                  onChange={(e: any) => {
                    _orderToUpdate(res._id, "washCompleted", moment().format());
                    _washToUpdate(
                      res?.orderWash._id,
                      "machineNumber",
                      parseInt(e.target.value),
                      res?.jobOrderNumber
                    );
                  }}
                />
              ) : res["orderWash"]["machineNumber"] ? (
                res["orderWash"]["machineNumber"]
              ) : (
                "---"
              );
          } else if (res2.dataName === "dry") {
            value =
              isEditActive && !res["orderDry"]["machineNumber"] ? (
                <select
                  className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent appearance-none`}
                  onChange={(e: any) => {
                    const dryItem = dryData.find(
                      (res: any) => res._id === e.target.value
                    );
                    _dryToUpdate(
                      res?.orderDry?._id,
                      "dryId",
                      e.target.value,
                      res?.jobOrderNumber,
                      dryItem.price
                    );
                  }}
                  disabled={isDryDataLoading}
                >
                  <option value="">Select Dry</option>
                  {dryData &&
                    dryData.map((res2: any) => {
                      return (
                        <option
                          value={res2._id}
                          selected={res?.orderDry?.dryId?._id === res2._id}
                        >
                          {res2.type}
                        </option>
                      );
                    })}
                </select>
              ) : res["orderDry"]["dryId"] ? (
                res["orderDry"]["dryId"]["type"]
              ) : (
                "---"
              );
          } else if (res2.dataName === "dm") {
            value =
              isEditActive &&
              !res["orderDry"]["machineNumber"] &&
              res["orderDry"]?.dryId?.type &&
              res["orderWash"]["machineNumber"] ? (
                <input
                  className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-[45px] border-2 border-semi-light"
                  type="number"
                  defaultValue={res["orderDry"]["machineNumber"]}
                  onChange={(e: any) => {
                    _orderToUpdate(res._id, "dryCompleted", moment().format());
                    _dryToUpdate(
                      res?.orderDry._id,
                      "machineNumber",
                      parseInt(e.target.value),
                      res?.jobOrderNumber
                    );
                  }}
                />
              ) : res["orderDry"]["machineNumber"] ? (
                res["orderDry"]["machineNumber"]
              ) : (
                "---"
              );
          } else if (res2.dataName === "det") {
            const selected = Array.isArray(res["orderItem"])
              ? res["orderItem"].find(
                  (res: any) => res?.inventoryId?.type === "Detergent"
                )
              : null;
            const items =
              inventoryData &&
              inventoryData.filter((res: any) => res.type === "Detergent");
            const inventory = selectedInventory.find(
              (res: any) => res.index === index && res.Detergent
            );
            value =
              isEditActive && !res["orderWash"]["machineNumber"] ? (
                <>
                  {res["orderWash"]["machineNumber"] ? (
                    selected?.inventoryId?.stockCode
                  ) : (
                    <select
                      className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-[50px] border-2 border-semi-light appearance-none"
                      onChange={(e: any) => {
                        const item =
                          inventoryData &&
                          inventoryData.find(
                            (res: any) => res._id === e.target.value
                          );
                        _selectedInventory(item, index, "Detergent");
                        _itemToUpdate(
                          index,
                          selected?._id,
                          res.jobOrderNumber,
                          "inventoryId",
                          e.target.value,
                          "DET",
                          item?.unitCost
                        );
                      }}
                    >
                      <option></option>
                      {items &&
                        items.map((res2: any) => {
                          return (
                            <option
                              value={res2._id}
                              selected={res2._id === selected?.inventoryId._id}
                            >
                              {res2.stockCode}
                            </option>
                          );
                        })}
                    </select>
                  )}
                  :
                  {res["orderWash"]["machineNumber"] ? (
                    selected?.qty
                  ) : (
                    <input
                      className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-[45px] border-2 border-semi-light"
                      type="number"
                      defaultValue={selected?.qty}
                      onChange={(e: any) => {
                        _itemToUpdate(
                          index,
                          selected?._id,
                          res.jobOrderNumber,
                          "qty",
                          parseFloat(e.target.value),
                          "DET",
                          undefined,
                          selected?.inventoryId._id
                        );
                        const inventoryId = inventory?.Detergent?._id
                          ? inventory?.Detergent?._id
                          : selected?.inventoryId._id;
                        _inventoryStockToUpdate(
                          inventoryId,
                          parseFloat(e.target.value),
                          selected?.qty
                        );
                        const updatedQty =
                          parseFloat(e.target.value) > selected?.qty
                            ? -(parseFloat(e.target.value) - selected?.qty)
                            : selected?.qty - parseFloat(e.target.value);
                        let newItemSufficiencyState = itemSufficiencyState;
                        const remainingStocks = inventory?.Detergent?.stock
                          ? inventory?.Detergent?.stock
                          : items.find(
                              (res5: any) =>
                                res5._id === selected?.inventoryId._id
                            )?.stock;
                        newItemSufficiencyState[index][0] =
                          updatedQty < 0
                            ? remainingStocks >= Math.abs(updatedQty)
                            : true;
                        setItemSufficiencyState([...newItemSufficiencyState]);
                      }}
                    />
                  )}
                </>
              ) : selected ? (
                `${selected?.inventoryId?.stockCode}:${selected.qty}`
              ) : (
                "---"
              );
          } else if (res2.dataName === "fab") {
            const selected = Array.isArray(res["orderItem"])
              ? res["orderItem"].find(
                  (res: any) => res?.inventoryId?.type === "FabCon"
                )
              : null;
            const items =
              inventoryData &&
              inventoryData.filter((res: any) => res.type === "FabCon");
            const inventory = selectedInventory.find(
              (res: any) => res.index === index && res.FabCon
            );
            value =
              isEditActive && !res["orderWash"]["machineNumber"] ? (
                <>
                  {res["orderWash"]["machineNumber"] ? (
                    selected?.inventoryId?.stockCode
                  ) : (
                    <select
                      className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-[50px] border-2 border-semi-light appearance-none"
                      onChange={(e: any) => {
                        const item =
                          inventoryData &&
                          inventoryData.find(
                            (res: any) => res._id === e.target.value
                          );
                        _selectedInventory(item, index, "FabCon");
                        _itemToUpdate(
                          index,
                          selected?._id,
                          res.jobOrderNumber,
                          "inventoryId",
                          e.target.value,
                          "FAB",
                          item?.unitCost
                        );
                      }}
                    >
                      <option></option>
                      {items &&
                        items.map((res2: any) => {
                          return (
                            <option
                              value={res2._id}
                              selected={res2._id === selected?.inventoryId._id}
                            >
                              {res2.stockCode}
                            </option>
                          );
                        })}
                    </select>
                  )}
                  :
                  {res["orderWash"]["machineNumber"] ? (
                    selected?.qty
                  ) : (
                    <input
                      className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-[45px] border-2 border-semi-light"
                      type="number"
                      defaultValue={selected?.qty}
                      onChange={(e: any) => {
                        _itemToUpdate(
                          index,
                          selected?._id,
                          res.jobOrderNumber,
                          "qty",
                          parseFloat(e.target.value),
                          "FAB",
                          undefined,
                          selected?.inventoryId._id
                        );
                        const inventoryId = inventory?.FabCon?._id
                          ? inventory?.FabCon?._id
                          : selected?.inventoryId._id;
                        _inventoryStockToUpdate(
                          inventoryId,
                          parseFloat(e.target.value),
                          selected?.qty
                        );
                        const updatedQty =
                          parseFloat(e.target.value) > selected?.qty
                            ? -(parseFloat(e.target.value) - selected?.qty)
                            : selected?.qty - parseFloat(e.target.value);
                        let newItemSufficiencyState = itemSufficiencyState;
                        const remainingStocks = inventory?.FabCon?.stock
                          ? inventory?.FabCon?.stock
                          : items.find(
                              (res5: any) =>
                                res5._id === selected?.inventoryId._id
                            )?.stock;
                        newItemSufficiencyState[index][1] =
                          updatedQty < 0
                            ? remainingStocks >= Math.abs(updatedQty)
                            : true;
                        setItemSufficiencyState([...newItemSufficiencyState]);
                      }}
                    />
                  )}
                </>
              ) : selected ? (
                `${selected?.inventoryId?.stockCode}:${selected.qty}`
              ) : (
                "---"
              );
          } else if (res2.dataName === "zx") {
            const zxItem =
              inventoryData &&
              inventoryData.find((res: any) => res.name === "Zonrox");
            const zonrox = Array.isArray(res["orderItem"])
              ? res["orderItem"].find(
                  (res: any) => res?.inventoryId?.name === "Zonrox"
                )
              : null;
            value =
              isEditActive && !res["orderWash"]["machineNumber"] ? (
                <input
                  className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-[45px] border-2 border-semi-light"
                  type="number"
                  defaultValue={zonrox?.qty}
                  onChange={(e: any) => {
                    _itemToUpdate(
                      index,
                      zonrox?._id,
                      res.jobOrderNumber,
                      "qty",
                      parseFloat(e.target.value),
                      "ZX",
                      zxItem?.unitCost
                    );
                    _inventoryStockToUpdate(
                      zxItem?._id,
                      parseFloat(e.target.value),
                      zonrox?.qty
                    );
                    const updatedQty =
                      parseFloat(e.target.value) > zonrox?.qty
                        ? -(parseFloat(e.target.value) - zonrox?.qty)
                        : zonrox?.qty
                        ? zonrox?.qty
                        : 0 - parseFloat(e.target.value);
                    let newItemSufficiencyState = itemSufficiencyState;
                    newItemSufficiencyState[index][2] =
                      updatedQty < 0
                        ? zxItem?.stock >= Math.abs(updatedQty)
                        : true;
                    setItemSufficiencyState([...newItemSufficiencyState]);
                  }}
                />
              ) : zonrox ? (
                zonrox?.qty
              ) : (
                "---"
              );
          } else if (res2.dataName === "pb") {
            const pbItem =
              inventoryData &&
              inventoryData.find((res: any) => res.name === "Plastic Bag");
            const plastic = Array.isArray(res["orderItem"])
              ? res["orderItem"].find(
                  (res: any) => res?.inventoryId?.name === "Plastic Bag"
                )
              : null;
            value =
              isEditActive && res.paidStatus !== "Paid" ? (
                <input
                  className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-[45px] border-2 border-semi-light"
                  type="number"
                  defaultValue={plastic?.qty}
                  onChange={(e: any) => {
                    _itemToUpdate(
                      index,
                      plastic?._id,
                      res.jobOrderNumber,
                      "qty",
                      parseFloat(e.target.value),
                      "PB",
                      pbItem?.unitCost
                    );
                    _inventoryStockToUpdate(
                      pbItem?._id,
                      parseFloat(e.target.value),
                      plastic?.qty
                    );
                    const updatedQty =
                      parseFloat(e.target.value) > plastic?.qty
                        ? -(parseFloat(e.target.value) - plastic?.qty)
                        : plastic?.qty
                        ? plastic?.qty
                        : 0 - parseFloat(e.target.value);
                    let newItemSufficiencyState = itemSufficiencyState;
                    newItemSufficiencyState[index][3] =
                      updatedQty < 0
                        ? pbItem?.stock >= Math.abs(updatedQty)
                        : true;
                    setItemSufficiencyState([...newItemSufficiencyState]);
                  }}
                />
              ) : plastic ? (
                plastic.qty
              ) : (
                "---"
              );
          } else if (res2.dataName === "paidStatus") {
            value = isEditActive ? (
              <select
                className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-[67px] border-2 border-semi-light appearance-none"
                onChange={(e: any) =>
                  _orderToUpdate(res._id, "paidStatus", e.target.value)
                }
              >
                <option value="Unpaid">Select</option>
                <option selected={res.paidStatus === "Unpaid"}>Unpaid</option>
                <option selected={res.paidStatus === "To Transfer"}>
                  To Transfer
                </option>
                <option selected={res.paidStatus === "Paid"}>Paid</option>
              </select>
            ) : (
              res[res2.dataName]
            );
          } else if (res2.dataName === "createdAt") {
            value = moment(res[res2.dataName]).format("MM/DD/YYYY");
          } else {
            value = res[res2.dataName] ? res[res2.dataName] : "";
          }
          return value;
        });
        const obj: any = {};
        currentTableHeader.forEach((element: T_Header, index: number) => {
          obj[element.dataName] = mainData[index];
        });

        return obj;
      });

      return newData;
    },
    [
      navigate,
      tableEndActions,
      rowEditActive,
      _updateRowEditActive,
      _orderToUpdate,
      isBulkUpdateOrderLoading,
      _washToUpdate,
      _dryToUpdate,
      dryData,
      washData,
      isDryDataLoading,
      isWashDataLoading,
      inventoryData,
      _itemToUpdate,
      isSelectMultipleOpen,
      currentTableHeader,
      _multiOrderToUpdate,
      _inventoryStockToUpdate,
      _openClaimedOrderModal,
      _selectedInventory,
      selectedInventory,
      itemSufficiencyState,
      orderData,
      isBulkUpdateInventoryStockLoading,
      isBulkUpdateItemLoading,
      isUpdateOrderLoading,
    ]
  );

  useEffect(() => {
    if (!sortedData.data && searchPhrase === "") {
      if (orderData && orderData.length > 0) {
        setOrder(_remappedData(orderData));
      }
    } else {
      if (!sortedData.data && orderData && orderData.length > 0) {
        const filteredorderData = orderData.filter(
          (res: any) =>
            res.customerId.firstName
              .toLowerCase()
              .includes(searchPhrase.toLowerCase()) ||
            res.customerId.lastName
              .toLowerCase()
              .includes(searchPhrase.toLowerCase()) ||
            res.jobOrderNumber
              .toLowerCase()
              .includes(searchPhrase.toLowerCase())
        );
        setOrder(_remappedData(filteredorderData));
      }
    }
  }, [searchPhrase, orderData, _remappedData, sortedData]);

  useEffect(() => {
    if (sortedData?.data) {
      const checkerRowEditActive = rowEditActive.every(
        (v: boolean) => v === false
      );
      if (!checkerRowEditActive) {
        setRowEditActive(orderData.map(() => false));
      }
      const checkerItemSuffciencyState = itemSufficiencyState
        .map((res: any) => {
          return res.every((v: boolean) => v === true);
        })
        .every((v: boolean) => v === true);
      if (!checkerItemSuffciencyState) {
        setItemSufficiencyState(orderData.map(() => [true, true, true, true]));
      }
      let orderDataSorted = orderData;
      if (sortedData?.data && sortedData?.data === "jobOrderNumber") {
        orderDataSorted = orderDataSorted?.sort((a: any, b: any) => {
          return sortedData?.sort === "up"
            ? a.jobOrderNumber.localeCompare(b.jobOrderNumber)
            : b.jobOrderNumber.localeCompare(a.jobOrderNumber);
        });
      }
      if (sortedData?.data && sortedData?.data === "customer") {
        orderDataSorted = orderDataSorted?.sort((a: any, b: any) => {
          return sortedData?.sort === "up"
            ? a.customerId.firstName.localeCompare(b.customerId.firstName)
            : b.customerId.firstName.localeCompare(a.customerId.firstName);
        });
      }
      if (sortedData?.data && sortedData?.data === "amountDue") {
        orderDataSorted = orderDataSorted?.sort((a: any, b: any) => {
          return sortedData?.sort === "up"
            ? parseFloat(a.amountDue) - parseFloat(b.amountDue)
            : parseFloat(b.amountDue) - parseFloat(a.amountDue);
        });
      }
      if (sortedData?.data && sortedData?.data === "paidStatus") {
        orderDataSorted = orderDataSorted?.sort((a: any, b: any) => {
          return sortedData?.sort === "up"
            ? a.paidStatus.localeCompare(b.paidStatus)
            : b.paidStatus.localeCompare(a.paidStatus);
        });
      }
      if (sortedData?.data && sortedData?.data === "wash") {
        orderDataSorted = orderDataSorted?.sort((a: any, b: any) => {
          return sortedData?.sort === "up"
            ? a.orderWash?.washId?.type.localeCompare(b.orderWash?.washId?.type)
            : b.orderWash?.washId?.type.localeCompare(
                a.orderWash?.washId?.type
              );
        });
      }
      if (sortedData?.data && sortedData?.data === "dry") {
        orderDataSorted = orderDataSorted?.sort((a: any, b: any) => {
          return sortedData?.sort === "up"
            ? a.orderDry?.dryId?.type.localeCompare(b.orderDry?.dryId?.type)
            : b.orderDry?.dryId?.type.localeCompare(a.orderDry?.dryId?.type);
        });
      }
      if (sortedData?.data && sortedData?.data === "wm") {
        orderDataSorted = orderDataSorted?.sort((a: any, b: any) => {
          return sortedData?.sort === "up"
            ? parseFloat(a.orderWash?.machineNumber) -
                parseFloat(b.orderWash?.machineNumber)
            : parseFloat(b.orderWash?.machineNumber) -
                parseFloat(a.orderWash?.machineNumber);
        });
      }
      if (sortedData?.data && sortedData?.data === "dm") {
        orderDataSorted = orderDataSorted?.sort((a: any, b: any) => {
          return sortedData?.sort === "up"
            ? parseFloat(a.orderDry?.machineNumber) -
                parseFloat(b.orderDry?.machineNumber)
            : parseFloat(b.orderDry?.machineNumber) -
                parseFloat(a.orderDry?.machineNumber);
        });
      }
      setOrder(_remappedData(orderDataSorted));
    }
  }, [
    orderData,
    _remappedData,
    sortedData,
    itemSufficiencyState,
    rowEditActive,
  ]);

  useEffect(() => {
    if (
      searchPhrase === "" &&
      orderData &&
      orderData.length > 0 &&
      order.length === 0
    ) {
      setRowEditActive(orderData.map(() => false));
      setItemSufficiencyState(orderData.map(() => [true, true, true, true]));
      setOrder(_remappedData(orderData));
    } else if (
      searchPhrase === "" &&
      orderData &&
      orderData.length === 0 &&
      order.length > 0
    ) {
      setOrder([]);
    }
  }, [orderData, _remappedData, order, searchPhrase]);

  const _cancelOrder = (jobOrderNumber: string, order: any) => {
    setIsCancelModalOpen(true);
    setSelectedJobOrderNumber(jobOrderNumber);
    setSelectedOrderId(order?._id);

    const toUpdateItem =
      order?.orderItem && order?.orderItem.length > 0
        ? order?.orderItem
            ?.map((res: any) => {
              const isEmpty = Object.keys(res).length === 0;
              return (
                !isEmpty && {
                  updateOne: {
                    filter: { _id: res?.inventoryId?._id },
                    update: { $inc: { stock: res.qty } },
                    upsert: false,
                  },
                }
              );
            })
            .filter((res2: any) => res2)
        : [];

    setSelectedOrderToUpdate(toUpdateItem);
  };

  useEffect(() => {
    const updatedTableHeader = isSelectMultipleOpen
      ? tableHeader
      : tableHeader.filter((res: any) => res.dataName !== "checkBox");
    setCurrentTableHeader(updatedTableHeader);
  }, [isSelectMultipleOpen, tableHeader]);

  return (
    <>
      <Header />
      <div className="flex justify-center ...">
        <button
          className="bg-light border-2 border-primary w-[90px] text-primary hover:bg-accent"
          onClick={() => navigate("/dashboard/dropoff")}
        >
          Drop Off
        </button>
        <button className="bg-primary w-[90px] text-white hover:bg-primary-dark">
          DIY
        </button>
      </div>
      <div className="flex justify-between mt-11">
        <div className="flex">
          <h3 className="font-bold text-primary">Active DIY Orders</h3>
          <div className="flex flex-col justify-center ml-5">
            {isBulkUpdateDryLoading ||
            isBulkUpdateInventoryStockLoading ||
            isBulkUpdateItemLoading ||
            isBulkUpdateOrderLoading ||
            isBulkUpdateWashLoading ||
            isBulkUpdateInventoryStockLoading ? (
              <SmallLoading />
            ) : null}
          </div>
        </div>
        <div>
          <input
            type="text"
            className="pt-1 pb-1 pl-2 rounded-sm mr-2"
            placeholder="Search"
            disabled={typeof sortedData?.data !== "undefined"}
            onChange={(e: any) => setSearchPhrase(e.target.value)}
          />
          <Icon icon="bi:search" className="inline" height={24} />
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <div>
          <button
            className={`${
              !isSelectMultipleOpen ? "bg-primary" : "bg-dark"
            } text-white py-1 pl-3 pr-3 rounded-xl mr-3 text-[14px]`}
            onClick={() => {
              setRowEditActive(rowEditActive.map(() => false));
              setIsSelectMultipleOpen(true);
            }}
            disabled={isSelectMultipleOpen}
          >
            Select Multiple
          </button>
          {isSelectMultipleOpen && (
            <>
              <select
                className=" pl-2 rounded-sm mr-2 w-[105px] border-2 border-semi-light appearance-none"
                onChange={(e: any) =>
                  _multiOrderToUpdate(
                    "paidStatus",
                    e.target.value === "Paid Status" ? "null" : e.target.value,
                    true
                  )
                }
                disabled={isorderDataLoading || multiOrderToUpdate.length === 0}
              >
                <option>Paid Status</option>
                <option>Paid</option>
                <option>To Transfer</option>
              </select>
              <span
                className="hover:cursor-pointer text-primary hover:underline mr-2 font-bold"
                onClick={() => _openClaimedMultiOrderModal()}
              >
                Save
              </span>
              <span
                className="hover:cursor-pointer text-primary hover:underline font-bold"
                onClick={() => {
                  setMultiOrderToUpdate([]);
                  setIsSelectMultipleOpen(false);
                }}
              >
                Back
              </span>
            </>
          )}
        </div>
      </div>
      <DataTable
        header={currentTableHeader}
        isLoading={isorderDataLoading}
        data={order}
        isColumnClickable={searchPhrase === ""}
        columnSort={(e: any) =>
          setSortedData({
            sort: sortedData?.sort === "up" ? "down" : "up",
            data: e,
          })
        }
        columnSortIcon={sortedData}
      />
      <Modal
        state={isCancelModalOpen}
        toggle={() => setIsCancelModalOpen(!isCancelModalOpen)}
        title={<h3>Cancel Order</h3>}
        content={
          <h5>{`Are you sure you want to cancel ${selectedJobOrderNumber}?`}</h5>
        }
        footer={
          <>
            <button
              className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-3"
              onClick={() => setIsAdminPasswordModal(!isAdminPasswordModalOpen)}
              disabled={isUpdateOrderLoading}
            >
              Yes
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              onClick={() => setIsCancelModalOpen(!isCancelModalOpen)}
              disabled={isUpdateOrderLoading}
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
            disabled={isVerifyPasswordLoading}
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
              disabled={isVerifyPasswordLoading}
            >
              Confirm
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              onClick={() => {
                setIsAdminPasswordModal(!isAdminPasswordModalOpen);
                setAdminPassword("");
              }}
              disabled={isVerifyPasswordLoading}
            >
              Cancel
            </button>
          </>
        }
        size="sm"
      />
      <Modal
        state={openClaimedOrderModal}
        toggle={() => setOpenClaimedOrderModal(!openClaimedOrderModal)}
        title={<h3>Close Job Order</h3>}
        content={
          <h5>{`This action will close the JO ${selectedData?.jobOrderNumber}. Do you want to continue?`}</h5>
        }
        footer={
          <>
            <button
              className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-3"
              onClick={() =>
                _updateOrder(selectedIndex, selectedData?._id, selectedData)
              }
              disabled={isUpdateOrderLoading}
            >
              Yes
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              onClick={() => setOpenClaimedOrderModal(!openClaimedOrderModal)}
              disabled={isUpdateOrderLoading}
            >
              No
            </button>
          </>
        }
        size="sm"
      />
      <Modal
        state={openClaimedMultiOrderModal}
        toggle={() =>
          setOpenClaimedMultiOrderModal(!openClaimedMultiOrderModal)
        }
        title={<h3>Close Job Orders</h3>}
        content={
          <h5>{`This action will close all the selected Job. Do you want to continue?`}</h5>
        }
        footer={
          <>
            <button
              className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-3"
              onClick={() => _updateMultiOrder()}
              disabled={isUpdateOrderLoading}
            >
              Yes
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              onClick={() =>
                setOpenClaimedMultiOrderModal(!openClaimedMultiOrderModal)
              }
              disabled={isUpdateOrderLoading}
            >
              No
            </button>
          </>
        }
        size="sm"
      />
      <TotalModal
        customerId={selectedData?.customerId?._id}
        isModalOpen={isTotalModalOpen}
        setIsModalOpen={() => setIsTotalModalOpen(!isTotalModalOpen)}
      />
      <ComputeTotalLoading orderId={toUpdateGrandTotalId} />
    </>
  );
};

const mapStateToProps = (global: any) => ({
  loggedInUserUsername: global.authenticatedUser.user.username,
});

export default connect(mapStateToProps)(TableDiy);
