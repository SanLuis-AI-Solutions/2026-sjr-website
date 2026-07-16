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
      var loadGa = function() {
        if (window.__sjrGaLoaded) return;
        window.__sjrGaLoaded = true;
        window.gtag("js", new Date());
        window.gtag("config", measurementId, { send_page_view: false });

        var script = document.createElement("script");
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
        document.head.appendChild(script);
      };

      var queued = false;
      var queueLoad = function() {
        if (queued || window.__sjrGaLoaded) return;
        queued = true;
        if (window.requestIdleCallback) {
          window.requestIdleCallback(loadGa, { timeout: 3000 });
          return;
        }
        window.setTimeout(loadGa, 1200);
      };

      var loadOnInteraction = function() {
        window.removeEventListener("pointerdown", loadOnInteraction);
        window.removeEventListener("keydown", loadOnInteraction);
        window.removeEventListener("touchstart", loadOnInteraction);
        queueLoad();
      };

      window.addEventListener("pointerdown", loadOnInteraction, { once: true, passive: true });
      window.addEventListener("keydown", loadOnInteraction, { once: true });
      window.addEventListener("touchstart", loadOnInteraction, { once: true, passive: true });

      if (document.readyState === "complete") {
        queueLoad();
        return;
      }

      window.addEventListener("load", queueLoad, { once: true });
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
