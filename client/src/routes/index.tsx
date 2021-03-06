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
      path: "print",
      children: [{ path: "", element: <Print /> }],
    },
    {
      path: "print/solo/:id",
      children: [{ path: "", element: <SoloPrint /> }],
    },
    {
      path: "",
      element: <MainLayout />,
      children: [
        { element: <Navigate to="/dashboard" replace /> },
        { path: "dashboard", element: <DashboardDropOff /> },
        {
          path: "dashboard",
          children: [
            { path: "dropoff", element: <DashboardDropOff /> },
            { path: "diy", element: <DashboardDiy /> },
          ],
        },
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
        { path: "orders", element: <OrdersDropOff /> },
        {
          path: "orders",
          children: [
            { path: "dropoff", element: <OrdersDropOff /> },
            {
              path: "dropoff",
              children: [
                { path: "add", element: <OrdersAddDropOff /> },
                { path: "add/:id", element: <OrdersAddDropOff /> },
                { path: "add/extra", element: <OrdersAddExtraDropOff /> },
                { path: "add/extra/:id", element: <OrdersAddExtraDropOff /> },
              ],
            },
            { path: "diy", element: <OrdersDiy /> },
            {
              path: "diy",
              children: [
                { path: "add", element: <OrdersAddDiy /> },
                { path: "add/:id", element: <OrdersAddDiy /> },
              ],
            },
            { path: ":id", element: <ViewOrder /> },
          ],
        },
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
        { path: "staffsettings", element: <StaffSettings /> },
      ],
    },
    // { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

const Login = Loadable(lazy(() => import("../pages/Login")));
const Print = Loadable(lazy(() => import("../pages/Print")));
const SoloPrint = Loadable(lazy(() => import("../pages/SoloPrint")));
const DashboardDiy = Loadable(
  lazy(() => import("../pages/Dashboard/TableDiy"))
);
const DashboardDropOff = Loadable(
  lazy(() => import("../pages/Dashboard/TableDropOff"))
);
const Services = Loadable(lazy(() => import("../pages/Services/Table")));
const AddServices = Loadable(lazy(() => import("../pages/Services/Add")));
const EditServices = Loadable(lazy(() => import("../pages/Services/Edit")));
const Customers = Loadable(lazy(() => import("../pages/Customers/Table")));
const AddCustomer = Loadable(lazy(() => import("../pages/Customers/Add")));
const EditCustomer = Loadable(lazy(() => import("../pages/Customers/Edit")));
const ViewCustomer = Loadable(
  lazy(() => import("../pages/Customers/Customer"))
);
const ViewOrder = Loadable(lazy(() => import("../pages/Orders/Order")));
const OrdersDiy = Loadable(lazy(() => import("../pages/Orders/TableDiy")));
const OrdersDropOff = Loadable(
  lazy(() => import("../pages/Orders/TableDropOff"))
);
const OrdersAddDiy = Loadable(lazy(() => import("../pages/Orders/AddDiy")));
const OrdersAddDropOff = Loadable(
  lazy(() => import("../pages/Orders/AddDropOff"))
);
const OrdersAddExtraDropOff = Loadable(
  lazy(() => import("../pages/Orders/AddExtraDropOff"))
);
const Inventory = Loadable(lazy(() => import("../pages/Inventory/Table")));
const AddInventory = Loadable(lazy(() => import("../pages/Inventory/Add")));
const EditInventory = Loadable(lazy(() => import("../pages/Inventory/Edit")));
const Reports = Loadable(lazy(() => import("../pages/Reports")));
const AdminSettings = Loadable(lazy(() => import("../pages/AdminSettings")));
const StaffSettings = Loadable(lazy(() => import("../pages/StaffSettings")));
const Staffs = Loadable(lazy(() => import("../pages/Staffs/Table")));
const AddStaff = Loadable(lazy(() => import("../pages/Staffs/Add")));
const EditStaff = Loadable(lazy(() => import("../pages/Staffs/Edit")));
const ViewStaff = Loadable(lazy(() => import("../pages/Staffs/Staff")));
