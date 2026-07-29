const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createOgImage() {
  const width = 1200;
  const height = 630;

  // Extract DM logo symbol from translucent logo
  const logoSymbol = await sharp('public/images/daxo-mart-new-logo-transparent.png')
    .extract({ left: 0, top: 0, width: 500, height: 576 })
    .resize(360, 360, { fit: 'contain' })
    .toBuffer();

  const svgOverlay = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0a0b10" />
          <stop offset="50%" stop-color="#161922" />
          <stop offset="100%" stop-color="#0d0e14" />
        </linearGradient>

        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#F59E0B" />
          <stop offset="50%" stop-color="#FBBF24" />
          <stop offset="100%" stop-color="#D97706" />
        </linearGradient>

        <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#E2E8F0" />
          <stop offset="100%" stop-color="#94A3B8" />
        </linearGradient>
      </defs>

      <!-- Dark Luxury Background -->
      <rect width="${width}" height="${height}" fill="url(#bg)" />
      
      <!-- Outer Frame Border -->
      <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-opacity="0.4" />

      <!-- Text Content Side -->
      <g transform="translate(450, 160)">
        <!-- Store Name Header -->
        <text x="0" y="55" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="bold" letter-spacing="2" fill="url(#goldGrad)">
          DAXO-MART
        </text>
        
        <text x="0" y="98" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="600" letter-spacing="3" fill="url(#silverGrad)">
          DIECAST SCALE MODELS &amp; RC CAR STORE
        </text>

        <!-- Separator -->
        <line x1="0" y1="125" x2="660" y2="125" stroke="#334155" stroke-width="2" />

        <!-- Subtitle / Niche Focus -->
        <text x="0" y="175" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="normal" fill="#E2E8F0">
          Premium 1:32, 1:24, 1:18 Metal Cars &amp; RC Racing Vehicles
        </text>

        <!-- Badges -->
        <g transform="translate(0, 225)">
          <!-- Pill 1 -->
          <rect x="0" y="0" width="180" height="42" rx="21" fill="#1e293b" stroke="#d97706" stroke-opacity="0.6" stroke-width="1.5" />
          <text x="90" y="26" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" fill="#FBBF24" text-anchor="middle">Fast Express Delivery</text>

          <!-- Pill 2 -->
          <rect x="195" y="0" width="210" height="42" rx="21" fill="#1e293b" stroke="#3b82f6" stroke-opacity="0.6" stroke-width="1.5" />
          <text x="300" y="26" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" fill="#60A5FA" text-anchor="middle">100% Quality Checked</text>

          <!-- Pill 3 -->
          <rect x="420" y="0" width="210" height="42" rx="21" fill="#1e293b" stroke="#10b981" stroke-opacity="0.6" stroke-width="1.5" />
          <text x="525" y="26" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" fill="#34D399" text-anchor="middle">Collector Grade Quality</text>
        </g>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(svgOverlay))
    .composite([{ input: logoSymbol, left: 65, top: 135 }])
    .png()
    .toFile('public/og-image.png');

  fs.copyFileSync('public/og-image.png', 'app/opengraph-image.png');
  console.log('Niche focused OG Image generated successfully!');
}

createOgImage().catch(console.error);
