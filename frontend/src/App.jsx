import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import React from "react";

const ProtectedRoute = ({ element }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return user ? element : <Navigate to="/login" />;
};

import Home from "@/Component/Home/Home";
import AddStock from "@/Component/AddStock/AddStock";
import IssueItems from "@/Component/IssueItems/IssueItems";
import AddBuyers from "@/Component/AddBuyers/AddBuyers";

import Buyers from "@/Component/Buyers/Buyers";
import Sales from "@/Component/Sales/Sales";

import Invoice from "@/Component/Invoice_DBuyers/Invoice";
import DirectBuyerReturns from "./Component/DirectBuyerReturns/DirectBuyerReturns";
import AddSuppliers from "./Component/AddSupplier/AddSupplier";
import HomeGM from "./Component/GMDashboard/GMDashboard";
import ReturnInvoice from "./Component/ReturnInvoice/ReturnInvoice";
import ViewReturns from "./Component/ViewReturns/ViewReturns";
import ViewStock from "./Component/ViewStock/ViewStock";
import Suppliers from "./Component/Suppliers/Suppliers";
import UpdateSuppliers from "./Component/UpdateSupplier/UpdateSupplier";
import Products from "./Component/AddProduct/AddProduct";
import GMViewStock from "./Component/GMViewStock/GMViewStock";
import GMBuyers from "./Component/GMBuyers/GMBuyers";
import GMSales from "./Component/GMviewsales/GMviewsales";

import GMemployee from "./Component/GMviewemployee/GMviewemployee";

