/* =============================================================
   Vēlmju saraksta loģika.
   Datus glabā Supabase tabulā "reservations".
   ============================================================= */

(function () {
  "use strict";

  // ---- Elementi ----
  const lockScreen = document.getElementById("lock-screen");
  const app = document.getElementById("app");
  const passwordForm = document.getElementById("password-form");
  const passwordInput = document.getElementById("password-input");
  const passwordError = document.getElementById("password-error");

  const grid = document.getElementById("gift-grid");
  const statusBox = document.getElementById("status");

  const modal = document.getElementById("claim-modal");
  const modalClose = document.getElementById("modal-close");
  const modalEmoji = document.getElementById("modal-emoji");
  const modalGiftName = document.getElementById("modal-gift-name");
  const claimForm = document.getElementById("claim-form");
  const claimName = document.getElementById("claim-name");
  const claimSubmit = document.getElementById("claim-submit");
  const claimError = document.getElementById("claim-error");

  // ---- Stāvoklis ----
  let supabase = null;
  let reservations = {}; // gift_id -> name
  let activeGiftId = null;
  const SESSION_KEY = "bs_unlocked_v1";

  // ---- Supabase savienojums ----
  function initSupabase() {
    const ok =
      window.supabase &&
      CONFIG.supabaseUrl &&
      !CONFIG.supabaseUrl.includes("AIZPILDI") &&
      CONFIG.supabaseAnonKey &&
      !CONFIG.supabaseAnonKey.includes("AIZPILDI");
    if (!ok) return null;
    try {
      return window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
    } catch (e) {
      console.error("Supabase init kļūda:", e);
      return null;
    }
  }

  // ---- Peldošās sirsniņas ----
  function spawnFloaties() {
    const layer = document.querySelector(".floaties");
    const icons = ["🎀", "💕", "🌸", "🍼", "✨", "👶"];
    for (let i = 0; i < 18; i++) {
      const s = document.createElement("span");
      s.textContent = icons[i % icons.length];
      s.style.left = Math.random() * 100 + "%";
      s.style.fontSize = 16 + Math.random() * 22 + "px";
      s.style.animationDuration = 10 + Math.random() * 16 + "s";
      s.style.animationDelay = Math.random() * 16 + "s";
      layer.appendChild(s);
    }
  }

  // ---- Teksti no config ----
  function applyTexts() {
    const t = CONFIG.texts || {};
    if (t.eventTitle) document.getElementById("eyebrow").textContent = t.eventTitle;
    if (t.subtitle) document.getElementById("hero-sub").textContent = t.subtitle;
    if (t.intro) document.getElementById("hero-intro").textContent = t.intro;
  }

  // ---- Statuss ----
  function showStatus(msg) {
    statusBox.textContent = msg;
    statusBox.hidden = false;
  }
  function hideStatus() {
    statusBox.hidden = true;
  }

  // ---- Rezervāciju ielāde ----
  async function loadReservations() {
    reservations = {};
    if (!supabase) {
      showStatus(
        "⚠️ Datu bāze vēl nav pievienota — rezervācijas pagaidām netiek saglabātas. " +
          "(Aizpildi Supabase datus failā config.js.)"
      );
      return;
    }
    const { data, error } = await supabase.from("reservations").select("gift_id, name");
    if (error) {
      console.error(error);
      showStatus("Neizdevās ielādēt rezervācijas. Pārlādē lapu, lūdzu. 🙏");
      return;
    }
    hideStatus();
    (data || []).forEach((row) => {
      reservations[row.gift_id] = row.name;
    });
  }

  // ---- Dāvanu attēlošana ----
  function renderGifts() {
    grid.innerHTML = "";
    (CONFIG.gifts || []).forEach((gift) => {
      const takenBy = reservations[gift.id];
      const card = document.createElement("article");
      card.className = "gift-card" + (takenBy ? " reserved" : "");

      const linkHtml =
        gift.link && gift.link.trim()
          ? `<a class="gift-link" href="${escapeAttr(gift.link)}" target="_blank" rel="noopener">Apskatīt veikalā →</a>`
          : "";

      if (takenBy) {
        card.innerHTML = `
          <div class="ribbon">🎀</div>
          <div class="gift-emoji">${gift.emoji || "🎁"}</div>
          <div class="gift-name">${escapeHtml(gift.name)}</div>
          <div class="gift-note">${escapeHtml(gift.note || "")}</div>
          ${linkHtml}
          <div class="gift-action">
            <span class="reserved-badge">✔ Jau rezervēts</span>
            <div class="reserved-by">Rūpējas: ${escapeHtml(takenBy)} 💕</div>
          </div>`;
      } else {
        card.innerHTML = `
          <div class="gift-emoji">${gift.emoji || "🎁"}</div>
          <div class="gift-name">${escapeHtml(gift.name)}</div>
          <div class="gift-note">${escapeHtml(gift.note || "")}</div>
          ${linkHtml}
          <div class="gift-action">
            <button type="button" data-gift="${escapeAttr(gift.id)}">Rezervēt 💝</button>
          </div>`;
      }
      grid.appendChild(card);
    });

    grid.querySelectorAll("button[data-gift]").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.getAttribute("data-gift")));
    });
  }

  // ---- Modālis ----
  function openModal(giftId) {
    const gift = (CONFIG.gifts || []).find((g) => g.id === giftId);
    if (!gift) return;
    activeGiftId = giftId;
    modalEmoji.textContent = gift.emoji || "🎁";
    modalGiftName.textContent = gift.name;
    claimName.value = "";
    claimError.hidden = true;
    claimSubmit.disabled = false;
    modal.hidden = false;
    setTimeout(() => claimName.focus(), 50);
  }
  function closeModal() {
    modal.hidden = true;
    activeGiftId = null;
  }

  // ---- Rezervēšana ----
  async function submitClaim(e) {
    e.preventDefault();
    const name = claimName.value.trim();
    if (!name) return;

    if (!supabase) {
      claimError.textContent =
        "Datu bāze vēl nav pievienota, tāpēc rezervāciju nevar saglabāt.";
      claimError.hidden = false;
      return;
    }

    claimSubmit.disabled = true;
    claimError.hidden = true;

    const { error } = await supabase
      .from("reservations")
      .insert({ gift_id: activeGiftId, name: name });

    if (error) {
      // 23505 = unikālā ierobežojuma pārkāpums => kāds paspēja ātrāk
      if (error.code === "23505") {
        claimError.textContent = "Diemžēl kāds tikko paspēja rezervēt šo dāvanu 🙈";
        await loadReservations();
        renderGifts();
      } else {
        console.error(error);
        claimError.textContent = "Kaut kas nogāja greizi. Mēģini vēlreiz, lūdzu.";
      }
      claimError.hidden = false;
      claimSubmit.disabled = false;
      return;
    }

    reservations[activeGiftId] = name;
    closeModal();
    renderGifts();
  }

  // ---- Palīgi (XSS aizsardzība) ----
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }
  function escapeAttr(str) {
    return escapeHtml(str);
  }

  // ---- Parole ----
  async function unlock() {
    lockScreen.hidden = true;
    app.hidden = false;
    applyTexts();
    supabase = initSupabase();
    await loadReservations();
    renderGifts();
  }

  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (passwordInput.value === CONFIG.password) {
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (_) {}
      unlock();
    } else {
      passwordError.hidden = false;
      passwordInput.value = "";
      passwordInput.focus();
    }
  });

  // ---- Notikumi ----
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });
  claimForm.addEventListener("submit", submitClaim);

  // ---- Sākums ----
  spawnFloaties();
  let alreadyIn = false;
  try { alreadyIn = sessionStorage.getItem(SESSION_KEY) === "1"; } catch (_) {}
  if (alreadyIn) {
    unlock();
  } else {
    passwordInput.focus();
  }
})();
