/**
 * Scan & Create - PWA QR & Barcode Application Logic
 */

// Global State
const state = {
  activeTab: 'tab-scan',
  language: 'en',
  theme: 'auto',
  settings: {
    vibration: true,
    beep: true,
    autoOpen: false,
    batchMode: false,
    saveHistory: true
  },
  batchCount: 0,
  lastScannedCode: null,
  lastScannedTime: 0,
  currentResult: null,
  history: [],
  historySegment: 'scanned', // 'scanned' | 'created'
  historyFilter: 'all',
  activeCreateType: 'website',
  html5QrcodeScanner: null,
  qrCodeStyling: null,
  activeCameraId: null,
  flashOn: false,
  isPaused: false
};

// Translations Dictionary (English & Arabic)
const i18n = {
  en: {
    appTitle: "Scan & Create",
    navScan: "Scan",
    navCreate: "Create",
    navHistory: "History",
    hintScan: "Point your camera at a QR code",
    tipFlashlight: "Tip: tap the flashlight in the dark",
    permTitle: "Camera Access Needed",
    permDesc: "We need your camera to scan codes. Nothing is recorded or uploaded anywhere.",
    allowCamera: "Allow Camera",
    scanPhoto: "Scan from photo",
    createTitle: "Create Code",
    typeWebsite: "Website",
    typeText: "Text",
    typeWifi: "Wi-Fi network",
    typeContact: "Contact",
    typePhone: "Phone",
    typeEmail: "Email",
    typeSMS: "SMS",
    typeWhatsapp: "WhatsApp",
    typeLocation: "Location",
    typeBarcode: "Product Barcode",
    lblFgColor: "Foreground",
    lblBgColor: "Background",
    lblDotStyle: "Dot Style",
    btnPng: "Download PNG",
    btnSvg: "Download SVG",
    btnSave: "Save Code",
    historyTitle: "History",
    segScanned: "Scanned",
    segCreated: "Created",
    emptyTitle: "No Scans Yet",
    emptyDesc: "Point your camera at a QR code to get started",
    btnExportCsv: "Export CSV",
    btnClearAll: "Clear All",
    settingsHeading: "Settings",
    lblVib: "Vibration",
    descVib: "Haptic feedback on scan",
    lblBeep: "Beep Sound",
    descBeep: "Audio tone on detection",
    lblAutoOpen: "Open links automatically",
    descAutoOpen: "Directly launch safe websites",
    lblBatch: "Batch Mode Default",
    descBatch: "Continuous scanning mode",
    lblHistorySave: "Save History",
    descHistorySave: "Store scans locally",
    lblLang: "Language",
    lblTheme: "Theme",
    safeGreen: "Looks safe",
    amberWarn: "Be careful",
    redWarn: "Warning: High Risk",
    openAnyway: "Open anyway",
    openLink: "Open link",
    copyPass: "Copy password",
    connectWifi: "Connect Wi-Fi",
    saveContact: "Save contact",
    callNumber: "Call",
    sendSMS: "Send SMS",
    writeEmail: "Write email",
    openMaps: "Open in Maps",
    openWhatsapp: "Open WhatsApp chat",
    searchProduct: "Search product online",
    copyText: "Copy text",
    share: "Share",
    scanAgain: "Scan again",
    copied: "Copied to clipboard!",
    saved: "Saved to History!"
  },
  ar: {
    appTitle: "مسح وإنشاء",
    navScan: "مسح",
    navCreate: "إنشاء",
    navHistory: "السجل",
    hintScan: "وجه الكاميرا نحو رمز QR",
    tipFlashlight: "تلميح: اضغط على الكشاف في الظلام",
    permTitle: "مطلوب الإذن بالكاميرا",
    permDesc: "نحتاج إلى الكاميرا لمسح الرموز. لا يتم تسجيل أو رفع أي شيء.",
    allowCamera: "السماح بالكبس الكاميرا",
    scanPhoto: "مسح من صورة",
    createTitle: "إنشاء رمز",
    typeWebsite: "موقع إلكتروني",
    typeText: "نص",
    typeWifi: "شبكة Wi-Fi",
    typeContact: "جهة اتصال",
    typePhone: "رقم هاتف",
    typeEmail: "بريد إلكتروني",
    typeSMS: "رسالة نصية",
    typeWhatsapp: "واتساب",
    typeLocation: "موقع جغرافي",
    typeBarcode: "باركود منتج",
    lblFgColor: "اللون الأمامي",
    lblBgColor: "اللون الخلفي",
    lblDotStyle: "نمط النقاط",
    btnPng: "تحميل PNG",
    btnSvg: "تحميل SVG",
    btnSave: "حفظ الرمز",
    historyTitle: "السجل",
    segScanned: "الممسوحة",
    segCreated: "المنشأة",
    emptyTitle: "لا توجد عمليات مسح بعد",
    emptyDesc: "وجه الكاميرا نحو رمز QR للبدء",
    btnExportCsv: "تصدير CSV",
    btnClearAll: "مسح الكل",
    settingsHeading: "الإعدادات",
    lblVib: "الاهتزاز",
    descVib: "استجابة لمسية عند المسح",
    lblBeep: "صوت التنبيه",
    descBeep: "نغمة صوتية عند الاكتشاف",
    lblAutoOpen: "فتح الروابط تلقائياً",
    descAutoOpen: "الانتقال مباشرة للمواقف الآمنة",
    lblBatch: "وضع المسح المتعدد",
    descBatch: "استمرار المسح بدون توقف",
    lblHistorySave: "حفظ السجل",
    descHistorySave: "تخزين المسوحات محلياً",
    lblLang: "اللغة",
    lblTheme: "المظهر",
    safeGreen: "يبدو آمناً",
    amberWarn: "توخَ الحذر",
    redWarn: "تحذير: خطر محتمل",
    openAnyway: "الفتح على أي حال",
    openLink: "فتح الرابط",
    copyPass: "نسخ كلمة السر",
    connectWifi: "الاتصال بالشبكة",
    saveContact: "حفظ جهة الاتصال",
    callNumber: "اتصال",
    sendSMS: "إرسال رسالة",
    writeEmail: "كتابة بريد",
    openMaps: "الفتح في الخرائط",
    openWhatsapp: "فتح محادثة واتساب",
    searchProduct: "البحث عن المنتج",
    copyText: "نسخ النص",
    share: "مشاركة",
    scanAgain: "مسح مجدداً",
    copied: "تم النسخ بالحافظة!",
    saved: "تم الحفظ بالسجل!"
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadSavedSettings();
  initPWA();
  initI18n();
  initTabNavigation();
  initScanner();
  initCreateScreen();
  initHistory();
  initSettingsModal();
});

