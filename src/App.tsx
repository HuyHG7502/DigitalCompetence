import { BrowserRouter as Router, Routes, Route } from "react-router";
import Sidebar from "@/components/layout/Sidebar";
import "./App.css";
import HomePage from "./pages/HomePage";

function App() {
  return (
      <Router basename="/DigitalCompetence">
          <div className="flex min-h-screen max-w-screen bg-slate-800 text-white">
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
