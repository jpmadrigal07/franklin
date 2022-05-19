import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useMutation, useQuery } from "react-query";
import { addInventory, getAllInventory } from "../../utils/inventory";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useParams } from "react-router-dom";
import Asterisk from "../../components/Asterisk";
import validate from "../../validation/order";
import getErrorsFromValidation from "../../utils/getErrorsFromValidation";
import findInputError from "../../utils/findInputError";
import clean from "../../utils/cleanObject";
import { Icon } from "@iconify/react";
import { getAllCustomer } from "../../utils/customer";
import { getAllWash } from "../../utils/wash";
import { getAllDry } from "../../utils/dry";
import { getAllAddOn } from "../../utils/addOn";
import { getAllDiscount } from "../../utils/discount";
import nextJobOrderNumber from "../../utils/nextJobOrderNumber";
import { getAllLaundry } from "../../utils/laundry";
import { addOrder, getAllOrder } from "../../utils/order";
import { addOrderWash } from "../../utils/api/orderWash";
import { addOrderDry } from "../../utils/api/orderDry";
import { addOrderItem } from "../../utils/api/orderItem";
import { addOrderAddOn, bulkAddOrderAddOn } from "../../utils/api/orderAddOn";
import {
  addOrderDiscount,
  bulkAddOrderDiscounts,
} from "../../utils/api/orderDiscount";
import { getAllStaff } from "../../utils/staff";
import { getAllFolder } from "../../utils/api/folder";

