import { useQuery, useQueryClient, useMutation } from "react-query";
import { useEffect, useMemo } from "react";
import { getAllOrder, updateOrder } from "../../utils/order";

const ComputeTotalLoading = (props: any) => {
  const { orderId } = props;
  const queryClient = useQueryClient();

  const { mutate: triggerUpdateOrder } = useMutation(
    async (order: any) => updateOrder(order, orderId),
    {
      onError: async (err: any) => {
        console.log("Error: ", err);
      },
    }
  );

  const {
    data: orderData,
    isLoading: isOrderLoading,
    refetch: refetchOrderData,
  } = useQuery("computeOrder", () => getAllOrder(`{"_id":"${orderId}"}`), {
    enabled: false,
  });

  const services = useMemo(() => {
    return orderData && orderData.length > 0
      ? [orderData[0]?.orderWash, orderData[0]?.orderDry]
      : [];
  }, [orderData]);

  const addOns = useMemo(() => {
    if (orderData && orderData.length > 0 && orderData[0]?.laundryId) {
      return [orderData[0]?.laundryId, ...orderData[0]?.orderAddOn];
    } else {
      return orderData && orderData.length > 0
        ? [...orderData[0]?.orderAddOn]
        : [];
    }
  }, [orderData]);

  useEffect(() => {
    const servicesTotal =
      services.length > 0
        ? services.reduce(function (a: any, b: any) {
            return a + b.total;
          }, 0)
        : 0;
    const itemsTotal =
      orderData && orderData.length > 0 && orderData[0]?.orderItem.length > 0
        ? orderData[0]?.orderItem.reduce(function (a: any, b: any) {
            return a + parseFloat(b.total);
          }, 0)
        : 0;
    const addOnsTotal =
      addOns.length > 0
        ? addOns.reduce(function (a: any, b: any) {
            return a + parseFloat(b.total ? b.total : b.price ? b.price : 0);
          }, 0)
        : 0;
    const discountTotal =
      orderData &&
      orderData.length > 0 &&
      orderData[0]?.orderDiscount.length > 0
        ? orderData[0]?.orderDiscount.reduce(function (a: any, b: any) {
            return a + parseFloat(b.total);
          }, 0)
        : 0;
    const pay = servicesTotal + itemsTotal + addOnsTotal - discountTotal;
    if (pay > 0) {
      triggerUpdateOrder({ amountDue: pay });
    }
  }, [services, addOns, orderData, orderId, triggerUpdateOrder]);

  useEffect(() => {
    if (orderId !== "") {
      refetchOrderData();
    }
    return () => {
      queryClient.removeQueries("computeOrder");
    };
  }, [orderId, refetchOrderData, queryClient]);

  return <>{isOrderLoading ? <h4>Loading...</h4> : null}</>;
};

export default ComputeTotalLoading;
