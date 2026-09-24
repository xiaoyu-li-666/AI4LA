---
title: "Where AI fits in a GIS workflow"
description: "Use AI to clarify analysis steps while keeping the spatial data and validation visible."
stage: analysis
published: 2026-09-22
---

## Define the question first

Before asking AI for GIS code, specify the design question, study area, unit of analysis, input layers, coordinate system, and expected output. A question such as “Which blocks have limited access to shade?” needs a definition of shade and a distance or time threshold.

## Give AI a narrow task

Ask for a short script to inspect fields, check geometry validity, or calculate one variable at a time. Include sample column names and the software version. Run the script on a small area before applying it to the full dataset.

## Verify spatial results

Check coordinate systems, units, missing geometries, joins, and at least a few values against the original map. A plausible map can still be wrong if a distance was calculated in degrees or a join duplicated features.

Write these checks into your article or project notes. A reader should be able to see which input produced each map and which decisions were made by the designer.