// Load Settings from LocalStorage
function loadSavedSettings() {
  const savedSettings = localStorage.getItem('qr_app_settings');
  if (savedSettings) {
    try {
      Object.assign(state.settings, JSON.parse(savedSettings));
    } catch (e) {}
  }
  
  const savedLang = localStorage.getItem('qr_app_lang');
  if (savedLang) {
    state.language = savedLang;
  } else {
    // Auto detect language
    state.language = navigator.language && navigator.language.startsWith('ar') ? 'ar' : 'en';
  }

  const savedTheme = localStorage.getItem('qr_app_theme') || 'auto';
  state.theme = savedTheme;
  applyTheme(savedTheme);

  const savedHistory = localStorage.getItem('qr_app_history');
  if (savedHistory) {
    try {
      state.history = JSON.parse(savedHistory);
    } catch (e) {}
  }

  // Check first time tooltip
  if (!localStorage.getItem('qr_tooltip_shown')) {
    document.getElementById('first-time-tooltip').style.display = 'flex';
  }
  
  document.getElementById('btn-dismiss-tooltip').addEventListener('click', () => {
    document.getElementById('first-time-tooltip').style.display = 'none';
    localStorage.setItem('qr_tooltip_shown', 'true');
  });
}

// Apply Theme
function applyTheme(theme) {
  if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

// Service Worker PWA Setup
function initPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

// i18n Engine
function initI18n() {
  const t = i18n[state.language];
  document.documentElement.setAttribute('lang', state.language);
  document.documentElement.setAttribute('dir', state.language === 'ar' ? 'rtl' : 'ltr');

  document.getElementById('txt-app-title').textContent = t.appTitle;
  document.getElementById('lbl-nav-scan').textContent = t.navScan;
  document.getElementById('lbl-nav-create').textContent = t.navCreate;
  document.getElementById('lbl-nav-history').textContent = t.navHistory;
  document.getElementById('scan-hint-text').textContent = t.hintScan;
  document.getElementById('txt-perm-title').textContent = t.permTitle;
  document.getElementById('txt-perm-desc').textContent = t.permDesc;
  document.getElementById('btn-allow-camera').textContent = t.allowCamera;
  document.getElementById('btn-perm-upload').textContent = t.scanPhoto;
  document.getElementById('txt-create-title').textContent = t.createTitle;
  document.getElementById('txt-fg-color').textContent = t.lblFgColor;
  document.getElementById('txt-bg-color').textContent = t.lblBgColor;
  document.getElementById('txt-dot-style').textContent = t.lblDotStyle;
  document.getElementById('btn-download-png').textContent = t.btnPng;
  document.getElementById('btn-download-svg').textContent = t.btnSvg;
  document.getElementById('btn-save-created').textContent = t.btnSave;
  document.getElementById('txt-history-title').textContent = t.historyTitle;
  document.getElementById('seg-scanned').textContent = t.segScanned;
  document.getElementById('seg-created').textContent = t.segCreated;
  document.getElementById('txt-empty-title').textContent = t.emptyTitle;
  document.getElementById('txt-empty-desc').textContent = t.emptyDesc;
  document.getElementById('btn-export-csv').textContent = t.btnExportCsv;
  document.getElementById('btn-clear-history').textContent = t.btnClearAll;
  document.getElementById('txt-settings-heading').textContent = t.settingsHeading;
  document.getElementById('lbl-vib').textContent = t.lblVib;
  document.getElementById('desc-vib').textContent = t.descVib;
  document.getElementById('lbl-beep').textContent = t.lblBeep;
  document.getElementById('desc-beep').textContent = t.descBeep;
  document.getElementById('lbl-auto-open').textContent = t.lblAutoOpen;
  document.getElementById('desc-auto-open').textContent = t.descAutoOpen;
  document.getElementById('lbl-batch').textContent = t.lblBatch;
  document.getElementById('desc-batch').textContent = t.descBatch;
  document.getElementById('lbl-history-save').textContent = t.lblHistorySave;
  document.getElementById('desc-history-save').textContent = t.descHistorySave;
  document.getElementById('lbl-lang').textContent = t.lblLang;
  document.getElementById('lbl-theme').textContent = t.lblTheme;

  // Update data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
}

// Tab Switching
function initTabNavigation() {
  const navBtns = document.querySelectorAll('.nav-item');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

  const activeNav = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  const activePane = document.getElementById(tabId);
  if (activeNav) activeNav.classList.add('active');
  if (activePane) activePane.classList.add('active');

  if (tabId === 'tab-scan') {
    startCameraScanner();
  } else {
    stopCameraScanner();
  }

  if (tabId === 'tab-history') {
    renderHistoryList();
  }
}

// 1) SCANNER ENGINE (Html5Qrcode with Fallbacks)
function initScanner() {
  document.getElementById('btn-allow-camera').addEventListener('click', startCameraScanner);
  document.getElementById('btn-perm-upload').addEventListener('click', triggerFileSelect);
  document.getElementById('btn-upload-photo').addEventListener('click', triggerFileSelect);
  document.getElementById('file-photo-input').addEventListener('change', handleFileUpload);
  document.getElementById('btn-flip-camera').addEventListener('click', flipCamera);
  document.getElementById('btn-flash').addEventListener('click', toggleFlashlight);

  // Zoom control
  const zoomSlider = document.getElementById('zoom-slider');
  zoomSlider.addEventListener('input', (e) => {
    if (state.html5QrcodeScanner) {
      state.html5QrcodeScanner.applyVideoConstraints({
        advanced: [{ zoom: parseFloat(e.target.value) }]
      }).catch(() => {});
    }
  });

  // Start camera directly on load
  startCameraScanner();
}

async function startCameraScanner() {
  document.getElementById('perm-overlay').style.display = 'none';

  if (!state.html5QrcodeScanner) {
    state.html5QrcodeScanner = new Html5Qrcode("reader-container");
  }

  // First request getUserMedia permission directly if mediaDevices is available
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      // Release initial stream so html5Qrcode can take control
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.warn("Camera permission request failed or rejected:", err);
    }
  }

  const config = {
    fps: 15,
    qrbox: { width: 250, height: 250 },
    aspectRatio: 1.0,
    experimentalFeatures: {
      useBarCodeDetectorIfSupported: true
    }
  };

  const facingMode = state.activeCameraId ? { deviceId: { exact: state.activeCameraId } } : { facingMode: "environment" };

  state.html5QrcodeScanner.start(
    facingMode,
    config,
    onCodeDetected,
    () => {}
  ).catch(err => {
    // Show permission fallback overlay
    document.getElementById('perm-overlay').style.display = 'flex';
    if (err && err.toString().includes("NotAllowedError")) {
      document.getElementById('perm-help-text').style.display = 'block';
      document.getElementById('perm-help-text').textContent = state.language === 'ar' ? 
        "يرجى تمكين إذن الكاميرا من إعدادات الجهاز أو المتصفح." : 
        "Please enable camera permissions in your device or browser settings.";
    }
  });
}

