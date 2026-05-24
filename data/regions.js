/**
 * Region definitions for outbreak cluster detection.
 * CHWs select their operational region when logging assessments.
 * Used by the cluster detection algorithm to group cases geographically.
 * @sdgTarget 3.d — Strengthen capacity for early warning of health risks
 */

export const REGIONS = [
  { id: "region_north", label: "North district", zone: "north" },
  { id: "region_south", label: "South district", zone: "south" },
  { id: "region_east", label: "East district", zone: "east" },
  { id: "region_west", label: "West district", zone: "west" },
  { id: "region_central", label: "Central district", zone: "central" },
  { id: "region_periurban", label: "Peri-urban zone", zone: "periurban" },
];

export const DEFAULT_REGION = REGIONS[4]; // Central district
