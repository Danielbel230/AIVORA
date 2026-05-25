export default function FrascoSVG({ colorHex, codigo }) {
  const colorBase = colorHex || "#8B5E3C";
  const colorClaro = colorBase + "99";
  const colorBrillo = colorBase + "33";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 120 200"
        width="120"
        height="200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tapa */}
        <rect x="42" y="8" width="36" height="18" rx="4"
          fill="#C9A84C" opacity="0.9" />
        <rect x="48" y="4" width="24" height="8" rx="2"
          fill="#C9A84C" />

        {/* Cuello */}
        <rect x="50" y="26" width="20" height="14" rx="2"
          fill={colorBase} opacity="0.85" />

        {/* Cuerpo principal */}
        <rect x="28" y="40" width="64" height="130" rx="12"
          fill={colorBase} opacity="0.75" />

        {/* Brillo lateral izquierdo */}
        <rect x="32" y="48" width="10" height="110" rx="5"
          fill={colorBrillo} opacity="0.6" />

        {/* Brillo central superior */}
        <ellipse cx="60" cy="60" rx="16" ry="8"
          fill="white" opacity="0.08" />

        {/* Reflejo inferior */}
        <rect x="30" y="148" width="60" height="16" rx="6"
          fill={colorClaro} opacity="0.3" />

        {/* Nombre grabado */}
        <text
          x="60" y="115"
          textAnchor="middle"
          fontFamily="serif"
          fontSize="7"
          fill="white"
          opacity="0.7"
          letterSpacing="1"
        >
          AIVORA
        </text>
      </svg>

      {codigo && (
        <p style={{ color: "#C9A84C", fontSize: "10px", letterSpacing: "3px" }}>
          {codigo}
        </p>
      )}
    </div>
  );
}
