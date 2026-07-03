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
  const MY_RES_KEY = "bs_my_reservations_v1"; // gift_id -> slepenais tokens (šajā pārlūkā)

  // ---- Manas rezervācijas (glabājas tikai šajā pārlūkā/ierīcē) ----
  function getMyReservations() {
    try { return JSON.parse(localStorage.getItem(MY_RES_KEY)) || {}; }
    catch (_) { return {}; }
  }
  function rememberMyReservation(giftId, token) {
    const mine = getMyReservations();
    mine[giftId] = token;
    try { localStorage.setItem(MY_RES_KEY, JSON.stringify(mine)); } catch (_) {}
  }
  function forgetMyReservation(giftId) {
    const mine = getMyReservations();
    delete mine[giftId];
    try { localStorage.setItem(MY_RES_KEY, JSON.stringify(mine)); } catch (_) {}
  }
  function makeToken() {
    try {
      if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    } catch (_) {}
    return "t-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  }

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
    const subEl = document.getElementById("hero-sub");
    if (t.subtitle) subEl.textContent = t.subtitle;
    else subEl.hidden = true;
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
    // Ielasām tikai gift_id — vārdus (kas rezervēja) citiem viesiem nerādām.
    const { data, error } = await supabase.from("reservations").select("gift_id");
    if (error) {
      console.error(error);
      showStatus("Neizdevās ielādēt rezervācijas. Pārlādē lapu, lūdzu. 🙏");
      return;
    }
    hideStatus();
    (data || []).forEach((row) => {
      reservations[row.gift_id] = true;
    });
  }

  // ---- Dāvanu attēlošana ----
  function renderGifts() {
    grid.innerHTML = "";
    const mine = getMyReservations();
    (CONFIG.gifts || []).forEach((gift) => {
      const isReserved = Boolean(reservations[gift.id]);
      const isMine = Boolean(isReserved && mine[gift.id]);
      const card = document.createElement("article");
      card.className = "gift-card" + (isReserved ? " reserved" : "");

      const linkHtml = buildLinksHtml(gift);

      if (isReserved) {
        // Citiem viesiem rādām tikai "Jau rezervēts". Tikai pats rezervētājs
        // redz, ka tā ir viņa rezervācija, un var to atcelt.
        const mineHtml = isMine
          ? `<div class="reserved-by">Tu to rezervēji 💕</div>
            <button type="button" class="cancel-btn" data-cancel="${escapeAttr(gift.id)}">Atcelt manu rezervāciju</button>`
          : "";
        card.innerHTML = `
          <div class="ribbon">🎀</div>
          <div class="gift-emoji">${gift.emoji || "🎁"}</div>
          <div class="gift-name">${escapeHtml(gift.name)}</div>
          <div class="gift-note">${escapeHtml(gift.note || "")}</div>
          ${linkHtml}
          <div class="gift-action">
            <span class="reserved-badge">✔ Jau rezervēts</span>
            ${mineHtml}
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
    grid.querySelectorAll("button[data-cancel]").forEach((btn) => {
      btn.addEventListener("click", () => cancelReservation(btn.getAttribute("data-cancel")));
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

    const token = makeToken();
    const { error } = await supabase
      .from("reservations")
      .insert({ gift_id: activeGiftId, name: name, token: token });

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
    rememberMyReservation(activeGiftId, token);
    closeModal();
    renderGifts();
  }

  // ---- Rezervācijas atcelšana (tikai pašu izveidoto) ----
  async function cancelReservation(giftId) {
    const token = getMyReservations()[giftId];
    if (!token) return; // šo rezervāciju nav veicis šis pārlūks

    const gift = (CONFIG.gifts || []).find((g) => g.id === giftId);
    const label = gift ? gift.name : "šo dāvanu";
    if (!window.confirm(`Vai tiešām atcelt rezervāciju “${label}”?`)) return;
    if (!supabase) return;

    const { data, error } = await supabase.rpc("cancel_reservation", {
      p_gift_id: giftId,
      p_token: token,
    });

    if (error) {
      console.error(error);
      alert("Neizdevās atcelt rezervāciju. Mēģini vēlreiz, lūdzu. 🙏");
      return;
    }

    if (data === true) {
      delete reservations[giftId];
      forgetMyReservation(giftId);
      renderGifts();
    } else {
      // Tokens nesakrīt — rezervācija droši vien jau ir atcelta vai mainīta.
      forgetMyReservation(giftId);
      await loadReservations();
      renderGifts();
      alert("Šo rezervāciju vairs nevar atcelt (tā jau ir mainīta).");
    }
  }

  // ---- Saišu veidošana (viena vai vairākas saites uz veikalu) ----
  function buildLinksHtml(gift) {
    let items = [];
    if (Array.isArray(gift.links)) {
      items = gift.links.filter((l) => l && l.url);
    } else if (gift.link && String(gift.link).trim()) {
      items = [{ label: "Apskatīt veikalā →", url: gift.link }];
    }
    if (!items.length) return "";
    const inner = items
      .map(
        (l) =>
          `<a class="gift-link" href="${escapeAttr(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label || "Apskatīt veikalā →")}</a>`
      )
      .join("");
    return `<div class="gift-links">${inner}</div>`;
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
