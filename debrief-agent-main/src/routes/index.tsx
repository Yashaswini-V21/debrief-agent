import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, ExternalLink, Info, Plus, Radar } from "lucide-react";
import { StepCard } from "@/components/mission/StepCard";
import { LicenceCard } from "@/components/mission/LicenceCard";
import { MotionToggle } from "@/components/mission/MotionToggle";
import { buildMission, missionQueryKey, type Investigation } from "@/lib/mission";
import { decideLicenceFn, fetchMissionFn, restartInvestigationFn } from "@/lib/mission.functions";
import { POC_VIDEO_URL, resolvePocEmbed } from "@/lib/poc-video";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Debrief — Mission View for AI Repo Investigations" },
      {
        name: "description",
        content:
          "Debrief is a mission-dossier dashboard for an AI agent that investigates repo issues, runs sandbox tests, and waits for your approval before pushing a fix.",
      },
      { property: "og:title", content: "Debrief — Mission View" },
      {
        property: "og:description",
        content:
          "Follow an AI agent's reasoning, tool calls, sub-agents and sandbox test runs, then approve or reject the proposed fix.",
      },
    ],
  }),
  component: MissionView,
});

const statusMeta: Record<string, { label: string; className: string }> = {
  investigating: { label: "Investigating", className: "border-cyan/50 bg-cyan/10 text-cyan" },
  awaiting_approval: {
    label: "Awaiting Approval",
    className: "border-amber/60 bg-amber/10 text-amber",
  },
  resolved: { label: "Resolved", className: "border-success/50 bg-success/10 text-success" },
  rejected: { label: "Rejected", className: "border-danger/50 bg-danger/10 text-danger" },
};

function MissionView() {
  const queryClient = useQueryClient();
  const fetchMission = useServerFn(fetchMissionFn);
  const { data, isPending, error } = useQuery({
    queryKey: missionQueryKey,
    queryFn: async () => buildMission(await fetchMission()),
  });

  const decideLicence = useServerFn(decideLicenceFn);
  const restartInvestigation = useServerFn(restartInvestigationFn);

  const decide = useMutation({
    mutationFn: (data: { investigationId: string; stepId: string; approve: boolean }) =>
      decideLicence({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: missionQueryKey }),
  });

  const restart = useMutation({
    mutationFn: (investigationId: string) => restartInvestigation({ data: { investigationId } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: missionQueryKey }),
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Ambience />

      <div className="glass-bar sticky top-0 z-30">
        <div className="hairline-top h-px w-full" />
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-5 py-3">
          <p className="label-stencil text-amber">Debrief // field report</p>
          <div className="flex items-center gap-3">
            <p className="label-stencil hidden text-muted-foreground/70 sm:block">
              autonomous repo forensics
            </p>
            <MotionToggle />
          </div>
        </div>
      </div>

      <main className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-16 pt-8">
        {isPending && (
          <p className="mt-10 font-mono text-sm text-muted-foreground">Loading dossier…</p>
        )}
        {error && <p className="mt-10 font-mono text-sm text-danger">Could not load the dossier.</p>}
        {!isPending && !error && !data && (
          <p className="mt-10 font-mono text-sm text-muted-foreground">No investigations on file.</p>
        )}

        {data && (
          <>
            <Header
              investigation={data.investigation}
              onRestart={() => restart.mutate(data.investigation.id)}
            />

            <PoweredBy />

            <MissionStats steps={data.steps} investigation={data.investigation} />

            <IllustrativeBadge />

            <ol className="relative mt-8 space-y-4 pl-3">
              <span
                aria-hidden
                className="timeline-trace absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-amber/50 via-border to-transparent"
              />
              <span
                aria-hidden
                className="timeline-sweep absolute left-[-1px] top-2 h-24 w-[3px] rounded-full bg-gradient-to-b from-transparent via-amber to-transparent blur-[1px]"
              />
              {data.steps.map((step, i) =>
                step.kind === "licence_required" ? (
                  <LicenceCard
                    key={step.id}
                    step={step}
                    pending={decide.isPending}
                    delay={i * 80}
                    onDecide={(approve) =>
                      decide.mutate({
                        investigationId: data.investigation.id,
                        stepId: step.id,
                        approve,
                      })
                    }
                  />
                ) : (
                  <StepCard
                    key={step.id}
                    step={step}
                    index={i + 1}
                    delay={i * 80}
                    children={data.childrenByParent[step.id] ?? []}
                  />
                ),
              )}
            </ol>

            {data.investigation.status === "resolved" && (
              <Resolved investigation={data.investigation} />
            )}

            <ProofOfConcept />

          </>
        )}
      </main>
    </div>
  );
}

function Ambience() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="aurora-blob left-[-12%] top-[-10%] size-[38rem] bg-amber/12" />
      <span
        className="aurora-blob right-[-14%] top-[18%] size-[34rem] bg-cyan/12"
        style={{ animationDelay: "-6s" }}
      />
      <span
        className="aurora-blob bottom-[-16%] left-[28%] size-[30rem] bg-success/10"
        style={{ animationDelay: "-3s" }}
      />
      <span className="scan-line absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-transparent via-cyan/[0.06] to-transparent" />
      <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_25%,var(--background)_92%)]" />
    </div>
  );
}