function stopCameraScanner() {
  if (state.html5QrcodeScanner && state.html5QrcodeScanner.isScanning) {
    state.html5QrcodeScanner.stop().catch(() => {});
  }
}

function flipCamera() {
  if (!state.html5QrcodeScanner) return;
  Html5Qrcode.getCameras().then(cameras => {
    if (cameras && cameras.length > 1) {
      state.activeCameraId = cameras.find(c => c.id !== state.activeCameraId)?.id || cameras[0].id;
      stopCameraScanner();
      setTimeout(startCameraScanner, 200);
    }
  }).catch(() => {});
}

function toggleFlashlight() {
  state.flashOn = !state.flashOn;
  const btn = document.getElementById('btn-flash');
  btn.classList.toggle('active', state.flashOn);

  if (state.html5QrcodeScanner) {
    state.html5QrcodeScanner.applyVideoConstraints({
      advanced: [{ torch: state.flashOn }]
    }).catch(() => {});
  }
}

function triggerFileSelect() {
  document.getElementById('file-photo-input').click();
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const html5Qr = new Html5Qrcode("reader-container");
  html5Qr.scanFile(file, true)
    .then(decodedText => {
      onCodeDetected(decodedText, { result: { format: { formatName: "QR_CODE" } } });
    })
    .catch(() => {
      showToast(state.language === 'ar' ? "لم يتم العثور على رمز في هذه الصورة" : "Couldn't find a code in this photo. Try a clearer image.");
    });
}

