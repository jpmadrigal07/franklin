import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllStaff } from "../../utils/staff";
import DataTable from "../../components/Table";
import { getAllOrder } from "../../utils/order";
import { dateSlash } from "../../utils/formatDate";
import numberWithCommas from "../../utils/numberWithCommas";
import _constructTableActions from "../../utils/constructTableActions";

type T_Header = {
  header: string;
  dataName: string;
};

const Table = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [userName, setUsername] = useState("");
  const [order, setOrder] = useState([]);

  const { data: staffData } = useQuery("viewStaff", () =>
    getAllStaff(`{"_id":"${paramId}"}`)
  );

  const {
    data: orderData,
    isLoading: isOrderDataLoading,
    refetch: refetchOrderData,
  } = useQuery("orders", () => getAllOrder(`{"staffId": "${userId}" }`), {
    enabled: false,
  });

  useEffect(() => {
    if (staffData && staffData.length > 0) {
      const { name, userId } = staffData[0];
      setName(name);
      setUsername(userId.username);
      setUserId(userId._id);
    }
  }, [staffData]);

  useEffect(() => {
    if (userId !== "") {
      refetchOrderData();
    }
  }, [userId, refetchOrderData]);

  const tableHeader = useMemo(
    () => [
      { header: "JO Number", dataName: "jobOrderNumber" },
      { header: "Date", dataName: "createdAt" },
      { header: "Service Type", dataName: "serviceType" },
      { header: "Order Status", dataName: "orderStatus" },
      { header: "Total", dataName: "amountDue" },
      { header: "Action", dataName: "endActions" },
    ],
    []
  );

  const tableEndActions = useMemo(() => ["View"], []);

  const _remappedData = useCallback(
    (data: any) => {
      const newData = data.map((res: any) => {
        const mainData = tableHeader.map((res2: any) => {
          let value;
          if (res2.dataName === "serviceType") {
            value = res.jobOrderNumber?.slice(-1) === "Y" ? "DIY" : "DO";
          } else if (res2.dataName === "createdAt") {
            value = dateSlash(res.createdAt);
          } else if (res2.dataName === "amountDue") {
            value = res[res2.dataName]
              ? `₱${numberWithCommas(res[res2.dataName])}`
              : res[res2.dataName] === 0
              ? `₱0.00`
              : "";
          } else if (res2.dataName === "endActions") {
            value = tableEndActions.map((res3: any) => {
              if (res3 === "View") {
                return _constructTableActions(
                  res3,
                  () => navigate(`/orders/${res.jobOrderNumber}`),
                  true
                );
              }
            });
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
    [navigate, tableEndActions, tableHeader]
  );

  useEffect(() => {
    if (orderData && orderData.length > 0) {
      setOrder(_remappedData(orderData));
    }
  }, [orderData, _remappedData]);

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10">
        View Customer
      </h1>
      <h3 className="font-bold text-primary text-center mb-10">Past Actions</h3>
      <div>
        <div>
          <p className="font-bold">
            <span className="font-bold text-primary">Name:</span>
            {` ${name}`}
          </p>
        </div>
        <div>
          <p className="font-bold">
            <span className="font-bold text-primary">Username:</span>
            {` ${userName}`}
          </p>
        </div>
        <div className="flex justify-end mt-7 mb-3">
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl"
            type="button"
            onClick={() => navigate("/staffs")}
          >
            Back
          </button>
        </div>
        <DataTable
          header={tableHeader}
          isLoading={isOrderDataLoading}
          data={order}
        />
      </div>
    </>
  );
};

export default Table;
