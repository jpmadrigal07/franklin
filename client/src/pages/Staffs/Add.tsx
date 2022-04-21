import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useMutation, useQuery } from "react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useParams } from "react-router-dom";
import Asterisk from "../../components/Asterisk";
import validate from "../../validation/staff";
import getErrorsFromValidation from "../../utils/getErrorsFromValidation";
import findInputError from "../../utils/findInputError";
import clean from "../../utils/cleanObject";
import { addStaff } from "../../utils/staff";
import { addUser } from "../../utils/user";

const Add = (props: any) => {
  const { loggedInUserType } = props;
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formErrors, setFormErrors] = useState<any[]>([]);

  const { mutate: triggerAddUser, isLoading: isAddUserLoading } = useMutation(
    async (data: any) => addUser(data),
    {
      onSuccess: async (data) => {
        triggerAddStaff({
          userId: data._id,
          name,
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

  const { mutate: triggerAddStaff, isLoading: isAddStaffLoading } = useMutation(
    async (data: any) => addStaff(data),
    {
      onSuccess: async () => {
        MySwal.fire({
          title: `Staff created!`,
          text: "You will be redirected",
          icon: "success",
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 3000,
        }).then(() => {
          navigate("/staffs");
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

  const _addStaff = () => {
    if (loggedInUserType === "Admin") {
      if (password === confirmPassword) {
        const values = {
          username,
          password,
          userType: "Staff",
        };
        const values2 = {
          name,
          username,
          password,
          confirmPassword,
        };
        const filteredValues = clean(values2);
        const validatedData: any = validate(filteredValues);
        if (!validatedData) {
          triggerAddUser(values);
        } else {
          setFormErrors(getErrorsFromValidation(validatedData));
        }
      } else {
        MySwal.fire({
          title: "Ooops!",
          text: "Password didn't match",
          icon: "warning",
          confirmButtonText: "Okay",
          confirmButtonColor: "#274c77",
        });
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
        Add Staff
      </h1>
      <form className="w-full">
        <div className="mb-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Staff Name
            <Asterisk />
          </label>
          <input
            className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
              findInputError(formErrors, "name")
                ? "border-red"
                : "border-accent"
            }`}
            id="grid-first-name"
            type="text"
            onChange={(e: any) => setName(e.target.value)}
            disabled={isAddStaffLoading || isAddUserLoading}
          />
          {findInputError(formErrors, "name") ? (
            <p className="text-[12px] text-red">
              {findInputError(formErrors, "name")}
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="mb-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Username
            <Asterisk />
          </label>
          <input
            className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
              findInputError(formErrors, "username")
                ? "border-red"
                : "border-accent"
            }`}
            id="grid-first-name"
            type="text"
            onChange={(e: any) => setUsername(e.target.value)}
            disabled={isAddStaffLoading || isAddUserLoading}
          />
          {findInputError(formErrors, "username") ? (
            <p className="text-[12px] text-red">
              {findInputError(formErrors, "username")}
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="mb-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Password
            <Asterisk />
          </label>
          <input
            className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
              findInputError(formErrors, "password")
                ? "border-red"
                : "border-accent"
            }`}
            id="grid-first-name"
            type="password"
            autoComplete="off"
            onChange={(e: any) => setPassword(e.target.value)}
            disabled={isAddStaffLoading || isAddUserLoading}
          />
          {findInputError(formErrors, "password") ? (
            <p className="text-[12px] text-red">
              {findInputError(formErrors, "password")}
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="mb-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Confirm Password
            <Asterisk />
          </label>
          <input
            className={`pt-1 pb-1 pl-2 rounded-sm mr-2 w-full border-2 ${
              findInputError(formErrors, "confirmPassword")
                ? "border-red"
                : "border-accent"
            }`}
            id="grid-first-name"
            type="password"
            autoComplete="off"
            onChange={(e: any) => setConfirmPassword(e.target.value)}
            disabled={isAddStaffLoading || isAddUserLoading}
          />
          {findInputError(formErrors, "confirmPassword") ? (
            <p className="text-[12px] text-red">
              {findInputError(formErrors, "confirmPassword")}
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="bg-primary text-white pt-1 pl-5 pb-1 pr-5 rounded-xl mr-4"
            type="button"
            onClick={() => _addStaff()}
            disabled={isAddStaffLoading || isAddUserLoading}
          >
            Save
          </button>
          <button
            className="pt-1 pl-5 pb-1 pr-5 rounded-xl bg-white border-2 border-primary text-primary"
            type="button"
            disabled={isAddStaffLoading || isAddUserLoading}
            onClick={() => navigate("/staffs")}
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
