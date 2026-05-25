import html2canvas from "html2canvas";

export async function descargarTarjeta(elementRef, nombreArchivo) {
  const canvas = await html2canvas(elementRef.current, {
    width: 1080,
    height: 1920,
    scale: 1,
    backgroundColor: "#0A0A0A",
    useCORS: true,
  });

  const link = document.createElement("a");
  link.download = `${nombreArchivo || "mi-fragancia-aivora"}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
