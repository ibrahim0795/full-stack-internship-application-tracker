"use client";

import { useSyncExternalStore } from "react";

const motionStorageKey = "careerorbit-reduce-motion";
const motionPreferenceEvent = "careerorbit:motion-preference";

function subscribeToMotionPreference(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handleChange = () => callback();

  mediaQuery.addEventListener("change", handleChange);
  window.addEventListener("storage", handleChange);
  window.addEventListener(motionPreferenceEvent, handleChange);

  return () => {
    mediaQuery.removeEventListener("change", handleChange);
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(motionPreferenceEvent, handleChange);
  };
}

function getMotionSnapshot() {
  const systemReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  let userReduced = false;

  try {
    userReduced = window.localStorage.getItem(motionStorageKey) === "true";
  } catch {
    userReduced = false;
  }

  return `${systemReduced}:${userReduced}`;
}

function getServerMotionSnapshot() {
  return "false:false";
}

export function useMotionPreference() {
  const snapshot = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionSnapshot,
    getServerMotionSnapshot,
  );
  const [systemReduced, userReduced] = snapshot
    .split(":")
    .map((value) => value === "true");

  return {
    reduceMotion: systemReduced || userReduced,
    systemReduced,
    userReduced,
  };
}

export function setUserReducedMotion(reduceMotion: boolean) {
  try {
    window.localStorage.setItem(motionStorageKey, String(reduceMotion));
  } catch {
    // The current page can still honour the system preference when storage is unavailable.
  }

  window.dispatchEvent(new Event(motionPreferenceEvent));
}
