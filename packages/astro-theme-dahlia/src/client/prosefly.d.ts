interface ProseflyNamespace {
  dahlia?: {
    initPageActions?: () => void;
    initSidebarScroll?: () => void;
    initTableOfContents?: () => void;
    initThemeModeControls?: () => void;
    themeModeControlReady?: boolean;
    initSearchDialog?: () => void;
    searchDialogReady?: boolean;
    initDocSearch?: () => Promise<void>;
    docSearchReady?: boolean;
    appearanceInitial?: {
      accent: string;
      gray: string;
      radius: string;
      accentLight: string;
      accentDark: string;
    };
    initAppearancePalette?: () => void;
    initMobileDocsNav?: () => void;
    initDropdowns?: () => void;
    initInkeepAssistant?: () => Promise<void>;
    inkeepAssistantReady?: boolean;
  };
}

interface Window {
  __prosefly?: ProseflyNamespace;
}
