import type { SupabaseClient } from "@supabase/supabase-js";

const DEMO_REPO = "Yashaswini-V21/Rytha_Mitra";

async function admin(): Promise<SupabaseClient> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as unknown as SupabaseClient;
}

/**
 * Loads the target investigation and confirms it is the seeded demo dossier.
 * Every write below is scoped to that row so no arbitrary record can be touched.
 */
async function loadDemoInvestigation(client: SupabaseClient, investigationId: string) {
  const { data, error } = await client
    .from("investigations")
    .select("id, repo, status")
    .eq("id", investigationId)
    .maybeSingle();
  if (error) throw new Error("Could not load the investigation.");
  if (!data || data.repo !== DEMO_REPO) {
    throw new Error("This investigation cannot be modified.");
  }
  return data as { id: string; repo: string; status: string };
}

export async function applyLicenceDecision(input: {
  investigationId: string;
  stepId: string;
  approve: boolean;
}) {
  const client = await admin();
  const investigation = await loadDemoInvestigation(client, input.investigationId);
  const now = new Date().toISOString();
  const commitRef = crypto.randomUUID().replace(/-/g, "").slice(0, 7);

  const { data: step, error: stepLoadError } = await client
    .from("investigation_steps")
    .select("id, kind, investigation_id")
    .eq("id", input.stepId)
    .eq("investigation_id", investigation.id)
    .maybeSingle();
  if (stepLoadError) throw new Error("Could not load the approval step.");
  if (!step || (step as { kind: string }).kind !== "licence_required") {
    throw new Error("This step is not an approval gate.");
  }

  const { error: stepError } = await client
    .from("investigation_steps")
    .update({ status: input.approve ? "approved" : "rejected" })
    .eq("id", input.stepId)
    .eq("investigation_id", investigation.id)
    .eq("kind", "licence_required");
  if (stepError) throw new Error("Could not record the decision.");

  const { error: invError } = await client
    .from("investigations")
    .update({
      status: input.approve ? "resolved" : "rejected",
      updated_at: now,
      resolved_at: input.approve ? now : null,
      resolved_ref: input.approve ? commitRef : null,
      resolved_url: input.approve
        ? `https://github.com/${DEMO_REPO}/commit/${commitRef}`
        : null,
    })
    .eq("id", investigation.id);
  if (invError) throw new Error("Could not update the investigation.");

  return { ok: true as const, commitRef };
}

export async function rearmDemoInvestigation(investigationId: string) {
  const client = await admin();
  const investigation = await loadDemoInvestigation(client, investigationId);

  const { error: stepError } = await client
    .from("investigation_steps")
    .update({ status: "pending" })
    .eq("investigation_id", investigation.id)
    .eq("kind", "licence_required");
  if (stepError) throw new Error("Could not reset the approval gate.");

  const { error } = await client
    .from("investigations")
    .update({
      status: "awaiting_approval",
      resolved_at: null,
      resolved_ref: null,
      resolved_url: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", investigation.id);
  if (error) throw new Error("Could not reset the investigation.");

  return { ok: true as const };
}

/**
 * Loads the newest demo dossier with the service role. Reads are server-only so
 * the investigation tables stay unreadable from the public internet.
 */
export async function loadDemoMission() {
  const client = await admin();

  const { data: investigation, error: invError } = await client
    .from("investigations")
    .select(
      "id, repo, issue_title, issue_number, status, branch, resolved_ref, resolved_url, resolved_at, created_at, updated_at",
    )
    .eq("repo", DEMO_REPO)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (invError) throw new Error("Could not load the dossier.");
  if (!investigation) return null;

  const { data: steps, error: stepsError } = await client
    .from("investigation_steps")
    .select(
      "id, investigation_id, parent_step_id, position, kind, title, detail, tool_name, status, output, payload, created_at",
    )
    .eq("investigation_id", (investigation as { id: string }).id)
    .order("position", { ascending: true });
  if (stepsError) throw new Error("Could not load the dossier steps.");

  return { investigation, steps: steps ?? [] };
}