// Code Detection Handler
function onCodeDetected(decodedText, result) {
  const now = Date.now();
  // Prevent duplicate triggers within 2 seconds
  if (state.lastScannedCode === decodedText && (now - state.lastScannedTime) < 2000) {
    return;
  }

  state.lastScannedCode = decodedText;
  state.lastScannedTime = now;

  // Feedback Actions
  triggerFeedback();

  const scanFrame = document.getElementById('scan-frame');
  scanFrame.classList.add('detected');
  setTimeout(() => scanFrame.classList.remove('detected'), 600);

  const formatName = result?.result?.format?.formatName || "QR Code";

  // Parse Result Content
  const parsedResult = parseScannedContent(decodedText, formatName);
  state.currentResult = parsedResult;

  // Save to history
  if (state.settings.saveHistory) {
    saveToHistory(parsedResult, 'scanned');
  }

  if (state.settings.batchMode) {
    state.batchCount++;
    const badge = document.getElementById('batch-badge');
    badge.style.display = 'inline-flex';
    badge.textContent = `Batch: ${state.batchCount}`;
    showToast(`Scanned (${state.batchCount})`);
  } else {
    // Show Result Sheet
    showResultSheet(parsedResult);
    if (state.settings.autoOpen && parsedResult.type === 'website' && parsedResult.safetyLevel === 'safe') {
      window.open(parsedResult.content, '_blank');
    }
  }
}

// Feedback: Vibration & Soft Beep
function triggerFeedback() {
  if (state.settings.vibration && navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
  }

  if (state.settings.beep) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  }
}

// 2) RESULT PARSER & SAFETY CHECK
function parseScannedContent(content, format) {
  const res = {
    id: Date.now().toString(),
    content: content,
    format: format,
    timestamp: Date.now(),
    favorite: false,
    type: 'text',
    title: 'Text',
    safetyLevel: 'safe', // 'safe' | 'amber' | 'red'
    safetyReason: ''
  };

  const lower = content.trim().toLowerCase();

  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    res.type = 'website';
    res.title = i18n[state.language].typeWebsite;
    evaluateUrlSafety(content, res);
  } else if (lower.startsWith('wifi:')) {
    res.type = 'wifi';
    res.title = i18n[state.language].typeWifi;
    res.wifiData = parseWifiString(content);
  } else if (lower.startsWith('begin:vcard') || lower.startsWith('begin:mecard')) {
    res.type = 'contact';
    res.title = i18n[state.language].typeContact;
    res.contactData = parseVCardString(content);
  } else if (lower.startsWith('tel:')) {
    res.type = 'phone';
    res.title = i18n[state.language].typePhone;
    res.phoneNum = content.replace('tel:', '');
  } else if (lower.startsWith('mailto:')) {
    res.type = 'email';
    res.title = i18n[state.language].typeEmail;
  } else if (lower.startsWith('smsto:') || lower.startsWith('sms:')) {
    res.type = 'sms';
    res.title = i18n[state.language].typeSMS;
  } else if (lower.startsWith('geo:')) {
    res.type = 'location';
    res.title = i18n[state.language].typeLocation;
  } else if (lower.includes('wa.me') || lower.includes('api.whatsapp.com')) {
    res.type = 'whatsapp';
    res.title = i18n[state.language].typeWhatsapp;
  } else if (/^\d{8,14}$/.test(content.trim())) {
    res.type = 'barcode';
    res.title = i18n[state.language].typeBarcode;
  } else {
    res.type = 'text';
    res.title = i18n[state.language].typeText;
  }

  return res;
}

