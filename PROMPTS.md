# AI Workflow Prompts

## 1. Analyse

Analyse this task without modifying files.

Task:
[describe the task]

Return:
- relevant files;
- minimal plan;
- risks;
- checks to run.

Do not propose unrelated changes.

---

## 2. Implement

Implement the approved plan.

Rules:
- keep the change small;
- do not refactor unrelated code;
- do not add dependencies;
- stop and ask if the scope must expand;
- run relevant checks;
- report modified files and remaining risks.

---

## 3. Review

Review the current git diff without modifying files.

Check:
- correctness;
- regressions;
- scope violations;
- unnecessary complexity;
- missing tests or checks.

Classify findings as:
- blocking;
- important;
- optional.
