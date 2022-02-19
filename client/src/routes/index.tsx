import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Loading from "../components/Loading";
import MainLayout from "../pages/MainLayout";

// ----------------------------------------------------------------------

const Loadable = (Component: React.ElementType) => (props: any) => {
  return (
    <Suspense
      fallback={
        // To be replaced with loading
        <Loading />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "/",
      children: [{ path: "", element: <Login /> }],
    },
    {
      path: "login",
      children: [{ path: "", element: <Login /> }],
    },
    {
      path: "",
      element: <MainLayout />,
      children: [
        { element: <Navigate to="/dashboard" replace /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "services", element: <Services /> },
        { path: "customers", element: <Customers /> },
        {
          path: "customers",
          children: [
            { path: ":id", element: <ViewCustomer /> },
            { path: "add", element: <AddCustomer /> },
            { path: "edit/:id", element: <EditCustomer /> },
          ],
        },
        { path: "orders", element: <Orders /> },
        { path: "inventory", element: <Inventory /> },
        {
          path: "inventory",
          children: [{ path: "add", element: <AddInventory /> }],
        },
        { path: "staff", element: <Staff /> },
        { path: "reports", element: <Reports /> },
      ],
    },
    // { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

const Login = Loadable(lazy(() => import("../pages/Login")));
const Dashboard = Loadable(lazy(() => import("../pages/Dashboard")));
const Services = Loadable(lazy(() => import("../pages/Services")));
const Customers = Loadable(lazy(() => import("../pages/Customers/Table")));
const AddCustomer = Loadable(lazy(() => import("../pages/Customers/Add")));
const EditCustomer = Loadable(lazy(() => import("../pages/Customers/Edit")));
const ViewCustomer = Loadable(
  lazy(() => import("../pages/Customers/Customer"))
);
const Orders = Loadable(lazy(() => import("../pages/Orders")));
const Inventory = Loadable(lazy(() => import("../pages/Inventory/Table")));
const AddInventory = Loadable(lazy(() => import("../pages/Inventory/Add")));
const Staff = Loadable(lazy(() => import("../pages/Staff")));
const Reports = Loadable(lazy(() => import("../pages/Reports")));
