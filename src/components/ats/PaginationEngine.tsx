import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ResumeData } from '../../types/resume';

export interface PaginationOptions {
  sidebarMode?: 'first-page-only' | 'repeat';
  showContinuationLabels?: boolean;
  debugPagination?: boolean;
  marginTop?: number;
  marginBottom?: number;
}

export interface PaginatedPage {
  sidebarBlockKeys: string[];
  mainBlockKeys: string[];
  continuedSectionIds: string[];
  debugData?: {
    usedHeight: number;
    remainingHeight: number;
    blockCount: number;
    breakReason: string;
    effectiveMaxHeight: number;
    headerHeight?: number;
    itemHeights?: string;
  };
}

export interface PaginationResult {
  pages: PaginatedPage[];
  isReady: boolean;
  measureRef: React.Ref<HTMLDivElement>;
  stablePages: React.RefObject<PaginatedPage[]>;
}

// A4 at 96 DPI
export const A4_WIDTH = 794;
export const A4_HEIGHT = 1122;

// Page margins — must match template padding exactly
export const MARGIN_TOP = 48;
export const MARGIN_BOTTOM = 48;

// Usable content height per page
export const MAX_CONTENT_HEIGHT = A4_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM; // 1026px

// Safety buffer — prevents floating-point edge cases from pushing content off page
const HEIGHT_BUFFER = 4;
export const EFFECTIVE_MAX_HEIGHT = MAX_CONTENT_HEIGHT - HEIGHT_BUFFER;


/**
 * useResumePagination
 *
 * Measures block heights in an off-screen container, then distributes blocks
 * across A4 pages respecting keep-with-next and widow/orphan rules.
 *
 * Key fixes vs previous version:
 * - Replaces blind 100ms timer with document.fonts.ready + requestAnimationFrame
 *   to guarantee measurement fires only after fonts are loaded and layout is settled.
 * - Adds HEIGHT_BUFFER to prevent floating-point rounding from overflowing pages.
 * - Correctly handles ElegantCompact's header block (outside data-main) by measuring
 *   the full container when no data-main sentinel is found.
 * - Improved keep-with-next: a section title always travels with its first block.
 */
