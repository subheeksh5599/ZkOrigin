import { Routes, Route } from "react-router-dom";
import LandingLayout from "./components/LandingLayout";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingLayout />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
