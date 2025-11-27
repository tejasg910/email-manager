## Overview

We’ll resolve the TypeScript build issues by aligning the queue library with its TypeScript-first API, tightening types in API routes and frontend components, and ensuring Node-only imports are scoped to server code. After edits, we’ll run a full type check and build to verify.

## Queue Library Alignment

* Replace `bull` v4 usage with `bullmq`, which provides official TypeScript types and `addBulk`.

* Update `lib/que.ts` to:

  * `import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq'`

  * Construct queue with `new Queue('email-queue', { connection: { host, port, password }, limiter: { max: 15, duration: 60000 } })`

  * Register a `Worker` for processing jobs (guarded behind server-only context), and `QueueEvents` for lifecycle logs.

  * Keep the existing email processing logic and Supabase updates.

* Update `app/api/send-bulk/route.ts` to use the `Queue` instance returned by `getQueue` and call `queue.addBulk([...])` with correct `JobsOptions` typing. Reference: BullMQ `addBulk` docs (<https://docs.bullmq.io/guide/queues/adding-bulks>).

## API Route Type Safety

* `app/api/send-bulk/route.ts`

  * Define `type BulkPayload = { emailId: string[]; templateId: string }` and parse `const { emailId, templateId }: BulkPayload = await request.json()`.

  * Import `randomUUID` from `node:crypto` and set `export const runtime = 'nodejs'` to ensure Node runtime.

  * Coerce template HTML safely: `const sanitized = sanitizeHtml(template?.html ?? '')`.

* `app/api/campain/[campaignId]/route.ts`

  * Handle potential `null` data: `const rows = stats ?? []` before `reduce`.

  * Include `cancelled` in completion tally and guard division by zero (already noted).

## Frontend Typings & Runtime Guarding

* `features/pending/components/PendingEmails.tsx`

  * Fix `intervalRef` typing to `useRef<ReturnType<typeof setInterval> | null>(null)`.

  * Extend `Email` interface to include `status?: 'queued' | 'sending' | 'sent' | 'failed' | 'cancelled'` so `email.status` usage type-checks.

  * Keep progress display logic; it will read the corrected API percentage.

## Build & Verification

* Run `tsc --noEmit` to surface TypeScript diagnostics.

* Run `npm run build` to validate Next.js build.

* If any missing declaration errors appear (e.g., for libraries), add appropriate dev types (most already present per package.json). With `bullmq`, no extra `@types` are needed.

## Notes on Vercel

* Worker processes do not persist on Vercel serverless. We will keep queue enqueuing in API and process via `Worker` only in environments that support long-running tasks (local dev or a dedicated worker service). For Vercel, consider moving the worker to a separate service or adopting a webhook-based job runner. The API will still return quickly with `addBulk`.

## Deliverables

* Updated `lib/que.ts` using `bullmq` with typed queue/worker/events.

* Updated `app/api/send-bulk/route.ts` with typed payload, Node runtime guard, and safe sanitization.

* Updated `app/api/campain/[campaignId]/route.ts` with safe `stats` handling.

* Updated `features/pending/components/PendingEmails.tsx` with corrected `Email` interface and interval typing.

* Verified clean `tsc` diagnostics and successful `next build`.

