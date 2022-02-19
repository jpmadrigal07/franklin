import { useState } from "react";
import { useMutation } from "react-query";
import { addCustomer } from "../../utils/customer";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

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
    triggerAddCustomer({
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
    });
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
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setLastName(e.target.value)}
              disabled={isAddCustomerLoading}
            />
          </div>
          <div className="basis-1/2 mx-1">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Given Name
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setFirstName(e.target.value)}
              disabled={isAddCustomerLoading}
            />
          </div>
          <div className="basis-1/4 ml-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Birthdate
            </label>
            <div className="flex flex-row">
              <div className="basis-1/4 mr-2">
                <input
                  className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
                  id="grid-first-name"
                  type="text"
                  placeholder="MM"
                  onChange={(e: any) => setBdMonth(e.target.value)}
                  disabled={isAddCustomerLoading}
                />
              </div>
              <div className="basis-1/4 mx-1">
                <input
                  className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
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
          </div>
        </div>
        <div className="flex flex-row mt-5">
          <div className="basis-1/3 mr-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Mobile No.
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setContactNumber(e.target.value)}
              disabled={isAddCustomerLoading}
            />
          </div>
          <div className="basis-1/3 mx-1">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Email
            </label>
            <input
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setEmail(e.target.value)}
              disabled={isAddCustomerLoading}
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
              disabled={isAddCustomerLoading}
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
              className="pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 border-accent"
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setPostalZipcode(e.target.value)}
              disabled={isAddCustomerLoading}
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
            className="bg-primary pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
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
