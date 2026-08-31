<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:3b82f6,100:9333ea&height=250&section=header&text=Debrief&fontSize=90&fontColor=ffffff&desc=Investigate.%20Verify.%20Ask%20Before%20Acting.&descSize=22&descAlignY=70&descAlign=50" width="100%" />

[![Built for: The Agent Harness](https://img.shields.io/badge/Hackathon-The_Agent_Harness-ff69b4?style=for-the-badge)](#)
[![Sandbox: Daytona](https://img.shields.io/badge/Sandbox-Daytona-000000?style=for-the-badge)](https://daytona.io)
[![Reviewed by Qodo](https://img.shields.io/badge/Reviewed_by-Qodo-4c1d95?style=for-the-badge)](https://qodo.ai)
[![Dashboard: Lovable](https://img.shields.io/badge/Dashboard-Lovable-10b981?style=for-the-badge)](https://lovable.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>
<b><a href="https://debrief-agent.lovable.app">[🔗 FULL LIVE DASHBOARD ]</a></b> &nbsp;&nbsp;|&nbsp;&nbsp; <b><a href="https://youtu.be/qNxpv1vEIRo">[📺 YOUTUBE PRESENTATION  ]</a></b>

<br/><br/>
<h3>🏆 Official Hackathon Submission: The Agent Harness</h3>
</div>

---

<br/>

## 🕵️‍♂️ What It Does

> **Debrief** is a mission-dossier style web application designed for an AI agent that investigates GitHub repository issues. It executes code and runs autonomous tests securely in a **Daytona sandbox**, critically pausing for human approval via a "Licence Required" intercept *before* attempting to push any fixes.

### Core Protocol:
* 🔍 **Investigate:** Clones target repositories and performs deep reasoning on issues.
* 🧪 **Verify:** Runs automated testing suites in a completely isolated secure sandbox.
* 🛑 **Authorize:** Strictly halts and requires a human "License to Act" before any codebase modification.

<br/>

## 🛠️ Mission Architecture

<p align="center">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres" />
</p>

* **Frontend:** React + Tailwind CSS (Generated via Lovable)
* **Backend:** Supabase / PostgreSQL Auth
* **Sandbox / Engine:** Daytona & TrueForge

<br/>

## 📊 Live Session Telemetry
> A snapshot of our test agent operating autonomously in the runtime sandbox.

| 📡 Telemetry Metric | 🟢 Status / Result |
|---------------------|--------------------|
| **Target Cloned**   | ✅ Operation Successful |
| **Dependencies**    | ✅ Self-installed |
| **Test Matrix**     | 34 passed / 2 skipped / 0 failed (of 36 total) |
| **LLM Engine**      | `openrouter-free` |

<br/>

## 📂 Visual Proof (Agent Dashboard)

<table border="0" style="width: 100%;">
  <tr>
    <td align="center" width="50%" valign="top">
      <b>[01] Mission View & Agent Reasoning</b><br><br>
      <img src="debrief-agent-main/public/TrueForge%28Screenshots%29/Screenshot%202026-08-28%20125819.png" width="100%" alt="Reasoning" style="border-radius: 8px;"/>
    </td>
    <td align="center" width="50%" valign="top">
      <b>[02] Evaluating Test Results</b><br><br>
      <img src="debrief-agent-main/public/TrueForge%28Screenshots%29/Screenshot%202026-08-28%20164524.png" width="100%" alt="Test Results" style="border-radius: 8px;"/>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%" valign="top">
      <br><b>[03] Repo Clone Setup</b><br><br>
      <img src="debrief-agent-main/public/TrueForge%28Screenshots%29/Screenshot%202026-08-28%20164458.png" width="100%" alt="Repo Clone" style="border-radius: 8px;"/>
    </td>
    <td align="center" width="50%" valign="top">
      <br><b>[04] Secure Sandbox Execution</b><br><br>
      <img src="debrief-agent-main/public/TrueForge%28Screenshots%29/Screenshot%202026-08-28%20164509.png" width="100%" alt="Running code" style="border-radius: 8px;"/>
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2" valign="top">
      <br><b>🛑 [05] Mission Critical: License Required for Action</b><br><br>
      <img src="debrief-agent-main/public/TrueForge%28Screenshots%29/Screenshot%202026-08-28%20164532.png" width="80%" alt="License Required" style="border-radius: 8px;"/>
    </td>
  </tr>
</table>

<br/>

## 🔬 Qodo Quality Assurance
> Our repository has been strictly reviewed using Qodo for code robustness and structural integrity.

<table border="0" style="width: 100%;">
  <tr>
    <td align="center" width="50%" valign="top">
      <img src="debrief-agent-main/public/Qodo%20Code%20Review%20Evidence/Screenshot%202026-08-28%20163723.png" width="100%" alt="Qodo 1"/>
    </td>
    <td align="center" width="50%" valign="top">
      <img src="debrief-agent-main/public/Qodo%20Code%20Review%20Evidence/Screenshot%202026-08-28%20163735.png" width="100%" alt="Qodo 2"/>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%" valign="top">
      <img src="debrief-agent-main/public/Qodo%20Code%20Review%20Evidence/Screenshot%202026-08-28%20170655.png" width="100%" alt="Qodo 3"/>
    </td>
    <td align="center" width="50%" valign="top">
      <img src="debrief-agent-main/public/Qodo%20Code%20Review%20Evidence/Screenshot%202026-08-28%20170707.png" width="100%" alt="Qodo 4"/>
    </td>
  </tr>
</table>

<br/>

## ⚠️ Data Integrity Disclaimer
**DATA SEEDING:** For the purposes of this hackathon submission, this application is currently seeded with highly realistic, illustrative sample data. It reflects a simulated investigation of a `pytest` suite—complete with LLM reasoning blocks, tool calls, sub-agent delegations, and culminating in the "Licence Required" intercept card proposing a fix commit. 

This sample session is properly stored in **Supabase** acting as identical real-time JSON session data, strictly structured so it can dynamically swap over to live API telemetry in future production releases (one investigation = one row with an ordered array/table of steps).

<br/>
<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:9333ea,100:3b82f6&height=120&section=footer" width="100%" />

  <br><br>
  Built solo for the TrueForge Agent Harness Hackathon by **[Yashaswini V]**<br>
  <small>Powered by TrueForge · Daytona · Lovable · Qodo</small><br><br>
  <a href="#">Back to top ⬆️</a>
</div>
