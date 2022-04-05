import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
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

type T_Header = {
  header: string;
  dataName: string;
};

const Order = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [orderDataObj, setOrderDataObj] = useState<any>({});
  const [orderWashDataRemapped, setOrderWashDataRemapped] = useState<any>([]);
  const [orderDryDataRemapped, setOrderDryDataRemapped] = useState<any>([]);
  const [orderAddOnDataRemapped, setOrderAddOnDataRemapped] = useState<any>([]);
  const [orderDiscountDataRemapped, setOrderDiscountDataRemapped] =
    useState<any>([]);
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
  } = useQuery("laundry", () => getAllLaundry(`{"type":"Drop Off Fee"}`), {
    enabled: false,
  });

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

  useEffect(() => {
    if (orderDataObj.laundryId) {
      refetchLaundryData();
    }
  }, [orderDataObj, refetchLaundryData]);

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
  }, [laundryData]);

  useEffect(() => {
    if (orderData && orderData.length > 0) {
      setOrderDataObj(orderData[0]);
    }
  }, [orderData]);

  const tableHeader = useMemo(
    () => [
      { header: "Qty", dataName: "qty" },
      { header: "Service", dataName: "type" },
      { header: "Machine", dataName: "machineNumber" },
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
      { header: "Add Ons Total", dataName: "addOns" },
      { header: "Discounts Total", dataName: "discounts" },
      { header: "Grand Total", dataName: "grandTotal" },
    ],
    []
  );

  const _remappedData = useCallback(
    (data: any, type: string) => {
      const newData = data.map((res: any) => {
        const mainData = tableHeader.map((res2: any) => {
          let value;
          if (res2.dataName === "total") {
            value = res[res2.dataName]
              ? `₱${numberWithCommas(res[res2.dataName])}`
              : res[res2.dataName] === 0
              ? `₱0.00`
              : "";
          } else if (res2.dataName === "type" && res[type]) {
            value = res[type][res2.dataName] ? res[type][res2.dataName] : "";
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
    },
    [tableHeader]
  );

  useEffect(() => {
    if (orderData && orderData.length > 0) {
      setOrderDataObj(orderData[0]);
    }
  }, [orderData, _remappedData]);

  useEffect(() => {
    if (orderWashData && orderWashData.length > 0) {
      setOrderWashDataRemapped(_remappedData(orderWashData, "washId"));
    }
  }, [orderWashData, _remappedData]);

  useEffect(() => {
    if (orderDryData && orderDryData.length > 0) {
      setOrderDryDataRemapped(_remappedData(orderDryData, "dryId"));
    }
  }, [orderDryData, _remappedData]);

  useEffect(() => {
    if (orderDiscountData && orderDiscountData.length > 0) {
      setOrderDiscountDataRemapped(
        _remappedData(orderDiscountData, "discountId")
      );
    }
  }, [orderDiscountData, _remappedData]);

  useEffect(() => {
    if (orderAddOnData && orderAddOnData.length > 0) {
      setOrderAddOnDataRemapped(_remappedData(orderAddOnData, "addOnId"));
    }
  }, [orderAddOnData, _remappedData]);

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
      services.length > 0 &&
      services.reduce(function (a: any, b: any) {
        return a + parseFloat(b.total ? b.total.substring(1) : 0);
      }, 0);
    const addOnsTotal =
      addOns.length > 0 &&
      addOns.reduce(function (a: any, b: any) {
        return a + parseFloat(b.total ? b.total.substring(1) : 0);
      }, 0);
    const discountTotal =
      orderDiscountDataRemapped.length > 0 &&
      orderDiscountDataRemapped.reduce(function (a: any, b: any) {
        return a + parseFloat(b.total ? b.total.substring(1) : 0);
      }, 0);
    setPayment({
      services: `₱${servicesTotal ? numberWithCommas(servicesTotal) : "0.00"}`,
      addOns: `₱${addOnsTotal ? numberWithCommas(addOnsTotal) : "0.00"}`,
      discounts: `₱${discountTotal ? numberWithCommas(discountTotal) : "0.00"}`,
      grandTotal: `₱${
        servicesTotal + addOnsTotal - discountTotal
          ? numberWithCommas(servicesTotal + addOnsTotal - discountTotal)
          : "0.00"
      }`,
    });
  }, [orderDiscountDataRemapped, services, addOns]);

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
                ? orderDataObj?.laundryId
                  ? "Drop-off"
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
              {!isOrderLoading ? orderDataObj?.staffId?.name : "..."}
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
              <span className="font-bold text-primary">Staff:</span> Wala pa
            </p>
          </div>
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">Order Completed:</span>{" "}
              {!isOrderLoading
                ? orderDataObj?.orderCompleted
                  ? dateSlashWithTime(orderDataObj?.orderCompleted)
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
