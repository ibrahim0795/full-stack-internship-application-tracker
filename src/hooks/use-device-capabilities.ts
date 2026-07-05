"use client";

import { useSyncExternalStore } from "react";

let cachedWebglSupport: boolean | undefined;
let cachedConstrainedDevice: boolean | undefined;

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

  if (cachedConstrainedDevice === undefined) {
    const navigatorWithMemory = navigator as Navigator & {
      deviceMemory?: number;
    };
    const memory = navigatorWithMemory.deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    cachedConstrainedDevice = memory <= 2 || cores <= 2;
  }

  const compact =
    cachedConstrainedDevice || window.matchMedia("(max-width: 767px)").matches;
  return `${cachedWebglSupport}:${cachedConstrainedDevice}:${compact}`;
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
