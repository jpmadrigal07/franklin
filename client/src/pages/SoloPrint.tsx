import { useState, useEffect, useMemo, useCallback } from "react";
import DataTable from "../components/Table";
import _constructTableActions from "../utils/constructTableActions";
import { useQuery } from "react-query";
import { getAllOrder } from "../utils/order";
import { useParams } from "react-router-dom";

type T_Header = {
  header: string;
  dataName: string;
};

const Print = () => {
  const { id: paramId } = useParams();
  const [orders, setOrders] = useState([]);
  const [totalLoads, setTotalLoads] = useState<any>(null);
  const [total, setTotal] = useState<any>(null);

  const {
    data: orderData,
    isLoading: isorderDataLoading,
    refetch: refetchOrderData,
  } = useQuery("printOrder", () => getAllOrder(`{"_id": "${paramId}"}`));

  const tableHeader = useMemo(
    () => [
      { header: "JOB", dataName: "jobOrderNumber" },
      { header: "W", dataName: "wash" },
      { header: "D", dataName: "dry" },
      { header: "DET", dataName: "det" },
      { header: "FAB", dataName: "fab" },
      { header: "ZX", dataName: "zx" },
    ],
    []
  );

  const _remappedData = useCallback(
    (data: any) => {
      const newData = data.map((res: any) => {
        const mainData = tableHeader.map((res2: any) => {
          let value;
          if (res2.dataName === "jobOrderNumber") {
            value = res.jobOrderNumber?.substr(res.jobOrderNumber.length - 3);
          } else if (res2.dataName === "wash") {
            value = res.orderWash.washId?.type?.charAt(0);
          } else if (res2.dataName === "dry") {
            value = res.orderDry.dryId?.type?.charAt(0);
          } else if (res2.dataName === "det") {
            const selected = Array.isArray(res["orderItem"])
              ? res["orderItem"].find(
                  (res: any) => res?.inventoryId?.type === "Detergent"
                )
              : null;
            value = selected
              ? `${selected?.inventoryId?.stockCode}:${selected?.qty}`
              : "---";
          } else if (res2.dataName === "fab") {
            const selected = Array.isArray(res["orderItem"])
              ? res["orderItem"].find(
                  (res: any) => res?.inventoryId?.type === "FabCon"
                )
              : null;
            value = selected
              ? `${selected?.inventoryId?.stockCode}:${selected?.qty}`
              : "---";
          } else if (res2.dataName === "zx") {
            const zonrox = Array.isArray(res["orderItem"])
              ? res["orderItem"].find(
                  (res: any) => res?.inventoryId?.name === "Zonrox"
                )
              : null;
            value = zonrox ? zonrox?.qty : "---";
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
      setOrders(_remappedData(orderData));
      const loadTotal =
        orderData.length > 0
          ? orderData.reduce(function (a: any, b: any) {
              const dryMachineNumber = b?.orderDry
                ? b?.orderDry?.machineNumber
                : 0;
              const washMachineNumber = b?.orderWash
                ? b?.orderWash?.machineNumber
                : 0;
              return a + (dryMachineNumber + washMachineNumber);
            }, 0)
          : 0;
      setTotalLoads(loadTotal);
      const totalPayment =
        orderData.length > 0
          ? orderData.reduce(function (a: any, b: any) {
              return a + b.amountDue;
            }, 0)
          : 0;
      setTotal(totalPayment);
    }
  }, [orderData, _remappedData]);

  useEffect(() => {
    if (orderData && orderData.length > 0 && orders.length > 0) {
      window.print();
    }
  }, [orderData, orders]);

  return (
    <>
      <div className="flex flex-col border-dashed border-b-4 mx-2 pb-5">
        <div className="flex justify-center">
          <span className="text-[48px] font-bold">FRANKLIN'S</span>
          <div className="flex flex-col justify-center ml-1">
            <span className="text-[10px] font-bold">WASH</span>
            <span className="text-[10px] font-bold">DRY</span>
            <span className="text-[10px] font-bold">CLEAN</span>
          </div>
        </div>
        <div className="flex justify-center mt-[-14px]">
          <span className="text-[17px] mr-10">+639223174219</span>
          <span className="text-[17px]">+639289839953</span>
        </div>
        <div className="flex justify-center mt-2 mb-3">
          <span className="text-[25px] underline tracking-widest">
            CLAIM STUB
          </span>
        </div>
        <div className="flex justify-center">
          <span>Final amount subject to change</span>
        </div>
        <div className="flex justify-center">
          <span>subject to conditions.</span>
        </div>
        <div className="flex justify-center mb-2">
          <span>Present this stub when claiming.</span>
        </div>
        <div className="flex justify-center">
          <span className="font-bold">NOT AN OFFICIAL RECEIPT</span>
        </div>
        <div className="flex justify-center mt-3 mb-3">
          <span className="mr-[120px]">
            LOADS: {totalLoads ? totalLoads : "---"}
          </span>
          <span>TOTAL: {total ? total : "---"}</span>
        </div>
        <DataTable
          header={tableHeader}
          isLoading={isorderDataLoading}
          data={orders}
          paddingLeftRight={false}
        />
      </div>
      {orderData && orderData.length > 0
        ? orderData.map((res: any) => {
            const selectedDet = Array.isArray(res["orderItem"])
              ? res["orderItem"].find(
                  (res: any) => res?.inventoryId?.type === "Detergent"
                )
              : null;

            const selectedFab = Array.isArray(res["orderItem"])
              ? res["orderItem"].find(
                  (res: any) => res?.inventoryId?.type === "FabCon"
                )
              : null;

            const zonrox = Array.isArray(res["orderItem"])
              ? res["orderItem"].find(
                  (res: any) => res?.inventoryId?.name === "Zonrox"
                )
              : null;

            return (
              <div className="flex flex-col border-dashed border-b-4 mx-2 pb-10 mt-5">
                <div className="flex justify-center">
                  <span className="text-[48px] font-bold">FRANKLIN'S</span>
                </div>
                <div className="flex justify-center mt-[-18px] border-dashed border-b-4 mx-12">
                  <span className="text-[48px]">{res.jobOrderNumber}</span>
                </div>
                <div className="flex justify-center">
                  <div className="flex justify-center mt-5 mr-12 ml-[-50px]">
                    <span className="rotate-90 text-[20px] font-bold">
                      {res.jobOrderNumber}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-center mt-5">
                      <span className="w-[100px]">
                        W:{" "}
                        {res?.orderWash
                          ? res?.orderWash?.washId?.type?.charAt(0)
                          : "---"}
                      </span>
                      <span className="grow"></span>
                      <span className="w-[100px]">
                        DET:{" "}
                        {selectedDet
                          ? `${selectedDet?.inventoryId?.stockCode}:${selectedDet?.qty}`
                          : "---"}
                      </span>
                    </div>
                    <div className="flex justify-center mt-2">
                      <span className="w-[100px]">
                        D:{" "}
                        {res?.orderDry
                          ? res?.orderDry?.dryId?.type?.charAt(0)
                          : "---"}
                      </span>
                      <span className="grow"></span>
                      <span className="w-[100px]">
                        FAB:{" "}
                        {selectedFab
                          ? `${selectedFab?.inventoryId?.stockCode}:${selectedFab?.qty}`
                          : "---"}
                      </span>
                    </div>
                    <div className="flex justify-center mt-2">
                      <span className="w-[100px]"></span>
                      <span className="grow"></span>
                      <span className="w-[100px]">
                        ZRX: {zonrox ? zonrox?.qty : "---"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        : null}
    </>
  );
};

Print.propTypes = {};

export default Print;
