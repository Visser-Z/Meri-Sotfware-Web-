# Meri.Software · LinkedIn company page

Brand assets for the company page, built from the site's own tokens (`css/variables.css`) and logo
(`images/logo-mark.svg`). The parent brand is black, white and the warm canvas grey, with mint and voltage
yellow as accents and the gold mark. Teal belongs to Meri.Conquer only, so it stays off the company page.

This folder is listed in `.assetsignore`, so it never deploys with the site.

## Re-render

```bash
node brand/linkedin/render.mjs            # everything
node brand/linkedin/render.mjs banner     # just names containing "banner"
```

Sources are in `src/` (plain HTML at the exact pixel size). Output goes to `export/`. The script uses headless Edge or Chrome.

## Page setup

| Where | File | Notes |
|---|---|---|
| Logo | `export/logo-400x400.png` | Gold mark on black. It still reads at 48px in the feed. |
| Cover | `export/banner-1128x191@2x.png` | Upload the 2x file for crisp text. `banner-guides.png` shows the logo-overlap and mobile-trim zones. |
| Tagline | Operations automation agency. We build AI systems that take over the manual work in operations-heavy businesses. | 112 of 120 characters |
| Button | Visit website → the site's `#contact` (Free AI Opportunity Map) | |

## Posts

All posts are 1080×1350 (4:5), the largest a single image gets in the feed. Every claim comes from the
site. Product screenshots are the real app with sample data, labelled as on the site. Client names stay private.

Suggested order, about two a week:

1. **Statement** (`post-statement.png`): introduces the page.
2. **Carousel: produce trading** (`carousel-produce-trading.pdf`): upload as a *document* post. The single-slide PNGs are a fallback for a multi-image post.
3. **How we work** (`post-how-we-work.png`)
4. **Project: mining haulage** (`post-project-haulage.png`)
5. **Project: engineering workshop** (`post-project-workshop.png`)
6. **Project: petroleum engineering** (`post-project-petroleum.png`)
7. **Project: produce trading** (`post-project-produce.png`): a short recap of the carousel for people who missed it.

To add a project, add an entry to `POSTS` in `src/post.html` and a line to `shots` in `render.mjs`.

### Captions

**1 · Statement**
> The retyping. The reconciling. The chasing.
>
> Every operations-heavy business has it: the same information typed in three times, the reconciliation done by hand at month end, the job nobody can find.
>
> We're Meri.Software, an operations automation agency in Cape Town. We build AI systems that take that work over, inside the way your business already runs. The decisions stay with your people.
>
> Over the next few weeks we'll show you what we've built.

**2 · Carousel: produce trading**
> A fresh-produce trader's market agents report back in stacks of fixed-format PDFs. Every day.
>
> Now the reports pull themselves every morning, every payment is matched to its sales to the cent, stock is tracked from the trader's own delivery notes, and an assistant plans what to send where.
>
> Swipe through the build. (Screens show sample data. Client names stay private.)
>
> Want to know where this would pay in your operation? Comment "MAP" and we'll send you a free AI Opportunity Map.

**3 · How we work**
> No big-bang transformation.
>
> We fix the one job that costs you the most, make sure your team actually uses it, then move on to the next.
>
> 01 A free AI Opportunity Map: where AI would pay, where it wouldn't, and what a first build costs
> 02 A small first build, scoped
> 03 Live on your real documents and data, with every exception landing with a person
> 04 Run and improve. When it runs itself, we automate the next job.

**4 · Mining haulage**
> Hauled against billed.
>
> For a coal-haulage operation, we built a system where weighbridge tickets and delivery dockets are captured as they come in, tonnage hauled is reconciled against tonnage billed, and the whole fleet is visible in one place.
>
> It fits bulk transport, cross-border logistics and quarrying too.

**5 · Engineering workshop**
> Nothing sits forgotten on a bench.
>
> For a gear and engineering workshop, each bespoke job is now quoted in the app and followed through the shop by stage, so the floor and the office work from the same picture.
>
> It fits fabricators, machine builders, equipment makers and repair shops.

**6 · Petroleum engineering**
> Check the safety file. Don't build it.
>
> For a petroleum-engineering firm, a full compliance file is assembled from a reusable document library plus the project's details. The safety officer then reviews and signs a complete file, instead of building one from scratch.
>
> It fits construction, EPC, mining and any regulated, document-heavy operation.

**7 · Produce trading (recap)**
> Market reports that read themselves.
>
> Reports pulled and read every day. Payments reconciled against deliveries to the cent. Buy plans and dispatch sheets built from what actually sold.
>
> The full build is in our carousel from earlier this month.
