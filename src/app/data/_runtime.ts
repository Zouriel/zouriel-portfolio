/**
 * Mutable registry populated at app startup by ContentService.
 * Each data file's exported constant proxies its property reads through this
 * registry, falling back to the bundled defaults when a slot is empty (e.g.
 * during SSR, before content has loaded, or if the fetch failed).
 *
 * Routes through APP_INITIALIZER, so by the time any page renders the
 * registry is already populated with the JSON shipped at /public/content.
 */
export const runtimeContent: {
  settings?: any;
  navigation?: any;
  home?: any;
  military?: any;
  work?: { entries: any[] };
  projects?: { projects: any[]; categories: any[] };
  development?: any;
  education?: any;
} = {};
