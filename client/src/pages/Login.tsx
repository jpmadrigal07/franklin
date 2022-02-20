import { useState } from "react";
import { useMutation } from "react-query";
import { login } from "../utils/auth";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: triggerLogin, isLoading: isLoginLoading } = useMutation(
    async (inventory: any) => login(inventory),
    {
      onSuccess: async (data) => {
        Cookies.set("sessionToken", data.token);
        navigate("/dashboard");
      },
      onError: async (err: any) => {
        MySwal.fire({
          title: "Ooops!",
          text: err,
          icon: "error",
          confirmButtonText: "Okay",
          confirmButtonColor: "#274c77",
        });
      },
    }
  );
  const _login = (e: any) => {
    e.preventDefault();
    triggerLogin({
      username,
      password,
    });
  };
  return (
    <div className="grid place-content-center h-screen">
      <div className="w-full max-w-xs">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={_login}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              disabled={isLoginLoading}
              onChange={(e: any) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              disabled={isLoginLoading}
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isLoginLoading}
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2022 Franklin's All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
