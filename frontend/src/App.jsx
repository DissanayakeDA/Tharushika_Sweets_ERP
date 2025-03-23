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
import SignOut from "@/Component/SignOut/SignOut";
import Buyers from "@/Component/Buyers/Buyers";
import Sales from "@/Component/Sales/Sales";
import Requests from "@/Component/Requests/Requests";
import UpdateBuyers from "@/Component/UpdateBuyers/UpdateBuyers";
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
import GMrequests from "./Component/GMviewrequests/GMviewrequests";
import GMemployee from "./Component/GMviewemployee/GMviewemployee"; 
import GMsupplier from "./Component/GMviewsupplier/Suppliers";
import GMproducts from "./Component/GMviewproducts/GMviewproducts";
import GMreturns from "./Component/GMviewreturns/GMreturns";
import AllRequestsApproval from "./Component/AllRequestsApproval/AllRequestsApproval";
import SalesRequestForm from "./Component/SalesRequestForm/SalesRequestForm";
import MyRequests from "./Component/MyRequests/MyRequests";
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
import SPReturns from "./Component/SPReturns/SPReturns"
import SPSales from "./Component/SPSales/SPSales"
import SPviewReturns from "./Component/SPviewReturns/SPviewReturns"
import SPviewstock from "./Component/viewSalesStock/viewSalesStock"
import SPInvoice from "./Component/SPInvoice/SPInvoice";
import SPReturnInvoice from "./Component/SPReturnInvoice/SPReturnInvoice";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/mainhome" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/addstock" element={<ProtectedRoute element={<AddStock />} />} />
          <Route path="/issueitems" element={<ProtectedRoute element={<IssueItems />} />} />
          <Route path="/addbuyers" element={<ProtectedRoute element={<AddBuyers />} />} />
          <Route path="/signout" element={<ProtectedRoute element={<SignOut />} />} />
          <Route path="/viewbuyers" element={<ProtectedRoute element={<Buyers />} />} />
          <Route path="/viewbuyers-gm" element={<ProtectedRoute element={<GMBuyers />} />} />
          <Route path="/viewsales" element={<ProtectedRoute element={<Sales />} />} />
          <Route path="/viewrequests" element={<ProtectedRoute element={<Requests />} />} />
          <Route path="/viewbuyers/:id" element={<ProtectedRoute element={<UpdateBuyers />} />} />
          <Route path="/invoice" element={<ProtectedRoute element={<Invoice />} />} />
          <Route path="/directreturns" element={<ProtectedRoute element={<DirectBuyerReturns />} />} />
          <Route path="/addsuppliers" element={<ProtectedRoute element={<AddSuppliers />} />} />
          <Route path="/home-gm" element={<ProtectedRoute element={<HomeGM />} />} />
          <Route path="/returninvoice" element={<ProtectedRoute element={<ReturnInvoice />} />} />
          <Route path="/viewReturns" element={<ProtectedRoute element={<ViewReturns />} />} />
          <Route path="/viewstock" element={<ProtectedRoute element={<ViewStock />} />} />
          <Route path="/viewstock-gm" element={<ProtectedRoute element={<GMViewStock />} />} />
          <Route path="/viewsuppliers" element={<ProtectedRoute element={<Suppliers />} />} />
          <Route path="/viewsuppliers/:id" element={<ProtectedRoute element={<UpdateSuppliers />} />} />
          <Route path="/products" element={<ProtectedRoute element={<Products />} />} />
          <Route path="/GMviewsales" element={<ProtectedRoute element={<GMSales />} />} />
          <Route path="/GMviewrequests" element={<ProtectedRoute element={<GMrequests />} />} />
          <Route path="/GMviewemployee" element={<ProtectedRoute element={<GMemployee />} />} />
          <Route path="/GMviewsuppliers" element={<ProtectedRoute element={<GMsupplier />} />} />
          <Route path="/GMviewproducts" element={<ProtectedRoute element={<GMproducts />} />} />
          <Route path="/GMviewreturns" element={<ProtectedRoute element={<GMreturns />} />} />
          <Route path="/hrdashboard" element={<ProtectedRoute element={<HRDashboard />} />} />
          <Route path="/addemployee" element={<ProtectedRoute element={<AddEmployee />} />} />
          <Route path="/viewemployees" element={<ProtectedRoute element={<ViewEmployees />} />} />
          <Route path="/updateemployee/:id" element={<ProtectedRoute element={<UpdateEmployee />} />} />
          <Route path="/addattendance" element={<ProtectedRoute element={<AddAttendance />} />} />
          <Route path="/viewattendance" element={<ProtectedRoute element={<ViewAttendance />} />} />
          <Route path="/create-user" element={<ProtectedRoute element={<CreateUser />} />} />
          <Route path="/Accessdashboard" element={<ProtectedRoute element={<AccessControlDashboard />} />} />
          <Route path="/login" element={<Login />} />

             <Route path="/addshops" element={<AddShop />} />
          <Route path="/manageshops" element={<ManageShops />} />
          <Route path="/spissueitems" element={<SPIssueItem />} />
          <Route path="/spreturns" element={<SPReturns />} />
          <Route path="/spsales" element={<SPSales />} />
          <Route path="/spviewreturns" element={<SPviewReturns />} />
          <Route path="/salesdashboard" element={<SalesDashboard />} />
          <Route path="/sales-request" element={<SalesRequestForm />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/all-requests-approval" element={<AllRequestsApproval />} />
          <Route path="/viewsalesstock" element={<SPviewstock />} />
          <Route path="/spreturnInvoice" element={<SPReturnInvoice />} />
          <Route path="/spInvoice" element={<SPInvoice />} />




          
          

        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
