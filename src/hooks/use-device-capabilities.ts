"use client";

import { useSyncExternalStore } from "react";

let cachedWebglSupport: boolean | undefined;

export function isConstrainedDevice({
  cores,
  effectiveType,
  memory,
  saveData,
}: {
  cores: number;
  effectiveType?: string;
  memory: number;
  saveData?: boolean;
}) {
  return (
    memory <= 2 ||
    cores <= 2 ||
    saveData === true ||
    effectiveType === "slow-2g" ||
    effectiveType === "2g"
  );
}

function subscribeToCapabilities(callback: () => void) {
  const compactQuery = window.matchMedia("(max-width: 767px)");
  compactQuery.addEventListener("change", callback);
  return () => compactQuery.removeEventListener("change", callback);
}

function detectCapabilities() {
  if (cachedWebglSupport === undefined) {
    const canvas = document.createElement("canvas");
    cachedWebglSupport = Boolean(
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }),
    );
  }

  const navigatorWithCapabilities = navigator as Navigator & {
    connection?: { effectiveType?: string; saveData?: boolean };
    deviceMemory?: number;
  };
  const constrained = isConstrainedDevice({
    cores: navigator.hardwareConcurrency ?? 8,
    effectiveType: navigatorWithCapabilities.connection?.effectiveType,
    memory: navigatorWithCapabilities.deviceMemory ?? 8,
    saveData: navigatorWithCapabilities.connection?.saveData,
  });

  const compact =
    constrained || window.matchMedia("(max-width: 767px)").matches;
  return `${cachedWebglSupport}:${constrained}:${compact}`;
}

function getServerCapabilities() {
  return "false:false:false";
}

export function useDeviceCapabilities() {
  const snapshot = useSyncExternalStore(
    subscribeToCapabilities,
    detectCapabilities,
    getServerCapabilities,
  );
  const [webglSupported, constrained, compact] = snapshot
    .split(":")
    .map((value) => value === "true");

  return { compact, constrained, webglSupported };
}
