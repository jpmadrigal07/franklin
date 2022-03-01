import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useParams } from "react-router-dom";
import Asterisk from "../../components/Asterisk";
import validate from "../../validation/services";
import getErrorsFromValidation from "../../utils/getErrorsFromValidation";
import findInputError from "../../utils/findInputError";
import clean from "../../utils/cleanObject";
import { getAllWash, updateWash } from "../../utils/wash";
import { getAllDry, updateDry } from "../../utils/dry";
import { getAllAddOn, updateAddOn } from "../../utils/addOn";
import { getAllLaundry, updateLaundry } from "../../utils/laundry";
import { getAllDiscount, updateDiscount } from "../../utils/discount";

const Update = (props: any) => {
  const { loggedInUserType, name: propsName, category } = props;
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: paramId } = useParams();
  const [type, setType] = useState("");
  const [price, setPrice] = useState<number | undefined>();

  const [formErrors, setFormErrors] = useState<any[]>([]);

  const getData = (condition: string) => {
    if (propsName === "Wash") {
      return getAllWash(condition);
    } else if (propsName === "Dry") {
      return getAllDry(condition);
    } else if (propsName === "Service") {
      return getAllAddOn(condition);
    } else if (propsName === "Drop Off Fee") {
      return getAllLaundry(condition);
    } else if (propsName === "Discount") {
      return getAllDiscount(condition);
    }
  };

  const updateData = (data: any) => {
    if (propsName === "Wash") {
      return updateWash(data, paramId);
    } else if (propsName === "Dry") {
      return updateDry(data, paramId);
    } else if (propsName === "Service") {
      return updateAddOn(data, paramId);
    } else if (propsName === "Drop Off Fee") {
      return updateLaundry(data, paramId);
    } else if (propsName === "Discount") {
      return updateDiscount(data, paramId);
    }
  };

  const queryKey = `edit${
    category.charAt(0).toUpperCase() + category.slice(1)
  }`;

  const { data, isLoading: isDataLoading } = useQuery(queryKey, () =>
    getData(`{"_id":"${paramId}"}`)
  );

  const { mutate, isLoading: isUpdateLoading } = useMutation(
    async (data: any) => updateData(data),
    {
      onSuccess: async () => {
        MySwal.fire({
          title: `${propsName} updated!`,
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

  useEffect(() => {
    if (data && data.length > 0) {
      const { type, price } = data[0];
      setType(type);
      setPrice(price);
    }
  }, [data]);

  const _updateServices = () => {
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

  const _cancel = () => {
    queryClient.removeQueries(queryKey, { exact: true });
    navigate("/services");
  };

  return (
    <>
      <h1 className="font-bold text-primary text-center mt-10 mb-10">
        Update {propsName}
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
              value={type}
              disabled={
                isUpdateLoading ||
                isDataLoading ||
                !data ||
                propsName === "Drop Off Fee"
              }
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
              value={price}
              onChange={(e: any) => setPrice(parseFloat(e.target.value))}
              disabled={isUpdateLoading || isDataLoading || !data}
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
            onClick={() => _updateServices()}
            disabled={isUpdateLoading || isDataLoading || !data}
          >
            Save
          </button>
          <button
            className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
            type="button"
            disabled={isUpdateLoading}
            onClick={() => _cancel()}
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

export default connect(mapStateToProps)(Update);
