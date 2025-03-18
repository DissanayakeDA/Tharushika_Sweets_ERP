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
          <Route path="/viewsuppliers" element={<Suppliers />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
