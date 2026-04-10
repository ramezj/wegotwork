# lunics pricing + unit economics (working doc)

This document captures **what we’re pricing**, **what costs money**, and **how to estimate COGS and margins** for lunics multi-tenant ATS-style product.

It’s intended as a handoff doc you can give to other AIs to iterate on a final pricing strategy.

---

## 1) Project overview (what lunics does)

lunics is an organizations-based product where an organization can:

- Create and manage **Jobs**
- Receive **Candidates** (each candidate has a resume/CV upload and optional questionnaire responses)
- Move candidates through an **ATS pipeline**
- Invite **Team members** to collaborate
- Send **transactional emails** (candidate confirmation + workflow emails)

**Key “meterable” objects**

- **Organization**
- **Job**
- **Candidate** (includes resume storage + workflow events)
- **Seat** (team member)
- **Email** (confirmation + extra workflow)
- **Storage** (CV files + possibly other assets)
- **DB/API queries** (Prisma queries behind TanStack server functions)

---

## 2) What we are calculating

We’re building a pricing model based on **unit economics**:

- **Cost per candidate** (dominant driver tends to be emails; storage is cheap with R2)
- **Cost per job** = candidates/job × cost/candidate (+ fixed per-job overhead if any)
- **Cost per org/month** = jobs/org × candidates/job × cost/candidate + seats costs + fixed overhead allocation
- **Gross margin** = (revenue − COGS) / revenue

Where **COGS** includes (at minimum):

- Email sending costs (Resend)
- Resume storage + operations (Cloudflare R2)
- Hosting/DB base overhead (Railway minimums + any overage)

**Not included unless you add inputs**

- Support time
- Payment processing fees (Stripe)
- Error monitoring/logging (Sentry/Axiom)
- SMS costs (if any)
- AI/LLM costs (resume parsing, scoring, embeddings)

---

## 3) Vendor pricing (as used in calculations)

### Cloudflare R2 (Standard storage class)

Source: Cloudflare docs `https://developers.cloudflare.com/r2/pricing/`

- **Storage**: **$0.015 / GB-month**
- **Operations (Class A; writes like PUT)**: **$4.50 / 1,000,000 requests**
- **Operations (Class B; reads like GET)**: **$0.36 / 1,000,000 requests**
- **Egress**: **Free**
- **Free tier** (Standard): 10 GB-month storage, 1M Class A, 10M Class B (monthly)

Notes:

- R2 costs here usually remain small unless you store a _lot_ of large files for a long time.
- Download/egress is free, which is huge for “resume downloads.”

### Resend (Transactional emails)

Source: Resend pricing page (screenshot provided)

Overage pricing shown:

- **Extra emails**: **$0.90 / 1,000 emails** = **$0.0009/email**

Monthly tiers shown:

- Free: **3,000 emails/mo**
- Pro: **50,000 emails/mo** for **$20/mo**
- Scale: **100,000 emails/mo** for **$90/mo**

Notes:

- Once you consistently send near a tier’s included volume, your _effective per-email cost_ can drop vs pure overage.
  - Example: $20 / 50,000 = **$0.0004/email**
  - Example: $90 / 100,000 = **$0.0009/email** (same as overage)

### Railway hosting/DB (minimums)

Source: Railway pricing screenshot provided

- Hobby: **$5/mo minimum**, includes $5 usage credits
- Pro: **$20/mo minimum**, includes $20 usage credits
- Enterprise: custom

Notes:

- Railway is usage-based after credits; to model this correctly you either:
  - treat **$20/mo** as base overhead and measure actual usage later, or
  - model an estimated variable cost per request/GB/CPU second (needs your real usage).

---

## 4) Baseline product usage assumptions (inputs)

Provided assumptions:

- **Resume/CV average size**: 5 MB
- **Average downloads per CV**: 3–4 (use 3.5 average)
- **Candidates per job**: 100 → 1,000
- **Jobs per org**: 3 → 12
- **Team members per org**: ~3
- **Extra emails per candidate**: unknown (this is the biggest unknown + biggest driver)

Define:

- `E` = extra workflow emails per candidate (beyond 1 confirmation)
- `R` = average retention in months for resumes (e.g. 6, 12, 24)

---

## 5) Unit cost formulas (copy/paste friendly)

### 5.1 R2 storage per candidate per month

CV size: 5 MB

- In GB: 5 / 1024 = **0.0048828125 GB**

Storage cost per candidate per month:

- `C_storage_pm = 0.0048828125 * 0.015`
- `C_storage_pm ≈ $0.0000732421875`

Storage per candidate over retention window:

- `C_storage = C_storage_pm * R`

Example:

- R = 12 months → `~$0.00088` per candidate (still tiny)

### 5.2 R2 operations per candidate (upload + downloads)

Assume:

- 1 upload (PUT) per candidate
- 3.5 downloads (GET) per candidate

Per-request costs:

- PUT: 4.50 / 1,000,000 = **$0.0000045**
- GET: 0.36 / 1,000,000 = **$0.00000036**

Ops per candidate:

- `C_ops = 1*0.0000045 + 3.5*0.00000036`
- `C_ops ≈ $0.00000576`

### 5.3 Email per candidate

Resend overage price:

- `C_email = $0.0009 per email`

Total emails per candidate:

- `emails_per_candidate = 1 (confirmation) + E`

Email cost per candidate:

- `C_email_candidate = (1 + E) * 0.0009`

Examples:

- E=0 → $0.0009
- E=2 → $0.0027
- E=5 → $0.0054
- E=10 → $0.0099

