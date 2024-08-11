import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Table from "./components/Table";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/crm/:userId/:crmId" element={<Table />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
