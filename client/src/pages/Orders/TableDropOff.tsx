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
import { bulkUpdateInventory } from "../../utils/inventory";
import moment from "moment";

type T_Header = {
  header: string;
  dataName: string;
};

const TableDropOff = (props: any) => {
  const { loggedInUserUsername } = props;
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [order, setOrder] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedJobOrderNumber, setSelectedJobOrderNumber] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [sortedData, setSortedData] = useState<any>({});
  const [isAdminPasswordModalOpen, setIsAdminPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [selectedOrderItemToUpdate, setSelectedOrderToUpdate] = useState<any>(
    []
  );

  const {
    data: orderData,
    isLoading: isorderDataLoading,
    refetch: refetchOrderData,
  } = useQuery("ordersDropOff", () =>
    getAllOrder(`{"laundryId": { "$exists": true}}`)
  );

  const {
    mutate: triggerBulkUpdateInventoryStock,
    isLoading: isBulkUpdateInventoryStockLoading,
  } = useMutation(async (order: any) => bulkUpdateInventory(order), {
    onSuccess: async () => {
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

  const { mutate: triggerUpdateOrder, isLoading: isUpdateOrderLoading } =
    useMutation(async (order: any) => updateOrder(order, selectedOrderId), {
      onSuccess: async () => {
        setSelectedJobOrderNumber("");
        setSelectedOrderId("");
        setIsCancelModalOpen(false);
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

  const { mutate: triggerVerifyPassword, isLoading: isVerifyPasswordLoading } =
    useMutation(async (password: any) => verifyPassword(password), {
      onSuccess: async () => {
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

  const tableHeader = useMemo(
    () => [
      { header: "JO Number", dataName: "jobOrderNumber", sort: true },
      { header: "Date", dataName: "createdAt", sort: true },
      { header: "Customer", dataName: "customer", sort: true },
      { header: "Total", dataName: "amountDue", sort: true },
      { header: "Paid Status", dataName: "paidStatus", sort: true },
      { header: "Claim Status", dataName: "claimStatus", sort: true },
      { header: "Order Status", dataName: "orderStatus", sort: true },
      { header: "Action", dataName: "endActions", sort: false },
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
                  () => _cancelOrder(res.jobOrderNumber, res),
                  false,
                  res.orderStatus === "Canceled"
                );
              } else if (res3 === "Print") {
                return _constructTableActions(
                  res3,
                  () => window.open(`/print/${res?.customerId?._id}`, "_blank"),
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
  }, [searchPhrase, orderData, _remappedData]);

  useEffect(() => {
    if (orderData && orderData.length > 0) {
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
      if (sortedData?.data && sortedData?.data === "claimStatus") {
        orderDataSorted = orderDataSorted?.sort((a: any, b: any) => {
          return sortedData?.sort === "up"
            ? a.claimStatus.localeCompare(b.claimStatus)
            : b.claimStatus.localeCompare(a.claimStatus);
        });
      }
      if (sortedData?.data && sortedData?.data === "orderStatus") {
        orderDataSorted = orderDataSorted?.sort((a: any, b: any) => {
          return sortedData?.sort === "up"
            ? a.orderStatus.localeCompare(b.orderStatus)
            : b.orderStatus.localeCompare(a.orderStatus);
        });
      }
      setOrder(_remappedData(orderDataSorted));
    }
  }, [orderData, _remappedData, sortedData]);

  const _cancelOrder = (jobOrderNumber: string, order: any) => {
    setSelectedJobOrderNumber(jobOrderNumber);
    setSelectedOrderId(order?._id);
    setIsCancelModalOpen(true);

    const toUpdateItem = order?.orderItem
      ? order?.orderItem?.map((res: any) => {
          return {
            updateOne: {
              filter: { _id: res?.inventoryId?._id },
              update: { $inc: { stock: res.qty } },
              upsert: false,
            },
          };
        })
      : [];

    setSelectedOrderToUpdate(toUpdateItem);
  };

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
              disabled={
                isUpdateOrderLoading || isBulkUpdateInventoryStockLoading
              }
            >
              Yes
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              onClick={() => setIsCancelModalOpen(!isCancelModalOpen)}
              disabled={
                isUpdateOrderLoading || isBulkUpdateInventoryStockLoading
              }
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
            disabled={
              isVerifyPasswordLoading ||
              isUpdateOrderLoading ||
              isBulkUpdateInventoryStockLoading
            }
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
              disabled={
                isVerifyPasswordLoading ||
                isUpdateOrderLoading ||
                isBulkUpdateInventoryStockLoading
              }
            >
              Confirm
            </button>
            <button
              className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
              onClick={() => {
                setIsAdminPasswordModal(!isAdminPasswordModalOpen);
                setAdminPassword("");
              }}
              disabled={
                isVerifyPasswordLoading ||
                isUpdateOrderLoading ||
                isBulkUpdateInventoryStockLoading
              }
            >
              Cancel
            </button>
          </>
        }
        size="sm"
      />
    </>
  );
};

const mapStateToProps = (global: any) => ({
  loggedInUserUsername: global.authenticatedUser.user.username,
});

export default connect(mapStateToProps)(TableDropOff);
