import { useState, useEffect, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { getAllOrder, updateOrder } from "../../utils/order";
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
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedJobOrderNumber, setSelectedJobOrderNumber] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");

  const {
    data: orderData,
    isLoading: isorderDataLoading,
    refetch: refetchOrderData,
  } = useQuery("ordersDiy", () =>
    getAllOrder(`{"laundryId": { "$exists": false}}`)
  );

  const { mutate: triggerUpdateOrder, isLoading: isUpdateOrderLoading } =
    useMutation(async (order: any) => updateOrder(order, selectedOrderId), {
      onSuccess: async () => {
        setSelectedJobOrderNumber("");
        setSelectedOrderId("");
        setIsCancelModalOpen(false);
        refetchOrderData();
        MySwal.fire({
          title: "Update success!",
          text: "Order has been updated",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
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

  const tableHeader = useMemo(
    () => [
      { header: "JO Number", dataName: "jobOrderNumber" },
      { header: "Date", dataName: "createdAt" },
      { header: "Customer", dataName: "customer" },
      { header: "Total", dataName: "amountDue" },
      { header: "Paid Status", dataName: "paidStatus" },
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
                  () => _cancelOrder(res.jobOrderNumber, res._id),
                  false,
                  res.orderStatus === "Canceled"
                );
              } else if (res3 === "Print") {
                return _constructTableActions(
                  res3,
                  () => window.open(`/orders/print/${res._id}`, "_blank"),
                  true,
                  res.orderStatus === "Canceled"
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
          res.customerId.firstName
            .toLowerCase()
            .includes(searchPhrase.toLowerCase())
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

  const _cancelOrder = (jobOrderNumber: string, orderId: string) => {
    setSelectedJobOrderNumber(jobOrderNumber);
    setSelectedOrderId(orderId);
    setIsCancelModalOpen(true);
  };

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10 mb-10">
        View Orders
      </h1>
      <div className="flex justify-center">
        <button
          className="bg-light border-2 border-primary w-[90px] text-primary hover:bg-accent"
          onClick={() => navigate("/orders/dropoff")}
        >
          Drop Off
        </button>
        <button className="bg-primary w-[90px] text-white hover:bg-primary-dark">
          DIY
        </button>
      </div>
      <div className="flex justify-between mt-11">
        <div>
          <h3 className="font-bold text-primary">DIY Orders</h3>
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
              onClick={() => triggerUpdateOrder({ orderStatus: "Canceled" })}
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
    </>
  );
};

const mapStateToProps = (global: any) => ({
  loggedInUserType: global.authenticatedUser.user.type,
});

export default connect(mapStateToProps)(TableDropOff);
