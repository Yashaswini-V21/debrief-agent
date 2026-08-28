import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { applyLicenceDecision, loadDemoMission, rearmDemoInvestigation } from "./mission.server";

const decideSchema = z.object({
  investigationId: z.string().uuid(),
  stepId: z.string().uuid(),
  approve: z.boolean(),
});

const restartSchema = z.object({
  investigationId: z.string().uuid(),
});

export const decideLicenceFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => decideSchema.parse(data))
  .handler(async ({ data }) => applyLicenceDecision(data));

export const restartInvestigationFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => restartSchema.parse(data))
  .handler(async ({ data }) => rearmDemoInvestigation(data.investigationId));

export const fetchMissionFn = createServerFn({ method: "GET" }).handler(async () =>
  loadDemoMission(),
);
