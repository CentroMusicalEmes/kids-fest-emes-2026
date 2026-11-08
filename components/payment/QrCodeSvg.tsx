import QRCode from "qrcode";

/**
 * Renderiza o QR Code como SVG puro a partir do payload real.
 * Sem efeitos nem canvas: o mesmo resultado no servidor e no cliente.
 */
export function QrCodeSvg({ value, label }: { value: string; label: string }) {
  const qr = QRCode.create(value, { errorCorrectionLevel: "M" });
  const { size, data } = qr.modules;
  const quiet = 4;
  const total = size + quiet * 2;

  let path = "";
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (data[row * size + col]) path += `M${col + quiet} ${row + quiet}h1v1h-1z`;
    }
  }

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${total} ${total}`}
      shapeRendering="crispEdges"
      className="h-auto w-full"
    >
      <rect width={total} height={total} fill="#ffffff" />
      <path d={path} fill="#160833" />
    </svg>
  );
}
