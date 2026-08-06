export interface SearchMessages {
  loading: string;
  noResults: string;
  typeToSearch: string;
  unavailable: string;
}

function getMessage(dialog: Element, name: string, fallback: string): string {
  return dialog.getAttribute(name) || fallback;
}

export function getSearchMessages(dialog: Element): SearchMessages {
  return {
    loading: getMessage(dialog, 'data-dahlia-search-loading', 'Loading search index...'),
    noResults: getMessage(dialog, 'data-dahlia-search-no-results', 'No results found.'),
    typeToSearch: getMessage(dialog, 'data-dahlia-search-type-to-search', 'Type to search documentation.'),
    unavailable: getMessage(dialog, 'data-dahlia-search-unavailable', 'Search is unavailable.'),
  };
}
