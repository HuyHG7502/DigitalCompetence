import { BrowserRouter as Router, Routes, Route } from "react-router";
import Sidebar from "@/components/layout/Sidebar";
import "./App.css";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <div className="flex max-w-screen min-h-screen bg-slate-800 text-white">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
