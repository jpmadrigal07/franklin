import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getAllCustomer } from "../../utils/customer";
import moment from "moment";

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

  const { data: customerData, isLoading: isCustomerDataLoading } = useQuery(
    "customer",
    () => getAllCustomer(`{"_id":"${paramId}"}`)
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
        <div className="flex flex-col mt-7">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead className="border-b-2">
                    <tr>
                      <th
                        scope="col"
                        className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                      >
                        JO Number
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                      >
                        Service Type
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-accent">
                      <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                        Mark
                      </td>
                      <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                        Otto
                      </td>
                      <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                        @mdo
                      </td>
                      <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                        @mdo
                      </td>
                      <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                        View
                      </td>
                    </tr>
                    <tr className="bg-accent border-b border-accent">
                      <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                        Mark
                      </td>
                      <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                        Otto
                      </td>
                      <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                        @mdo
                      </td>
                      <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                        @mdo
                      </td>
                      <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                        View
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                        Mark
                      </td>
                      <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                        Otto
                      </td>
                      <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                        @mdo
                      </td>
                      <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                        @mdo
                      </td>
                      <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                        View
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-5">
            <button
              className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-4"
              type="button"
            >
              Add DIY
            </button>
            <button
              className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl"
              type="button"
            >
              Add DO
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