import GMproducts from "./Component/GMviewproducts/GMviewproducts";
import GMreturns from "./Component/GMviewreturns/GMreturns";
import HRDashboard from "./Component/HRDashboard/HRDashboard";
import AddEmployee from "./Component/AddEmployee/AddEmployee";
import ViewEmployees from "./Component/ViewEmployee/ViewEmployee";
import UpdateEmployee from "./Component/UpdateEmployee/UpdateEmployee";
import AddAttendance from "./Component/AddAttendance/AddAttendance";
import ViewAttendance from "./Component/ViewAttendance/ViewAttendace";
import CreateUser from "./Component/CreateUser/CreateUser";
import AccessControlDashboard from "./Component/AccessControlDashboard/AccessControlDashboard";
import Login from "./Component/Login/Login";
import SalesDashboard from "./Component/SalesDashboard/SalesDashboard";
import AddShop from "./Component/AddShop/AddShop";
import ManageShops from "./Component/ManageShops/ManageShops";
import SPIssueItem from "./Component/SPIssueItem/SPIssueItem";
import SPReturns from "./Component/SPReturns/SPReturns";
import SPSales from "./Component/SPSales/SPSales";
import SPviewReturns from "./Component/SPviewReturns/SPviewReturns";
import ViewSalesStock from "./Component/viewSalesStock/viewSalesStock";
import SPInvoice from "./Component/SPInvoice/SPInvoice";
import SPReturnInvoice from "./Component/SPReturnInvoice/SPReturnInvoice";
import AllStockRequestsApproval from "./Component/AllStockRequestsApproval/AllStockRequestsApproval";
import MyStockChangeRequests from "./Component/SMRequests/MyStockChangeRequests";
import StockChangeRequestForm from "./Component/StockChangeRequestForm/StockChangeRequestForm";
import ForgotPassword from "./Component/ForgotPassword/ForgotPassword";
import ResetPassword from "./Component/ResetPassword/ResetPassword";
import SPViewProduct from "./Component/SPViewProduct/SPViewProduct";
import PMDashboard from "./Component/PMDashboard/PMDashboard";
import IngredientRequestForm from "./Component/IngredientRequestForm/IngredientRequestForm";
import IngredientRequestsApproval from "./Component/IngredientRequestsApproval/IngredientRequestsApproval";
import ViewIngredientRequests from "./Component/ViewIngredientRequests/ViewIngredientRequests";
import PMViewProducts from "./Component/PMViewProducts/PMViewProducts";
import SalesRequestApproval from "./Component/SalesRequestApproval/SalesRequestApproval";
import ViewSalesRequests from "./Component/ViewSalesRequests/ViewSalesRequests";
import StockRequestForm from "./Component/StockRequestForm/StockRequestForm";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/mainhome"
            element={<ProtectedRoute element={<Home />} />}
          />
          <Route
            path="/addstock"
            element={<ProtectedRoute element={<AddStock />} />}
          />
          <Route
            path="/pmdashboard"
            element={<ProtectedRoute element={<PMDashboard />} />}
          />
          <Route
            path="/issueitems"
            element={<ProtectedRoute element={<IssueItems />} />}
          />
          <Route
            path="/addbuyers"
            element={<ProtectedRoute element={<AddBuyers />} />}
          />

          <Route
            path="/viewbuyers"
            element={<ProtectedRoute element={<Buyers />} />}
          />
          <Route
            path="/viewbuyers-gm"
            element={<ProtectedRoute element={<GMBuyers />} />}
          />
          <Route
            path="/viewsales"
            element={<ProtectedRoute element={<Sales />} />}
          />

          <Route
            path="/invoice"
            element={<ProtectedRoute element={<Invoice />} />}
          />
          <Route
            path="/directreturns"
            element={<ProtectedRoute element={<DirectBuyerReturns />} />}
          />

          <Route
            path="/home-gm"
            element={<ProtectedRoute element={<HomeGM />} />}
          />
          <Route
            path="/returninvoice"
            element={<ProtectedRoute element={<ReturnInvoice />} />}
          />
          <Route
            path="/viewReturns"
            element={<ProtectedRoute element={<ViewReturns />} />}
          />
          <Route
            path="/viewstock"
            element={<ProtectedRoute element={<ViewStock />} />}
          />
          <Route
            path="/viewstock-gm"
            element={<ProtectedRoute element={<GMViewStock />} />}
          />
          <Route
            path="/viewsuppliers"
            element={<ProtectedRoute element={<Suppliers />} />}
          />
          <Route
            path="/viewsuppliers/:id"
            element={<ProtectedRoute element={<UpdateSuppliers />} />}
          />
          <Route
            path="/products"
            element={<ProtectedRoute element={<Products />} />}
          />
          <Route
            path="/GMviewsales"
            element={<ProtectedRoute element={<GMSales />} />}
          />

          <Route
            path="/GMviewemployee"
            element={<ProtectedRoute element={<GMemployee />} />}
          />

          <Route
            path="/GMviewproducts"
            element={<ProtectedRoute element={<GMproducts />} />}
          />
          <Route
            path="/GMviewreturns"
            element={<ProtectedRoute element={<GMreturns />} />}
          />
          <Route
            path="/hrdashboard"
            element={<ProtectedRoute element={<HRDashboard />} />}
          />
          <Route
            path="/addemployee"
            element={<ProtectedRoute element={<AddEmployee />} />}
          />
          <Route
            path="/viewemployees"
            element={<ProtectedRoute element={<ViewEmployees />} />}
          />
          <Route
            path="/updateemployee/:id"
            element={<ProtectedRoute element={<UpdateEmployee />} />}
          />
          <Route
            path="/addattendance"
            element={<ProtectedRoute element={<AddAttendance />} />}
          />
          <Route
            path="/viewattendance"
            element={<ProtectedRoute element={<ViewAttendance />} />}
          />
          <Route
            path="/create-user"
            element={<ProtectedRoute element={<CreateUser />} />}
          />
          <Route
            path="/Accessdashboard"
            element={<ProtectedRoute element={<AccessControlDashboard />} />}
          />

          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/addshops" element={<AddShop />} />
          <Route path="/manageshops" element={<ManageShops />} />
          <Route path="/spissueitems" element={<SPIssueItem />} />
          <Route path="/spreturns" element={<SPReturns />} />
          <Route path="/spsales" element={<SPSales />} />
          <Route path="/spviewreturns" element={<SPviewReturns />} />
          <Route path="/salesdashboard" element={<SalesDashboard />} />
          <Route path="/spviewproduct" element={<SPViewProduct />} />

          <Route path="/addsuppliers" element={<AddSuppliers />} />

          <Route path="/viewsalesstock" element={<ViewSalesStock />} />
          <Route path="/spreturnInvoice" element={<SPReturnInvoice />} />
          <Route path="/spInvoice" element={<SPInvoice />} />
          <Route
            path="/all-stock-change-requests"
            element={<AllStockRequestsApproval />}
          />
          <Route path="/sales-request" element={<StockRequestForm />} />
          <Route
            path="/mystock-change-requests"
            element={<MyStockChangeRequests />}
          />
          <Route
            path="/mystock-request/:stockId"
            element={<StockChangeRequestForm />}
          />
          <Route
            path="/ingredient-request"
            element={<ProtectedRoute element={<IngredientRequestForm />} />}
          />
          <Route
            path="/ingredient-requests-approval"
            element={
              <ProtectedRoute element={<IngredientRequestsApproval />} />
            }
          />
          <Route
            path="/view-ingredient-requests"
            element={<ProtectedRoute element={<ViewIngredientRequests />} />}
          />
          <Route
            path="/pmviewproducts"
            element={<ProtectedRoute element={<PMViewProducts />} />}
          />
          <Route
            path="/sales-requests-approval"
            element={<ProtectedRoute element={<SalesRequestApproval />} />}
          />
          <Route
            path="/viewsalesrequests"
            element={<ProtectedRoute element={<ViewSalesRequests />} />}
          />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
