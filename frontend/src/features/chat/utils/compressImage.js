const DEFAULT_MAX_DIMENSION = 1600;
const DEFAULT_QUALITY = 0.8;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected file"));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error("Could not load the selected image"));
    img.onload = () => resolve(img);
    img.src = dataUrl;
  });
}

export async function compressImage(
  file,
  { maxDimension = DEFAULT_MAX_DIMENSION, quality = DEFAULT_QUALITY } = {}
) {
  const originalDataUrl = await readFileAsDataUrl(file);

  if (file.type === "image/gif") {
    return originalDataUrl;
  }

  const img = await loadImage(originalDataUrl);
  const largestEdge = Math.max(img.width, img.height);
  const scale = largestEdge > maxDimension ? maxDimension / largestEdge : 1;
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return originalDataUrl;
  ctx.drawImage(img, 0, 0, width, height);

  const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
  return canvas.toDataURL(mimeType, quality);
}

export function estimateDataUrlBytes(dataUrl) {
  const commaIndex = dataUrl.indexOf(",");
  const base64Length = dataUrl.length - commaIndex - 1;
  return Math.ceil(base64Length * 0.75);
}
