# Mobile-First QR & Barcode Scanner PWA

A simple, friendly, mobile-first QR & Barcode Scanner and Generator built as a Progressive Web App (PWA).

## Features
- **Instant Live Scanning**: Opens directly into camera mode with no onboarding wall.
- **Offline First**: Works 100% offline via Service Worker caching and local storage.
- **Multi-Format Barcode Support**: QR Code, Data Matrix, Aztec, PDF417, EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39, ITF.
- **Link Safety Inspection**: Real-time URL evaluation with Green ("Looks safe"), Amber ("Be careful"), and Red ("Warning") badges and plain-language explanation gates.
- **Custom QR Generator**: Live preview, dot and color styling, PNG/SVG exports, and contrast check.
- **History & CSV Export**: Local IndexedDB/localStorage history with search, type filters, and favorites.
- **Multi-Language & RTL**: Full English and Arabic support with automatic RTL layout switching.
- **Installable PWA**: Can be saved directly to home screen on iOS Safari, Android Chrome, and Desktop.

## Running Locally

To run the application locally with full camera support:

```bash
# Option 1: Using Python HTTP server
python3 -m http.server 8080

# Option 2: Using Node npx serve
npx serve .
```

Navigate to `http://localhost:8080` in your web browser.

> [!NOTE]
> **HTTPS Requirement**: Mobile web browsers (iOS Safari and Chrome Android) require a secure HTTPS connection or `localhost` to access camera hardware.

## Deploying to Netlify / Vercel

1. Push your repository to GitHub: `https://github.com/sharjeel-maker/qr-code`
2. Connect your GitHub repository to **Netlify** or **Vercel**.
3. Select static site build settings (Publish directory: `./` root).
4. Netlify/Vercel will automatically issue a free SSL certificate (`https://`), allowing seamless camera access on iPhone and Android mobile devices.
