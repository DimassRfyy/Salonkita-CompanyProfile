// Initialize Lucide icons
if (window.lucide) {
  lucide.createIcons();
}

// Navbar scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  if (window.scrollY > 100) {
    navbar.classList.remove("navbar-transparent");
    navbar.classList.add("navbar-scrolled");
  } else {
    navbar.classList.remove("navbar-scrolled");
    navbar.classList.add("navbar-transparent");
  }
});

// Sidebar functions
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  if (sidebar) sidebar.classList.add("active");
  if (overlay) overlay.classList.add("active");
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  if (sidebar) sidebar.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// --- Multi-Language (i18n) Controller ---
let currentLang = "id";
let activeModalType = null;
let currentPlatinumType = "salon";
let currentPlatinumImg = "assets/platinum1.png";
let currentPlatinumTitle = "Platinum Salon Partnership";

function setLanguage(lang) {
  if (!window.translations || !window.translations[lang]) return;
  currentLang = lang;
  try {
    localStorage.setItem("salonkita_lang", lang);
  } catch (e) {}

  document.documentElement.lang = lang;

  // 1. Update text of elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (window.translations[lang] && window.translations[lang][key] !== undefined) {
      const val = window.translations[lang][key];
      if (val.includes("<") && val.includes(">")) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    }
  });

  // 2. Update Switcher buttons visual states (Desktop, Mobile Topbar, Mobile Drawer)
  updateSwitcherButtons(lang);

  // 3. Update Platinum Tab Display with active language
  switchPlatinumTab(currentPlatinumType);

  // 4. If Product Detail Modal is open, update its content in the new language
  const productModal = document.getElementById("productModal");
  if (productModal && !productModal.classList.contains("hidden") && activeModalType) {
    renderProductModalContent(activeModalType);
  }

  // 5. Reinitialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
}

function updateSwitcherButtons(lang) {
  const isId = lang === "id";

  const applyPillStyle = (btn, isActive) => {
    if (!btn) return;
    if (isActive) {
      btn.classList.add("lang-btn-active");
      btn.classList.remove("lang-btn-inactive");
    } else {
      btn.classList.remove("lang-btn-active");
      btn.classList.add("lang-btn-inactive");
    }
  };

  // Desktop switcher
  applyPillStyle(document.getElementById("lang-btn-id"), isId);
  applyPillStyle(document.getElementById("lang-btn-en"), !isId);

  // Mobile Topbar switcher
  applyPillStyle(document.getElementById("lang-topbar-btn-id"), isId);
  applyPillStyle(document.getElementById("lang-topbar-btn-en"), !isId);

  // Mobile Drawer switcher
  const drawerId = document.getElementById("lang-drawer-btn-id");
  const drawerEn = document.getElementById("lang-drawer-btn-en");
  if (drawerId && drawerEn) {
    if (isId) {
      drawerId.className = "px-3 py-1 rounded-lg text-xs font-bold transition-all bg-primary text-white shadow-sm";
      drawerEn.className = "px-3 py-1 rounded-lg text-xs font-bold transition-all text-gray-500 hover:text-gray-900";
    } else {
      drawerId.className = "px-3 py-1 rounded-lg text-xs font-bold transition-all text-gray-500 hover:text-gray-900";
      drawerEn.className = "px-3 py-1 rounded-lg text-xs font-bold transition-all bg-primary text-white shadow-sm";
    }
  }
}

