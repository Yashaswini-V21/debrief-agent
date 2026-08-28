# Debrief

An AI agent that investigates failing tests in a GitHub repo, verifies the
real cause by running the test suite in an isolated sandbox, and pauses for
explicit human approval before pushing any fix — built on TrueForge.

## What it does
Debrief takes a GitHub issue or a broken test report, investigates the
repo (reading relevant files, tracing the failure), reproduces it by
actually executing the test suite inside a Daytona-backed sandbox, and
proposes a fix. It never pushes anything without a human explicitly
approving first.

## How TrueForge is used
- Reaches GitHub via the GitHub MCP connector to read repo/issue/PR content
- Runs the real test suite inside a Daytona sandbox to verify failures
- Pauses for explicit human approval before any irreversible action
- Uses TrueForge's reasoning trace to show its investigation step by step

## Tech Stack
TrueForge (agent harness) · GitHub MCP · Daytona (sandbox) · Lovable
(React + Tailwind + Supabase) for the Debrief mission-dossier dashboard

## Qodo Code Review Evidence
This repo's changes go through pull requests reviewed by Qodo.
