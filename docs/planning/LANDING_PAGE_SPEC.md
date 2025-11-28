# Landing Page Specification

_Last updated: 2025-11-28_

Техническое задание на лендинг Carbon Report. Весь контент основан на `docs/marketing/deliverables/` документах.

---

## 1. Общие требования

### 1.1 Цели страницы

| Цель | Метрика |
|------|---------|
| **Primary**: Собрать beta signups | Email submissions |
| **Secondary**: Валидировать messaging | Time on page, scroll depth |
| **Tertiary**: SEO для CBAM/PCF запросов | Organic traffic |

### 1.2 Технические требования

- **Framework**: Next.js (уже используется в проекте)
- **Стиль**: Tailwind CSS + существующий design system
- **Responsive**: Mobile-first, breakpoints: sm/md/lg/xl
- **Performance**: LCP < 2.5s, CLS < 0.1
- **Analytics**: Plausible или Posthog events
- **Forms**: React Hook Form + Zod validation

### 1.3 SEO Requirements

```html
<title>Carbon Report — Product Carbon Footprint & CBAM Reporting Platform</title>
<meta name="description" content="Collect supplier data and generate CBAM, ISO 14067, EPD reports in days, not months. Built for SME manufacturers under EU carbon regulations.">
<meta name="keywords" content="CBAM reporting, product carbon footprint, ISO 14067, PCF software, carbon compliance, EU carbon border">
```

**OG Tags**:
- og:title: "Carbon Report — PCF & CBAM Reports in Days"
- og:description: Same as meta description
- og:image: 1200x630 preview image (TBD)

---

## 2. Page Structure

### Навигация (Fixed Header)

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]    Features    Pricing    Beta Program    [CTA: Join Beta] │
└─────────────────────────────────────────────────────────────┘
```

- Logo → scroll to top
- Features → anchor scroll
- Pricing → anchor scroll  
- Beta Program → anchor scroll
- CTA → scroll to signup form

---

## 3. Sections & Content

### 3.1 Hero Section

**Layout**: Full-width, centered text, gradient background

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│           Product carbon footprint reports                  │
│              in days, not months.                           │
│                                                             │
│     Collect supplier data, generate CBAM & ISO 14067        │
│      reports from one dataset. No PhD required.             │
│                                                             │
│              [Join Beta — It's Free]                        │
│                                                             │
│         "Built for SME manufacturers under CBAM"            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Content** (из `04_messaging_positioning.md`):

| Element | Content |
|---------|---------|
| **Headline** | Product carbon footprint reports in days, not months. |
| **Subheadline** | Collect supplier data, generate CBAM & ISO 14067 reports from one dataset. No PhD required. |
| **CTA Button** | Join Beta — It's Free |
| **Trust badge** | Built for SME manufacturers under CBAM |

**Variants for A/B Testing**:
- Headline A: "Product carbon footprint reports in days, not months."
- Headline B: "Collect data for CBAM/PCF reports before the deadline."
- Headline C: "One dataset — any report format. CBAM, ISO 14067, EPD."

---

### 3.2 Problem Section

**Layout**: 2-column (text left, illustration right) or 3-card grid

**Headline**: "Sound familiar?"

**Pain Points** (из `04_messaging_positioning.md` + Reddit quotes):

```
┌─────────────────────────────────────────────────────────────┐
│                     Sound familiar?                         │
├─────────────────────────────────────────────────────────────┤
│  📧 "Getting suppliers to respond is like pulling teeth"   │
│                                                             │
│  📊 "We have 47 Excel files and nobody knows which is      │
│      the latest version"                                    │
│                                                             │
│  ⏰ "CBAM deadline is in 3 months and we haven't started"  │
│                                                             │
│  💸 "Consultants quoted us $50K+ for enterprise platforms" │
└─────────────────────────────────────────────────────────────┘
```

**Content Cards**:

| Icon | Pain | Source |
|------|------|--------|
| 📧 | "Getting suppliers to respond is like pulling teeth" | Reddit quote |
| 📊 | "47 Excel files, nobody knows which is latest" | Adapted quote |
| ⏰ | "CBAM deadline in 3 months, haven't started" | ICP research |
| 💸 | "Consultants quoted $50K+ for enterprise tools" | Reddit quote |

---

### 3.3 Solution Section

**Layout**: Centered headline + 3-column feature cards

**Headline**: "One platform. One dataset. Any report format."

**Subheadline**: "Enter your data once. Export to CBAM, ISO 14067, EPD, or any client format."

```
┌─────────────────────────────────────────────────────────────┐
│         One platform. One dataset. Any report format.       │
│   Enter data once. Export to CBAM, ISO 14067, EPD, or more. │
├───────────────────┬───────────────────┬─────────────────────┤
│                   │                   │                     │
│  📋 Structured    │  📨 One-click     │  📄 Multi-format    │
│     Data          │     Supplier      │     Export          │
│     Collection    │     Requests      │                     │
│                   │                   │                     │
│  Replace Excel    │  Pre-filled       │  CBAM, ISO 14067,   │
│  chaos with       │  emails to        │  EPD, client-       │
│  organized        │  suppliers.       │  specific — from    │
│  project view.    │  Track status.    │  one dataset.       │
│                   │                   │                     │
└───────────────────┴───────────────────┴─────────────────────┘
```

**Feature Cards**:

| Icon | Feature | Description |
|------|---------|-------------|
| 📋 | Structured Data Collection | Replace Excel chaos with organized project view. Status tracking for every field. |
| 📨 | One-click Supplier Requests | Pre-filled emails to suppliers. Track who responded, who's pending. |
| 📄 | Multi-format Export | CBAM, ISO 14067, EPD, client-specific templates — all from one dataset. |

---

### 3.4 How It Works

**Layout**: 4-step horizontal flow or vertical timeline

**Headline**: "From data chaos to compliance in 4 steps"

```
┌─────────────────────────────────────────────────────────────┐
│         From data chaos to compliance in 4 steps            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ① Create         ② Request         ③ Fill           ④ Export │
│   Project          Data              Dataset          Report   │
│                                                             │
│   Set up your      One-click         Enter data       Generate │
│   product or       emails to         once. Track      CBAM,    │
│   process scope.   suppliers.        completion.      ISO 14067│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Steps**:

