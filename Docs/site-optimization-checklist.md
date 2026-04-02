# Site Optimization Checklist

Use this for each website improvement pass so work stays progressive instead of looping.

## Objective

Finish every cycle with one completed improvement, full verification, and one clearly named next step.

## Checklist

1. Identify one remaining hardcoded decision surface or one high-leverage growth improvement.
2. Keep scope narrow enough to finish verification in the same pass.
3. Centralize or improve the target without unnecessary visible behavior changes unless the change is intentional.
4. Run `npm run build`.
5. Run `CI=1 npx playwright test tests/smoke.spec.ts`.
6. Confirm the user-facing result matches the intended outcome.
7. Name the next optimal step and explain why it is the highest-value follow-up.

## Current Sequence

1. Centralize service taxonomy and service-surface shortcuts.
2. Verify parity on `/services`, blog, and service-area surfaces.
3. Build the next discovery upgrade on top of the centralized taxonomy instead of adding more page-local arrays.