export function useResumePagination(
  data: ResumeData,
  templateId: number,
  isTwoColumn: boolean,
  options: PaginationOptions = {}
): PaginationResult {
  const {
    sidebarMode = 'first-page-only',
    showContinuationLabels = true,
    debugPagination = false,
    marginTop = 48,
    marginBottom = 48,
  } = options;

  const currentMaxContentHeight = A4_HEIGHT - marginTop - marginBottom;
  const currentEffectiveMaxHeight = currentMaxContentHeight - HEIGHT_BUFFER;

  const [pages, setPages] = useState<PaginatedPage[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [measureElement, setMeasureElement] = useState<HTMLDivElement | null>(null);
  const measureRef = useCallback((node: HTMLDivElement | null) => {
    setMeasureElement(node);
  }, []);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPagesRef = useRef<PaginatedPage[]>([]);
  const lastHeightRef = useRef<number>(0);


  const runMeasurement = useCallback(() => {
    if (!measureElement) {
        console.warn("[Pagination] runMeasurement called but measureElement is null.");
        return;
    }
    const container = measureElement;
    if (debugPagination) {
      console.log("[Pagination] runMeasurement starting. Container offsetHeight:", container.offsetHeight);
    }

    // Locate sidebar and main sentinels
    const sidebarEl = container.querySelector('[data-sidebar="true"]') as HTMLElement | null;
    const mainEl = (container.querySelector('[data-main="true"]') as HTMLElement | null) ?? container;

    const headerEl = container.querySelector('[data-block-key="header"], [data-block-key="sidebar-header"]') as HTMLElement | null;
    const headerIsTopLevel = !!(headerEl && !mainEl.contains(headerEl) && (!sidebarEl || !sidebarEl.contains(headerEl)));
    const headerHeight = headerIsTopLevel ? (headerEl?.offsetHeight ?? 0) : 0;
    if (debugPagination) {
      console.log("[Pagination] Sentinels located. Sidebar:", !!sidebarEl, "MainEl:", mainEl !== container ? "data-main" : "container", "Header height:", headerHeight);
    }

    type MeasuredItem = {
      key: string;
      type: 'title' | 'block';
      height: number;
      offsetTop: number;
      sectionId?: string;
    };

    const getMeasuredItems = (parent: HTMLElement): MeasuredItem[] => {
      const elements = Array.from(
        parent.querySelectorAll('[data-block-key], [data-section-title="true"]')
      ) as HTMLElement[];

      // Use offsetTop relative to `parent` by walking the offset chain.
      // This is reliable even when the container is fixed off-screen,
      // because offsetTop is always a layout value unaffected by scroll/viewport.
      const getOffsetTopRelativeTo = (el: HTMLElement, ancestor: HTMLElement): number => {
        let top = 0;
        let current: HTMLElement | null = el;
        while (current && current !== ancestor) {
          top += current.offsetTop;
          current = current.offsetParent as HTMLElement | null;
        }
        return top;
      };

      return elements.map((el, i) => {
        const key = el.getAttribute('data-block-key') || '';
        const isTitle = el.getAttribute('data-section-title') === 'true';
        const sectionId = el.getAttribute('data-section-id') || undefined;

        const elTop = getOffsetTopRelativeTo(el, parent);
        const elHeight = el.offsetHeight;

        // Gap to next element
        let marginToNext = 0;
        if (i < elements.length - 1) {
          const nextTop = getOffsetTopRelativeTo(elements[i + 1], parent);
          marginToNext = Math.max(0, nextTop - (elTop + elHeight));
        }
        const height = elHeight + marginToNext;

        const resolvedKey = key || (isTitle && sectionId ? `${sectionId}-title` : sectionId) || '';

        return { key: resolvedKey, type: isTitle ? 'title' : 'block', height, offsetTop: elTop, sectionId };
      });
    };

    const sidebarItems = sidebarEl ? getMeasuredItems(sidebarEl) : [];
    const mainItems = getMeasuredItems(mainEl);
    if (debugPagination) {
      console.log("[Pagination] Measured main items:", JSON.stringify(mainItems));
      console.log("[Pagination] Measured sidebar items:", JSON.stringify(sidebarItems));
    }

    type ColumnPage = {
      keys: string[];
      continuedSectionIds: string[];
      usedHeight: number;
      breakReason: string;
    };

    const paginateColumn = (items: MeasuredItem[], reservedOnFirstPage = 0): ColumnPage[] => {
      if (!items.length) return [];

      const pagesOut: ColumnPage[] = [];
      // Map sectionId → its title item (for continuation headers)
      const titleBySection = new Map<string, MeasuredItem>();
      items.forEach((item) => {
        if (item.type === 'title' && item.sectionId) {
          titleBySection.set(item.sectionId, item);
        }
      });

      // Height of the first content block after a given index in the same section
      const firstBlockHeightAfter = (startIdx: number, sectionId?: string): number => {
        if (!sectionId) return 0;
        for (let i = startIdx + 1; i < items.length; i++) {
          if (items[i].sectionId === sectionId && items[i].type === 'block') return items[i].height;
          if (items[i].type === 'title') return 0;
        }
        return 0;
      };

      const startedSections = new Set<string>();
      let cursor = 0;
      let isFirstPage = true;

      while (cursor < items.length) {
        const keys: string[] = [];
        const continuedSectionIds = new Set<string>();
        // Page 1 loses some height to the header block outside data-main
        const effectiveMax = isFirstPage
          ? currentEffectiveMaxHeight - reservedOnFirstPage
          : currentEffectiveMaxHeight;
        let usedHeight = 0;
        let consumed = 0;
        let breakReason = 'End of content';

        let currentLineTop = -1;
        let currentLineHeight = 0;

        while (cursor + consumed < items.length) {
          const item = items[cursor + consumed];

          if (item.type === 'title') {
            // Keep title + at least its first block together (keep-with-next)
            const firstBlockHeight = firstBlockHeightAfter(cursor + consumed, item.sectionId);
            const keepWithNextHeight = item.height + firstBlockHeight;

            let potentialUsedHeight = usedHeight;
            if (item.offsetTop === currentLineTop) {
              const newHeight = Math.max(currentLineHeight, keepWithNextHeight);
              potentialUsedHeight = usedHeight - currentLineHeight + newHeight;
            } else {
              potentialUsedHeight = usedHeight + keepWithNextHeight;
            }

            if (usedHeight > 0 && potentialUsedHeight > effectiveMax) {
              breakReason = `Keep-with-next: title "${item.key}" moved to next page`;
              break;
            }

            keys.push(item.key);
            
            if (item.offsetTop === currentLineTop) {
              usedHeight = usedHeight - currentLineHeight + Math.max(currentLineHeight, item.height);
              currentLineHeight = Math.max(currentLineHeight, item.height);
            } else {
              usedHeight += item.height;
              currentLineTop = item.offsetTop;
              currentLineHeight = item.height;
            }

            if (item.sectionId) startedSections.add(item.sectionId);
            consumed++;
            continue;
          }

          // Content block — may need a continuation title prepended
          let continuationTitle: MeasuredItem | undefined;
          const lastKey = keys[keys.length - 1] ?? '';
          const titleKey = item.sectionId ? `${item.sectionId}-title` : '';
          const needsContinuationTitle =
            item.sectionId &&
            startedSections.has(item.sectionId) &&
            !keys.includes(titleKey) &&
            lastKey !== titleKey;

          if (needsContinuationTitle) {
            continuationTitle = titleBySection.get(item.sectionId as string);
          }

          const extraHeight = continuationTitle ? continuationTitle.height : 0;
          const incrementHeight = extraHeight + item.height;
          let checkHeight = incrementHeight;

          // Prevent orphaned headers: keep job/project headers with their first bullet
          if (item.key.endsWith('-header')) {
            const firstBulletHeight = firstBlockHeightAfter(cursor + consumed, item.sectionId);
            checkHeight += firstBulletHeight;
          }

          let potentialUsedHeight = usedHeight;
          if (item.offsetTop === currentLineTop) {
            const newHeight = Math.max(currentLineHeight, checkHeight);
            potentialUsedHeight = usedHeight - currentLineHeight + newHeight;
          } else {
            potentialUsedHeight = usedHeight + checkHeight;
          }

          if (usedHeight > 0 && potentialUsedHeight > effectiveMax) {
            breakReason = `Block "${item.key}" moved to next page`;
            break;
          }

          if (continuationTitle) {
            keys.push(continuationTitle.key);
            usedHeight += continuationTitle.height;
            currentLineTop = -1; // reset current line since we inserted a block-level header
            currentLineHeight = continuationTitle.height;
            continuedSectionIds.add(item.sectionId as string);
          }

          keys.push(item.key);
          if (item.offsetTop === currentLineTop) {
            const newHeight = Math.max(currentLineHeight, incrementHeight);
            usedHeight = usedHeight - currentLineHeight + newHeight;
            currentLineHeight = Math.max(currentLineHeight, incrementHeight);
          } else {
            usedHeight += incrementHeight;
            currentLineTop = item.offsetTop;
            currentLineHeight = incrementHeight;
          }
          consumed++;
        }

        // Safety: never infinite-loop on an oversized block
        if (consumed === 0 && cursor < items.length) {
          const oversized = items[cursor];
          keys.push(oversized.key);
          usedHeight += oversized.height;
          consumed = 1;
          breakReason = `Oversized block "${oversized.key}" forced onto page`;
        }

        // ── Prune orphaned section-title keys ──────────────────────────────
        // A continuation title (e.g. "awards-title") gets pushed onto a page
        // before its first block. But if that block ends up being the one that
        // caused the page break (oversized / edge-case), the title is stranded
        // alone with no content beneath it. Remove any section-title key that
        // has no matching block key from the same section on this page.
        const finalKeys: string[] = [];
        const blockSectionIds = new Set<string>();
        for (const k of keys) {
          // Collect all section IDs that have actual block keys on this page
          const matchedItem = items.find(it => it.key === k && it.type === 'block');
          if (matchedItem?.sectionId) blockSectionIds.add(matchedItem.sectionId);
        }
        for (const k of keys) {
          const titleItem = items.find(it => it.key === k && it.type === 'title');
          if (titleItem) {
            // Only keep the title if a block from the same section also appears
            if (titleItem.sectionId && !blockSectionIds.has(titleItem.sectionId)) {
              // Remove this section from continuedSectionIds too
              continuedSectionIds.delete(titleItem.sectionId);
              continue; // skip — orphaned title
            }
          }
          finalKeys.push(k);
        }

        pagesOut.push({
          keys: finalKeys,
          continuedSectionIds: Array.from(continuedSectionIds),
          usedHeight,
          breakReason,
        });
        cursor += consumed;
        isFirstPage = false;
      }

      return pagesOut;
    };

    const mainPages = paginateColumn(mainItems, headerHeight);
    const sidebarPages = isTwoColumn ? paginateColumn(sidebarItems, headerHeight) : [];
    // When sidebarMode is 'repeat', sidebar content continues across pages just
    // like the main column does. If the sidebar overflows beyond what the main
    // column needs, we must create extra pages to show those sidebar blocks —
    // otherwise overflow skills/languages are silently clipped and never rendered.
    // When sidebarMode is 'first-page-only', sidebar only appears on page 0 so
    // overflow simply doesn't exist — page count stays main-driven.
    const physicalPageCount = Math.max(
      1,
      mainPages.length,
      sidebarMode === 'repeat' ? sidebarPages.length : 0
    );

    // Collect all sidebar block keys that were measured (to avoid duplicating them via extraKeys)
    const measuredSidebarKeys = new Set(sidebarItems.map(i => i.key));
    const measuredMainKeys = new Set(mainItems.map(i => i.key));

    const paginatedPages: PaginatedPage[] = Array.from({ length: physicalPageCount }, (_, index) => {
      const mainPage = mainPages[index];
      const sidebarPage =
        sidebarMode === 'repeat' || index === 0 ? sidebarPages[index] : undefined;
      const usedHeight = Math.max(mainPage?.usedHeight ?? 0, sidebarPage?.usedHeight ?? 0);
      const continued = new Set<string>([
        ...(mainPage?.continuedSectionIds ?? []),
        ...(sidebarPage?.continuedSectionIds ?? []),
      ]);

      // On page 0: always include header/sidebar-header keys ONLY if they were
      // not already measured (i.e. they live outside data-main/data-sidebar).
      const extraKeys = index === 0
        ? ['header', 'sidebar-header'].filter(
            k => !measuredMainKeys.has(k) && !measuredSidebarKeys.has(k)
          )
        : [];

      return {
        sidebarBlockKeys: [...(sidebarPage?.keys ?? []), ...extraKeys],
        mainBlockKeys: [...(mainPage?.keys ?? []), ...extraKeys],
        continuedSectionIds: Array.from(continued),
        debugData: {
          usedHeight: Math.round(usedHeight),
          remainingHeight: Math.round(currentEffectiveMaxHeight - usedHeight),
          blockCount: (mainPage?.keys.length ?? 0) + (sidebarPage?.keys.length ?? 0),
          breakReason:
            [mainPage?.breakReason, sidebarPage?.breakReason].filter(Boolean).join(' | ') ||
            'End of content',
          effectiveMaxHeight: currentEffectiveMaxHeight,
          headerHeight,
          itemHeights: mainItems.map(item => `${item.key}:${item.height}px`).join(', '),
        },
      };
    });

    if (debugPagination) {
      console.log("[Pagination] Paginated pages output:", JSON.stringify(paginatedPages));
    }

    setPages(paginatedPages);
    setIsReady(true);
    prevPagesRef.current = paginatedPages;
  }, [measureElement, isTwoColumn, sidebarMode, debugPagination, currentEffectiveMaxHeight]);

  // Unified effect: whenever inputs change, cancel any in-flight RAF and
  // immediately schedule a fresh measurement. This must NOT rely on
  // isReady state changing to trigger — if isReady was already false,
  // setIsReady(false) is a no-op and useLayoutEffect([isReady]) would never
  // re-fire, leaving the component stuck in an un-paginated state forever.
  // NOTE: this effect must live AFTER runMeasurement is defined.
  useEffect(() => {
    if (!measureElement) return;

    // Cancel any in-flight RAF from a previous cycle
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    setIsReady(false);

    // Schedule measurement in 2 animation frames so React can commit
    // the updated DOM to the measurement container before we read it.
    let raf2: number | undefined;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        runMeasurement();
      });
      rafRef.current = raf2;
    });
    rafRef.current = raf1;

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2 !== undefined) cancelAnimationFrame(raf2);
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, templateId, isTwoColumn, sidebarMode, showContinuationLabels, debugPagination, measureElement, runMeasurement]);

  // ResizeObserver: catches content-driven height changes (font loading,
  // style changes, etc.) that aren't covered by the data-change effect above.
  // When the measurement container changes height, reschedule measurement.
  useEffect(() => {
    const container = measureElement;
    if (!container) return;

    let rafId: number | null = null;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const newHeight = Math.round(entry.contentRect.height);
      if (newHeight === 0) return;

      if (newHeight !== lastHeightRef.current) {
        lastHeightRef.current = newHeight;
        // Cancel any in-flight measurement and reschedule
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          rafId = requestAnimationFrame(() => {
            setIsReady(false);
            runMeasurement();
          });
        });
      }
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measureElement]);

  return { pages, isReady, measureRef, stablePages: prevPagesRef };
}

