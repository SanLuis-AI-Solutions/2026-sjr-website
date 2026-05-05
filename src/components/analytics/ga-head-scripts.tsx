type GaHeadScriptsProps = {
  measurementId: string;
};

function buildInlineGaBootstrap(measurementId: string) {
  const encodedMeasurementId = JSON.stringify(measurementId);
  return `
    (function() {
      var measurementId = ${encodedMeasurementId};
      if (!measurementId || typeof window === "undefined") return;

      var allowedHost = window.location.hostname === "www.susiesjewelryrepair.com";
      try {
        window.__sjrGaHostAllowed = allowedHost;
      } catch (error) {}

      window.dataLayer = Array.isArray(window.dataLayer) ? window.dataLayer : [];
      if (typeof window.gtag !== "function") {
        window.gtag = function() { window.dataLayer.push(arguments); };
      }

      if (!allowedHost || window.__sjrGaLoaded) return;
      window.__sjrGaLoaded = true;
      window.gtag("js", new Date());
      window.gtag("config", measurementId, { send_page_view: false });

      var loadGtag = function() {
        if (window.__sjrGaScriptAppended) return;
        window.__sjrGaScriptAppended = true;
        var script = document.createElement("script");
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
        document.head.appendChild(script);
      };

      var scheduleLoad = function() {
        if ("requestIdleCallback" in window) {
          window.requestIdleCallback(loadGtag, { timeout: 3000 });
          return;
        }
        window.setTimeout(loadGtag, 1800);
      };

      if (document.readyState === "complete") {
        scheduleLoad();
      } else {
        window.addEventListener("load", scheduleLoad, { once: true });
      }
    })();
  `;
}

export function GaHeadScripts({ measurementId }: GaHeadScriptsProps) {
  if (!measurementId) return null;

  return (
    <script
      id="ga-head-bootstrap"
      dangerouslySetInnerHTML={{ __html: buildInlineGaBootstrap(measurementId) }}
    />
  );
}