function MissionStats({
  steps,
  investigation,
}: {
  steps: import("@/lib/mission").Step[];
  investigation: Investigation;
}) {
  const stats = [
    { label: "Steps logged", value: String(steps.length).padStart(2, "0") },
    {
      label: "Tool calls",
      value: String(steps.filter((s) => s.kind === "call_tool").length).padStart(2, "0"),
    },
    { label: "Branch", value: investigation.branch ?? "—" },
    {
      label: "Opened",
      value: new Date(investigation.created_at).toISOString().slice(0, 10),
    },
  ];
  return (
    <div className="rise-in mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" style={{ animationDelay: "80ms" }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="dossier-panel lift-card hover:lift-card-hover rounded-md px-3 py-3"
        >
          <p className="label-stencil text-muted-foreground/70">{stat.label}</p>
          <p className="mt-1 truncate font-mono text-sm text-foreground">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

function PoweredBy() {
  const stack = [
    { name: "TrueForge", note: "agent runtime" },
    { name: "Daytona", note: "sandbox" },
    { name: "GitHub", note: "source of truth" },
  ];
  return (
    <div className="rise-in mt-5 flex flex-wrap items-center gap-2">
      <span className="label-stencil text-muted-foreground/70">Powered by</span>
      {stack.map((item) => (
        <span
          key={item.name}
          className="lift-card hover:lift-card-hover inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-2.5 py-1 font-mono text-[0.6875rem] text-panel-foreground"
        >
          <span className="size-1.5 rounded-full bg-cyan/70" />
          {item.name}
          <span className="text-muted-foreground/70">· {item.note}</span>
        </span>
      ))}
    </div>
  );
}

function IllustrativeBadge() {
  return (
    <div className="rise-in mt-4" style={{ animationDelay: "120ms" }}>
      <div
        className="inline-flex max-w-2xl flex-col gap-1 rounded-md border border-muted/70 bg-card/50 px-3 py-2"
        title="This investigation is a UI demonstration. See our real TrueForge session recording in the README/demo video for actual tool-call and sandbox proof."
      >
        <span className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
          <Info className="size-3.5 text-muted-foreground/70" />
          illustrative session
        </span>
        <p className="text-[0.7rem] leading-relaxed text-muted-foreground/70">
          This investigation is a UI demonstration. See our real TrueForge session recording in the
          README/demo video for actual tool-call and sandbox proof.
        </p>
      </div>
    </div>
  );
}


function Header({
  investigation,
  onRestart,
}: {
  investigation: Investigation;
  onRestart: () => void;
}) {
  const status = statusMeta[investigation.status] ?? statusMeta["investigating"]!;
  const active = investigation.status === "investigating";

  return (
    <header className="rise-in mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="float-slow grid size-11 shrink-0 place-items-center rounded border border-amber/40 bg-amber/10 text-amber shadow-[0_0_30px_-10px_color-mix(in_oklab,var(--amber)_70%,transparent)]">
          <Radar className="size-5" />
        </span>
        <div className="min-w-0">
          <h1 className="shimmer-text truncate font-mono text-xl font-bold tracking-tight sm:text-2xl">
            {investigation.repo}
          </h1>
          <p className="truncate text-sm text-muted-foreground">
            {investigation.issue_number ? `#${investigation.issue_number} · ` : ""}
            {investigation.issue_title}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-3 sm:flex-row sm:items-center">
        <span
          className={`label-stencil inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${status.className} ${active ? "pulse-ring" : ""}`}
        >
          {active && <span className="size-1.5 rounded-full bg-cyan blink-cursor" />}
          {status.label}
        </span>
        <button
          type="button"
          onClick={onRestart}
          className="press-btn inline-flex items-center gap-2 rounded border border-amber/50 bg-amber/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-amber hover:bg-amber/20 active:scale-[0.96]"
        >
          <Plus className="size-3.5" /> New investigation
        </button>
      </div>
    </header>
  );
}

function Resolved({ investigation }: { investigation: Investigation }) {
  return (
    <section
      className="rise-in lift-card hover:lift-card-hover mt-6 rounded-md border border-success/40 bg-success/[0.06] p-5 shadow-[0_0_40px_-16px_color-mix(in_oklab,var(--success)_45%,transparent)]"
      style={{ animationDelay: "120ms" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="label-stencil inline-flex items-center gap-2 text-success">
          <CheckCircle2 className="size-4" /> Resolved
        </p>
        <p className="label-stencil text-muted-foreground">
          {investigation.resolved_at ? new Date(investigation.resolved_at).toUTCString() : ""}
        </p>
      </div>

      <p className="mt-3 text-sm text-panel-foreground">
        Fix pushed to <span className="font-mono text-foreground">{investigation.branch}</span> after
        licence granted. The advisory serializer field was renamed so the pytest suite matches the
        schema again.
      </p>

      {investigation.resolved_url && (
        <a
          href={investigation.resolved_url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 font-mono text-sm text-cyan underline decoration-cyan/40 underline-offset-4 transition-colors hover:decoration-cyan"
        >
          commit {investigation.resolved_ref}
          <ExternalLink className="size-3.5" />
        </a>
      )}
    </section>
  );
}

function ProofOfConcept() {
  const embed = resolvePocEmbed(POC_VIDEO_URL);

  return (
    <section
      className="rise-in mt-10 rounded-md border border-border/70 bg-card/50 p-5 shadow-sm"
      style={{ animationDelay: "160ms" }}
    >
      <div className="mb-4">
        <h2 className="font-mono text-lg font-semibold tracking-tight text-foreground">
          Proof of Concept
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Real TrueForge session — repo cloned, dependencies self-installed, tests run live in the
          Daytona sandbox.
        </p>
      </div>

      <div className="overflow-hidden rounded-md border border-dashed border-border/70">
        {embed.type === "iframe" ? (
          <iframe
            src={embed.src}
            title="Debrief proof-of-concept session recording"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full border-0 bg-panel"
          />
        ) : embed.type === "file" ? (
          <video src={embed.src} controls playsInline className="aspect-video w-full bg-panel" />
        ) : (
          <div className="grid aspect-video w-full place-items-center bg-panel">
            <div className="px-6 text-center">
              <p className="label-stencil text-muted-foreground/70">recording pending</p>
              <p className="mt-2 font-mono text-xs text-muted-foreground/60">
                Add your link in src/lib/poc-video.ts (YouTube, Loom, or an MP4 in public/).
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground/70">
        The Mission View above is a UI concept illustrating how a real investigation would be
        presented in Debrief.
      </p>
    </section>
  );
}


