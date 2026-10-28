import { useEffect } from "react";

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  handler: () => void;
}

export function useKeyboard(shortcuts: KeyboardShortcut[]): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      for (const shortcut of shortcuts) {
        if (event.key.toLowerCase() !== shortcut.key.toLowerCase()) continue;

        if (shortcut.ctrl && !event.ctrlKey) continue;
        if (shortcut.meta && !event.metaKey) continue;
        if (shortcut.shift && !event.shiftKey) continue;

        // If ctrl/meta is specified, require it; if not, require it's not pressed
        if (shortcut.ctrl !== undefined && shortcut.ctrl !== event.ctrlKey)
          continue;
        if (shortcut.meta !== undefined && shortcut.meta !== event.metaKey)
          continue;

        event.preventDefault();
        shortcut.handler();
        return;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);
}
