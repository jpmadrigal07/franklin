import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useMutation, useQuery } from "react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useParams } from "react-router-dom";
import Asterisk from "../../components/Asterisk";
import validate from "../../validation/services";
import getErrorsFromValidation from "../../utils/getErrorsFromValidation";
import findInputError from "../../utils/findInputError";
import clean from "../../utils/cleanObject";
import { addWash } from "../../utils/wash";
import { addDry } from "../../utils/dry";
import { addAddOn } from "../../utils/addOn";
import { addLaundry } from "../../utils/laundry";
import { addDiscount } from "../../utils/discount";

const Add = (props: any) => {
  const { loggedInUserType, name: propsName } = props;
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [price, setPrice] = useState<number | undefined>();

  const [formErrors, setFormErrors] = useState<any[]>([]);

  const addData = (data: any) => {
    if (propsName === "Wash") {
      return addWash(data);
    } else if (propsName === "Dry") {
      return addDry(data);
    } else if (propsName === "Service") {
      return addAddOn(data);
    } else if (propsName === "Drop Off Fee") {
      return addLaundry(data);
    } else if (propsName === "Discount") {
      return addDiscount(data);
    }
  };

  const { mutate, isLoading: isAddLoading } = useMutation(
    async (data: any) => addData(data),
    {
      onSuccess: async () => {
        MySwal.fire({
          title: `${propsName} created!`,
          text: "You will be redirected",
          icon: "success",
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          navigate("/services");
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
    }
  );

  const _addServices = () => {
    if (loggedInUserType === "Admin") {
      const values = {
        type,
        price,
      };
      const filteredValues = clean(values);
      const validatedData: any = validate(filteredValues);
      if (!validatedData) {
        mutate(filteredValues);
      } else {
        setFormErrors(getErrorsFromValidation(validatedData));
      }
    } else {
      MySwal.fire({
        title: "Ooops!",
        text: "Only the Admin can make an action for this",
        icon: "warning",
        confirmButtonText: "Okay",
        confirmButtonColor: "#274c77",
      });
    }
  };

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10 mb-10">
        Add {propsName}
      </h1>
      <form className="w-full">
        <div className="flex flex-row">
          <div className="basis-1/2 mr-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              {propsName} Name
              <Asterisk />
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "type")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="text"
              onChange={(e: any) => setType(e.target.value)}
              disabled={isAddLoading}
            />
            {findInputError(formErrors, "type") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "type")}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="basis-1/2 ml-2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Price
              <Asterisk />
            </label>
            <input
              className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
                findInputError(formErrors, "price")
                  ? "border-red"
                  : "border-accent"
              }`}
              id="grid-first-name"
              type="number"
              autoComplete="off"
              onChange={(e: any) => setPrice(parseFloat(e.target.value))}
              disabled={isAddLoading}
            />
            {findInputError(formErrors, "price") ? (
              <p className="text-[12px] text-red">
                {findInputError(formErrors, "price")}
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-4"
            type="button"
            onClick={() => _addServices()}
            disabled={isAddLoading}
          >
            Save
          </button>
          <button
            className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
            type="button"
            disabled={isAddLoading}
            onClick={() => navigate("/services")}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

const mapStateToProps = (global: any) => ({
  loggedInUserType: global.authenticatedUser.user.type,
});

export default connect(mapStateToProps)(Add);
