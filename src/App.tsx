import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import './App.css';
import HomePage from './pages/HomePage';

function App() {
    return (
        <Router basename="/DigitalCompetence">
            <div className="flex min-h-screen max-w-screen bg-slate-800 text-white">
                <Sidebar />
                <main className="ml-[40px] flex-1 lg:ml-0">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
