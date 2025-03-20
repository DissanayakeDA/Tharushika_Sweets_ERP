import { Route, Routes } from "react-router-dom";
import "./App.css";
import React from "react";

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
import HRDashboard from "./Component/HRDashboard/HRDashboard";
import AddEmployee from "./Component/AddEmployee/AddEmployee";
import ViewEmployees from "./Component/ViewEmployee/ViewEmployee";
import UpdateEmployee from "./Component/UpdateEmployee/UpdateEmployee";
import AddAttendance from "./Component/AddAttendance/AddAttendance";
import ViewAttendance from "./Component/ViewAttendance/ViewAttendace";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mainhome" element={<Home />} />
          <Route path="/addstock" element={<AddStock />} />
          <Route path="/issueitems" element={<IssueItems />} />
          <Route path="/addbuyers" element={<AddBuyers />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/viewbuyers" element={<Buyers />} />
          <Route path="/viewbuyers-gm" element={<GMBuyers />} />
          <Route path="/viewsales" element={<Sales />} />
          <Route path="/viewrequests" element={<Requests />} />
          <Route path="/viewbuyers/:id" element={<UpdateBuyers />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/directreturns" element={<DirectBuyerReturns />} />
          <Route path="/addsuppliers" element={<AddSuppliers />} />
          <Route path="/home-gm" element={<HomeGM />} />
          <Route path="/returninvoice" element={<ReturnInvoice />} />
          <Route path="/viewReturns" element={<ViewReturns />} />
          <Route path="/viewstock" element={<ViewStock />} />
          <Route path="/viewstock-gm" element={<GMViewStock />} />
          <Route path="/viewsuppliers" element={<Suppliers />} />
          <Route path="/viewsuppliers/:id" element={<UpdateSuppliers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/GMviewsales" element={<GMSales />} />
          <Route path="/GMviewrequests" element={<GMrequests />} />
          <Route path="/GMviewemployee" element={<GMemployee />} />
          <Route path="/GMviewsuppliers" element={<GMsupplier />} />
          <Route path="/GMviewproducts" element={<GMproducts />} />
          <Route path="/GMviewreturns" element={<GMreturns />} />
          <Route path="/hrdashboard" element={<HRDashboard />}/>
          <Route path="/addemployee" element={<AddEmployee />} />
          <Route path="/viewemployees" element={<ViewEmployees/>}/>
          <Route path="/updateemployee/:id" element = {<UpdateEmployee/>}/>
          <Route path="/addattendance" element={<AddAttendance />} />
          <Route path="/viewattendance" element={<ViewAttendance />} />

          
          
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
