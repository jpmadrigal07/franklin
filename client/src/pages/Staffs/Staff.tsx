import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllStaff } from "../../utils/staff";
import DataTable from "../../components/Table";
import { getAllOrder } from "../../utils/order";
import { dateSlash } from "../../utils/formatDate";
import numberWithCommas from "../../utils/numberWithCommas";
import _constructTableActions from "../../utils/constructTableActions";
import { getAllFolder } from "../../utils/api/folder";

type T_Header = {
  header: string;
  dataName: string;
};

const Table = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [userName, setUsername] = useState("");
  const [order, setOrder] = useState([]);
  const [folderIds, setFolderIds] = useState([]);
  const [orderFolder, setOrderFolder] = useState([]);

  const { data: staffData } = useQuery("viewStaff", () =>
    getAllStaff(`{"_id":"${paramId}"}`)
  );

  const {
    data: orderData,
    isLoading: isOrderDataLoading,
    refetch: refetchOrderData,
  } = useQuery(
    "cashierOrders",
    () => getAllOrder(`{"staffId": "${userId}" }`),
    {
      enabled: false,
    }
  );

  const { data: folderData, isLoading: folderDataLoading } = useQuery(
    "staffFolders",
    () => getAllFolder(`{"staffId": "${paramId}" }`)
  );

  const {
    data: orderFolderData,
    isLoading: isOrderFolderDataLoading,
    refetch: refetchFolderOrderData,
  } = useQuery(
    "folderOrders",
    () =>
      getAllOrder(
        `{ "$and": [ { "laundryId": { "$exists": true } }, { "laundryId": { "$ne": null } } ], "multiFolderId": [${folderIds.map(
          (res: any) => `"${res}"`
        )}] }`
      ),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (staffData && staffData.length > 0) {
      const { name, userId } = staffData[0];
      setName(name);
      setUsername(userId.username);
      setUserId(userId._id);
    }
    return () => {
      setUserId("");
      queryClient.removeQueries("cashierOrders");
      queryClient.removeQueries("folderOrders");
    };
  }, [staffData, queryClient]);

  useEffect(() => {
    if (folderData && folderData.length > 0) {
      setFolderIds(folderData.map((res: any) => res._id));
    }
  }, [folderData]);

  useEffect(() => {
    if (folderIds.length > 0) {
      refetchFolderOrderData();
    }
  }, [folderIds, refetchFolderOrderData]);

  useEffect(() => {
    if (userId !== "") {
      refetchOrderData();
    }
  }, [userId, refetchOrderData]);

  const tableHeader = useMemo(
    () => [
      { header: "Date", dataName: "createdAt" },
      { header: "JO Number", dataName: "jobOrderNumber" },
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
          if (res2.dataName === "createdAt") {
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

  useEffect(() => {
    if (orderFolderData && orderFolderData.length > 0) {
      setOrderFolder(_remappedData(orderFolderData));
    }
  }, [orderFolderData, _remappedData]);

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10">View Staff</h1>
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
        <div className="flex justify-end mt-7">
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl"
            type="button"
            onClick={() => navigate("/staffs")}
          >
            Back
          </button>
        </div>
        <div className="flex flex-row">
          <div className="basis-1/2 mr-7">
            <div className="flex justify-between mt-11">
              <h4 className="text-primary font-bold">As Cashier</h4>
            </div>
            <DataTable
              header={tableHeader}
              isLoading={isOrderDataLoading}
              data={order}
            />
          </div>
          <div className="basis-1/2 ml-7">
            <div className="flex justify-between mt-11">
              <h4 className="text-primary font-bold">As Folder</h4>
            </div>
            <DataTable
              header={tableHeader}
              isLoading={isOrderFolderDataLoading || folderDataLoading}
              data={orderFolder}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
