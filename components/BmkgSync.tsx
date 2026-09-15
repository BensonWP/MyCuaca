"use client";

import { useEffect, useRef } from "react";
import { useBmkg } from "@/app/bmkg-provider";

// Satu lokasi aktif: pilihan wilayah BMKG menggerakkan modul global.
export default function BmkgSync() {
  const { adm4 } = useBmkg();
  const lastSyncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastSyncedRef.current === null) {
      lastSyncedRef.current = adm4;
      return;
    }
    if (lastSyncedRef.current === adm4) return;
    lastSyncedRef.current = adm4;
  }, [adm4]);

  return null;
}
