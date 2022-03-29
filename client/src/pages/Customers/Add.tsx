import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { addCustomer } from "../../utils/customer";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import Asterisk from "../../components/Asterisk";
import validate from "../../validation/customer";
import getErrorsFromValidation from "../../utils/getErrorsFromValidation";
import findInputError from "../../utils/findInputError";
import clean from "../../utils/cleanObject";
import { isBirthDateValid } from "../../utils/isDateValid";
import { isValidPhoneNumber } from "libphonenumber-js";

const Add = () => {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
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

  const { mutate: triggerAddCustomer, isLoading: isAddCustomerLoading } =
    useMutation(async (customer: any) => addCustomer(customer), {
      onSuccess: async () => {
        MySwal.fire({
          title: "Customer created!",
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

  const _addCustomer = () => {
    const values = {
      lastName,
      firstName,
      contactNumber,
      landline,
      street,
      email,
      barangayVillage,
      cityProvince,
      postalZipcode,
      notes,
      bdMonth,
      bdDay,
      bdYear,
    };
    const filteredValues = clean(values);
    const validatedData: any = validate(filteredValues);

    const isBdateValid = isBirthDateValid(
      `${bdMonth}/${bdDay}/${bdYear ? bdYear : "1970"}`
    );
    const isPhoneNumberValid = contactNumber
      ? isValidPhoneNumber(contactNumber, "PH")
      : false;
    const isLandlineValid = landline
      ? isValidPhoneNumber(landline, "PH")
      : false;
    const errors = validatedData ? getErrorsFromValidation(validatedData) : [];
    let customErrors: any[] = [];
    if (!isBdateValid || !isPhoneNumberValid) {
      if (
        !isBdateValid ||
        typeof bdMonth === "string" ||
        typeof bdDay === "string" ||
        typeof bdYear === "string"
      ) {
        const bdateError = [
          {
            input: "bdMonth",
            errorMessage: "Invalid birthdate",
          },
          {
            input: "bdDay",
            errorMessage: "Invalid birthdate",
          },
        ];
        customErrors = [...customErrors, ...bdateError];
      }
      if (!isPhoneNumberValid) {
        customErrors = [
          ...customErrors,
          {
            input: "contactNumber",
            errorMessage: "Invalid Mobile Number",
          },
        ];
      }
    }
    if (landline && !isLandlineValid) {
      customErrors = [
        ...customErrors,
        {
          input: "landline",
          errorMessage: "Invalid Landline Number",
        },
      ];
    }
    const combinedErrors = [...errors, ...customErrors];

    if (combinedErrors && combinedErrors.length === 0) {
      triggerAddCustomer(filteredValues);
    } else {
      setFormErrors(combinedErrors);
    }
  };

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10 mb-10">
        Add Customer
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
              disabled={isAddCustomerLoading}
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
              disabled={isAddCustomerLoading}
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
                  disabled={isAddCustomerLoading}
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
                  disabled={isAddCustomerLoading}
                />
              </div>
              <div className="basis-1/2 ml-2">
                <input
                  className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
                  id="grid-first-name"
                  type="text"
                  placeholder="YYYY"
                  onChange={(e: any) => setBdYear(e.target.value)}
                  disabled={isAddCustomerLoading}
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
              disabled={isAddCustomerLoading}
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
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "email")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="email"
              onChange={(e: any) => setEmail(e.target.value)}
              disabled={isAddCustomerLoading}
            />
            {findInputError(formErrors, "email") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "email")}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="basis-1/3 ml-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Landline
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "landline")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setLandline(e.target.value)}
              disabled={isAddCustomerLoading}
            />
            {findInputError(formErrors, "landline") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "landline")}
              </p>
            ) : (
              ""
            )}
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
              disabled={isAddCustomerLoading}
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
              disabled={isAddCustomerLoading}
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
              disabled={isAddCustomerLoading}
            />
          </div>
          <div className="basis-1/4 ml-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Zip Code
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "postalZipcode")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setPostalZipcode(e.target.value)}
              disabled={isAddCustomerLoading}
            />
            {findInputError(formErrors, "postalZipcode") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "postalZipcode")}
              </p>
            ) : (
              ""
            )}
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
            disabled={isAddCustomerLoading}
          ></textarea>
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-4"
            type="button"
            onClick={() => _addCustomer()}
            disabled={isAddCustomerLoading}
          >
            Save
          </button>
          <button
            className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
            type="button"
            disabled={isAddCustomerLoading}
            onClick={() => navigate("/customers")}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default Add;