| Step | Title | Description |
|------|-------|-------------|
| 1 | Create Project | Set up your product or process scope. Define what you're reporting on. |
| 2 | Request Data | One-click emails to suppliers and colleagues. Track who responded. |
| 3 | Fill Dataset | Enter data once. See completion status. Get notified when data arrives. |
| 4 | Export Report | Generate CBAM, ISO 14067, EPD, or custom format. Ready for verifier. |

---

### 3.5 Comparison Section

**Layout**: Comparison table or "Us vs Them" cards

**Headline**: "Why Carbon Report?"

```
┌─────────────────────────────────────────────────────────────┐
│                    Why Carbon Report?                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  vs Excel + Email         vs Enterprise ESG      vs LCA Software │
│  ─────────────────        ─────────────────      ─────────────── │
│                                                             │
│  ✅ Structured data       ✅ €299/mo, not        ✅ No PhD      │
│  ✅ Status tracking         $50K+                  required     │
│  ✅ Version control       ✅ Days, not months    ✅ Business UX │
│  ✅ Audit trail           ✅ Product-level focus ✅ Compliance  │
│                                                               focus │
└─────────────────────────────────────────────────────────────┘
```

**Comparison Points** (из `04_messaging_positioning.md`):

| vs Excel + Email | vs Enterprise ESG (Persefoni, Sweep) | vs LCA Software (SimaPro, GaBi) |
|------------------|--------------------------------------|--------------------------------|
| ✅ Structured data collection | ✅ €299/mo, not $50K+ | ✅ No PhD or 6-month training |
| ✅ Status tracking per field | ✅ First report in days, not months | ✅ Business user UX |
| ✅ Version control & audit trail | ✅ Product-level focus, not just Scope 1-3 | ✅ Compliance-first, not science-first |

