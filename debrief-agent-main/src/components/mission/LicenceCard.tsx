import { useState } from "react";
import { AlertTriangle, Loader2, ShieldCheck, ShieldX } from "lucide-react";
import type { LicencePayload, Step } from "@/lib/mission";

export function LicenceCard({
  step,
  pending,
  delay = 0,
  onDecide,
}: {
  step: Step;
  pending: boolean;
  delay?: number;
  onDecide: (approve: boolean) => void;
}) {
  const payload: LicencePayload = step.payload ?? {};
  const decided = step.status === "approved" || step.status === "rejected";
  const [choice, setChoice] = useState<boolean | null>(null);

  function decide(approve: boolean) {
    setChoice(approve);
    onDecide(approve);
  }

  return (
    <li className="rise-in relative pl-10" style={{ animationDelay: `${delay}ms` }}>
      <span className="absolute left-0 top-3 z-10 grid size-7 place-items-center rounded-full border border-amber/60 bg-amber/15 text-amber">
        <AlertTriangle className="size-3.5" />
      </span>

      <div
        className={`lift-card hover:lift-card-hover rounded-md border border-amber/50 bg-amber/[0.06] p-5 transition-opacity duration-500 ${
          decided ? "rule-amber opacity-90" : "amber-glow"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="label-stencil text-amber">Licence required</h2>
          {decided && (
            <span
              className={`label-stencil ${step.status === "approved" ? "text-success" : "text-danger"}`}
            >
              {step.status}
            </span>
          )}
        </div>

        <p className="mt-2 text-lg font-semibold">{step.title}</p>
        <p className="mt-1 text-sm text-panel-foreground">{step.detail}</p>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Action" value={payload.action} mono />
          <Field label="Commit message" value={payload.commit_message} mono />
          <Field
            label="Target"
            value={payload.branch ? `${payload.branch} → ${payload.base ?? "main"}` : undefined}
            mono
          />
          <Field label="Sandbox result" value={payload.tests} />
        </dl>

        {!!payload.files?.length && (
          <div className="mt-4">
            <p className="label-stencil text-muted-foreground">Files touched</p>
            <ul className="mt-2 space-y-1 font-mono text-xs">
              {payload.files.map((file) => (
                <li key={file.path} className="flex items-center gap-3">
                  <span className="text-panel-foreground">{file.path}</span>
                  <span className="text-success">+{file.added}</span>
                  <span className="text-danger">-{file.removed}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!!payload.diff?.length && (
          <div className="mt-4">
            <p className="label-stencil text-muted-foreground">Proposed diff</p>
            <div className="mt-2 space-y-3">
              {payload.diff.map((file) => (
                <div
                  key={file.file}
                  className="overflow-hidden rounded border border-border bg-panel"
                >
                  <p className="border-b border-border px-3 py-2 font-mono text-xs text-foreground">
                    {file.file}
                  </p>
                  <pre className="overflow-x-auto py-2 font-mono text-xs leading-relaxed">
                    {file.lines.map((line, i) => (
                      <div
                        key={i}
                        className={
                          line.type === "add"
                            ? "bg-success/10 px-3 text-success"
                            : line.type === "del"
                              ? "bg-danger/10 px-3 text-danger"
                              : line.type === "meta"
                                ? "px-3 text-cyan/80"
                                : "px-3 text-muted-foreground"
                        }
                      >
                        {line.type === "add" ? "+" : line.type === "del" ? "-" : " "}
                        {line.text}
                      </div>
                    ))}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-4 flex items-center gap-2 font-mono text-xs text-danger">
          <AlertTriangle className="size-3.5 shrink-0" />
          This action is irreversible once executed on the remote.
        </p>

        {!decided && (
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={() => decide(true)}
              className="press-btn inline-flex items-center gap-2 rounded border border-success/50 bg-success/15 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-success hover:bg-success/25 hover:shadow-[0_0_20px_-6px_color-mix(in_oklab,var(--success)_60%,transparent)] active:scale-[0.96] disabled:opacity-60"
            >
              {pending && choice === true ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
              {pending && choice === true ? "Pushing" : "Approve"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => decide(false)}
              className="press-btn inline-flex items-center gap-2 rounded border border-danger/50 bg-danger/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-danger hover:bg-danger/20 active:scale-[0.96] disabled:opacity-60"
            >
              <ShieldX className="size-4" /> Reject
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | undefined;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div>
      <dt className="label-stencil text-muted-foreground">{label}</dt>
      <dd className={`mt-1 text-sm ${mono ? "font-mono" : ""} text-foreground`}>{value}</dd>
    </div>
  );
}
