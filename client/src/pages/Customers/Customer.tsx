import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCustomer } from "../../utils/customer";
import moment from "moment";
import _constructTableActions from "../../utils/constructTableActions";
import DataTable from "../../components/Table";
import { getAllOrder } from "../../utils/order";
import { dateSlash } from "../../utils/formatDate";
import numberWithCommas from "../../utils/numberWithCommas";

type T_Header = {
  header: string;
  dataName: string;
};

const Table = () => {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");

  const [bdMonth, setBdMonth] = useState("");
  const [bdDay, setBdDay] = useState("");
  const [bdYear, setBdYear] = useState("");

  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [landline, setLandline] = useState("");
  const [street, setStreet] = useState("");
  const [barangayVillage, setBarangayVillage] = useState("");
  const [cityProvince, setCityProvince] = useState("");
  const [postalZipcode, setPostalZipcode] = useState("");
  const [notes, setNotes] = useState("");
  const [order, setOrder] = useState([]);

  const { data: customerData, isLoading: isCustomerDataLoading } = useQuery(
    "customer",
    () => getAllCustomer(`{"_id":"${paramId}"}`)
  );

  const { data: orderData, isLoading: isorderDataLoading } = useQuery(
    "orders",
    () => getAllOrder(`{"customerId": "${paramId}" }`)
  );

  useEffect(() => {
    if (customerData && customerData.length > 0) {
      const {
        lastName,
        firstName,
        contactNumber,
        email,
        landline,
        street,
        barangayVillage,
        cityProvince,
        postalZipcode,
        notes,
        bdMonth,
        bdDay,
        bdYear,
      } = customerData[0];
      setLastName(lastName);
      setFirstName(firstName);
      setBdMonth(bdMonth);
      setBdDay(bdDay);
      setBdYear(bdYear);
      setContactNumber(contactNumber);
      setEmail(email);
      setLandline(landline);
      setStreet(street);
      setBarangayVillage(barangayVillage);
      setCityProvince(cityProvince);
      setPostalZipcode(postalZipcode);
      setNotes(notes);
    }
  }, [customerData]);

  const setBirthdate = () => {
    if (!bdMonth) {
      return "--- --- ---";
    } else {
      const dateString = `${bdMonth}/${bdDay}/${bdYear ? bdYear : "1970"}`;
      return moment(dateString).format(`${bdYear ? "MMM D, YYYY" : "MMM D"}`);
    }
  };

  const tableHeader = useMemo(
    () => [
      { header: "JO Number", dataName: "jobOrderNumber" },
      { header: "Date", dataName: "createdAt" },
      { header: "Service Type", dataName: "serviceType" },
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
            value = res.laundryId ? "Drop Off" : "DIY";
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
      <h1 className="font-bold text-primary text-center mt-10 mb-10">
        View Customer
      </h1>
      <div>
        <div className="flex justify-between mt-11">
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">Name:</span>{" "}
              {isCustomerDataLoading
                ? "---"
                : `${firstName ? firstName : "---"} ${
                    lastName ? lastName : "---"
                  }`}
            </p>
          </div>
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">Birthdate:</span>{" "}
              {isCustomerDataLoading ? "--- --- ---" : setBirthdate()}
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">Mobile No.:</span>{" "}
              {isCustomerDataLoading
                ? "---"
                : contactNumber
                ? contactNumber
                : "---"}
            </p>
          </div>
          <div>
            <p className="font-bold">
              <span className="font-bold text-primary">Landline:</span>{" "}
              {isCustomerDataLoading ? "---" : landline ? landline : "---"}
            </p>
          </div>
        </div>
        <p className="font-bold">
          <span className="font-bold text-primary">Email:</span>{" "}
          {isCustomerDataLoading ? "---" : email ? email : "---"}
        </p>
        <p className="font-bold">
          <span className="font-bold text-primary">Address:</span>{" "}
          {isCustomerDataLoading
            ? "---"
            : `${street ? street : "---"}, ${
                barangayVillage ? barangayVillage : "---"
              }, ${cityProvince ? cityProvince : "---"}, ${
                postalZipcode ? postalZipcode : "---"
              }`}
        </p>
        <p className="font-bold">
          <span className="font-bold text-primary">Notes:</span>{" "}
          {isCustomerDataLoading ? "---" : notes ? notes : "---"}
        </p>
        <div className="flex justify-end mt-7">
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl"
            type="button"
            onClick={() => navigate("/customers")}
          >
            Back
          </button>
        </div>
        <DataTable
          header={tableHeader}
          isLoading={isCustomerDataLoading}
          data={order}
        />
        <div className="flex justify-end mt-5">
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-4"
            type="button"
            onClick={() => navigate(`/orders/diy/add/${paramId}`)}
          >
            Add DIY
          </button>
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl"
            type="button"
            onClick={() => navigate(`/orders/dropoff/add/${paramId}`)}
          >
            Add DO
          </button>
        </div>
      </div>
    </>
  );
};

export default Table;
