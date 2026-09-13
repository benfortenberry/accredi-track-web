// crude oklch -> sRGB relative luminance -> contrast vs white, sanity-check AA (>=4.5).
function oklchToLin(L, C, H) {
  const hr = (H * Math.PI) / 180;
  const a = Math.cos(hr) * C, b = Math.sin(hr) * C;
  let l = L + 0.3963377774 * a + 0.2158037573 * b;
  let m = L - 0.1055613458 * a - 0.0638541728 * b;
  let s = L - 0.0894841775 * a - 1.2914855480 * b;
  l = l ** 3; m = m ** 3; s = s ** 3;
  const R = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const G = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const B = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  return [R, G, B];
}
function srgb(c) {
  c = Math.max(0, Math.min(1, c));
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}
function lin(c) {
  c = Math.max(0, Math.min(1, c));
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function relLum(L, C, H) {
  const [r, g, b] = oklchToLin(L, C, H).map(srgb).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastWhite(L, C, H) {
  return (1.05) / (relLum(L, C, H) + 0.05);
}
const items = {
  success: [0.52, 0.14, 150],
  warning: [0.54, 0.13, 70],
  error: [0.52, 0.19, 25],
};
for (const k in items) {
  const [L, C, H] = items[k];
  const c = contrastWhite(L, C, H);
  console.log(k, c.toFixed(2), c >= 4.5 ? "PASS AA" : (c >= 3 ? "AA large only" : "FAIL"));
}