// --- Platinum Card Sub-Tabs ---
function switchPlatinumTab(type) {
  currentPlatinumType = type;
  const tabsData = (window.bilingualPlatinumTabs && window.bilingualPlatinumTabs[currentLang]) 
    ? window.bilingualPlatinumTabs[currentLang] 
    : (window.bilingualPlatinumTabs ? window.bilingualPlatinumTabs["id"] : null);
  
  if (!tabsData || !tabsData[type]) return;
  const item = tabsData[type];

  currentPlatinumImg = item.img;
  currentPlatinumTitle = item.title;

  const imgEl = document.getElementById("platinumCardImg");
  const badgeEl = document.getElementById("platinumImgBadge");
  const priceEl = document.getElementById("platinumImgPrice");

  if (imgEl) {
    imgEl.src = item.img;
    imgEl.onerror = function () {
      this.onerror = null;
      this.src = item.fallback;
    };
  }
  if (badgeEl) badgeEl.textContent = item.badge;
  if (priceEl) priceEl.innerHTML = item.price;

  // Reset tabs style
  ["salon", "academy", "hub"].forEach((t) => {
    const btn = document.getElementById(`btnTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (btn) {
      if (t === type) {
        btn.className = "h-full px-2 rounded-lg text-[11px] font-bold text-slate-900 bg-amber-400 transition-all text-center truncate flex items-center justify-center";
      } else {
        btn.className = "h-full px-2 rounded-lg text-[11px] font-bold text-slate-300 hover:text-white transition-all text-center truncate flex items-center justify-center";
      }
    }
  });
}

// --- Product Detail Modal ---
function openProductModal(type) {
  activeModalType = type;
  renderProductModalContent(type);

  const modal = document.getElementById("productModal");
  const modalCard = document.getElementById("productModalCard");
  if (!modal || !modalCard) return;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
  setTimeout(() => {
    modalCard.classList.remove("scale-95", "opacity-0");
    modalCard.classList.add("scale-100", "opacity-100");
  }, 10);
}

function renderProductModalContent(type) {
  const detailsData = (window.bilingualProductDetails && window.bilingualProductDetails[currentLang])
    ? window.bilingualProductDetails[currentLang]
    : (window.bilingualProductDetails ? window.bilingualProductDetails["id"] : null);
  
  if (!detailsData || !detailsData[type]) return;
  const data = detailsData[type];

  const modalTitle = document.getElementById("modalTitle");
  const modalCategoryBadge = document.getElementById("modalCategoryBadge");
  const modalBody = document.getElementById("modalBody");
  const modalCtaBtn = document.getElementById("modalCtaBtn");

  if (modalTitle) modalTitle.textContent = data.title;
  if (modalCategoryBadge) modalCategoryBadge.textContent = data.badge || (currentLang === "id" ? "Paket Kemitraan" : "Partnership Plan");
  if (modalCtaBtn) {
    modalCtaBtn.textContent = data.ctaText;
    if (type === "basic") {
      modalCtaBtn.href = "https://docs.google.com/forms/d/e/1FAIpQLSevhjNCROd4P04mls0-PMwUI3JTeLZuhcr0-nWawfu1kPNLDg/viewform?usp=header";
      modalCtaBtn.target = "_blank";
      modalCtaBtn.rel = "noopener noreferrer";
    } else {
      modalCtaBtn.href = "#contact";
      modalCtaBtn.removeAttribute("target");
      modalCtaBtn.removeAttribute("rel");
    }
  }

  let contentHtml = "";

  if (type === "platinum") {
    const periodLabel = currentLang === "id" ? "Periode 5 Tahun" : "5-Year Period";
    const headingLabel = currentLang === "id" ? "Pilih Dari 3 Opsi Program Platinum:" : "Choose From 3 Platinum Program Options:";
    contentHtml = `
      <div class="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl border border-slate-700 mb-6">
        <span class="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">${periodLabel}</span>
        <h4 class="text-xl sm:text-2xl font-black mt-3 mb-1 text-white">${data.tagline}</h4>
        <p class="text-slate-300 text-sm leading-relaxed">${data.description}</p>
      </div>

      <div class="space-y-6">
        <h5 class="text-sm font-bold uppercase tracking-wider text-gray-500">${headingLabel}</h5>
        
        <div class="grid grid-cols-1 gap-5">
          ${data.subProducts.map(sub => `
            <div class="bg-white border-2 border-pink-100 hover:border-primary/50 transition-all rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-4">
                <div>
                  <span class="text-xs font-extrabold uppercase text-primary bg-primary/10 px-2.5 py-0.5 rounded-full inline-block mb-1">${sub.badge}</span>
                  <h4 class="text-lg sm:text-xl font-bold text-gray-900">${sub.name}</h4>
                  <p class="text-xs text-gray-500 font-medium">${sub.highlight}</p>
                </div>
                <div class="text-right sm:text-right">
                  <span class="text-xl sm:text-2xl font-black text-gray-900 text-primary">${sub.price}</span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                ${sub.benefits.map(b => `
                  <div class="flex items-start space-x-2.5 text-sm text-gray-700">
                    <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i data-lucide="check" class="w-3.5 h-3.5 stroke-[3]"></i>
                    </div>
                    <span class="leading-tight">${b}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    const benefitHeading = currentLang === "id" ? "Benefit & Keunggulan Program:" : "Program Benefits & Advantages:";
    contentHtml = `
      <div class="bg-pink-50/60 p-6 rounded-2xl border border-pink-100">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          ${data.badge ? `<span class="text-xs font-bold uppercase tracking-wider text-primary bg-white border border-primary/20 px-3 py-1 rounded-full inline-block w-fit">${data.badge}</span>` : '<span></span>'}
          <div class="flex items-baseline">
            <span class="text-3xl font-extrabold text-gray-900">${data.price}</span>
            <span class="text-gray-500 text-sm font-semibold ml-1.5">${data.period}</span>
          </div>
        </div>
        <h4 class="text-lg font-bold text-gray-900 mb-1">${data.tagline}</h4>
        <p class="text-gray-600 text-sm leading-relaxed">${data.description}</p>
      </div>

      <div>
        <h5 class="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">${benefitHeading}</h5>
        <div class="space-y-3">
          ${data.sections[0].items.map(item => `
            <div class="flex items-start space-x-3 p-3.5 rounded-xl bg-gray-50 hover:bg-pink-50/50 border border-gray-100 transition-colors">
              <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i data-lucide="check" class="w-3.5 h-3.5 stroke-[3]"></i>
              </div>
              <span class="text-gray-800 font-medium text-sm leading-snug">${item}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (modalBody) modalBody.innerHTML = contentHtml;
  if (window.lucide) {
    lucide.createIcons();
  }
}

function closeProductModal() {
  activeModalType = null;
  const modal = document.getElementById("productModal");
  const modalCard = document.getElementById("productModalCard");
  if (!modal || !modalCard) return;

  modalCard.classList.remove("scale-100", "opacity-100");
  modalCard.classList.add("scale-95", "opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "auto";
  }, 150);
}

// --- Fullscreen Image Preview ---
function openFullscreenImage(imgSrc, title) {
  const modal = document.getElementById("fullscreenModal");
  const fullImg = document.getElementById("fullscreenImg");
  const titleEl = document.getElementById("fullscreenImageTitle");
  const downloadBtn = document.getElementById("fullscreenDownloadBtn");

  if (!modal || !fullImg) return;

  titleEl.textContent = title || (currentLang === "id" ? "Brosur Produk" : "Product Brochure");
  fullImg.src = imgSrc;
  if (downloadBtn) {
    downloadBtn.href = imgSrc;
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
  if (window.lucide) {
    lucide.createIcons();
  }
}

function closeFullscreenImage() {
  const modal = document.getElementById("fullscreenModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "auto";
}

// Close fullscreen or product modal with Escape key
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeFullscreenImage();
    closeProductModal();
  }
});

// --- Initial Language Loader ---
window.addEventListener("DOMContentLoaded", () => {
  let savedLang = null;
  try {
    savedLang = localStorage.getItem("salonkita_lang");
  } catch (e) {}

  const browserPref = navigator.language && navigator.language.toLowerCase().startsWith("id") ? "id" : "en";
  const initialLang = savedLang || browserPref || "id";
  setLanguage(initialLang);
});

// Explicitly bind to window for HTML onclick handlers
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.setLanguage = setLanguage;
window.switchPlatinumTab = switchPlatinumTab;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.openFullscreenImage = openFullscreenImage;
window.closeFullscreenImage = closeFullscreenImage;
