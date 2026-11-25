import { useCallback, useRef, useState } from "react";
import { X } from "lucide-react";
import { RELEASE_HISTORY } from "../../shared/changelog";
import { useEscapeKey, useMountEffect } from "../../shared/hooks";
import { UpdateSectionsList } from "./UpdateSectionsList";
import styles from "./ChangelogSheet.module.css";

interface ChangelogSheetProps {
  onClose: () => void;
}

export function ChangelogSheet({ onClose }: ChangelogSheetProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [dragOffset, setDragOffset] = useState<number | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMountEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  });

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      onClose();
    }, 280);
  }, [isClosing, onClose]);

  useEscapeKey(handleClose);

  const handleTouchStart = (e: React.TouchEvent, fromHandle = false) => {
    if (isClosing) return;
    touchStartY.current = e.touches[0].clientY;

    const isAtTop = !contentRef.current || contentRef.current.scrollTop <= 0;
    if (fromHandle || isAtTop) {
      isDragging.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || isClosing) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;

    const isAtTop = !contentRef.current || contentRef.current.scrollTop <= 0;

    if (deltaY > 0 && isAtTop) {
      setDragOffset(deltaY);
    } else {
      setDragOffset(null);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current || isClosing) {
      isDragging.current = false;
      return;
    }
    isDragging.current = false;
    const currentY = e.changedTouches[0].clientY;
    const deltaY = currentY - touchStartY.current;

    setDragOffset(null);

    // Dismiss if dragged down more than 75px
    if (deltaY > 75) {
      handleClose();
    }
  };

  // Only show changelog for actually installed and released versions
  const releases = RELEASE_HISTORY;

  const sheetStyle: React.CSSProperties = {};
  if (dragOffset !== null) {
    sheetStyle.transform = `translateY(${dragOffset}px)`;
    sheetStyle.transition = "none";
  }

  return (
    <div
      className={`${styles.backdrop} ${isClosing ? styles.closing : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={`${styles.sheet} ${dragOffset !== null ? styles.dragging : ""} ${
          isClosing ? styles.closing : ""
        }`}
        style={sheetStyle}
        onTouchStart={(e) => handleTouchStart(e, false)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={styles.handleContainer}
          onTouchStart={(e) => {
            e.stopPropagation();
            handleTouchStart(e, true);
          }}
          onClick={handleClose}
          role="button"
          tabIndex={0}
          aria-label="Dismiss sheet"
        >
          <div className={styles.handle} />
        </div>

        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>What's New</h2>
            <span className={styles.releaseCount}>{releases.length} releases</span>
          </div>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={handleClose}
            aria-label="Close changelog"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.content} ref={contentRef}>
          {releases.map((rel) => (
            <div key={rel.version} className={styles.releaseCard}>
              <div className={styles.releaseHeader}>
                <span className={styles.versionTag}>{rel.version}</span>
                <span className={styles.releaseDate}>{rel.date}</span>
              </div>
              <h3 className={styles.releaseTitle}>{rel.title}</h3>

              {rel.sections && rel.sections.length > 0 ? (
                <UpdateSectionsList sections={rel.sections} />
              ) : (
                <ul className={styles.list}>
                  {(rel.highlights || []).map((h, i) => (
                    <li key={i} className={styles.listItem}>
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
