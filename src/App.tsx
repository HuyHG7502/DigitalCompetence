import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import React from 'react';
import HomePage from '@/pages/HomePage';
import AssessmentPage from '@/pages/AssessmentPage';
import ReportPage from '@/pages/ReportPage';
import Sidebar from '@/components/layout/Sidebar';
import { Loading } from '@/components/loading/Loading';
import { AssessmentProvider } from '@/contexts/assessment/AssessmentProvider';

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-background text-foreground flex min-h-screen max-w-screen">
            <Sidebar />
            <main className="ml-[40px] flex-1 lg:ml-0">{children}</main>
        </div>
    );
};

const AppLayout = () => {
    const location = useLocation();
    const isAssessmentRoute = /^\/assessment\//.test(location.pathname);

    // Only use useParams if on assessment route
    let assessmentId: string | undefined = undefined;
    if (isAssessmentRoute) {
        const match = location.pathname.match(/^\/assessment\/([^/]+)/);
        assessmentId = match ? match[1] : undefined;
    }

    const pages = [
        { path: '/', element: <HomePage /> },
        { path: '/info', element: <HomePage /> },
        { path: '/assessment/:assessmentId', element: <AssessmentPage /> },
        { path: '/report/:assessmentId/*', element: <ReportPage /> },
    ];

    const content = (
        <Routes>
            {pages.map(page => (
                <Route key={page.path} path={page.path} element={<LayoutWrapper>{page.element}</LayoutWrapper>} />
            ))}
            {/* Catch-all route for 404 */}
            <Route
                path="*"
                element={
                    <LayoutWrapper>
                        <Loading message="404 Not Found" />
                    </LayoutWrapper>
                }
            />
        </Routes>
    );

    // Conditionally wrap in AssessmentProvider
    return isAssessmentRoute && assessmentId ? (
        <AssessmentProvider assessmentId={assessmentId}>{content}</AssessmentProvider>
    ) : (
        content
    );
};

function App() {
    return (
        <Router basename="/digital-competence/">
            <Routes>
                <Route path="/*" element={<AppLayout />} />
            </Routes>
        </Router>
    );
}

export default App;
