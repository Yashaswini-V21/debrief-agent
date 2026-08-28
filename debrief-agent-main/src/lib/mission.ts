export type StepKind =
  | "reasoning"
  | "call_tool"
  | "get_tool_info"
  | "sub_agent"
  | "sandbox"
  | "licence_required";

export type Step = {
  id: string;
  investigation_id: string;
  parent_step_id: string | null;
  position: number;
  kind: string;
  title: string | null;
  detail: string | null;
  tool_name: string | null;
  status: string | null;
  output: string | null;
  payload: LicencePayload | null;
  created_at: string;
};

export type DiffLine = { type: "meta" | "ctx" | "add" | "del"; text: string };

export type DiffFile = { file: string; lines: DiffLine[] };

export type LicencePayload = {
  action?: string;
  commit_message?: string;
  branch?: string;
  base?: string;
  tests?: string;
  reversible?: boolean;
  files?: { path: string; added: number; removed: number }[];
  diff?: DiffFile[];
};

export type Investigation = {
  id: string;
  repo: string;
  issue_title: string;
  issue_number: number | null;
  status: string;
  branch: string | null;
  resolved_ref: string | null;
  resolved_url: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Mission = {
  investigation: Investigation;
  steps: Step[];
  childrenByParent: Record<string, Step[]>;
};

export const missionQueryKey = ["mission"] as const;

type RawMission = { investigation: unknown; steps: unknown[] } | null;

/**
 * Shapes the dossier returned by the trusted server function. The tables are not
 * publicly readable, so all data arrives already filtered server-side.
 */
export function buildMission(raw: RawMission): Mission | null {
  if (!raw || !raw.investigation) return null;

  const all = (raw.steps ?? []) as unknown as Step[];
  const childrenByParent: Record<string, Step[]> = {};
  for (const step of all) {
    if (step.parent_step_id) {
      const bucket = childrenByParent[step.parent_step_id] ?? [];
      bucket.push(step);
      childrenByParent[step.parent_step_id] = bucket;
    }
  }

  return {
    investigation: raw.investigation as unknown as Investigation,
    steps: all.filter((s) => !s.parent_step_id),
    childrenByParent,
  };
}
