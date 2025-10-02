
"use client";

import { useAuth } from "@/hooks/useAuth";
import { UserPlan } from "@/context/AuthContext";

// Client-side model name getter to avoid importing Genkit on client
function getModelName(isPro: boolean): string {
    const FREE_MODEL = process.env.NEXT_PUBLIC_FREE_MODEL_NAME || 'gemini-1.5-flash';
    const PRO_MODEL = process.env.NEXT_PUBLIC_PRO_MODEL_NAME || 'gemini-2.5-pro';
    return isPro ? PRO_MODEL : FREE_MODEL;
}

export function usePlan() {
    const { user } = useAuth();
    const plan: UserPlan = user?.plan || "Free";
    const isPro = plan === "Pro";
    const modelName = getModelName(isPro);

    return { plan, isPro, modelName };
}
