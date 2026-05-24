"use client";
/**
 * useClusterAlert — Outbreak Cluster Alert Hook
 * Runs the cluster detection engine against the assessment log
 * and returns any active alerts.
 *
 * Designed to be called from the outbreak dashboard and also from
 * the app-level layout so alerts surface across all pages.
 *
 * @sdgTarget 3.d
 */

import { useState, useEffect, useCallback } from "react";
import { getAllAssessments } from "../lib/storage.js";
import { detectClusters, getRegionCounts } from "../lib/clusterDetection.js";

export function useClusterAlert() {
  const [alerts, setAlerts] = useState([]);
  const [regionCounts, setRegionCounts] = useState({});
  const [lastChecked, setLastChecked] = useState(null);

  const refresh = useCallback(() => {
    const log = getAllAssessments();
    const detected = detectClusters(log);
    const counts = getRegionCounts(log);
    setAlerts(detected);
    setRegionCounts(counts);
    setLastChecked(new Date());
  }, []);

  // Run on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    alerts,
    regionCounts,
    alertCount: alerts.length,
    hasAlerts: alerts.length > 0,
    lastChecked,
    refresh,
  };
}
