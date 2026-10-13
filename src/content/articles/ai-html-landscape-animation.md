---
title: "Using AI to Animate Landscape Diagrams with HTML"
description: "Turn landscape processes into browser-based animations, with a three-stage delta example and a reusable prompt."
stage: communication
published: 2026-09-13
publishedLabel: "Sept.13.2026"
thumbnail: ../../assets/html-animation/delta-storyboard.svg
thumbnailAlt: "Three plan diagrams showing sediment delivery, mouth-bar buildup, and branching around a delta island."
---

Landscape analysis often needs to explain change: how rainwater collects, where sediment settles, or how shadows move. A static diagram can show a route or an end state, but the sequence may need several drawings and a spoken explanation.

An AI-generated HTML animation can bring those drawings together. It can separate a process into readable steps, retain the changes from earlier stages, and let the viewer pause to examine a spatial relationship. The designer supplies the analysis logic; AI helps turn it into a moving explanation.

## What an HTML animation offers

“HTML animation” usually means a web page built with HTML, with SVG, CSS, and JavaScript drawing the scene and controlling its movement. HTML organizes the content, SVG draws lines and shapes, CSS sets their appearance, and JavaScript manages timing and interaction. SVG graphics remain sharp when enlarged, which makes them useful for paths, boundaries, and annotations. [MDN: SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)

For a designer, the practical advantages are editability and access. Colors, labels, speed, and layout can be revised, and the result can play in a browser with pause, replay, or parameter controls. It can also be embedded in a project page so viewers can follow the explanation at their own pace. A self-contained file with inline graphics and code can work without external assets or a network connection.

## What AI can help produce

Start by describing the scene, the order of events, and the relationship that should be understood. For example: “Show rainwater flowing down the slope into a low area, then entering a detention basin.” Include the features that stay fixed and the changes that must remain visible.

AI can draft the runnable code and revise it through follow-up instructions: “Slow the flow,” “Keep the deposits from the previous stage,” or “Put all three stages in one row.” Similar workflows can explain stormwater routes, sediment movement, changing shade, vegetation succession, or construction phases.

The analysis still needs a designer's judgment. An animation can make an incorrect sequence look convincing. Check whether each change follows from the stated process, whether the spatial relationships remain consistent, and whether the labels accurately describe what is shown.

## Example: explain delta formation in three stages

The example below uses a simplified river-dominated delta with abundant sediment supply and relatively weak wave and tidal influence. It focuses on one mechanism: sediment deposition builds a mouth bar, which redirects flow and supports further deposition at new mouths. Mouth-bar formation and channel splitting are described in [Edmonds and Slingerland's research](https://doi.org/10.1029/2006JF000574).

<div class="animation-example">
  <iframe data-auto-resize="delta" src="../../downloads/html-animation/delta-formation.html?lang=en" title="Three-stage animation of sediment delivery, accumulation, and delta branching" loading="lazy" sandbox="allow-scripts" style="height:850px;"></iframe>
</div>

<p class="figure-caption">Figure 1. An interactive teaching schematic. Select Play to follow the three stages, or drag the sequence control to compare their states. Later panels begin with inherited terrain; completed panels retain their end states. <a href="../../downloads/html-animation/delta-formation.html?lang=en" target="_blank" rel="noopener">Open the animation at full width</a> · <a href="../../downloads/html-animation/delta-formation.html" download>Download the standalone HTML</a>.</p>

### 1. Sediment delivery

Blue flow lines and moving brown particles show the river carrying sediment toward the sea. Beyond the mouth, the flow spreads and slows, and some sediment begins settling onto the bed. The section makes the downward movement visible; the plan shows where the deposits collect.

### 2. Accumulation

Sediment continues arriving, while earlier deposits remain in place. The mouth bar gradually thickens and extends seaward. Keeping a section beside the plan shows that substantial accumulation can occur underwater before land emerges.

### 3. Branching and growth

The raised bar redirects flow toward its sides. Distributary paths develop, and sediment accumulates at the new mouths. The earlier bar remains while additional depositional areas grow farther seaward. This is one simplified pathway of river-dominated delta development; real deltas have more varied patterns and histories.

All three panels use the same viewpoint, palette, and section scale. Blue indicates flow, brown indicates sediment, and pale beige indicates land above water. Hatched areas distinguish submerged deposits from emerged land. The A—A′ section follows the same centerline throughout; the new lateral mouths in stage three are shown in plan.

## Keep the sequence continuous

The most useful instruction is to preserve state: the next stage must start from the previous stage's terrain. Deposited material should not disappear when a panel changes, and land should emerge through accumulation rather than appear as an unrelated shape.

In this demonstration, each prescribed deposition event adds to an existing terrain state. The plan's emerged-land boundary and the section's bed profile are drawn from that same state. Play, pause, reset, and a sequence slider make the explanation inspectable; changing playback speed changes presentation timing.

These are illustrative rules. Flow paths, deposit locations, and accumulation amounts are prescribed for teaching. The code does not solve water flow or sediment-transport equations, and it omits erosion, waves, tides, and compaction. Sustained delta growth depends on sediment supply and removal, alongside other conditions; the [USGS overview of delta sediment budgets](https://pubs.usgs.gov/of/2003/of03-337/rivers-deltas.html) explains why deposition alone does not guarantee continued growth.

For a specific site, use appropriate observations or model outputs to define the changing states. Identify the data source, assumptions, and quantities represented. A smooth animation can communicate a calculation, but its visual plausibility does not validate that calculation.

## A reusable prompt

Use the following prompt with an AI assistant that can create code files. For another landscape process, replace the three stages and specify the features that must persist.

<pre class="prompt-template">
Create a standalone HTML file that uses three sequential animations to explain deposition in a river-dominated delta, for landscape design teaching and a project website.

Show these stages:
1. A river carries sediment into the sea. Flow spreads and slows beyond the mouth, and some particles settle onto the bed.
2. Sediment continues accumulating. Earlier deposits remain, and a submerged mouth bar thickens and extends seaward.
3. The raised bar redirects flow to its sides, forming distributary paths. Deposition continues at the new mouths, extending the delta seaward.

Use the same plan view and a simplified section in each stage. Blue represents flow, brown represents sediment, and pale beige represents land above water. Distinguish submerged deposits from emerged land. Label the section location clearly.

Preserve deposited sediment. Each later stage must inherit the previous terrain. Derive emerged land from the accumulating terrain; do not make it appear independently. Keep the plan and section consistent.

Use a clean analytical diagram style, a white background, and English labels. Arrange the panels horizontally on desktop and vertically on mobile. Include Play, Pause, and Reset buttons, and one sentence explaining each stage. Start paused so the reader chooses when to play.

Use inline SVG, CSS, and JavaScript, with no external assets or libraries. Include accessible control labels and text descriptions of the diagrams.

Display: “Geomorphic process schematic; time and scale are simplified.” State that paths and accumulation are prescribed, not a quantitative simulation. Do not display uncalculated flow rates, sediment quantities, elevations, or dates.

Deliver the complete HTML file. Check transport, settling, accumulation, and branching in the browser; check that deposited material persists, terrain is continuous between stages, and controls work at desktop and mobile widths.
</pre>

Before sharing the result, play it from start to finish and inspect the stage boundaries while paused. Check the arrows, settling direction, inherited deposits, and agreement between plan and section. Then test the controls and read the labels at a phone-sized width. The result should help someone explain the process from the diagram itself.