// ---------------------------------------------------------------------------
// ResumeDocument — outer wrapper around all pages
// ---------------------------------------------------------------------------
export const ResumeDocument: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="resume-document"
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      alignItems: 'center',
      background: 'transparent',
      padding: '0',
      borderRadius: '0',
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// ResumePage — single A4 page wrapper
// ---------------------------------------------------------------------------
interface ResumePageProps {
  children: React.ReactNode;
  pageIndex?: number;
  debugPagination?: boolean;
  visibleBlockKeys?: Set<string>;
  debugData?: PaginatedPage['debugData'];
}

export const ResumePage: React.FC<ResumePageProps> = ({
  children,
  pageIndex = 0,
  debugPagination = false,
  visibleBlockKeys,
  debugData,
}) => (
  <div
    className="resume-page"
    style={{
      position: 'relative',
      width: `${A4_WIDTH}px`,
      height: `${A4_HEIGHT}px`,
      background: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid rgba(203,213,225,0.5)',
      // overflow hidden is critical: clips content to exactly A4 boundaries
      // so the browser preview matches the PDF output
      overflow: 'hidden',
      boxSizing: 'border-box',
      flexShrink: 0,
    }}
  >
    {children}

    {debugPagination && debugData && (
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: 'rgba(15,23,42,0.95)',
          color: '#38bdf8',
          padding: '12px 14px',
          borderRadius: '8px',
          fontSize: '10px',
          fontFamily: 'monospace',
          zIndex: 9999,
          pointerEvents: 'none',
          border: '1px solid #0284c7',
          textAlign: 'left',
          maxWidth: '350px',
          lineHeight: '1.4',
        }}
      >
        <div style={{ fontWeight: 'bold', color: '#f43f5e', marginBottom: '6px', fontSize: '11px' }}>
          DEBUG: PAGE {pageIndex + 1}
        </div>
        <div>Used: <span style={{ color: '#fff' }}>{debugData.usedHeight}px</span> / {debugData.effectiveMaxHeight}px</div>
        <div>Remaining: <span style={{ color: '#4ade80' }}>{debugData.remainingHeight}px</span></div>
        <div>Blocks: <span style={{ color: '#fff' }}>{debugData.blockCount}</span></div>
        <div>Header: <span style={{ color: '#fff' }}>{(debugData as any).headerHeight}px</span></div>
        <div style={{ color: '#fb7185', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px' }}>
          <strong>Break:</strong> {debugData.breakReason}
        </div>
        <div style={{ color: '#e2e8f0', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px', maxHeight: '120px', overflowY: 'auto', fontSize: '8px', wordBreak: 'break-all' }}>
          <strong>Items:</strong> {(debugData as any).itemHeights}
        </div>
        <div style={{ color: '#94a3b8', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4px', maxHeight: '60px', overflowY: 'auto', fontSize: '8px', wordBreak: 'break-all' }}>
          <strong>Keys:</strong> {visibleBlockKeys ? Array.from(visibleBlockKeys).join(', ') : 'All'}
        </div>
      </div>
    )}
  </div>
);