function evaluateUrlSafety(urlStr, resObj) {
  try {
    const url = new URL(urlStr);
    const host = url.hostname.toLowerCase();

    if (url.protocol === 'http:') {
      resObj.safetyLevel = 'amber';
      resObj.safetyReason = 'Not secure (HTTP connection)';
    } else if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
      resObj.safetyLevel = 'amber';
      resObj.safetyReason = 'IP address instead of domain name';
    } else if (host.startsWith('xn--')) {
      resObj.safetyLevel = 'amber';
      resObj.safetyReason = 'Lookalike / Punycode domain detected';
    } else if (['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'rb.gy'].includes(host)) {
      resObj.safetyLevel = 'amber';
      resObj.safetyReason = 'URL shortener hides original destination';
    } else if (url.pathname.endsWith('.apk') || url.pathname.endsWith('.exe')) {
      resObj.safetyLevel = 'red';
      resObj.safetyReason = 'Warning: Direct executable file download';
    } else {
      resObj.safetyLevel = 'safe';
      resObj.safetyReason = 'Normal secure HTTPS web address';
    }
  } catch (e) {
    resObj.safetyLevel = 'amber';
    resObj.safetyReason = 'Malformed web URL';
  }
}

function parseWifiString(wifiStr) {
  const ssid = wifiStr.match(/S:([^;]+)/)?.[1] || '';
  const pass = wifiStr.match(/P:([^;]+)/)?.[1] || '';
  const type = wifiStr.match(/T:([^;]+)/)?.[1] || 'WPA';
  return { ssid, pass, type };
}

function parseVCardString(vcard) {
  const fn = vcard.match(/FN:([^\r\n]+)/)?.[1] || '';
  const tel = vcard.match(/TEL[;:]*([^\r\n]+)/)?.[1] || '';
  const email = vcard.match(/EMAIL[;:]*([^\r\n]+)/)?.[1] || '';
  const org = vcard.match(/ORG:([^\r\n]+)/)?.[1] || '';
  return { fn, tel, email, org };
}

