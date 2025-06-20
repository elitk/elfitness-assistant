// src/app/actions/profile.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types";

export async function saveProfileAction(form: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "not-auth" };
  type WorkoutProfile = Omit<
    Profile,
    "gender" | "experience_level" | "created_at" | "avatar_url"
  >;

  const payload: WorkoutProfile = {
    id: user.id,
    name: form.get("name") as string,
    height: Number(form.get("height")),
    weight: Number(form.get("weight")),
    goal_target: Number(form.get("goal_target")),
    goal_date: form.get("goal_date") as string,
    updated_at: new Date().toISOString(),
    fitness_goal: form.get("fitness_goal") as string,
  };

  const { error } = await supabase
    .from("profiles")
    .upsert(payload, { count: 'exact' });

  return { error: error?.message ?? null };
}
