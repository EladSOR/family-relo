#!/usr/bin/env bash
# Project hook: blocks the agent from declaring "done" if cities.json or
# countries.json were edited in this session and the Valencia-standard audit
# (scripts/deep_audit_cities.py) reports issues.
#
# Fails open if anything in this script or the audit itself errors — this is
# a safety net, not a gatekeeper. loop_limit in hooks.json caps retries.
set -e
cd "$(dirname "$0")/../.."

# Skip if no cities/countries data was changed in this session.
if ! git diff --name-only HEAD 2>/dev/null | grep -qE '^data/(cities|countries)\.json$'; then
  printf '{}'
  exit 0
fi

audit=$(python3 scripts/deep_audit_cities.py 2>&1 || true)
if printf '%s' "$audit" | grep -q "No issues. Site matches Valencia standard."; then
  printf '{}'
  exit 0
fi

# Audit found issues — block stop and feed findings back to the agent.
python3 - "$audit" <<'PY'
import json, sys
audit = sys.argv[1]
print(json.dumps({
    "agent_message": (
        "Quality audit BLOCKED completion. data/cities.json or data/countries.json "
        "was edited but the Valencia-standard audit reported issues. Fix every "
        "finding below before declaring the task done. Re-run "
        "`python3 scripts/deep_audit_cities.py` after each fix.\n\n"
        + audit
    ),
    "user_message": "Audit blocked completion — agent is fixing issues."
}))
PY
exit 2
