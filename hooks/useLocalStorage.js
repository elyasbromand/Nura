"use client";
/**
 * useLocalStorage — SSR-safe persistent React state hook.
 * Reads and writes a value to localStorage, falls back gracefully
 * in server-side rendering contexts.
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - Default value if key is not set
 * @returns {[value, setValue]} Tuple matching React.useState API
 */

import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);

  // Read from localStorage after mount (client-side only)
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch {
      // localStorage unavailable or parse error — use initialValue
    }
  }, [key]);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      // localStorage unavailable — silently fail, state still updates in memory
    }
  };

  return [storedValue, setValue];
}