// RESULT BOTTOM SHEET UI
function showResultSheet(res) {
  const sheet = document.getElementById('result-sheet');
  const backdrop = document.getElementById('sheet-backdrop');
  const t = i18n[state.language];

  document.getElementById('res-type-title').textContent = res.title;
  document.getElementById('res-format-tag').textContent = res.format || 'QR Code';
  document.getElementById('res-content-box').textContent = res.content;

  // Star Icon
  const starIcon = document.getElementById('star-icon');
  starIcon.setAttribute('fill', res.favorite ? 'currentColor' : 'none');

  // Safety Badge
  const safetyBadge = document.getElementById('safety-badge');
  const safetyText = document.getElementById('safety-text');
  if (res.type === 'website') {
    safetyBadge.style.display = 'inline-flex';
    safetyBadge.className = `safety-badge ${res.safetyLevel}`;
    safetyText.textContent = res.safetyLevel === 'safe' ? t.safeGreen : (res.safetyLevel === 'amber' ? t.amberWarn : t.redWarn);
  } else {
    safetyBadge.style.display = 'none';
  }

  // Dynamic Context Actions
  const actionsContainer = document.getElementById('res-actions-container');
  actionsContainer.innerHTML = '';

  if (res.type === 'website') {
    if (res.safetyLevel !== 'safe') {
      const warnInfo = document.createElement('div');
      warnInfo.style.cssText = 'font-size: 0.8rem; color: var(--danger); margin-bottom: 8px; font-weight: 600;';
      warnInfo.textContent = `⚠ ${res.safetyReason}`;
      actionsContainer.appendChild(warnInfo);

      const btnAnyway = document.createElement('button');
      btnAnyway.className = 'btn-primary';
      btnAnyway.textContent = t.openAnyway;
      btnAnyway.onclick = () => window.open(res.content, '_blank');
      actionsContainer.appendChild(btnAnyway);
    } else {
      const btnOpen = document.createElement('button');
      btnOpen.className = 'btn-primary';
      btnOpen.textContent = t.openLink;
      btnOpen.onclick = () => window.open(res.content, '_blank');
      actionsContainer.appendChild(btnOpen);
    }
  } else if (res.type === 'wifi') {
    const btnCopyPass = document.createElement('button');
    btnCopyPass.className = 'btn-primary';
    btnCopyPass.textContent = t.copyPass;
    btnCopyPass.onclick = () => copyToClipboard(res.wifiData?.pass || '');
    actionsContainer.appendChild(btnCopyPass);
  } else if (res.type === 'contact') {
    const btnSaveVcf = document.createElement('button');
    btnSaveVcf.className = 'btn-primary';
    btnSaveVcf.textContent = t.saveContact;
    btnSaveVcf.onclick = () => downloadVCard(res.content);
    actionsContainer.appendChild(btnSaveVcf);
  } else if (res.type === 'phone') {
    const btnCall = document.createElement('button');
    btnCall.className = 'btn-primary';
    btnCall.textContent = t.callNumber;
    btnCall.onclick = () => window.open(`tel:${res.phoneNum}`, '_self');
    actionsContainer.appendChild(btnCall);
  } else if (res.type === 'barcode') {
    const btnSearch = document.createElement('button');
    btnSearch.className = 'btn-primary';
    btnSearch.textContent = t.searchProduct;
    btnSearch.onclick = () => window.open(`https://www.google.com/search?q=${res.content}`, '_blank');
    actionsContainer.appendChild(btnSearch);
  } else {
    const btnCopy = document.createElement('button');
    btnCopy.className = 'btn-primary';
    btnCopy.textContent = t.copyText;
    btnCopy.onclick = () => copyToClipboard(res.content);
    actionsContainer.appendChild(btnCopy);
  }

  sheet.classList.add('open');
  backdrop.classList.add('open');

  backdrop.onclick = hideResultSheet;
  document.getElementById('btn-scan-again').onclick = hideResultSheet;
  document.getElementById('btn-share-result').onclick = () => shareContent(res.content);
  document.getElementById('btn-fav-toggle').onclick = () => {
    res.favorite = !res.favorite;
    starIcon.setAttribute('fill', res.favorite ? 'currentColor' : 'none');
    saveToHistory(res, 'update');
  };
}

function hideResultSheet() {
  document.getElementById('result-sheet').classList.remove('open');
  document.getElementById('sheet-backdrop').classList.remove('open');
}

// 3) CREATE SCREEN ENGINE
function initCreateScreen() {
  const gridCards = document.querySelectorAll('#create-type-grid .type-card');
  gridCards.forEach(card => {
    card.addEventListener('click', () => {
      gridCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.activeCreateType = card.getAttribute('data-type');
      renderCreateFormFields(state.activeCreateType);
    });
  });

  // Accordion Toggle
  const toggle = document.getElementById('accordion-toggle');
  const body = document.getElementById('accordion-body');
  toggle.addEventListener('click', () => {
    body.classList.toggle('open');
  });

  // Color & Style Inputs
  ['qr-color-fg', 'qr-color-bg', 'qr-dot-style'].forEach(id => {
    document.getElementById(id).addEventListener('change', updateQRPreview);
  });

  document.getElementById('btn-download-png').addEventListener('click', () => downloadQRCode('png'));
  document.getElementById('btn-download-svg').addEventListener('click', () => downloadQRCode('svg'));
  document.getElementById('btn-save-created').addEventListener('click', saveCreatedQRCode);

  renderCreateFormFields('website');
}

