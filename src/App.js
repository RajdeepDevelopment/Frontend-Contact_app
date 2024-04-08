import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DisplayTable from "./Components/Tables/DisplayTable";
import Form from "./Components/AddTable/Form";

export const CacheData = {}; // Implemented client-side Api(data) Caching (on path: src\Api\table\get\index.js )

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DisplayTable />} />
        <Route path="/Add-new-table" element={<Form />} />
      </Routes>
    </Router>
  );
}

export default App;
