
"use client";

import { useAuth, UserPlan } from "@/context/AuthContext";
import { getModelName } from "@/lib/models";

export function usePlan() {
    const { user } = useAuth();
    const plan: UserPlan = user?.plan || "Free";
    const isPro = plan === "Pro";
    const modelName = getModelName(isPro);

    return { plan, isPro, modelName };
}
