import { useCallback, useRef, type PointerEvent } from "react";

type AmbientPointerElement = HTMLElement;

/** Tracks a mouse/pen pointer and exposes coordinates to the ambient CSS effects. */
export function useAmbientPointer<T extends AmbientPointerElement>() {
  const stageRef = useRef<T | null>(null);

  const handlePointerMove = useCallback((event: PointerEvent<T>) => {
    // Avoid expensive pointer lighting on touch devices.
    if (event.pointerType === "touch") return;

    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    stage.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`);
    stage.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`);
  }, []);

  const handlePointerLeave = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    stage.style.setProperty("--cursor-x", "-1000px");
    stage.style.setProperty("--cursor-y", "-1000px");
  }, []);

  return { stageRef, handlePointerMove, handlePointerLeave };
}
