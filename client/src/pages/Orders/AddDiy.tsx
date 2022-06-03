import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useMutation, useQuery } from "react-query";
import { getAllInventory } from "../../utils/inventory";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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

const AddDiy = (props: any) => {
  const { loggedInUserId, loggedInUserType } = props;
  const MySwal = withReactContent(Swal);
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  const toPrintJO = searchParams.get("toPrintJO");

  const [isOpenCustomer, setIsOpenCustomer] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [customers, setCustomers] = useState([]);

  const [customAddOnServices, setCustomAddOnServices] = useState<any>([]);
  const [customDiscount, setCustomDiscount] = useState<any>([]);

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [weight, setWeight] = useState<number | undefined>();
  const [selectedWash, setSelectedWash] = useState("");
  const [selectedDry, setSelectedDry] = useState("");
  const [pbQty, setPbQty] = useState<number | undefined>();
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

  const { data: staffData, refetch: refetchStaffData } = useQuery(
    "loggedInStaff",
    () => getAllStaff(`{"userId":"${loggedInUserId}"}`)
  );

  const { data: orderData, isLoading: isOrderDataLoading } = useQuery(
    "order",
    () => getAllOrder(`{"laundryId": { "$exists": false } }`)
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
    if (customerData && customerData.length > 0) {
      const filteredCustomerData = customerData.filter(
        (res: any) =>
          res.firstName.toLowerCase().includes(searchCustomer.toLowerCase()) ||
          res.lastName.toLowerCase().includes(searchCustomer.toLowerCase())
      );
      setCustomers(filteredCustomerData);
    }
  }, [searchCustomer, customerData]);

  useEffect(() => {
    if (customerId) {
      const customer =
        customerData &&
        customerData.find((res: any) => {
          return res._id === customerId;
        });
      setSelectedCustomer(JSON.stringify(customer));
    }
  }, [customerData, customerId]);

  const { mutate: triggerAddOrder, isLoading: isAddOrderLoading } = useMutation(
    async (order: any) => addOrder(order),
    {
      onSuccess: async (data: any, variables: any) => {
        if (selectedWash && JSON.parse(selectedWash)._id) {
          triggerAddOrderWash({
            jobOrderNumber:
              orderData &&
              nextJobOrderNumber(
                orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
                "Y"
              ),
            washId: selectedWash && JSON.parse(selectedWash)._id,
            qty: 1,
            total: selectedWash ? JSON.parse(selectedWash)?.price : 0,
            saveType: variables?.saveType,
          });
        } else if (selectedDry && JSON.parse(selectedDry)._id) {
          triggerAddOrderDry({
            jobOrderNumber:
              orderData &&
              nextJobOrderNumber(
                orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
                "Y"
              ),
            dryId: selectedDry && JSON.parse(selectedDry)._id,
            qty: 1,
            total: selectedDry ? JSON.parse(selectedDry)?.price : 0,
            saveType: variables?.saveType,
          });
        } else {
          _thirdRequests(variables?.saveType);
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
      onSuccess: async (data: any, variables: any) => {
        if (selectedDry && JSON.parse(selectedDry)._id) {
          triggerAddOrderDry({
            jobOrderNumber:
              orderData &&
              nextJobOrderNumber(
                orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
                "Y"
              ),
            dryId: selectedDry && JSON.parse(selectedDry)._id,
            qty: 1,
            total: selectedDry ? JSON.parse(selectedDry)?.price : 0,
            saveType: variables?.saveType,
          });
        } else {
          _thirdRequests(variables?.saveType);
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

  const _thirdRequests = (saveType: string) => {
    const detergentQtyFinal = detergentQty ? detergentQty : 0;
    const fabConQtyFinal = fabConQty ? fabConQty : 0;
    const zonroxQtyFinal = zonroxQty ? zonroxQty : 0;
    const pbQtyFinal = pbQty ? pbQty : 0;
    const zonrox =
      inventoryData &&
      inventoryData.find(
        (res: any) => res.name === "Zonrox" && res.type === "Bleach"
      );
    const plasticBag =
      inventoryData &&
      inventoryData.find(
        (res: any) => res.name === "Plastic Bag" && res.type === "Plastic"
      );
    if (detergentQtyFinal > 0) {
      triggerAddOrderItem({
        jobOrderNumber:
          orderData &&
          nextJobOrderNumber(
            orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
            "Y"
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
            orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
            "Y"
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
            orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
            "Y"
          ),
        inventoryId: zonrox && zonrox?._id,
        qty: zonroxQtyFinal,
        total: zonrox ? zonrox?.unitCost * zonroxQtyFinal : 0,
      });
    }
    if (pbQtyFinal > 0) {
      triggerAddOrderItem({
        jobOrderNumber:
          orderData &&
          nextJobOrderNumber(
            orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
            "Y"
          ),
        inventoryId: plasticBag && plasticBag?._id,
        qty: pbQtyFinal,
        total: plasticBag ? plasticBag?.unitCost * pbQtyFinal : 0,
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
            orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
            "Y"
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
            orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
            "Y"
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
            `/print?toPrintJO=${toPrintJO ? toPrintJO : ""}${
              toPrintJO ? "," : ""
            }${nextJobOrderNumber(
              orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
              "Y"
            )}`,
            "_blank"
          );
          navigate("/orders/diy");
        } else if (saveType === "saveAdd") {
          window.location.href = `/orders/diy/add?customerId=${
            selectedCustomer && JSON.parse(selectedCustomer)._id
          }&toPrintJO=${toPrintJO ? toPrintJO : ""}${
            toPrintJO ? "," : ""
          }${nextJobOrderNumber(
            orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
            "Y"
          )}`;
        }
      });
    }
  };

  const { mutate: triggerAddOrderDry, isLoading: isAddOrderDryLoading } =
    useMutation(async (order: any) => addOrderDry(order), {
      onSuccess: async (data: any, variables: any) => {
        _thirdRequests(variables?.saveType);
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
      onSuccess: async (data: any, variables: any) => {
        if (selectedDiscount && JSON.parse(selectedDiscount)._id) {
          triggerAddOrderDiscount({
            jobOrderNumber:
              orderData &&
              nextJobOrderNumber(
                orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
                "Y"
              ),
            discountId: selectedDiscount && JSON.parse(selectedDiscount)._id,
            qty: 1,
            total: selectedDiscount ? JSON.parse(selectedDiscount)?.price : 0,
            saveType: variables?.saveType,
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
            if (variables?.saveType === "saveEnd") {
              window.open(
                `/print?toPrintJO=${toPrintJO ? toPrintJO : ""}${
                  toPrintJO ? "," : ""
                }${nextJobOrderNumber(
                  orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
                  "Y"
                )}`,
                "_blank"
              );
              navigate("/orders/diy");
            } else if (variables?.saveType === "saveAdd") {
              window.location.href = `/orders/diy/add?customerId=${
                selectedCustomer && JSON.parse(selectedCustomer)._id
              }&toPrintJO=${toPrintJO ? toPrintJO : ""}${
                toPrintJO ? "," : ""
              }${nextJobOrderNumber(
                orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
                "Y"
              )}`;
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
    onSuccess: async (data: any, variables: any) => {
      MySwal.fire({
        title: "Order created!",
        text: "You will be redirected",
        icon: "success",
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        if (variables?.saveType === "saveEnd") {
          window.open(
            `/print?toPrintJO=${toPrintJO ? toPrintJO : ""}${
              toPrintJO ? "," : ""
            }${nextJobOrderNumber(
              orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
              "Y"
            )}`,
            "_blank"
          );
          navigate("/orders/diy");
        } else if (variables?.saveType === "saveAdd") {
          window.location.href = `/orders/diy/add?customerId=${
            selectedCustomer && JSON.parse(selectedCustomer)._id
          }&toPrintJO=${toPrintJO ? toPrintJO : ""}${
            toPrintJO ? "," : ""
          }${nextJobOrderNumber(
            orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
            "Y"
          )}`;
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
            orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
            "Y"
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
            orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
            "Y"
          ),
        discountId: data.id,
        qty: 1,
        total: data.price,
      };
    });
    triggerBulkAddOrderDiscount({ bulk: bulkAddDiscounts });
  };

  const _addOrder = (type: string) => {
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
    const plasticBag =
      inventoryData &&
      inventoryData.find(
        (res: any) => res.name === "Plastic Bag" && res.type === "Plastic"
      );
    const zonroxQtyFinal = typeof zonroxQty === "number" ? zonroxQty : null;
    const pbQtyFinal = typeof pbQty === "number" ? pbQty : null;
    const pbStockQty = plasticBag ? plasticBag.stock : 0;
    const zonroxTotal = zonrox
      ? zonrox.unitCost * (zonroxQtyFinal ? zonroxQtyFinal : 0)
      : 0;
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
          ? staffData[0].userId?._id
          : loggedInUserId,
      customerId: selectedCustomer && JSON.parse(selectedCustomer)._id,
      jobOrderNumber:
        orderData &&
        nextJobOrderNumber(
          orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
          "Y"
        ),
      folderId: folderData && folderData[0]._id,
      weight,
      paidStatus: "Unpaid",
      orderStatus: "In",
      claimStatus: "Unclaimed",
      washId: washId,
      dryId: dryId,
      plasticBag: pbQty,
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
          ? staffData[0].userId?._id
          : loggedInUserId,
      customerId: selectedCustomer && JSON.parse(selectedCustomer)._id,
      jobOrderNumber:
        orderData &&
        nextJobOrderNumber(
          orderData[0] ? orderData[0].jobOrderNumber : "000000Y",
          "Y"
        ),
      folderId: folderData && folderData[0]._id,
      weight,
      plasticBag: pbQty,
      amountDue,
      paidStatus: "Unpaid",
      orderStatus: "In",
      claimStatus: "Unclaimed",
      saveType: type,
    };

    const filteredValues = clean(orderToFilter);
    const validatedData: any = validate(filteredValues);
    const errors = validatedData ? getErrorsFromValidation(validatedData) : [];
    let customErrors: any[] = [];

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

    if (!Number.isInteger(detergentQtyFinal)) {
      const newError = [
        {
          input: "detergentQty",
          errorMessage: `Needs to be a whole number`,
        },
      ];
      customErrors = [...customErrors, ...newError];
    } else if (detergentQtyFinal > detergentTypeQty) {
      const newError = [
        {
          input: "detergentQty",
          errorMessage: `Remaining stocks is ${detergentTypeQty}`,
        },
      ];
      customErrors = [...customErrors, ...newError];
    }

    if (!Number.isInteger(fabConQtyFinal)) {
      const newError = [
        {
          input: "fabConQty",
          errorMessage: `Needs to be a whole number`,
        },
      ];
      customErrors = [...customErrors, ...newError];
    } else if (fabConQtyFinal > fabConTypeQty) {
      const newError = [
        {
          input: "fabConQty",
          errorMessage: `Remaining stocks is ${fabConTypeQty}`,
        },
      ];
      customErrors = [...customErrors, ...newError];
    }

    if (zonroxQtyFinal && !Number.isInteger(zonroxQtyFinal)) {
      const newError = [
        {
          input: "zonrox",
          errorMessage: `Needs to be a whole number`,
        },
      ];
      customErrors = [...customErrors, ...newError];
    }
    if (
      (zonroxQtyFinal || typeof zonroxQtyFinal === "number") &&
      zonroxQtyFinal < 1
    ) {
      const newError = [
        {
          input: "zonrox",
          errorMessage: "This needs to be greater than 0",
        },
      ];
      customErrors = [...customErrors, ...newError];
    } else if (
      (zonroxQtyFinal || typeof zonroxQtyFinal === "number") &&
      zonroxQtyFinal > zonroxStockQty
    ) {
      const newError = [
        {
          input: "zonrox",
          errorMessage: `Remaining stocks is ${zonroxStockQty}`,
        },
      ];
      customErrors = [...customErrors, ...newError];
    }

    if (pbQtyFinal && !Number.isInteger(pbQtyFinal)) {
      const newError = [
        {
          input: "pb",
          errorMessage: `Needs to be a whole number`,
        },
      ];
      customErrors = [...customErrors, ...newError];
    } else if (
      (pbQtyFinal || typeof pbQtyFinal === "number") &&
      pbQtyFinal < 1
    ) {
      const newError = [
        {
          input: "pb",
          errorMessage: "This needs to be greater than 0",
        },
      ];
      customErrors = [...customErrors, ...newError];
    } else if (
      (pbQtyFinal || typeof pbQtyFinal === "number") &&
      pbQtyFinal > pbStockQty
    ) {
      const newError = [
        {
          input: "pb",
          errorMessage: `Remaining stocks is ${pbStockQty}`,
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

  return (
    <>
      <div className="flex justify-between mt-11">
        <div>
          <h1 className="font-bold text-primary mt-7">Add DIY Order</h1>
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
            <div>
              <button
                className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                  findInputError(formErrors, "customerId")
                    ? "border-red"
                    : "border-accent"
                } appearance-none bg-white`}
                onClick={(e: any) => {
                  e.preventDefault();
                  setIsOpenCustomer(!isOpenCustomer);
                }}
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
                <span className="float-left">
                  {selectedCustomer
                    ? `${JSON.parse(selectedCustomer).firstName} ${
                        JSON.parse(selectedCustomer).lastName
                      }`
                    : "Select Customer"}
                </span>

                <svg
                  className="h-4 float-right fill-current text-white mt-[3px] mr-[7px]"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 129 129"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  enable-background="new 0 0 129 129"
                >
                  <g>
                    <path d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z" />
                  </g>
                </svg>
              </button>
              {isOpenCustomer ? (
                <div className="absolute rounded shadow-md my-2 pin-t pin-l bg-white max-w-[500px]">
                  <ul className="list-reset">
                    <li className="p-2">
                      <input
                        autoFocus
                        className="border-2 rounded h-8 w-full px-2"
                        onChange={(e: any) => setSearchCustomer(e.target.value)}
                      />
                      <br />
                    </li>
                    {customers &&
                      customers.map((res: any) => {
                        const isSelected: boolean =
                          (customerId && res._id === customerId) ||
                          res._id === JSON.parse(selectedCustomer)?._id
                            ? true
                            : false;
                        return (
                          <li
                            onClick={() => {
                              setSelectedCustomer(JSON.stringify(res));
                              setIsOpenCustomer(!isOpenCustomer);
                            }}
                          >
                            <p className="p-2 block text-black hover:bg-grey-light cursor-pointer hover:bg-light">
                              {`${res.firstName} ${res.lastName}`}
                              {isSelected && (
                                <svg
                                  className="float-right"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                >
                                  <path d="M6.61 11.89L3.5 8.78 2.44 9.84 6.61 14l8.95-8.95L14.5 4z" />
                                </svg>
                              )}
                            </p>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              ) : null}
            </div>
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
        <div className="grid grid-cols-8 gap-4 mt-3">
          <div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Wash
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
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "detergentQty")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="number"
              onChange={(e: any) => setDetergentQty(parseFloat(e.target.value))}
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
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "fabConQty")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="number"
              onChange={(e: any) => setFabConQty(parseFloat(e.target.value))}
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
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "zonrox")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="number"
              onChange={(e: any) => setZonroxQty(parseFloat(e.target.value))}
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
          <div>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              PB
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "pb")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="number"
              onChange={(e: any) => setPbQty(parseFloat(e.target.value))}
              disabled={false}
            />
            {findInputError(formErrors, "pb") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "pb")}
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
            disabled={false}
            onClick={() => _addOrder("saveAdd")}
          >
            Save & Add
          </button>
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-4"
            type="button"
            disabled={false}
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

export default connect(mapStateToProps)(AddDiy);