---

### 3.6 Pricing Section

**Layout**: 3-4 pricing cards (Free / Starter / Professional / Business)

**Headline**: "Simple, transparent pricing"
**Subheadline**: "Start free. Scale as you grow."

```
┌─────────────────────────────────────────────────────────────┐
│              Simple, transparent pricing                     │
│              Start free. Scale as you grow.                  │
├───────────────┬───────────────┬───────────────┬─────────────┤
│    FREE       │   STARTER     │  PROFESSIONAL │   BUSINESS  │
│    €0/mo      │   €99/mo      │   €299/mo     │   €599/mo   │
├───────────────┼───────────────┼───────────────┼─────────────┤
│ 1 project     │ 3 projects    │ 10 projects   │ 30 projects │
│ 1 user        │ 3 users       │ 5 users       │ 10 users    │
│               │               │               │             │
│ ✓ All export  │ ✓ All export  │ ✓ All export  │ ✓ All in    │
│   formats     │   formats     │   formats     │   Pro       │
│ ✓ Email       │ ✓ Supplier    │ ✓ AI Data     │ ✓ API       │
│   requests    │   Portal*     │   Agent*      │   access*   │
│               │ ✓ Auto-       │ ✓ Verifier    │ ✓ Priority  │
│               │   reminders*  │   Collab*     │   support   │
├───────────────┼───────────────┼───────────────┼─────────────┤
│  [Try Free]   │ [Start Trial] │ [Start Trial] │ [Contact Us]│
└───────────────┴───────────────┴───────────────┴─────────────┘
                     * Coming soon
```

**Pricing Cards** (из `07_pricing_model.md`):

| Plan | Price | Projects | Users | Key Features |
|------|-------|----------|-------|--------------|
| **Free** | €0/mo | 1 | 1 | All export formats, email requests |
| **Starter** | €99/mo | 3 | 3 | + Supplier Portal*, Auto-reminders* |
| **Professional** | €299/mo | 10 | 5 | + AI Data Agent*, Verifier Collaboration* |
| **Business** | €599/mo | 30 | 10 | + API access*, Priority support |

**Note**: Mark roadmap features with `*` and "Coming soon" label.

**FAQ под pricing**:
- "What's a project?" → One product = one project. Archived projects don't count.
- "What about suppliers?" → Unlimited. They respond via email, no login needed.
- "Can I upgrade anytime?" → Yes. Prorated billing.

---

### 3.7 Beta Program Section

**Layout**: Full-width CTA section with form

**Headline**: "Join the Beta — Shape the Product"
**Subheadline**: "Get free access, influence the roadmap, and lock in 50% lifetime discount."

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│           Join the Beta — Shape the Product                 │
│                                                             │
│    Get free access, influence the roadmap, and lock in      │
│              50% lifetime discount.                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Email: [________________________]                   │   │
│  │  Company: [______________________]                   │   │
│  │  Role: [Sustainability Manager ▼]                    │   │
│  │  What brings you here? [CBAM / Client request / ...] │   │
│  │                                                      │   │
│  │           [Request Beta Access]                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ✓ Full platform access      ✓ Direct founder access       │
│  ✓ Personal onboarding       ✓ Influence roadmap           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Form Fields**:

| Field | Type | Required | Options/Validation |
|-------|------|----------|-------------------|
| Email | email | ✅ | Valid email |
| Company | text | ✅ | Min 2 chars |
| Role | select | ✅ | Sustainability Manager, Quality Manager, Operations, Consultant, Other |
| What brings you here? | select | ⚠️ Optional | CBAM compliance, Client PCF request, Internal initiative, Just exploring |
| Company size | select | ⚠️ Optional | 1-50, 50-200, 200-500, 500+ |

