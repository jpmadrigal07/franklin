import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getAllOrder } from "../../utils/order";
import { getAllOrderDiscount } from "../../utils/api/orderDiscount";
import { getAllOrderWash } from "../../utils/api/orderWash";
import { getAllOrderDry } from "../../utils/api/orderDry";
import { getAllLaundry } from "../../utils/laundry";
import { getAllOrderAddOn } from "../../utils/api/orderAddOn";
import { dateSlashWithTime } from "../../utils/formatDate";
import numberWithCommas from "../../utils/numberWithCommas";
import DataTable from "../../components/Table";
import { getAllOrderItem } from "../../utils/api/orderItem";

type T_Header = {
  header: string;
  dataName: string;
};

const Order = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [orderDataObj, setOrderDataObj] = useState<any>({});
  const [orderWashDataRemapped, setOrderWashDataRemapped] = useState<any>([]);
  const [orderDryDataRemapped, setOrderDryDataRemapped] = useState<any>([]);
  const [orderAddOnDataRemapped, setOrderAddOnDataRemapped] = useState<any>([]);
  const [orderDiscountDataRemapped, setOrderDiscountDataRemapped] =
    useState<any>([]);
  const [orderItemDataRemapped, setOrderItemDataRemapped] = useState<any>([]);
  const [dropOffFee, setDropOffFee] = useState<any>({});
  const [payment, setPayment] = useState<any>({});

  const { data: orderData, isLoading: isOrderLoading } = useQuery(
    "viewOrder",
    () => getAllOrder(`{"jobOrderNumber":"${paramId}"}`)
  );

  const {
    data: laundryData,
    isLoading: isLaundryLoading,
    refetch: refetchLaundryData,
  } = useQuery(
    "orderDropOffFee",
    () => getAllLaundry(`{"type":"Drop Off Fee"}`),
    {
      enabled: false,
    }
  );

  const { data: orderWashData, isLoading: isOrderWashLoading } = useQuery(
    "orderWash",
    () => getAllOrderWash(`{"jobOrderNumber":"${paramId}"}`)
  );

  const { data: orderDryData, isLoading: isOrderDryLoading } = useQuery(
    "orderDry",
    () => getAllOrderDry(`{"jobOrderNumber":"${paramId}"}`)
  );

  const { data: orderAddOnData, isLoading: isOrderAddOnLoading } = useQuery(
    "orderAddOn",
    () => getAllOrderAddOn(`{"jobOrderNumber":"${paramId}"}`)
  );

  const { data: orderDiscountData, isLoading: isOrderDiscountLoading } =
    useQuery("orderDiscount", () =>
      getAllOrderDiscount(`{"jobOrderNumber":"${paramId}"}`)
    );

  const { data: orderItemData, isLoading: isOrderItemLoading } = useQuery(
    "orderItem",
    () => getAllOrderItem(`{"jobOrderNumber":"${paramId}"}`)
  );

  useEffect(() => {
    if (orderDataObj.laundryId) {
      refetchLaundryData();
    }
    return () => {
      queryClient.removeQueries("orderDropOffFee");
    };
  }, [orderDataObj, refetchLaundryData, queryClient]);

  useEffect(() => {
    if (laundryData && laundryData.length > 0) {
      setDropOffFee({
        qty: 1,
        type: laundryData[0].type,
        total: laundryData[0].price
          ? `₱${numberWithCommas(laundryData[0].price)}`
          : laundryData[0].price === 0
          ? `₱0.00`
          : "",
      });
    }
    return () => {
      setDropOffFee({});
    };
  }, [laundryData]);

  const tableHeader = useMemo(
    () => [
      { header: "Qty", dataName: "qty" },
      { header: "Service", dataName: "type" },
      { header: "Machine", dataName: "machineNumber" },
      { header: "Subtotal", dataName: "total" },
    ],
    []
  );

  const tableHeaderItems = useMemo(
    () => [
      { header: "Qty", dataName: "qty" },
      { header: "Type", dataName: "type" },
      { header: "Name", dataName: "name" },
      { header: "Subtotal", dataName: "total" },
    ],
    []
  );

  const tableHeaderAddOn = useMemo(
    () => [
      { header: "Qty", dataName: "qty" },
      { header: "Service/Item", dataName: "type" },
      { header: "Subtotal", dataName: "total" },
    ],
    []
  );

  const tableHeaderDiscounts = useMemo(
    () => [
      { header: "Description", dataName: "type" },
      { header: "Discount", dataName: "total" },
    ],
    []
  );

  const tableHeaderPayment = useMemo(
    () => [
      { header: "Services Total", dataName: "services" },
      { header: "Items Total", dataName: "items" },
      { header: "Add Ons Total", dataName: "addOns" },
      { header: "Discounts Total", dataName: "discounts" },
      { header: "Grand Total", dataName: "grandTotal" },
    ],
    []
  );

  const _remappedData = useCallback((data: any, header: any, type: string) => {
    const newData = data.map((res: any) => {
      const mainData = header.map((res2: any) => {
        let value;
        if (res2.dataName === "total") {
          value = res[res2.dataName]
            ? `₱${numberWithCommas(
                type === "inventoryId" ? res[res2.dataName] : res[res2.dataName]
              )}`
            : res[res2.dataName] === 0
            ? `₱0.00`
            : "";
        } else if (res2.dataName === "type" && res[type]) {
          value = res[type][res2.dataName] ? res[type][res2.dataName] : "";
        } else if (res2.dataName === "name" && res[type]) {
          value = res[type][res2.dataName] ? res[type][res2.dataName] : "";
        } else {
          value = res[res2.dataName] ? res[res2.dataName] : "";
        }
        return value;
      });
      const obj: any = {};
      header.forEach((element: T_Header, index: number) => {
        obj[element.dataName] = mainData[index];
      });

      return obj;
    });

    return newData;
  }, []);

  useEffect(() => {
    if (orderData && orderData.length > 0) {
      setOrderDataObj(orderData[0]);
    }
    return () => {
      setOrderDataObj({});
    };
  }, [orderData, _remappedData, orderDataObj]);

  useEffect(() => {
    if (orderWashData && orderWashData.length > 0) {
      setOrderWashDataRemapped(
        _remappedData(orderWashData, tableHeader, "washId")
      );
    }
    return () => {
      setOrderWashDataRemapped([]);
    };
  }, [orderWashData, tableHeader, _remappedData]);

  useEffect(() => {
    if (orderDryData && orderDryData.length > 0) {
      setOrderDryDataRemapped(
        _remappedData(orderDryData, tableHeader, "dryId")
      );
    }
    return () => {
      setOrderDryDataRemapped([]);
    };
  }, [orderDryData, tableHeader, _remappedData]);

  useEffect(() => {
    if (orderDiscountData && orderDiscountData.length > 0) {
      setOrderDiscountDataRemapped(
        _remappedData(orderDiscountData, tableHeaderDiscounts, "discountId")
      );
    }
    return () => {
      setOrderDiscountDataRemapped([]);
    };
  }, [orderDiscountData, tableHeaderDiscounts, _remappedData]);

  useEffect(() => {
    if (orderItemData && orderItemData.length > 0) {
      setOrderItemDataRemapped(
        _remappedData(orderItemData, tableHeaderItems, "inventoryId")
      );
    }
    return () => {
      setOrderItemDataRemapped([]);
    };
  }, [orderItemData, tableHeaderItems, _remappedData]);

  useEffect(() => {
    if (orderAddOnData && orderAddOnData.length > 0) {
      setOrderAddOnDataRemapped(
        _remappedData(orderAddOnData, tableHeaderAddOn, "addOnId")
      );
    }
    return () => {
      setOrderAddOnDataRemapped([]);
    };
  }, [orderAddOnData, tableHeaderAddOn, _remappedData]);

  const services = useMemo(
    () => [...orderDryDataRemapped, ...orderWashDataRemapped],
    [orderDryDataRemapped, orderWashDataRemapped]
  );

  const addOns = useMemo(() => {
    if (dropOffFee.total) {
      return [dropOffFee, ...orderAddOnDataRemapped];
    } else {
      return [...orderAddOnDataRemapped];
    }
  }, [dropOffFee, orderAddOnDataRemapped]);

  useEffect(() => {
    const servicesTotal =
      services.length > 0
        ? services.reduce(function (a: any, b: any) {
            const total = b.total
              ? b.total.replace("₱", "").replace(",", "")
              : "0";
            return a + parseFloat(total);
          }, 0)
        : 0;
    const itemsTotal =
      orderItemDataRemapped.length > 0
        ? orderItemDataRemapped.reduce(function (a: any, b: any) {
            const total = b.total
              ? b.total.replace("₱", "").replace(",", "")
              : "0";
            return a + parseFloat(total);
          }, 0)
        : 0;
    const addOnsTotal =
      addOns.length > 0
        ? addOns.reduce(function (a: any, b: any) {
            const total = b.total
              ? b.total.replace("₱", "").replace(",", "")
              : "0";
            return a + parseFloat(total);
          }, 0)
        : 0;
    const discountTotal =
      orderDiscountDataRemapped.length > 0
        ? orderDiscountDataRemapped.reduce(function (a: any, b: any) {
            const total = b.total
              ? b.total.replace("₱", "").replace(",", "")
              : "0";
            return a + parseFloat(total);
          }, 0)
        : 0;
    const pay = servicesTotal + itemsTotal + addOnsTotal - discountTotal;
    setPayment({
      services: `₱${servicesTotal ? numberWithCommas(servicesTotal) : "0.00"}`,
      items: `₱${itemsTotal ? numberWithCommas(itemsTotal) : "0.00"}`,
      addOns: `₱${addOnsTotal ? numberWithCommas(addOnsTotal) : "0.00"}`,
      discounts: `₱${discountTotal ? numberWithCommas(discountTotal) : "0.00"}`,
      grandTotal: `₱${pay > 0 ? numberWithCommas(pay) : "0.00"}`,
    });
  }, [orderDiscountDataRemapped, orderItemDataRemapped, services, addOns]);

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10">View Order</h1>
      <h5 className="font-bold text-primary text-center">
        Job Order No.: <span className="text-black">{paramId}</span>
      </h5>
      <h5 className="font-bold text-primary text-center mb-10">
        Weight:{" "}
        <span className="text-black">
          {!isOrderLoading ? orderDataObj?.weight : "..."} kg
        </span>
      </h5>
      <div>
        <div className="flex justify-between mt-11">
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">Service Type:</span>{" "}
              {!isOrderLoading
                ? paramId?.slice(-1) === "F"
                  ? "DO"
                  : "DIY"
                : "..."}
            </p>
          </div>
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">Order Received:</span>{" "}
              {!isOrderLoading
                ? orderDataObj?.orderReceived
                  ? dateSlashWithTime(orderDataObj?.orderReceived)
                  : "---"
                : "..."}
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">Customer:</span>{" "}
              {!isOrderLoading
                ? `${orderDataObj?.customerId?.firstName} ${orderDataObj?.customerId?.lastName}`
                : "..."}
            </p>
          </div>
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">Wash Completed:</span>{" "}
              {!isOrderLoading
                ? orderDataObj?.washCompleted
                  ? dateSlashWithTime(orderDataObj?.washCompleted)
                  : "---"
                : "..."}
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">Mobile No.:</span>{" "}
              {!isOrderLoading
                ? orderDataObj?.customerId?.contactNumber
                : "..."}
            </p>
          </div>
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">Dry Completed:</span>{" "}
              {!isOrderLoading
                ? orderDataObj?.dryCompleted
                  ? dateSlashWithTime(orderDataObj?.dryCompleted)
                  : "---"
                : "..."}
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">Cashier:</span>{" "}
              {!isOrderLoading
                ? orderDataObj?.staffId
                  ? orderDataObj?.staffId?.name
                  : "Admin"
                : "..."}
            </p>
          </div>
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">Fold Completed:</span>{" "}
              {!isOrderLoading
                ? orderDataObj?.foldCompleted
                  ? dateSlashWithTime(orderDataObj?.foldCompleted)
                  : "---"
                : "..."}
            </p>
          </div>
        </div>
        <div className="flex justify-between mb-10">
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">Staff:</span>{" "}
              {!isOrderLoading
                ? `${
                    orderDataObj?.folderId?.staffId?.name
                      ? orderDataObj?.folderId?.staffId?.name
                      : "---"
                  }`
                : "..."}
            </p>
          </div>
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">Order Completed:</span>{" "}
              {!isOrderLoading
                ? orderDataObj?.updatedAt
                  ? dateSlashWithTime(orderDataObj?.updatedAt)
                  : "---"
                : "..."}
            </p>
          </div>
        </div>
        <h4 className="font-bold text-primary mt-10">Services</h4>
        <DataTable
          header={tableHeader}
          isLoading={isOrderLoading || isOrderDryLoading || isOrderWashLoading}
          data={services}
        />
        <h4 className="font-bold text-primary mt-10">Items</h4>
        <DataTable
          header={tableHeaderItems}
          isLoading={isOrderLoading || isOrderItemLoading}
          data={orderItemDataRemapped}
        />
        <h4 className="font-bold text-primary mt-10">Add-ons</h4>
        <DataTable
          header={tableHeaderAddOn}
          isLoading={isOrderLoading || isOrderAddOnLoading || isLaundryLoading}
          data={addOns}
        />
        <h4 className="font-bold text-primary mt-10">Discounts</h4>
        <DataTable
          header={tableHeaderDiscounts}
          isLoading={isOrderLoading || isOrderAddOnLoading || isLaundryLoading}
          data={orderDiscountDataRemapped}
        />
        <h4 className="font-bold text-primary mt-10">Payment</h4>
        <DataTable
          header={tableHeaderPayment}
          isLoading={isOrderLoading || isOrderDiscountLoading}
          data={[payment]}
          customTextColor="red"
          columnWithCustomText="discounts"
          customColumnTextColor={[
            {
              column: "discounts",
              color: "red",
            },
            {
              column: "grandTotal",
              bold: true,
            },
          ]}
        />
        <div className="flex justify-end mt-7">
          <button
            className="border-2 border-primary text-primary pt-1 pl-5 pb-1 pr-5 rounded-xl"
            type="button"
            onClick={() => navigate("/orders")}
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default Order;
