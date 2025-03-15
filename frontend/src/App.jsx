import { Route, Routes } from "react-router-dom";
import "./App.css";
import React from "react";
import Home from "@/Component/Home/Home";
import AddStock from "@/Component/AddStock/AddStock";
import IssueItems from "@/Component/IssueItems/IssueItems";
import AddBuyers from "@/Component/AddBuyers/AddBuyers";
import SignOut from "@/Component/SignOut/SignOut";
import Stocks from "@/Component/Stocks/Stocks";
import Buyers from "@/Component/Buyers/Buyers";
import Sales from "@/Component/Sales/Sales";
import Requests from "@/Component/Requests/Requests";
import UpdateBuyers from "@/Component/UpdateBuyers/UpdateBuyers";
import Invoice from "@/Component/Invoice_DBuyers/Invoice";
import DirectBuyerReturns from "./Component/DirectBuyerReturns/DirectBuyerReturns";
import AddSuppliers from "./Component/AddSupplier/AddSupplier";

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
          <Route path="/viewstocks" element={<Stocks />} />
          <Route path="/viewbuyers" element={<Buyers />} />
          <Route path="/viewsales" element={<Sales />} />
          <Route path="/viewrequests" element={<Requests />} />
          <Route path="/viewbuyers/:id" element={<UpdateBuyers />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/directreturns" element={<DirectBuyerReturns />} />
          <Route path="/addsuppliers" element={<AddSuppliers />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
