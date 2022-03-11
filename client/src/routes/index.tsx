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
        {
          path: "services",
          children: [
            {
              path: "add/wash",
              element: <AddServices category="wash" name="Wash" />,
            },
            {
              path: "add/dry",
              element: <AddServices category="dry" name="Dry" />,
            },
            {
              path: "add",
              element: <AddServices category="service" name="Service" />,
            },
            {
              path: "add/discount",
              element: <AddServices category="discount" name="Discount" />,
            },
            {
              path: "edit/wash/:id",
              element: <EditServices category="wash" name="Wash" />,
            },
            {
              path: "edit/dry/:id",
              element: <EditServices category="dry" name="Dry" />,
            },
            {
              path: "edit/:id",
              element: <EditServices category="service" name="Service" />,
            },
            {
              path: "edit/discount/:id",
              element: <EditServices category="discount" name="Discount" />,
            },
            {
              path: "edit/dropofffee/:id",
              element: (
                <EditServices category="dropofffee" name="Drop Off Fee" />
              ),
            },
          ],
        },
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
          children: [
            { path: "add", element: <AddInventory /> },
            { path: "edit/:id", element: <EditInventory /> },
          ],
        },
        { path: "staffs", element: <Staffs /> },
        {
          path: "staffs",
          children: [
            { path: ":id", element: <ViewStaff /> },
            { path: "add", element: <AddStaff /> },
            { path: "edit/:id", element: <EditStaff /> },
          ],
        },
        { path: "reports", element: <Reports /> },
        { path: "adminsettings", element: <AdminSettings /> },
      ],
    },
    // { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

const Login = Loadable(lazy(() => import("../pages/Login")));
const Dashboard = Loadable(lazy(() => import("../pages/Dashboard")));
const Services = Loadable(lazy(() => import("../pages/Services/Table")));
const AddServices = Loadable(lazy(() => import("../pages/Services/Add")));
const EditServices = Loadable(lazy(() => import("../pages/Services/Edit")));
const Customers = Loadable(lazy(() => import("../pages/Customers/Table")));
const AddCustomer = Loadable(lazy(() => import("../pages/Customers/Add")));
const EditCustomer = Loadable(lazy(() => import("../pages/Customers/Edit")));
const ViewCustomer = Loadable(
  lazy(() => import("../pages/Customers/Customer"))
);
const Orders = Loadable(lazy(() => import("../pages/Orders")));
const Inventory = Loadable(lazy(() => import("../pages/Inventory/Table")));
const AddInventory = Loadable(lazy(() => import("../pages/Inventory/Add")));
const EditInventory = Loadable(lazy(() => import("../pages/Inventory/Edit")));
const Staff = Loadable(lazy(() => import("../pages/Staff")));
const Reports = Loadable(lazy(() => import("../pages/Reports")));
const AdminSettings = Loadable(lazy(() => import("../pages/AdminSettings")));
const Staffs = Loadable(lazy(() => import("../pages/Staffs/Table")));
const AddStaff = Loadable(lazy(() => import("../pages/Staffs/Add")));
const EditStaff = Loadable(lazy(() => import("../pages/Staffs/Edit")));
const ViewStaff = Loadable(lazy(() => import("../pages/Staffs/Staff")));
