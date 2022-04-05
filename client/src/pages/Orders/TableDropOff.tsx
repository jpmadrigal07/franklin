import { useState, useEffect, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { getAllOrder } from "../../utils/order";
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

type T_Header = {
  header: string;
  dataName: string;
};

const TableDropOff = (props: any) => {
  const { loggedInUserType } = props;
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [order, setOrder] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");

  const {
    data: orderData,
    isLoading: isorderDataLoading,
    refetch: refetchOrderData,
  } = useQuery("ordersDropOff", () =>
    getAllOrder(`{"laundryId": { "$exists": true}}`)
  );

  const tableHeader = useMemo(
    () => [
      { header: "JO Number", dataName: "jobOrderNumber" },
      { header: "Date", dataName: "createdAt" },
      { header: "Customer", dataName: "customer" },
      { header: "Total", dataName: "amountDue" },
      { header: "Paid Status", dataName: "paidStatus" },
      { header: "Claim Status", dataName: "claimStatus" },
      { header: "Order Status", dataName: "orderStatus" },
      { header: "Action", dataName: "endActions" },
    ],
    []
  );

  const tableEndActions = useMemo(() => ["Cancel", "Print"], []);

  const _remappedData = useCallback(
    (data: any) => {
      const newData = data.map((res: any) => {
        const mainData = tableHeader.map((res2: any) => {
          let value;
          if (res2.dataName === "endActions") {
            value = tableEndActions.map((res3: any) => {
              if (res3 === "Cancel") {
                return _constructTableActions(
                  res3,
                  () => navigate(`/order/edit/${res._id}`),
                  false
                );
              } else if (res3 === "Print") {
                return _constructTableActions(
                  res3,
                  () => console.log("click"),
                  true
                );
              }
            });
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
                onClick={() => navigate(`/customers/${res.customerId._id}`)}
              >
                {res["customerId"]["firstName"]} {res["customerId"]["lastName"]}
              </span>
            );
          } else if (res2.dataName === "amountDue") {
            value = res[res2.dataName]
              ? `₱${numberWithCommas(res[res2.dataName])}`
              : res[res2.dataName] === 0
              ? `₱0.00`
              : "";
          } else if (res2.dataName === "createdAt") {
            value = moment(res[res2.dataName]).format("MM/DD/YYYY");
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
    if (searchPhrase === "") {
      if (orderData && orderData.length > 0) {
        setOrder(_remappedData(orderData));
      }
    } else {
      if (orderData && orderData.length > 0) {
        const filteredorderData = orderData.filter((res: any) =>
          res.name.toLowerCase().includes(searchPhrase.toLowerCase())
        );
        setOrder(_remappedData(filteredorderData));
      }
    }
  }, [searchPhrase, orderData, _remappedData]);

  useEffect(() => {
    if (orderData && orderData.length > 0) {
      setOrder(_remappedData(orderData));
    }
  }, [orderData, _remappedData]);

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10 mb-10">
        View Orders
      </h1>
      <div className="flex justify-center ...">
        <button className="bg-primary w-[90px] text-white hover:bg-primary-dark">
          Drop Off
        </button>
        <button
          className="bg-light border-2 border-primary w-[90px] text-primary hover:bg-accent"
          onClick={() => navigate("/orders/diy")}
        >
          DIY
        </button>
      </div>
      <div className="flex justify-between mt-11">
        <div>
          <h3 className="font-bold text-primary">Drop Off Orders</h3>
        </div>
        <div>
          <input
            type="text"
            className="pt-1 pb-1 pl-2 rounded-sm mr-2"
            placeholder="Search"
            onChange={(e: any) => setSearchPhrase(e.target.value)}
          />
          <Icon icon="bi:search" className="inline" height={24} />
        </div>
      </div>
      <DataTable
        header={tableHeader}
        isLoading={isorderDataLoading}
        data={order}
      />
    </>
  );
};

const mapStateToProps = (global: any) => ({
  loggedInUserType: global.authenticatedUser.user.type,
});

export default connect(mapStateToProps)(TableDropOff);