const AddExtraDropOff = (props: any) => {
  const { loggedInUserId, loggedInUserType } = props;
  const MySwal = withReactContent(Swal);
  const { id: paramId } = useParams();
  const navigate = useNavigate();

  const [saveType, setSaveType] = useState("");

  const [customAddOnServices, setCustomAddOnServices] = useState<any>([]);
  const [customDiscount, setCustomDiscount] = useState<any>([]);

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [weight, setWeight] = useState<number | undefined>();
  const [selectedWash, setSelectedWash] = useState("");
  const [selectedDry, setSelectedDry] = useState("");
  const [selectedDetergentType, setSelectedDetergentType] = useState("");
  const [detergentQty, setDetergentQty] = useState<number | undefined>();
  const [selectedFabConType, setSelectedFabConType] = useState("");
  const [fabConQty, setFabConQty] = useState<number | undefined>();
  const [zonroxQty, setZonroxQty] = useState<number | undefined>();

  const [selectedAddOnService, setSelectedAddOnService] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState("");

  const [selectedAddOnServices, setSelectedAddOnServices] = useState<any>([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState<any>([]);

  const [selectedDiscountsPrices, setSelectedDiscountPrices] = useState<any>(
    []
  );
  const [selectedAddOnServicesPrices, setSelectedAddOnServicesPrices] =
    useState<any>([]);

  const [formErrors, setFormErrors] = useState<any[]>([]);

  const start = new Date().setHours(0, 0, 0, 0);
  const end = new Date().setHours(23, 59, 59, 999);

  const foldersCondition = `{ "createdAt": { "$gte": "${start}", "$lt": "${end}" } }`;

  const { data: folderData } = useQuery("folders", () =>
    getAllFolder(encodeURI(foldersCondition))
  );

  const { data: laundryData } = useQuery("dropOffFee", () =>
    getAllLaundry(`{"type":"Drop Off Fee"}`)
  );

  const { data: staffData, refetch: refetchStaffData } = useQuery(
    "loggedInStaff",
    () => getAllStaff(`{"userId":"${loggedInUserId}"}`),
    {
      enabled: false,
    }
  );

  const { data: orderData, isLoading: isOrderDataLoading } = useQuery(
    "order",
    () => getAllOrder(`{"laundryId": { "$exists": true } }`)
  );

  const { data: customerData, isLoading: isCustomerDataLoading } = useQuery(
    "customer",
    () => getAllCustomer()
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

  const { data: addOnData, isLoading: isAddOnDataLoading } = useQuery(
    "addOn",
    () => getAllAddOn()
  );

  const { data: discountData, isLoading: isDiscountDataLoading } = useQuery(
    "discount",
    () => getAllDiscount()
  );

  useEffect(() => {
    if (paramId) {
      const customer =
        customerData &&
        customerData.find((res: any) => {
          return res._id === paramId;
        });
      setSelectedCustomer(JSON.stringify(customer));
    }
    return () => {
      setSaveType("");
    };
  }, [customerData, paramId]);

  const { mutate: triggerAddOrder, isLoading: isAddOrderLoading } = useMutation(
    async (order: any) => addOrder(order),
    {
      onSuccess: async () => {
        if (selectedWash && JSON.parse(selectedWash)._id) {
          triggerAddOrderWash({
            jobOrderNumber:
              orderData &&
              nextJobOrderNumber(
                orderData[0] ? orderData[0].jobOrderNumber : "000000F",
                "F"
              ),
            washId: selectedWash && JSON.parse(selectedWash)._id,
            qty: 1,
            total: selectedWash ? JSON.parse(selectedWash)?.price : 0,
          });
        } else if (selectedDry && JSON.parse(selectedDry)._id) {
          triggerAddOrderDry({
            jobOrderNumber:
              orderData &&
              nextJobOrderNumber(
                orderData[0] ? orderData[0].jobOrderNumber : "000000F",
                "F"
              ),
            dryId: selectedDry && JSON.parse(selectedDry)._id,
            qty: 1,
            total: selectedDry ? JSON.parse(selectedDry)?.price : 0,
          });
        } else {
          _thirdRequests();
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
    }
  );

  const { mutate: triggerAddOrderWash, isLoading: isAddOrderWashLoading } =
    useMutation(async (order: any) => addOrderWash(order), {
      onSuccess: async () => {
        if (selectedDry && JSON.parse(selectedDry)._id) {
          triggerAddOrderDry({
            jobOrderNumber:
              orderData &&
              nextJobOrderNumber(
                orderData[0] ? orderData[0].jobOrderNumber : "000000F",
                "F"
              ),
            dryId: selectedDry && JSON.parse(selectedDry)._id,
            qty: 1,
            total: selectedDry ? JSON.parse(selectedDry)?.price : 0,
          });
        } else {
          _thirdRequests();
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

  const _thirdRequests = () => {
    const detergentQtyFinal = detergentQty ? detergentQty : 0;
    const fabConQtyFinal = fabConQty ? fabConQty : 0;
    const zonroxQtyFinal = zonroxQty ? zonroxQty : 0;
    const zonrox =
      inventoryData &&
      inventoryData.find(
        (res: any) => res.name === "Zonrox" && res.type === "Bleach"
      );
    if (detergentQtyFinal > 0) {
      triggerAddOrderItem({
        jobOrderNumber:
          orderData &&
          nextJobOrderNumber(
            orderData[0] ? orderData[0].jobOrderNumber : "000000F",
            "F"
          ),
        inventoryId:
          selectedDetergentType && JSON.parse(selectedDetergentType)._id,
        qty: detergentQty,
        total: selectedDetergentType
          ? JSON.parse(selectedDetergentType)?.unitCost * detergentQtyFinal
          : 0,
      });
    }
    if (fabConQtyFinal > 0) {
      triggerAddOrderItem({
        jobOrderNumber:
          orderData &&
          nextJobOrderNumber(
            orderData[0] ? orderData[0].jobOrderNumber : "000000F",
            "F"
          ),
        inventoryId: selectedFabConType && JSON.parse(selectedFabConType)._id,
        qty: fabConQty,
        total: selectedFabConType
          ? JSON.parse(selectedFabConType)?.unitCost * fabConQtyFinal
          : 0,
      });
    }
    if (zonroxQtyFinal > 0) {
      triggerAddOrderItem({
        jobOrderNumber:
          orderData &&
          nextJobOrderNumber(
            orderData[0] ? orderData[0].jobOrderNumber : "000000F",
            "F"
          ),
        inventoryId: zonrox && zonrox?._id,
        qty: zonroxQtyFinal,
        total: zonrox ? zonrox?.unitCost * zonroxQtyFinal : 0,
      });
    }
    if (selectedAddOnServices.length > 0) {
      _bulkAddCustomAddOnServices();
    }
    if (selectedDiscounts.length > 0) {
      _bulkAddCustomDiscounts();
    }
    if (selectedAddOnService && JSON.parse(selectedAddOnService)._id) {
      triggerAddOrderAddOn({
        jobOrderNumber:
          orderData &&
          nextJobOrderNumber(
            orderData[0] ? orderData[0].jobOrderNumber : "000000F",
            "F"
          ),
        addOnId: selectedAddOnService && JSON.parse(selectedAddOnService)._id,
        qty: 1,
        total: selectedAddOnService
          ? JSON.parse(selectedAddOnService)?.price
          : 0,
      });
    } else if (selectedDiscount && JSON.parse(selectedDiscount)._id) {
      triggerAddOrderDiscount({
        jobOrderNumber:
          orderData &&
          nextJobOrderNumber(
            orderData[0] ? orderData[0].jobOrderNumber : "000000F",
            "F"
          ),
        discountId: selectedDiscount && JSON.parse(selectedDiscount)._id,
        qty: 1,
        total: selectedDiscount ? JSON.parse(selectedDiscount)?.price : 0,
      });
    } else {
      MySwal.fire({
        title: "Order created!",
        text: "You will be redirected",
        icon: "success",
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        if (saveType === "saveEnd") {
          window.open(
            `/print/${selectedCustomer && JSON.parse(selectedCustomer)._id}`,
            "_blank"
          );
          navigate("/orders");
        } else {
          window.location.href = `/orders/dropoff/add/extra/${
            selectedCustomer && JSON.parse(selectedCustomer)._id
          }`;
        }
      });
    }
  };

  const { mutate: triggerAddOrderDry, isLoading: isAddOrderDryLoading } =
    useMutation(async (order: any) => addOrderDry(order), {
      onSuccess: async () => {
        _thirdRequests();
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

  const { mutate: triggerAddOrderItem, isLoading: isAddOrderItemLoading } =
    useMutation(async (order: any) => addOrderItem(order), {
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

  const { mutate: triggerAddOrderAddOn, isLoading: isAddOrderAddOnLoading } =
    useMutation(async (order: any) => addOrderAddOn(order), {
      onSuccess: async () => {
        if (selectedDiscount && JSON.parse(selectedDiscount)._id) {
          triggerAddOrderDiscount({
            jobOrderNumber:
              orderData &&
              nextJobOrderNumber(
                orderData[0] ? orderData[0].jobOrderNumber : "000000F",
                "F"
              ),
            discountId: selectedDiscount && JSON.parse(selectedDiscount)._id,
            qty: 1,
            total: selectedDiscount ? JSON.parse(selectedDiscount)?.price : 0,
          });
        } else {
          MySwal.fire({
            title: "Order created!",
            text: "You will be redirected",
            icon: "success",
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 3000,
          }).then(() => {
            if (saveType === "saveEnd") {
              window.open(
                `/print/${
                  selectedCustomer && JSON.parse(selectedCustomer)._id
                }`,
                "_blank"
              );
              navigate("/orders");
            } else {
              window.location.href = `/orders/dropoff/add/extra/${
                selectedCustomer && JSON.parse(selectedCustomer)._id
              }`;
            }
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

  const {
    mutate: triggerAddOrderDiscount,
    isLoading: isAddOrderDiscountLoading,
  } = useMutation(async (order: any) => addOrderDiscount(order), {
    onSuccess: async () => {
      MySwal.fire({
        title: "Order created!",
        text: "You will be redirected",
        icon: "success",
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        if (saveType === "saveEnd") {
          window.open(
            `/print/${selectedCustomer && JSON.parse(selectedCustomer)._id}`,
            "_blank"
          );
          navigate("/orders");
        } else {
          window.location.href = `/orders/dropoff/add/extra/${
            selectedCustomer && JSON.parse(selectedCustomer)._id
          }`;
        }
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

  const {
    mutate: triggerBulkAddOrderAddOn,
    isLoading: isBulkAddOrderAddOnLoading,
  } = useMutation(async (order: any) => bulkAddOrderAddOn(order), {
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
    mutate: triggerBulkAddOrderDiscount,
    isLoading: isBulkAddOrderDiscountLoading,
  } = useMutation(async (order: any) => bulkAddOrderDiscounts(order), {
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

  const _bulkAddCustomAddOnServices = () => {
    const bulkAddOnServices = selectedAddOnServices.map((res: any) => {
      const data = selectedAddOnServicesPrices.find(
        (res2: any) => res2.id === res
      );
      return {
        jobOrderNumber:
          orderData &&
          nextJobOrderNumber(
            orderData[0] ? orderData[0].jobOrderNumber : "000000F",
            "F"
          ),
        addOnId: data.id,
        qty: 1,
        total: data.price,
      };
    });
    triggerBulkAddOrderAddOn({ bulk: bulkAddOnServices });
  };

  const _bulkAddCustomDiscounts = () => {
    const bulkAddDiscounts = selectedDiscounts.map((res: any) => {
      const data = selectedDiscountsPrices.find((res2: any) => res2.id === res);
      return {
        jobOrderNumber:
          orderData &&
          nextJobOrderNumber(
            orderData[0] ? orderData[0].jobOrderNumber : "000000F",
            "F"
          ),
        discountId: data.id,
        qty: 1,
        total: data.price,
      };
    });
    triggerBulkAddOrderDiscount({ bulk: bulkAddDiscounts });
  };

  const _addOrder = (type: string) => {
    setSaveType(type);
    const washTotal = selectedWash ? JSON.parse(selectedWash)?.price : 0;
    const dryTotal = selectedDry ? JSON.parse(selectedDry)?.price : 0;
    const detergentQtyFinal = detergentQty ? detergentQty : 0;
    const detergentTotal = selectedDetergentType
      ? JSON.parse(selectedDetergentType).unitCost * detergentQtyFinal
      : 0;
    const fabConQtyFinal = fabConQty ? fabConQty : 0;
    const fabConTotal = selectedFabConType
      ? JSON.parse(selectedFabConType).unitCost * fabConQtyFinal
      : 0;
    const defaultAddOnServiceTotal = selectedAddOnService
      ? JSON.parse(selectedAddOnService).price
      : 0;
    const defaultDiscountTotal = selectedDiscount
      ? JSON.parse(selectedDiscount).price
      : 0;
    const zonrox =
      inventoryData &&
      inventoryData.find(
        (res: any) => res.name === "Zonrox" && res.type === "Bleach"
      );
    const zonroxQtyFinal = zonroxQty ? zonroxQty : 0;
    const zonroxTotal = zonrox ? zonrox.unitCost * zonroxQtyFinal : 0;
    const zonroxStockQty = zonrox ? zonrox.stock : 0;
    const customAddOnServicesTotal =
      selectedAddOnServices.length > 0
        ? selectedAddOnServices.reduce(function (a: any, b: any) {
            const customPrice = selectedAddOnServicesPrices.find(
              (res: any) => res.id === b
            )?.price;
            return a + customPrice;
          }, 0)
        : 0;
    const customDiscountsTotal =
      selectedDiscounts.length > 0
        ? selectedDiscounts.reduce(function (a: any, b: any) {
            const customPrice = selectedDiscountsPrices.find(
              (res: any) => res.id === b
            )?.price;
            return a + customPrice;
          }, 0)
        : 0;
    const amountDue =
      washTotal +
      dryTotal +
      detergentTotal +
      fabConTotal +
      zonroxTotal +
      defaultAddOnServiceTotal +
      customAddOnServicesTotal -
      (defaultDiscountTotal + customDiscountsTotal);

    const washId = selectedWash && JSON.parse(selectedWash)._id;
    const dryId = selectedDry && JSON.parse(selectedDry)._id;

    const detergentTypeId =
      selectedDetergentType && JSON.parse(selectedDetergentType)._id;
    const detergentTypeQty =
      selectedDetergentType && JSON.parse(selectedDetergentType).stock;
    const fabConTypeId =
      selectedFabConType && JSON.parse(selectedFabConType)._id;
    const fabConTypeQty =
      selectedFabConType && JSON.parse(selectedFabConType).stock;

    const orderToFilter = {
      staffId:
        staffData && loggedInUserType === "Staff"
          ? staffData[0]._id
          : loggedInUserId,
      laundryId: null,
      customerId: selectedCustomer && JSON.parse(selectedCustomer)._id,
      jobOrderNumber:
        orderData &&
        nextJobOrderNumber(
          orderData[0] ? orderData[0].jobOrderNumber : "000000F",
          "F"
        ),
      folderId: folderData && folderData[0]._id,
      weight,
      paidStatus: "Unpaid",
      orderStatus: "In",
      claimStatus: "Unclaimed",
      washId: washId,
      dryId: dryId,
      detergentTypeId: detergentTypeId,
      detergentQty: detergentQty,
      fabConTypeId: fabConTypeId,
      fabConQty: fabConQty,
      addOnServiceId:
        selectedAddOnService && JSON.parse(selectedAddOnService)._id,
      discountId: selectedDiscount && JSON.parse(selectedDiscount)._id,
      zonrox: zonroxQtyFinal,
    };

    const order = {
      staffId:
        staffData && loggedInUserType === "Staff"
          ? staffData[0]._id
          : loggedInUserId,
      laundryId: null,
      customerId: selectedCustomer && JSON.parse(selectedCustomer)._id,
      jobOrderNumber:
        orderData &&
        nextJobOrderNumber(
          orderData[0] ? orderData[0].jobOrderNumber : "000000F",
          "F"
        ),
      folderId: folderData && folderData[0]._id,
      weight,
      amountDue,
      paidStatus: "Unpaid",
      orderStatus: "In",
      claimStatus: "Unclaimed",
    };

    const filteredValues = clean(orderToFilter);
    const validatedData: any = validate(filteredValues);
    const errors = validatedData ? getErrorsFromValidation(validatedData) : [];
    let customErrors: any[] = [];
    if (!washId && !dryId && !detergentTypeId && !fabConTypeId && !zonroxQty) {
      const newError = [
        {
          input: "washId",
          errorMessage: "Select at least 1 service or item",
        },
        {
          input: "dryId",
          errorMessage: "Select at least 1 service or item",
        },
        {
          input: "detergentTypeId",
          errorMessage: "Select at least 1 service or item",
        },
        {
          input: "detergentQty",
          errorMessage: "Select at least 1 service or item",
        },
        {
          input: "fabConTypeId",
          errorMessage: "Select at least 1 service or item",
        },
        {
          input: "fabConQty",
          errorMessage: "Select at least 1 service or item",
        },
        {
          input: "zonrox",
          errorMessage: "Select at least 1 service or item",
        },
      ];
      customErrors = [...customErrors, ...newError];
    }

    if (detergentTypeId && !detergentQty) {
      const newError = [
        {
          input: "detergentQty",
          errorMessage: "This needs to be greater than 0",
        },
      ];
      customErrors = [...customErrors, ...newError];
    }

    if (fabConTypeId && !fabConQty) {
      const newError = [
        {
          input: "fabConQty",
          errorMessage: "This needs to be greater than 0",
        },
      ];
      customErrors = [...customErrors, ...newError];
    }

    if (detergentQtyFinal > detergentTypeQty) {
      const newError = [
        {
          input: "detergentQty",
          errorMessage: `Remaining stocks is ${detergentTypeQty}`,
        },
      ];
      customErrors = [...customErrors, ...newError];
    }

    if (fabConQtyFinal > fabConTypeQty) {
      const newError = [
        {
          input: "fabConQty",
          errorMessage: `Remaining stocks is ${fabConTypeQty}`,
        },
      ];
      customErrors = [...customErrors, ...newError];
    }

    if (zonroxQtyFinal > zonroxStockQty) {
      const newError = [
        {
          input: "zonrox",
          errorMessage: `Remaining stocks is ${zonroxStockQty}`,
        },
      ];
      customErrors = [...customErrors, ...newError];
    }

    const combinedErrors = [...errors, ...customErrors];

    if (combinedErrors && combinedErrors.length === 0) {
      triggerAddOrder(order);
    } else {
      setFormErrors(combinedErrors);
    }
  };

  const _customCustomAddOnServices = (index: number, value: string) => {
    const obj = JSON.parse(value);
    setSelectedAddOnServicesPrices([
      ...selectedAddOnServicesPrices,
      {
        id: obj._id,
        price: obj.price,
      },
    ]);
    let services = selectedAddOnServices;
    services[index] = obj._id;
    setSelectedAddOnServices(services);
  };

  const _customCustomDiscounts = (index: number, value: string) => {
    const obj = JSON.parse(value);
    setSelectedDiscountPrices([
      ...selectedDiscountsPrices,
      {
        id: obj._id,
        price: obj.price,
      },
    ]);
    let discounts = selectedDiscounts;
    discounts[index] = obj._id;
    setSelectedDiscounts(discounts);
  };

  const _addCustomAddOnServices = () => {
    const services = [
      ...customAddOnServices,
      <div>
        <select
          className={`pt-1 pb-1 pl-2 ${
            customAddOnServices.length < 6 ? "mt-6" : "mt-2"
          } rounded-sm mr-2 w-full border-2 border-semi-light appearance-none`}
          onChange={(e: any) =>
            _customCustomAddOnServices(
              customAddOnServices.length,
              e.target.value
            )
          }
          disabled={
            isAddOnDataLoading ||
            isAddOrderLoading ||
            isAddOrderWashLoading ||
            isAddOrderDryLoading ||
            isAddOrderItemLoading ||
            isAddOrderAddOnLoading ||
            isAddOrderDiscountLoading ||
            isBulkAddOrderAddOnLoading ||
            isBulkAddOrderDiscountLoading
          }
        >
          <option value="">Select Add-on Services</option>
          {addOnData &&
            addOnData.map((res: any) => {
              return <option value={JSON.stringify(res)}>{res.type}</option>;
            })}
        </select>
      </div>,
    ];
    setSelectedAddOnServices([...selectedAddOnServices, ""]);
    setCustomAddOnServices(services);
  };

  const _addCustomDiscount = () => {
    const discount = [
      ...customDiscount,
      <div>
        <select
          className={`pt-1 pb-1 pl-2 ${
            customDiscount.length < 6 ? "mt-6" : "mt-2"
          } rounded-sm mr-2 w-full border-2 border-semi-light appearance-none`}
          onChange={(e: any) =>
            _customCustomDiscounts(customDiscount.length, e.target.value)
          }
          disabled={
            isDiscountDataLoading ||
            isAddOrderLoading ||
            isAddOrderWashLoading ||
            isAddOrderDryLoading ||
            isAddOrderItemLoading ||
            isAddOrderAddOnLoading ||
            isAddOrderDiscountLoading ||
            isBulkAddOrderAddOnLoading ||
            isBulkAddOrderDiscountLoading
          }
        >
          <option value="">Select Discount</option>
          {discountData &&
            discountData.map((res: any) => {
              return <option value={JSON.stringify(res)}>{res.type}</option>;
            })}
        </select>
      </div>,
    ];
    setSelectedDiscounts([...customDiscount, ""]);
    setCustomDiscount(discount);
  };

  useEffect(() => {
    if (staffData && staffData.length > 0) {
      refetchStaffData();
    }
  }, [staffData, refetchStaffData]);

  return (
    <>
      <div className="flex justify-between mt-11">
        <div>
          <h1 className="font-bold text-primary mt-7">
            Add Extra Drop-Off Order
          </h1>
        </div>
        {selectedCustomer && JSON.parse(selectedCustomer)?.notes && (
          <div className="p-3 border-2 border-primary rounded-md">
            <p className="text-center font-bold">NOTES</p>
            <p className="text-center">{JSON.parse(selectedCustomer)?.notes}</p>
          </div>
        )}
      </div>
      <form className="w-full mt-7">
        <div className="grid grid-cols-7 gap-4">
          <div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Customer Name
              <Asterisk />
            </label>
            <select
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "customerId")
                  ? "border-red"
                  : "border-accent"
              } appearance-none`}
              onChange={(e: any) => setSelectedCustomer(e.target.value)}
              disabled={
                isCustomerDataLoading ||
                isOrderDataLoading ||
                isAddOrderLoading ||
                isAddOrderWashLoading ||
                isAddOrderDryLoading ||
                isAddOrderItemLoading ||
                isAddOrderAddOnLoading ||
                isAddOrderDiscountLoading ||
                isBulkAddOrderAddOnLoading ||
                isBulkAddOrderDiscountLoading
              }
            >
              <option value="">Select Customer</option>
              {customerData &&
                customerData.map((res: any) => {
                  const isSelected: boolean =
                    paramId && res._id === paramId ? true : false;
                  return (
                    <option value={JSON.stringify(res)} selected={isSelected}>
                      {res.firstName} {res.lastName}
                    </option>
                  );
                })}
            </select>
            {findInputError(formErrors, "customerId") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "customerId")}
              </p>
            ) : (
              ""
            )}
          </div>
          <div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Weight
              <Asterisk />
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm w-full border-2 ${
                findInputError(formErrors, "weight")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="number"
              onChange={(e: any) => setWeight(parseInt(e.target.value))}
              disabled={
                isOrderDataLoading ||
                isAddOrderLoading ||
                isAddOrderWashLoading ||
                isAddOrderDryLoading ||
                isAddOrderItemLoading ||
                isAddOrderAddOnLoading ||
                isAddOrderDiscountLoading ||
                isBulkAddOrderAddOnLoading ||
                isBulkAddOrderDiscountLoading
              }
            />
            {findInputError(formErrors, "weight") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "weight")}
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4 mt-3">
          <div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Wash
              <Asterisk />
            </label>
            <select
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "washId")
                  ? "border-red"
                  : "border-accent"
              } appearance-none`}
              onChange={(e: any) => setSelectedWash(e.target.value)}
              disabled={
                isWashDataLoading ||
                isOrderDataLoading ||
                isAddOrderLoading ||
                isAddOrderWashLoading ||
                isAddOrderDryLoading ||
                isAddOrderItemLoading ||
                isAddOrderAddOnLoading ||
                isAddOrderDiscountLoading ||
                isBulkAddOrderAddOnLoading ||
                isBulkAddOrderDiscountLoading
              }
            >
              <option value="">Select Wash</option>
              {washData &&
                washData.map((res: any) => {
                  return (
                    <option value={JSON.stringify(res)}>{res.type}</option>
                  );
                })}
            </select>
            {findInputError(formErrors, "washId") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "washId")}
              </p>
            ) : (
              ""
            )}
          </div>
          <div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Dry
              <Asterisk />
            </label>
            <select
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "dryId")
                  ? "border-red"
                  : "border-accent"
              } appearance-none`}
              onChange={(e: any) => setSelectedDry(e.target.value)}
              disabled={
                isDryDataLoading ||
                isOrderDataLoading ||
                isAddOrderLoading ||
                isAddOrderWashLoading ||
                isAddOrderDryLoading ||
                isAddOrderItemLoading ||
                isAddOrderAddOnLoading ||
                isAddOrderDiscountLoading ||
                isBulkAddOrderAddOnLoading ||
                isBulkAddOrderDiscountLoading
              }
            >
              <option value="">Select Dry</option>
              {dryData &&
                dryData.map((res: any) => {
                  return (
                    <option value={JSON.stringify(res)}>{res.type}</option>
                  );
                })}
            </select>
            {findInputError(formErrors, "dryId") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "dryId")}
              </p>
            ) : (
              ""
            )}
          </div>
          <div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Detergent Type
              <Asterisk />
            </label>
            <select
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "detergentTypeId")
                  ? "border-red"
                  : "border-accent"
              } appearance-none`}
              onChange={(e: any) => setSelectedDetergentType(e.target.value)}
              disabled={
                isInventoryDataLoading ||
                isOrderDataLoading ||
                isAddOrderLoading ||
                isAddOrderWashLoading ||
                isAddOrderDryLoading ||
                isAddOrderItemLoading ||
                isAddOrderAddOnLoading ||
                isAddOrderDiscountLoading ||
                isBulkAddOrderAddOnLoading ||
                isBulkAddOrderDiscountLoading
              }
            >
              <option value="">Select Detergent Type</option>
              {inventoryData &&
                inventoryData
                  .filter((res: any) => res.type === "Detergent")
                  .map((res: any) => {
                    return (
                      <option value={JSON.stringify(res)}>{res.name}</option>
                    );
                  })}
            </select>
            {findInputError(formErrors, "detergentTypeId") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "detergentTypeId")}
              </p>
            ) : (
              ""
            )}
          </div>
          <div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Detergent Qty
              <Asterisk />
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "detergentQty")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="number"
              onChange={(e: any) => setDetergentQty(parseInt(e.target.value))}
              disabled={
                isInventoryDataLoading ||
                isOrderDataLoading ||
                isAddOrderLoading ||
                isAddOrderWashLoading ||
                isAddOrderDryLoading ||
                isAddOrderItemLoading ||
                isAddOrderAddOnLoading ||
                isAddOrderDiscountLoading ||
                isBulkAddOrderAddOnLoading ||
                isBulkAddOrderDiscountLoading
              }
            />
            {findInputError(formErrors, "detergentQty") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "detergentQty")}
              </p>
            ) : (
              ""
            )}
          </div>
          <div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              FabCon Type
              <Asterisk />
            </label>
            <select
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-2 ${
                findInputError(formErrors, "fabConTypeId")
                  ? "border-red"
                  : "border-accent"
              } appearance-none`}
              onChange={(e: any) => setSelectedFabConType(e.target.value)}
              disabled={
                isInventoryDataLoading ||
                isOrderDataLoading ||
                isAddOrderLoading ||
                isAddOrderWashLoading ||
                isAddOrderDryLoading ||
                isAddOrderItemLoading ||
                isAddOrderAddOnLoading ||
                isAddOrderDiscountLoading ||
                isBulkAddOrderAddOnLoading ||
                isBulkAddOrderDiscountLoading
              }
            >
              <option value="">Select FabCon Type</option>
              {inventoryData &&
                inventoryData
                  .filter((res: any) => res.type === "FabCon")
                  .map((res: any) => {
                    return (
                      <option value={JSON.stringify(res)}>{res.name}</option>
                    );
                  })}
            </select>
            {findInputError(formErrors, "fabConTypeId") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "fabConTypeId")}
              </p>
            ) : (
              ""
            )}
          </div>
          <div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              FabCon Qty
              <Asterisk />
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "fabConQty")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="number"
              onChange={(e: any) => setFabConQty(parseInt(e.target.value))}
              disabled={
                isInventoryDataLoading ||
                isOrderDataLoading ||
                isAddOrderLoading ||
                isAddOrderWashLoading ||
                isAddOrderDryLoading ||
                isAddOrderItemLoading ||
                isAddOrderAddOnLoading ||
                isAddOrderDiscountLoading ||
                isBulkAddOrderAddOnLoading ||
                isBulkAddOrderDiscountLoading
              }
            />
            {findInputError(formErrors, "fabConQty") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "fabConQty")}
              </p>
            ) : (
              ""
            )}
          </div>
          <div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              ZX
              <Asterisk />
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "zonrox")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="number"
              onChange={(e: any) => setZonroxQty(parseInt(e.target.value))}
              disabled={
                isInventoryDataLoading ||
                isOrderDataLoading ||
                isAddOrderLoading ||
                isAddOrderWashLoading ||
                isAddOrderDryLoading ||
                isAddOrderItemLoading ||
                isAddOrderAddOnLoading ||
                isAddOrderDiscountLoading ||
                isBulkAddOrderAddOnLoading ||
                isBulkAddOrderDiscountLoading
              }
            />
            {findInputError(formErrors, "zonrox") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "zonrox")}
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4 mt-3">
          <div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Add-On Services
            </label>
            <select
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-2 ${
                findInputError(formErrors, "addOnServiceId")
                  ? "border-red"
                  : "border-accent"
              } appearance-none`}
              onChange={(e: any) => setSelectedAddOnService(e.target.value)}
              disabled={
                isAddOnDataLoading ||
                isOrderDataLoading ||
                isAddOrderLoading ||
                isAddOrderWashLoading ||
                isAddOrderDryLoading ||
                isAddOrderItemLoading ||
                isAddOrderAddOnLoading ||
                isAddOrderDiscountLoading ||
                isBulkAddOrderAddOnLoading ||
                isBulkAddOrderDiscountLoading
              }
            >
              <option value="">Select Add-on Services</option>
              {addOnData &&
                addOnData.map((res: any) => {
                  return (
                    <option value={JSON.stringify(res)}>{res.type}</option>
                  );
                })}
            </select>
            {findInputError(formErrors, "addOnServiceId") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "addOnServiceId")}
              </p>
            ) : (
              ""
            )}
          </div>
          {customAddOnServices}
          <div>
            <Icon
              icon="bi:plus-circle"
              className={`inline ${
                customAddOnServices.length < 6 ? "mt-7" : "mt-3"
              } text-primary hover:cursor-pointer`}
              height={24}
              onClick={() => _addCustomAddOnServices()}
            />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4 mt-3">
          <div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Discount
            </label>
            <select
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-2 ${
                findInputError(formErrors, "discountId")
                  ? "border-red"
                  : "border-accent"
              } appearance-none`}
              onChange={(e: any) => setSelectedDiscount(e.target.value)}
              disabled={
                isDiscountDataLoading ||
                isOrderDataLoading ||
                isAddOrderLoading ||
                isAddOrderWashLoading ||
                isAddOrderDryLoading ||
                isAddOrderItemLoading ||
                isAddOrderAddOnLoading ||
                isAddOrderDiscountLoading ||
                isBulkAddOrderAddOnLoading ||
                isBulkAddOrderDiscountLoading
              }
            >
              <option value="">Select Discount</option>
              {discountData &&
                discountData.map((res: any) => {
                  return (
                    <option value={JSON.stringify(res)}>{res.type}</option>
                  );
                })}
            </select>
            {findInputError(formErrors, "discountId") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "discountId")}
              </p>
            ) : (
              ""
            )}
          </div>
          {customDiscount}
          <div>
            <Icon
              icon="bi:plus-circle"
              className={`inline ${
                customDiscount.length < 6 ? "mt-7" : "mt-3"
              } text-primary hover:cursor-pointer`}
              height={24}
              onClick={() => _addCustomDiscount()}
            />
          </div>
        </div>
        <div className="flex justify-end mt-7">
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-4"
            type="button"
            disabled={
              isOrderDataLoading ||
              isAddOrderLoading ||
              isAddOrderWashLoading ||
              isAddOrderDryLoading ||
              isAddOrderItemLoading ||
              isAddOrderAddOnLoading ||
              isAddOrderDiscountLoading ||
              isBulkAddOrderAddOnLoading ||
              isBulkAddOrderDiscountLoading
            }
            onClick={() => _addOrder("saveAdd")}
          >
            Save & Add
          </button>
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-4"
            type="button"
            disabled={
              isOrderDataLoading ||
              isAddOrderLoading ||
              isAddOrderWashLoading ||
              isAddOrderDryLoading ||
              isAddOrderItemLoading ||
              isAddOrderAddOnLoading ||
              isAddOrderDiscountLoading ||
              isBulkAddOrderAddOnLoading ||
              isBulkAddOrderDiscountLoading
            }
            onClick={() => _addOrder("saveEnd")}
          >
            Save & End
          </button>
        </div>
      </form>
    </>
  );
};

const mapStateToProps = (global: any) => ({
  loggedInUserId: global.authenticatedUser.user.id,
  loggedInUserType: global.authenticatedUser.user.type,
});

export default connect(mapStateToProps)(AddExtraDropOff);