**Benefits List**:
- ✓ Full platform access during beta
- ✓ Personal 30-min onboarding call
- ✓ Direct Telegram/WhatsApp access to founder
- ✓ Influence feature roadmap
- ✓ 50% lifetime discount after beta

**Post-submit**:
- Success message: "You're on the list! We'll reach out within 48 hours to schedule your onboarding."
- Redirect to thank-you page or show inline confirmation

---

### 3.8 Social Proof Section (Placeholder)

**Layout**: Logo bar + quote cards

**Headline**: "Trusted by sustainability teams"

```
┌─────────────────────────────────────────────────────────────┐
│               Trusted by sustainability teams                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   [Logo 1]    [Logo 2]    [Logo 3]    [Logo 4]             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  "Finally, a tool that doesn't require a PhD to     │   │
│  │   use. We got our first CBAM report done in 2 weeks."│   │
│  │                                                      │   │
│  │   — Maria S., Sustainability Manager                 │   │
│  │     [Company Name]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Note**: Заполнить после получения beta testimonials. Пока показать:
- "Be among the first companies to try Carbon Report" или
- Скрыть секцию до появления реальных отзывов

---

### 3.9 FAQ Section

**Layout**: Accordion с категориями

**Источники**: Reddit quotes, G2/Capterra reviews, competitor analysis (`02_market_landscape.md`, `03_icp_and_personas.md`)

---

#### Категория 1: Supplier Data Collection (главная боль)

> *"Scope 3 is always the hardest - getting suppliers to actually respond with real data is like pulling teeth."* — Reddit r/sustainability

| Question | Answer |
|----------|--------|
| **My suppliers never respond to data requests. How does Carbon Report help?** | We make it dead simple: one-click emails with pre-filled templates, clear deadlines, and automatic follow-ups. Suppliers don't need to register or learn a new system — they just reply to an email. Our users report 2-3x better response rates vs manual emails. |
| **Do my suppliers need to create accounts or learn a new tool?** | No. Suppliers receive a simple email request and can respond directly. No registration, no portals, no training required. We're building an optional no-login form for those who prefer it, but email always works. |
| **What if my suppliers don't have carbon data?** | We provide guidance on what data to request (energy bills, material specs, transport info) that suppliers already have. You don't need their carbon footprint — you need their activity data. We handle the calculations. |
| **I have 50+ suppliers. How do I manage all those requests?** | Our dashboard shows exactly who responded, who's pending, and who needs a reminder. Filter by status, deadline, or supplier. Send bulk reminders in one click. No more hunting through email threads. |

---

#### Категория 2: CBAM & Compliance (срочность)

> *"CBAM is coming fast and most importers have no idea how to get verified data from their suppliers. It's going to be chaos."* — Reddit r/consulting

| Question | Answer |
|----------|--------|
| **What is CBAM and does it apply to me?** | EU Carbon Border Adjustment Mechanism requires importers of steel, aluminum, cement, fertilizers, electricity, and hydrogen to report embedded carbon from January 2026. If you import these goods into the EU — yes, it applies to you. |
| **Can Carbon Report generate CBAM-compliant reports?** | Yes. We output reports in the exact format required for the CBAM Transitional Registry. You enter data once, we handle the formatting. |
| **Is the report "audit-ready"?** | We provide structured documentation ready to hand to your verifier. All data is traceable with an audit trail showing who entered what and when. Note: final verification is performed by accredited third-party verifiers, not by us. |
| **The CBAM deadline is in a few months. Can I get started quickly?** | Yes. Most users create their first project in under an hour and complete a report within 1-2 weeks (depending on supplier response time). No 3-month implementation like enterprise tools. |

---

#### Категория 3: Pricing & Value (стоимость)

> *"We evaluated Watershed, Persefoni, and Plan A. All quoted us $50K+ for a mid-size company. Ended up staying with consultants + Excel."* — Reddit r/sustainability

| Question | Answer |
|----------|--------|
| **How much does Carbon Report cost?** | Starts at €99/month for 3 projects. Our Professional plan at €299/month covers 10 projects — typically 10-20x cheaper than enterprise alternatives that start at $25K+/year. |
| **Is it cheaper than hiring a consultant?** | Often, yes. Consultants charge €500-2,000 per product carbon footprint. With Carbon Report, you can do multiple reports per month for a flat fee. Plus, you keep the capability in-house. |
| **What's included? Any hidden fees?** | All export formats (CBAM, ISO 14067, EPD, custom) are included. Unlimited supplier requests. No per-report fees. No implementation fees. The price you see is the price you pay. |
| **Is there a free trial?** | Yes. Our Free plan includes 1 project forever. Beta users get full access free during beta, plus 50% off forever when we launch paid plans. |

---

#### Категория 4: Ease of Use (learning curve)

> *"SimaPro: The gold standard for LCA but you need a PhD to use it effectively."* — Capterra review
> *"Sphera GaBi: Powerful but feels like software from 2005. The UX is painful and training is mandatory."* — G2 review

| Question | Answer |
|----------|--------|
| **I'm not an LCA expert. Can I still use this?** | Absolutely. Carbon Report is built for sustainability managers and operations people, not scientists. We guide you step-by-step: which data to collect, where to enter it, what it means. No PhD required. |
| **How long does it take to learn?** | Most users are productive within 30 minutes. Compare that to traditional LCA software that requires 3-6 months of training. We offer a free onboarding call if you want help getting started. |
| **What if I don't know the "right" methodology?** | We've baked ISO 14067 and CBAM methodologies into our templates. You focus on collecting accurate data; we ensure it's calculated and formatted correctly. |
| **I'm just one person handling sustainability. Is this manageable?** | Yes — we built Carbon Report for exactly this situation. The one-person sustainability team is our core user. Status tracking and automation mean you can manage multiple reports without drowning in spreadsheets. |

---

#### Категория 5: vs Alternatives (competitive)

> *"Most of our clients still use Excel. They know it's not scalable but the switching cost to a platform feels too high."* — Reddit r/consulting

| Question | Answer |
|----------|--------|
| **Why not just use Excel?** | Excel works until it doesn't. No audit trail, no version control, no status tracking, copy-paste errors, files scattered across emails. When you have 20+ suppliers and a deadline, Excel becomes a liability. We've seen teams lose weeks to "which file is the latest?" |
| **How is this different from Persefoni, Sweep, or Plan A?** | Those are enterprise ESG platforms focused on corporate Scope 1/2/3. We focus on **product-level** carbon footprint — what CBAM and your B2B customers actually need. Also: €299/month vs $50K+/year, days to first report vs months of implementation. |
| **How is this different from SimaPro or GaBi?** | LCA software is designed for scientists doing deep lifecycle analysis. Carbon Report is designed for business users who need compliant reports fast. We're not trying to replace LCA tools — we're the layer between your data and your compliance deadline. |
| **Can I export to Excel if I need to?** | Yes. Export your data and reports to Excel, PDF, or structured formats anytime. No lock-in. Your data is yours. |

---

#### Категория 6: Technical & Security

| Question | Answer |
|----------|--------|
| **Where is my data stored?** | EU-based cloud infrastructure (AWS eu-central). Encrypted at rest and in transit. GDPR compliant. |
| **Can I integrate with our ERP/accounting system?** | API access is available on Business plans. For most SMEs, CSV import/export covers the need. We're building integrations based on user demand. |
| **Who can see my data?** | Only your team members. Suppliers only see their specific requests. We don't share or sell data. Ever. |
| **What happens if I cancel?** | Export all your data first (it's yours), then cancel anytime. No long-term contracts required. |

---

#### Категория 7: Getting Started

| Question | Answer |
|----------|--------|
| **How do I get started?** | Sign up for free, create your first project, and start entering data. Takes about 10 minutes to set up. Book an onboarding call if you want a walkthrough. |
| **What if I need help during setup?** | Beta users get a personal 30-minute onboarding call and direct access to the founder via Telegram/WhatsApp. We're here to make sure you succeed. |
| **What happens after the beta?** | Beta users lock in 50% off any paid plan, forever. You can also stay on the Free plan (1 project) indefinitely. |
| **Can I invite my team?** | Yes. Add colleagues with different roles (editor, viewer). Paid plans include multiple seats; extra seats are €19/month each. |

---

### 3.10 Footer

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]                                                      │
│                                                             │
│  Product          Company         Legal                      │
│  ────────         ───────         ─────                      │
│  Features         About           Privacy Policy             │
│  Pricing          Blog            Terms of Use               │
│  Beta Program     Contact         Cookie Policy              │
│                                                             │
│  © 2025 Carbon Report. All rights reserved.                 │
│                                                             │
│  [LinkedIn]  [Twitter/X]                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Conversion Events (Analytics)

| Event | Trigger | Priority |
|-------|---------|----------|
| `page_view` | Page load | 🟢 |
| `scroll_25` | 25% scroll depth | 🟡 |
| `scroll_50` | 50% scroll depth | 🟡 |
| `scroll_75` | 75% scroll depth | 🟡 |
| `cta_click_hero` | Click hero CTA | 🔴 |
| `cta_click_pricing` | Click pricing CTA | 🔴 |
| `form_start` | Focus on first form field | 🟡 |
| `form_submit` | Form submission | 🔴 |
| `form_success` | Successful submission | 🔴 |
| `faq_expand` | Click FAQ item | 🟢 |
| `pricing_hover` | Hover on pricing card | 🟢 |

---

## 5. A/B Test Plan

### Test 1: Hero Headline
- **Control**: "Product carbon footprint reports in days, not months."
- **Variant A**: "Collect data for CBAM/PCF reports before the deadline."
- **Variant B**: "One dataset — any report format."
- **Metric**: CTA click rate

### Test 2: CTA Button Text
- **Control**: "Join Beta — It's Free"
- **Variant A**: "Get Early Access"
- **Variant B**: "Start Free Trial"
- **Metric**: Form submissions

### Test 3: Pain Framing
- **Control**: Problem section with quotes
- **Variant**: Problem section with statistics
- **Metric**: Scroll depth to solution section

---

## 6. Content Checklist

### Copywriting
- [ ] Hero headline + subheadline
- [ ] Problem section pain points
- [ ] Solution section features
- [ ] How It Works steps
- [ ] Comparison table
- [ ] Pricing descriptions
- [ ] Beta benefits list
- [ ] FAQ answers
- [ ] Meta description + title

### Visual Assets
- [ ] Logo (dark + light versions)
- [ ] Hero illustration or screenshot
- [ ] Feature icons (3)
- [ ] Step icons (4)
- [ ] OG image (1200x630)
- [ ] Favicon

### Legal
- [ ] Privacy Policy page
- [ ] Terms of Use page
- [ ] Cookie consent banner

---

## 7. Launch Checklist

- [ ] All sections implemented
- [ ] Form submits to database/CRM
- [ ] Analytics events firing
- [ ] Mobile responsive tested
- [ ] Lighthouse score > 90
- [ ] OG tags working (test on LinkedIn/Twitter)
- [ ] Legal pages linked
- [ ] 404 page styled
- [ ] SSL certificate active
- [ ] Domain configured (carbonreport.io?)

---

## 8. Post-Launch Iterations

1. **Week 1**: Monitor conversion rate, fix obvious UX issues
2. **Week 2**: Start A/B tests on headlines
3. **Week 3-4**: Add testimonials from beta users
4. **Week 5-6**: Refine pricing based on feedback
5. **Ongoing**: SEO optimization, content additions

---

## 🔗 Source Documents

- `docs/marketing/deliverables/04_messaging_positioning.md` — Копирайт
- `docs/marketing/deliverables/06_beta_program.md` — Beta условия
- `docs/marketing/deliverables/07_pricing_model.md` — Pricing тарифы
- `docs/marketing/MARKETING_BACKLOG.md` — Связанная задача MKT-001
