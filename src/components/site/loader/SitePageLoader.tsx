import { useEffect, useState, useCallback } from "react";
import PageLoader from "./PageLoader";
import { useSimulatedProgress } from "./useSimulatedProgress";

const DRIVE_MS = 3800;
const FADE_OUT_DELAY_MS = 400;

export function SitePageLoader() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const progress = useSimulatedProgress(DRIVE_MS);

  const dismiss = useCallback(() => {
    setVisible(false);
    const unmountTimer = setTimeout(() => {
      setIsDone(true);
    }, 500);
    return () => clearTimeout(unmountTimer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (progress >= 100) {
      const timer = setTimeout(() => {
        dismiss();
      }, FADE_OUT_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [progress, mounted, dismiss]);

  if (isDone) return null;

  return (
    <PageLoader
      progress={mounted ? progress : 0}
      visible={visible}
      onDismiss={dismiss}
    />
  );
}
