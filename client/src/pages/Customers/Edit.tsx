import { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { updateCustomer, getAllCustomer } from "../../utils/customer";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useParams } from "react-router-dom";
import Asterisk from "../../components/Asterisk";
import validate from "../../validation/customer";
import getErrorsFromValidation from "../../utils/getErrorsFromValidation";
import findInputError from "../../utils/findInputError";
import clean from "../../utils/cleanObject";

const Edit = () => {
  const MySwal = withReactContent(Swal);
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
  const [formErrors, setFormErrors] = useState<any[]>([]);

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

  const { mutate: triggerUpdateCustomer, isLoading: isUpdateCustomerLoading } =
    useMutation(async (customer: any) => updateCustomer(customer, paramId), {
      onSuccess: async () => {
        MySwal.fire({
          title: "Customer updated!",
          text: "You will be redirected",
          icon: "success",
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          navigate("/customers");
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

  const _updateCustomer = () => {
    const customer = {
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
    };
    const filteredValues = clean(customer);
    const validatedData: any = validate(filteredValues);

    if (!validatedData) {
      triggerUpdateCustomer(filteredValues);
    } else {
      setFormErrors(getErrorsFromValidation(validatedData));
    }
  };

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10 mb-10">
        Edit Customer
      </h1>
      <form className="w-full">
        <div className="flex flex-row">
          <div className="basis-1/2 mr-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Last Name
              <Asterisk />
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "lastName")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setLastName(e.target.value)}
              disabled={
                isUpdateCustomerLoading ||
                isCustomerDataLoading ||
                !customerData
              }
              value={lastName}
            />
            {findInputError(formErrors, "lastName") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "lastName")}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="basis-1/2 mx-1">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Given Name
              <Asterisk />
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "firstName")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setFirstName(e.target.value)}
              disabled={
                isUpdateCustomerLoading ||
                isCustomerDataLoading ||
                !customerData
              }
              value={firstName}
            />
            {findInputError(formErrors, "firstName") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "firstName")}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="basis-1/4 ml-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Birthdate
              <Asterisk />{" "}
              <span className="italic text-dark text-[10px]">
                (Year is optional)
              </span>
            </label>
            <div className="flex flex-row">
              <div className="basis-1/4 mr-2">
                <input
                  className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                    findInputError(formErrors, "bdMonth")
                      ? "border-red"
                      : "border-accent"
                  }`}
                  id="grid-first-name"
                  type="text"
                  placeholder="MM"
                  onChange={(e: any) => setBdMonth(e.target.value)}
                  disabled={
                    isUpdateCustomerLoading ||
                    isCustomerDataLoading ||
                    !customerData
                  }
                  value={bdMonth}
                />
              </div>
              <div className="basis-1/4 mx-1">
                <input
                  className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                    findInputError(formErrors, "bdDay")
                      ? "border-red"
                      : "border-accent"
                  }`}
                  id="grid-first-name"
                  type="text"
                  placeholder="DD"
                  onChange={(e: any) => setBdDay(e.target.value)}
                  disabled={
                    isUpdateCustomerLoading ||
                    isCustomerDataLoading ||
                    !customerData
                  }
                  value={bdDay}
                />
              </div>
              <div className="basis-1/2 ml-2">
                <input
                  className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
                  id="grid-first-name"
                  type="text"
                  placeholder="YYYY"
                  onChange={(e: any) => setBdYear(e.target.value)}
                  disabled={
                    isUpdateCustomerLoading ||
                    isCustomerDataLoading ||
                    !customerData
                  }
                  value={bdYear}
                />
              </div>
            </div>
            {findInputError(formErrors, "bdMonth") ||
            findInputError(formErrors, "bdDay") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "bdMonth") ||
                  findInputError(formErrors, "bdDay")}
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex flex-row mt-5">
          <div className="basis-1/3 mr-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Mobile No.
              <Asterisk />
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "contactNumber")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setContactNumber(e.target.value)}
              disabled={
                isUpdateCustomerLoading ||
                isCustomerDataLoading ||
                !customerData
              }
              value={contactNumber}
            />
            {findInputError(formErrors, "contactNumber") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "contactNumber")}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="basis-1/3 mx-1">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Email
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
              id="grid-first-name"
              type="email"
              onChange={(e: any) => setEmail(e.target.value)}
              disabled={
                isUpdateCustomerLoading ||
                isCustomerDataLoading ||
                !customerData
              }
              value={email}
            />
          </div>
          <div className="basis-1/3 ml-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Landline
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setLandline(e.target.value)}
              disabled={
                isUpdateCustomerLoading ||
                isCustomerDataLoading ||
                !customerData
              }
              value={landline}
            />
          </div>
        </div>
        <div className="flex flex-row mt-5">
          <div className="basis-1/4 mr-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Street
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setStreet(e.target.value)}
              disabled={
                isUpdateCustomerLoading ||
                isCustomerDataLoading ||
                !customerData
              }
              value={street}
            />
          </div>
          <div className="basis-1/4 mx-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Brgy/Village
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setBarangayVillage(e.target.value)}
              disabled={
                isUpdateCustomerLoading ||
                isCustomerDataLoading ||
                !customerData
              }
              value={barangayVillage}
            />
          </div>
          <div className="basis-1/4 mx-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              City/Province
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setCityProvince(e.target.value)}
              disabled={
                isUpdateCustomerLoading ||
                isCustomerDataLoading ||
                !customerData
              }
              value={cityProvince}
            />
          </div>
          <div className="basis-1/4 ml-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Zip Code
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setPostalZipcode(e.target.value)}
              disabled={
                isUpdateCustomerLoading ||
                isCustomerDataLoading ||
                !customerData
              }
              value={postalZipcode}
            />
          </div>
        </div>
        <div className="mt-5">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Notes
          </label>
          <textarea
            className="
              block
              pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent
            "
            id="exampleFormControlTextarea1"
            rows={3}
            onChange={(e: any) => setNotes(e.target.value)}
            disabled={
              isUpdateCustomerLoading || isCustomerDataLoading || !customerData
            }
            value={notes}
          ></textarea>
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-4"
            type="button"
            onClick={() => _updateCustomer()}
            disabled={
              isUpdateCustomerLoading || isCustomerDataLoading || !customerData
            }
            value={lastName}
          >
            Save
          </button>
          <button
            className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
            type="button"
            disabled={isUpdateCustomerLoading}
            value={lastName}
            onClick={() => navigate("/customers")}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default Edit;
