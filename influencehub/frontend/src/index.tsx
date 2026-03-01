import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import VideoManager from "./components/VideoManager";
import SponsorshipMarketplace from "./components/SponsorshipMarketplace";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/videos" element={<VideoManager />} />
        <Route path="/sponsorships" element={<SponsorshipMarketplace />} />
      </Routes>
    </Router>
  );
};

export default App;
