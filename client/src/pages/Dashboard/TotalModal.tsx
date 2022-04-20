import { useState, useMemo, useCallback, useEffect } from "react";
import Modal from "../../components/Modal";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getAllOrder } from "../../utils/order";
import DataTable from "../../components/Table";
import numberWithCommas from "../../utils/numberWithCommas";

type T_Header = {
  header: string;
  dataName: string;
};

const TotalModal = (props: any) => {
  const navigate = useNavigate();
  const { customerId, isModalOpen, setIsModalOpen } = props;
  const [order, setOrder] = useState<any>([]);
  const [total, setTotal] = useState(0);

  const {
    data: orderData,
    isLoading: isOrderLoading,
    refetch: refetchOrderData,
  } = useQuery(
    "userOrder",
    () => getAllOrder(`{"customerId":"${customerId}"}`),
    {
      enabled: false,
    }
  );
  const tableHeader = useMemo(
    () => [
      { header: "JO Number", dataName: "jobOrderNumber" },
      { header: "Price", dataName: "amountDue" },
    ],
    []
  );

  useEffect(() => {
    if (isModalOpen && customerId) {
      refetchOrderData();
    }
  }, [isModalOpen, customerId, refetchOrderData]);

  const _remappedData = useCallback(
    (data: any) => {
      const newData = data.map((res: any) => {
        const mainData = tableHeader.map((res2: any) => {
          let value;
          if (res2.dataName === "jobOrderNumber") {
            value = (
              <span
                className="font-bold text-primary hover:underline hover:cursor-pointer"
                onClick={() => navigate(`/orders/${res.jobOrderNumber}`)}
              >
                {res["jobOrderNumber"]}
              </span>
            );
          } else if (res2.dataName === "amountDue") {
            value = res[res2.dataName]
              ? `₱${numberWithCommas(res[res2.dataName])}`
              : res[res2.dataName] === 0
              ? `₱0.00`
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
    },
    [navigate, tableHeader]
  );

  useEffect(() => {
    if (orderData && orderData.length > 0 && order.length === 0) {
      const orderTotal = orderData.reduce(function (a: any, b: any) {
        return a + b.amountDue;
      }, 0);
      setTotal(orderTotal);
      setOrder(_remappedData(orderData));
    }
  }, [orderData, _remappedData, order]);

  return (
    <Modal
      state={isModalOpen}
      toggle={() => {
        setIsModalOpen(false);
      }}
      title={
        <h3>
          {orderData && orderData.length > 0
            ? orderData[0]?.customerId?.lastName
            : "---"}
          ,{" "}
          {orderData && orderData.length > 0
            ? orderData[0]?.customerId?.firstName
            : "---"}
        </h3>
      }
      content={
        <>
          <h4 className="font-bold text-primary">Active Orders</h4>
          <DataTable
            header={tableHeader}
            isLoading={isOrderLoading}
            data={order}
          />
          <h3 className="mt-3">
            TOTAL: <span className="font-bold">₱{numberWithCommas(total)}</span>
          </h3>
        </>
      }
      clickOutsideClose={false}
      footer={
        <>
          <button
            className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
            onClick={() => {
              setIsModalOpen(false);
            }}
            disabled={false}
          >
            Back
          </button>
        </>
      }
      size="sm"
    />
  );
};

export default TotalModal;
