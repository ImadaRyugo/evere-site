import sharp from 'sharp';

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="0%" r="90%">
      <stop offset="0%" stop-color="#f4f4f5" stop-opacity="0.14"/>
      <stop offset="60%" stop-color="#f4f4f5" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="txt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.3" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#f4f4f5" stop-opacity="0.62"/>
    </linearGradient>
    <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="#f4f4f5" fill-opacity="0.08"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#0b0c0e"/>
  <rect width="1200" height="420" fill="url(#dots)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <text x="600" y="300" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="150" font-weight="700" letter-spacing="-4" fill="url(#txt)">Evere</text>
  <text x="600" y="392" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="34" fill="#f4f4f5" fill-opacity="0.55">Split bills, beautifully.</text>
  <g font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#f4f4f5" fill-opacity="0.35" text-anchor="middle">
    <text x="450" y="500">¥</text>
    <text x="510" y="500">$</text>
    <text x="570" y="500">€</text>
    <text x="630" y="500">฿</text>
    <text x="690" y="500">₩</text>
    <text x="750" y="500">£</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(process.argv[2] ?? 'og.png');
console.log('og.png generated');
