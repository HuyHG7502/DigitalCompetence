import { db } from '@/lib/firebase';
import { getDocs, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import type { AssessmentAnswer, AssessmentQuestion } from '@/types/assessment';
import type { AssessmentResults } from '@/types/report';

export async function fetchQuestions(): Promise<AssessmentQuestion[]> {
    const querySnapshot = await getDocs(collection(db, 'questions'));
    const qs: AssessmentQuestion[] = [];
    querySnapshot.forEach(doc => {
        qs.push({
            ...doc.data(),
            completed: false,
        } as AssessmentQuestion);
    });
    qs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return qs;
}

export async function fetchProgress(assessmentId: string) {
    const docSnapshot = await getDoc(doc(db, 'assessments', assessmentId));
    if (docSnapshot.exists()) {
        return docSnapshot.data();
    }
    return null;
}

export async function startAssessment(assessmentId: string) {
    await setDoc(
        doc(db, 'assessments', assessmentId),
        {
            answers: {},
            currentQuestionId: '',
            startedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        { merge: true }
    );
    localStorage.setItem('assessmentId', assessmentId);
}

export async function saveProgress(assessmentId: string, answers: AssessmentAnswer, currentQuestionId: string) {
    await setDoc(
        doc(db, 'assessments', assessmentId),
        {
            answers,
            currentQuestionId,
            updatedAt: new Date().toISOString(),
        },
        { merge: true }
    );
}

export async function saveResults(assessmentId: string, results: AssessmentResults) {
    await setDoc(
        doc(db, 'assessments', assessmentId),
        {
            results,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        { merge: true }
    );
    localStorage.removeItem('assessmentId');
}

export async function fetchResults(assessmentId: string) {
    const docSnapshot = await getDoc(doc(db, 'assessments', assessmentId));
    if (docSnapshot.exists()) {
        return {
            ...docSnapshot.data().results,
            id: assessmentId,
            name: docSnapshot.data().answers.i_name,
            answers: docSnapshot.data().answers as AssessmentAnswer,
            startedAt: docSnapshot.data().startedAt,
            completedAt: docSnapshot.data().completedAt,
        };
    }
    return null;
}
