/**
 * RB2B Visitor Identification Script (TypeScript version)
 * Identifies website visitors and pushes to Slack
 */

declare global {
  interface Window {
    reb2b: any;
  }
}

export function initRB2B() {
  (function(key: string) {
    if (window.reb2b) return;
    window.reb2b = { loaded: true };

    const s = document.createElement("script");
    s.async = true;
    s.src = "https://ddwl4m2hdecbv.cloudfront.net/b/" + key + "/" + key + ".js.gz";

    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(s, firstScript);
    }
  })("7N850H5ZP1N1");
}