function renderCreateFormFields(type) {
  const container = document.getElementById('form-fields-container');
  container.innerHTML = '';

  let fieldsHtml = '';

  if (type === 'website') {
    fieldsHtml = `
      <div class="form-group">
        <label class="form-label">Website URL</label>
        <input type="url" id="inp-create-val" class="form-input" placeholder="https://example.com" value="https://example.com">
      </div>`;
  } else if (type === 'wifi') {
    fieldsHtml = `
      <div class="form-group">
        <label class="form-label">Network Name (SSID)</label>
        <input type="text" id="inp-wifi-ssid" class="form-input" placeholder="My Home Wi-Fi">
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input type="password" id="inp-wifi-pass" class="form-input" placeholder="Password">
      </div>`;
  } else if (type === 'contact') {
    fieldsHtml = `
      <div class="form-group">
        <label class="form-label">Full Name</label>
        <input type="text" id="inp-c-name" class="form-input" placeholder="John Doe">
      </div>
      <div class="form-group">
        <label class="form-label">Phone</label>
        <input type="tel" id="inp-c-phone" class="form-input" placeholder="+123456789">
      </div>`;
  } else {
    fieldsHtml = `
      <div class="form-group">
        <label class="form-label">Content</label>
        <textarea id="inp-create-val" class="form-textarea" placeholder="Enter text here..."></textarea>
      </div>`;
  }

  container.innerHTML = fieldsHtml;

  // Add event listeners for live preview
  container.querySelectorAll('input, textarea').forEach(inp => {
    inp.addEventListener('input', updateQRPreview);
  });

  updateQRPreview();
}

function getCreateFormContent() {
  const type = state.activeCreateType;
  if (type === 'wifi') {
    const ssid = document.getElementById('inp-wifi-ssid')?.value || '';
    const pass = document.getElementById('inp-wifi-pass')?.value || '';
    return `WIFI:S:${ssid};T:WPA;P:${pass};;`;
  } else if (type === 'contact') {
    const name = document.getElementById('inp-c-name')?.value || '';
    const phone = document.getElementById('inp-c-phone')?.value || '';
    return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEND:VCARD`;
  } else {
    return document.getElementById('inp-create-val')?.value || 'https://example.com';
  }
}

function updateQRPreview() {
  const content = getCreateFormContent();
  const fg = document.getElementById('qr-color-fg').value;
  const bg = document.getElementById('qr-color-bg').value;
  const style = document.getElementById('qr-dot-style').value;

  const container = document.getElementById('qr-preview-canvas');
  container.innerHTML = '';

  state.qrCodeStyling = new QRCodeStyling({
    width: 200,
    height: 200,
    type: "canvas",
    data: content || "Sample",
    dotsOptions: {
      color: fg,
      type: style
    },
    backgroundOptions: {
      color: bg,
    }
  });

  state.qrCodeStyling.append(container);
}

function downloadQRCode(extension) {
  if (state.qrCodeStyling) {
    state.qrCodeStyling.download({ name: "qr-code", extension: extension });
  }
}

function saveCreatedQRCode() {
  const content = getCreateFormContent();
  const item = {
    id: Date.now().toString(),
    content: content,
    format: 'QR_CODE',
    timestamp: Date.now(),
    favorite: false,
    type: state.activeCreateType,
    title: i18n[state.language][`type${state.activeCreateType.charAt(0).toUpperCase() + state.activeCreateType.slice(1)}`] || 'Created Code'
  };

  saveToHistory(item, 'created');
  showToast(i18n[state.language].saved);
}

// 4) HISTORY ENGINE
function initHistory() {
  document.getElementById('seg-scanned').addEventListener('click', () => {
    state.historySegment = 'scanned';
    document.getElementById('seg-scanned').classList.add('active');
    document.getElementById('seg-created').classList.remove('active');
    renderHistoryList();
  });

  document.getElementById('seg-created').addEventListener('click', () => {
    state.historySegment = 'created';
    document.getElementById('seg-created').classList.add('active');
    document.getElementById('seg-scanned').classList.remove('active');
    renderHistoryList();
  });

  document.getElementById('history-search').addEventListener('input', renderHistoryList);

  document.querySelectorAll('.filter-bar .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-bar .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.historyFilter = chip.getAttribute('data-filter');
      renderHistoryList();
    });
  });

  document.getElementById('btn-export-csv').addEventListener('click', exportHistoryCSV);
  document.getElementById('btn-clear-history').addEventListener('click', clearHistory);
}

function saveToHistory(item, source = 'scanned') {
  item.source = source;
  const existingIdx = state.history.findIndex(h => h.id === item.id);
  if (existingIdx >= 0) {
    state.history[existingIdx] = item;
  } else {
    state.history.unshift(item);
  }
  localStorage.setItem('qr_app_history', JSON.stringify(state.history));
}

function renderHistoryList() {
  const container = document.getElementById('history-list-container');
  const emptyState = document.getElementById('history-empty');
  const searchVal = document.getElementById('history-search').value.toLowerCase();

  let filtered = state.history.filter(h => (h.source || 'scanned') === state.historySegment);

  if (searchVal) {
    filtered = filtered.filter(h => h.content.toLowerCase().includes(searchVal) || h.title.toLowerCase().includes(searchVal));
  }

  if (state.historyFilter === 'fav') {
    filtered = filtered.filter(h => h.favorite);
  } else if (state.historyFilter !== 'all') {
    filtered = filtered.filter(h => h.type === state.historyFilter);
  }

  document.getElementById('history-count').textContent = `${filtered.length} items`;

  if (filtered.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  container.innerHTML = filtered.map(item => `
    <div class="history-item" onclick="onHistoryItemClick('${item.id}')">
      <div class="item-left">
        <div class="item-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
        </div>
        <div class="item-details">
          <div class="item-title">${item.title} ${item.favorite ? '★' : ''}</div>
          <div class="item-preview">${item.content}</div>
          <div class="item-time">${formatTimeAgo(item.timestamp)}</div>
        </div>
      </div>
      <button class="icon-btn" onclick="event.stopPropagation(); deleteHistoryItem('${item.id}')" style="color: var(--danger);">✕</button>
    </div>
  `).join('');
}

function onHistoryItemClick(id) {
  const item = state.history.find(h => h.id === id);
  if (item) {
    showResultSheet(item);
  }
}

function deleteHistoryItem(id) {
  state.history = state.history.filter(h => h.id !== id);
  localStorage.setItem('qr_app_history', JSON.stringify(state.history));
  renderHistoryList();
}

function clearHistory() {
  if (confirm("Are you sure you want to clear all history?")) {
    state.history = [];
    localStorage.removeItem('qr_app_history');
    renderHistoryList();
  }
}

function exportHistoryCSV() {
  if (state.history.length === 0) return;
  let csv = "ID,Type,Content,Format,Timestamp\n";
  state.history.forEach(h => {
    csv += `"${h.id}","${h.type}","${h.content.replace(/"/g, '""')}","${h.format}","${new Date(h.timestamp).toISOString()}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `qr-history-${Date.now()}.csv`;
  a.click();
}

