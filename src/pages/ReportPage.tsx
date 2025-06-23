import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { ReportResult } from './Report/ReportResult';
import { ReportQuestions } from './Report/ReportQuestions';
import { useData } from '@/hooks/useData';
import { fetchResults } from '@/services/assessmentService';
import { useState, useEffect } from 'react';
import { Loading } from '@/components/loading/Loading';
import type { ReportResults } from '@/types/report';

export default function ReportPage() {
    const { assessmentId } = useParams();
    const { domainsMap, skillsMap, isLoading: isDomainsLoading } = useData();
    const [results, setResults] = useState<ReportResults | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (!assessmentId) return;
            const rs = await fetchResults(assessmentId);
            if (rs && !isDomainsLoading) {
                setResults(rs);
                setIsLoading(false);
            }
        }
        load();
    }, [assessmentId, domainsMap, skillsMap, isDomainsLoading]);

    if (isLoading || !results) return <Loading message="Loading report..." />;

    return (
        <Routes>
            <Route path="/" element={<Navigate to="result" replace />} />
            <Route
                path="result"
                element={<ReportResult results={results} domainsMap={domainsMap} skillsMap={skillsMap} />}
            />
            <Route path="questions" element={<ReportQuestions results={results} domainsMap={domainsMap} />} />
        </Routes>
    );
}
