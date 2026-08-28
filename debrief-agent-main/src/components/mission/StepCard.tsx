import { useState } from "react";
import {
  Brain,
  Check,
  ChevronDown,
  GitBranch,
  Info,
  Terminal,
  Wrench,
  X,
} from "lucide-react";
import type { Step } from "@/lib/mission";

const kindMeta: Record<
  string,
  { label: string; icon: typeof Brain; tone: "amber" | "cyan" | "muted" | "success" }
> = {
  reasoning: { label: "Reasoning", icon: Brain, tone: "amber" },
  call_tool: { label: "call_tool", icon: Wrench, tone: "cyan" },
  get_tool_info: { label: "get_tool_info", icon: Info, tone: "muted" },
  sub_agent: { label: "Sub-agent", icon: GitBranch, tone: "cyan" },
  sandbox: { label: "Sandbox execution", icon: Terminal, tone: "success" },
};

const toneClass = {
  amber: "text-amber border-amber/40 bg-amber/10",
  cyan: "text-cyan border-cyan/40 bg-cyan/10",
  muted: "text-muted-foreground border-border bg-muted/40",
  success: "text-success border-success/40 bg-success/10",
} as const;

/** "get_file_contents (github)" -> "github.get_file_contents" */
function toolSlug(name: string) {
  const match = name.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (match) return `${match[2]!.trim()}.${match[1]!.trim()}`;
  return name;
}

function TerminalOutput({ output, running }: { output: string; running: boolean }) {
  const lines = output.split("\n");
  return (
    <div className="terminal-block overflow-hidden">
      <div className="flex items-center gap-2 border-b border-success/15 px-3 py-2">
        <span className="size-2 rounded-full bg-danger/70" />
        <span className="size-2 rounded-full bg-amber/70" />
        <span className="size-2 rounded-full bg-success/70" />
        <span className="label-stencil ml-2 text-muted-foreground">daytona sandbox</span>
      </div>
      <pre className="overflow-x-auto px-3 py-3 text-xs leading-relaxed">
        {lines.map((line, i) => {
          const fail = /\b(FAILED|ERROR|failed|Traceback|assert)\b/.test(line);
          const pass = /\b(PASSED|passed|OK|ok|\ball green\b)\b/.test(line);
          return (
            <div
              key={i}
              className={fail ? "text-danger" : pass ? "text-success" : "text-panel-foreground"}
            >
              {line || "\u00A0"}
            </div>
          );
        })}
        {running && (
          <div className="text-success">
            <span className="text-muted-foreground">$ </span>
            <span className="blink-cursor">▍</span>
          </div>
        )}
      </pre>
    </div>
  );
}

export function StepCard({
  step,
  index,
  nested = false,
  delay = 0,
  children,
}: {
  step: Step;
  index: number;
  nested?: boolean;
  delay?: number;
  children?: Step[];
}) {
  const meta = kindMeta[step.kind] ?? kindMeta["reasoning"]!;
  const Icon = meta.icon;
  const hasBody = Boolean(step.detail || step.output || children?.length);
  const [open, setOpen] = useState(step.kind === "reasoning" || step.kind === "sandbox");
  const isTool = step.kind === "call_tool" || step.kind === "get_tool_info";
  const running = step.status === "running";

  return (
    <li
      className="rise-in relative pl-10"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className={`absolute left-0 top-3 z-10 grid size-7 place-items-center rounded-full border backdrop-blur-sm ${toneClass[meta.tone]}`}
      >
        <Icon className="size-3.5" />
      </span>

      <div
        className={`dossier-panel lift-card hover:lift-card-hover rounded-md ${
          step.kind === "sub_agent" ? "border-cyan/30 hover:border-cyan/50" : "hover:border-border"
        } ${step.kind === "get_tool_info" ? "opacity-80" : ""}`}
      >
        <button
          type="button"
          onClick={() => hasBody && setOpen((v) => !v)}
          className="flex w-full items-start gap-3 px-4 py-3 text-left"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-stencil text-muted-foreground">
                {String(index).padStart(2, "0")} / {meta.label}
              </span>
              {step.status === "ok" && <Check className="size-3.5 text-success" />}
              {step.status === "fail" && <X className="size-3.5 text-danger" />}
              {step.status === "complete" && (
                <span className="label-stencil text-cyan">complete</span>
              )}
              {step.status === "pass" && (
                <span className="label-stencil text-success">all green</span>
              )}
            </div>

            {isTool && step.tool_name ? (
              <span
                className={`tool-pill mt-2 inline-block ${
                  step.kind === "get_tool_info" ? "opacity-70" : ""
                }`}
              >
                {toolSlug(step.tool_name)}
              </span>
            ) : (
              <p className="mt-1 truncate font-mono text-sm text-foreground">
                {step.tool_name ?? step.title ?? meta.label}
              </p>
            )}
          </div>
          {hasBody && (
            <ChevronDown
              className={`mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {hasBody && (
          <div
            className={`collapse-grid ${open ? "collapse-grid-open" : ""}`}
            aria-hidden={!open}
          >
            <div className="overflow-hidden">
              <div className="space-y-3 border-t border-border px-4 py-3">
                {step.detail && (
                  <p
                    key={`detail-${open}`}
                    className={`text-sm leading-relaxed text-panel-foreground ${open ? "reveal-stagger" : ""}`}
                    style={{ animationDelay: "70ms" }}
                  >
                    {step.detail}
                  </p>
                )}

                {step.output && (
                  <div
                    key={`output-${open}`}
                    className={open ? "reveal-stagger" : ""}
                    style={{ animationDelay: "140ms" }}
                  >
                    {step.kind === "sandbox" ? (
                      <TerminalOutput output={step.output} running={running} />
                    ) : (
                      <pre className="overflow-x-auto rounded border border-border bg-panel p-3 font-mono text-xs leading-relaxed text-panel-foreground">
                        {step.output}
                      </pre>
                    )}
                  </div>
                )}

                {!!children?.length && (
                  <div
                    key={`children-${open}`}
                    className={`relative ml-1 pl-5 ${open ? "reveal-stagger" : ""}`}
                    style={{ animationDelay: "210ms" }}
                  >
                    <span
                      aria-hidden
                      className="timeline-trace absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-cyan/60 via-cyan/30 to-transparent"
                    />
                    <span aria-hidden className="absolute left-0 top-1 h-px w-3 bg-cyan/50" />
                    <span aria-hidden className="absolute bottom-1 left-0 h-px w-3 bg-cyan/30" />
                    <p className="label-stencil mb-3 text-cyan">delegated thread</p>
                    <ol className="space-y-3">
                      {children.map((child, i) => (
                        <StepCard
                          key={child.id}
                          step={child}
                          index={i + 1}
                          delay={i * 70}
                          nested
                        />
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {nested && null}
    </li>
  );
}