// 5) SETTINGS MODAL
function initSettingsModal() {
  const modal = document.getElementById('settings-backdrop');
  document.getElementById('btn-settings').addEventListener('click', () => modal.classList.add('open'));
  document.getElementById('btn-close-settings').addEventListener('click', () => modal.classList.remove('open'));

  // Toggle Checkboxes
  document.getElementById('set-vibration').checked = state.settings.vibration;
  document.getElementById('set-vibration').addEventListener('change', (e) => {
    state.settings.vibration = e.target.checked;
    saveSettings();
  });

  document.getElementById('set-beep').checked = state.settings.beep;
  document.getElementById('set-beep').addEventListener('change', (e) => {
    state.settings.beep = e.target.checked;
    saveSettings();
  });

  document.getElementById('set-auto-open').checked = state.settings.autoOpen;
  document.getElementById('set-auto-open').addEventListener('change', (e) => {
    state.settings.autoOpen = e.target.checked;
    saveSettings();
  });

  document.getElementById('set-batch').checked = state.settings.batchMode;
  document.getElementById('set-batch').addEventListener('change', (e) => {
    state.settings.batchMode = e.target.checked;
    saveSettings();
  });

  document.getElementById('set-history').checked = state.settings.saveHistory;
  document.getElementById('set-history').addEventListener('change', (e) => {
    state.settings.saveHistory = e.target.checked;
    saveSettings();
  });

  // Language & Theme Selectors
  const langSelect = document.getElementById('set-language');
  langSelect.value = state.language;
  langSelect.addEventListener('change', (e) => {
    state.language = e.target.value;
    localStorage.setItem('qr_app_lang', state.language);
    initI18n();
  });

  const themeSelect = document.getElementById('set-theme');
  themeSelect.value = state.theme;
  themeSelect.addEventListener('change', (e) => {
    state.theme = e.target.value;
    localStorage.setItem('qr_app_theme', state.theme);
    applyTheme(state.theme);
  });

  document.getElementById('btn-purge-data').addEventListener('click', () => {
    if (confirm("Clear all application data and reset settings?")) {
      localStorage.clear();
      location.reload();
    }
  });
}

function saveSettings() {
  localStorage.setItem('qr_app_settings', JSON.stringify(state.settings));
}

// Utility Helpers
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(i18n[state.language].copied);
  });
}

function shareContent(text) {
  if (navigator.share) {
    navigator.share({ text: text }).catch(() => {});
  } else {
    copyToClipboard(text);
  }
}

function downloadVCard(vcardStr) {
  const blob = new Blob([vcardStr], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'contact.vcf';
  a.click();
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function formatTimeAgo(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  return `${Math.floor(diff / 86400)} d ago`;
}