### 5.4 Total variable cost per candidate (COGS)

- `C_candidate = C_email_candidate + C_storage + C_ops`

Given R2 is tiny, typically:

- `C_candidate ≈ C_email_candidate`

### 5.5 Cost per job / per org

Let:

- `N` = candidates per job
- `J` = jobs per org (in a month or active concurrently—define your billing basis)

Cost per job:

- `C_job = N * C_candidate`

Cost per org:

- `C_org = J * N * C_candidate`

---

## 6) Concrete cost scenarios (email dominates)

Assume R=12 months storage retention.

### Candidate-level (COGS)

Approximate cost per candidate:

- E=2 → ~$0.0027 (email) + ~$0.00088 (12mo storage) + ~$0.000006 (ops) ≈ **$0.0036**
- E=5 → ~$0.0054 + ~$0.00088 + ~$0.000006 ≈ **$0.0063**
- E=10 → ~$0.0099 + ~$0.00088 + ~$0.000006 ≈ **$0.0108**

### Org-level (COGS) examples

Low usage org (3 jobs × 100 candidates = 300 candidates/month):

- E=2 → ~300 × 0.0036 ≈ **$1.08**
- E=5 → ~300 × 0.0063 ≈ **$1.89**

High usage org (12 jobs × 1,000 candidates = 12,000 candidates/month):

- E=2 → ~12,000 × 0.0036 ≈ **$43.20**
- E=5 → ~12,000 × 0.0063 ≈ **$75.60**
- E=10 → ~12,000 × 0.0108 ≈ **$129.60**

These numbers explain why **workflow emails per candidate** (E) strongly influences pricing.

---

## 7) Hosting/DB overhead allocation (Railway)

Start with a base overhead:

- `O = $20 / month` (Railway Pro minimum; adjust if you choose Hobby/Enterprise)

If you have `P` paying orgs, overhead allocation per paying org is:

- `O_per_org = O / P`

Example:

- P=10 → $2.00/org/mo
- P=50 → $0.40/org/mo
- P=200 → $0.10/org/mo

This should be added to variable COGS when computing margin.

---

## 8) Estimated “queries per user” (rough, based on app patterns)

The app uses:

- TanStack Router loaders + `ensureQueryData(...)`
- TanStack Query for fetching server functions (Prisma behind `createServerFn`)

In practice, “queries” fall into two buckets:

1. **App-level queries** (TanStack Query cache) – visible in devtools as query keys like `["jobs", slug]`
2. **DB queries** (Prisma) – internal, can be multiple per request if includes are heavy

### 8.1 Typical TanStack Query calls per page load (approx)

These are approximate and depend on layout composition and what’s on screen:

- **Jobs page**:
  - `["jobs", slug]` (jobs list)
  - Often also `["organizations"]` (sidebar org selector)
  - → **~2 query keys** on a cold load

- **Candidates (jobs list) page**:
  - `["jobs", slug]` (jobs list with candidate counts)
  - `["organizations"]` (sidebar)
  - → **~2 query keys**

- **Single job candidates/ATS page**:
  - `["job", jobId]` (job + pipeline + candidates + responses)
  - `["pipelines", organizationId]` (pipeline choices)
  - `["organizations"]` (sidebar)
  - → **~3 query keys**

- **Offices page**:
  - `["organization", slug]` (org lookup for orgId)
  - `["offices", organizationId]`
  - `["organizations"]` (sidebar)
  - → **~3 query keys**

### 8.2 Monthly per-seat query estimate (back-of-envelope)

Define:

- `PV` = page views per seat per day (e.g. 50 for active internal users)
- `Q` = average query keys per page view (2–4 typical)
- `D` = active days per month (~22 workdays)

Then:

- `query_keys_per_seat_per_month ≈ PV * Q * D`

Examples:

- PV=30, Q=3, D=22 → ~1,980 query keys/seat/month
- PV=50, Q=3, D=22 → ~3,300 query keys/seat/month

**DB queries per month** will be:

- `DB_queries ≈ query_keys * DB_queries_per_request`
  Where `DB_queries_per_request` depends on Prisma usage; with careful `select` it can be close to 1–3, but complex includes can inflate it.

Recommendation:

- Instrument production logs for request counts + Prisma query counts before hard-pricing per “DB query.”

---

## 9) Suggested pricing “meters” to expose (practical)

To keep pricing aligned with costs and predictable for customers:

High-signal meters:

- **Candidates per month** (or candidates per active job)
- **Emails per month** (explicitly)
- **Seats** (value-based upsell)

Low-signal meters (usually not necessary unless abuse):

- **Storage (GB)** (R2 is cheap, but still good as a fair-use cap)
- **Jobs** (value-based more than cost-based; still good for packaging)

---

## 10) Open questions / missing inputs (to finalize margins)

To move from “variable-only” to full margin model:

- Average **extra emails per candidate** (E): recommend estimating 2 / 5 / 10 scenarios
- Average **resume retention window** (R): 6/12/24 months
- Expected **# of paying orgs** in next 3/6/12 months (for overhead allocation)
- Any **LLM/AI** spend per candidate (if planned)
- Any **support/ops** cost per paying org (even rough)
- Any **additional storage** besides CVs (attachments, recordings, etc.)

---

## Appendix: quick reference numbers

- R2 storage: **$0.015 / GB-month**
- R2 ops: **$4.50/M (Class A)**, **$0.36/M (Class B)**, egress **free**
- Resend overage: **$0.90 / 1,000 emails** (**$0.0009/email**)
- Railway base: **$20/mo minimum** (Pro; usage-based beyond credits)
