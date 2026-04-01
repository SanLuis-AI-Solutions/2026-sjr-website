import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Susie’s Jewelry Repair";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1f1518 0%, #5f212d 55%, #c4a35a 100%)",
          color: "#faf7f2",
          padding: "68px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#e6cf92",
          }}
        >
          <span>Susie’s Jewelry Repair</span>
          <span>Pasadena, TX</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 920 }}>
          <div style={{ fontSize: 84, lineHeight: 1.02, fontWeight: 700 }}>
            In-house craftsmanship for repairs and future heirlooms.
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.35,
              color: "#f3e8d3",
              fontFamily: "Arial",
            }}
          >
            Jewelry repair, watch service, heirloom restoration, and custom design with clear approvals.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 18,
            fontSize: 24,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "Arial",
          }}
        >
          <span>Since 1984</span>
          <span>•</span>
          <span>Same Day/Next Day Service</span>
          <span>•</span>
          <span>susiesjewelryrepair.com</span>
        </div>
      </div>
    ),
    size
  );
}
