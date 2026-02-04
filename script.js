// theme
const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const saved = localStorage.getItem("theme");
if (saved) root.setAttribute("data-theme", saved);

themeBtn?.addEventListener("click", () => {
  const cur = root.getAttribute("data-theme") || "dark";
  const next = cur === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// progress
const progress = document.getElementById("progress");
function updateProgress() {
  const d = document.documentElement;
  const st = d.scrollTop || document.body.scrollTop;
  const sh = d.scrollHeight - d.clientHeight;
  const p = sh > 0 ? (st / sh) * 100 : 0;
  if (progress) progress.style.width = `${p}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// footer year
document.getElementById("year").textContent = new Date().getFullYear();

// timeline filter
const filterBtns = document.querySelectorAll(".fbtn");
const timelineItems = document.querySelectorAll(".titem");
filterBtns.forEach(btn => btn.addEventListener("click", () => {
  filterBtns.forEach(b => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  const f = btn.dataset.filter;
  timelineItems.forEach(it => {
    const kind = it.dataset.kind;
    it.style.display = (f === "all" || kind === f) ? "" : "none";
  });
}));

// gallery modal
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalCap = document.getElementById("modalCap");
const modalBg = document.getElementById("modalBg");
const modalClose = document.getElementById("modalClose");

function openModal(src, alt) {
  modalImg.src = src;
  modalImg.alt = alt || "";
  modalCap.textContent = alt || "";
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalImg.src = "";
}

document.querySelectorAll(".gitem").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.img, btn.dataset.alt));
});
modalBg?.addEventListener("click", closeModal);
modalClose?.addEventListener("click", closeModal);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

// reveal on scroll (красивое появление секций)
const obs = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) en.target.classList.add("is-in");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => obs.observe(el));

// подсветка активного шага слева
const stepDots = document.querySelectorAll(".stepdot");
const steps = ["step1","step2","step3","step4","step5"].map(id => document.getElementById(id));

const stepObs = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      const id = en.target.id;
      const idx = ["step1","step2","step3","step4","step5"].indexOf(id);
      stepDots.forEach(d => d.classList.remove("is-active"));
      if (idx >= 0) stepDots[idx].classList.add("is-active");
    }
  });
}, { threshold: 0.35 });

steps.forEach(s => s && stepObs.observe(s));

// 3D Tilt Effect for Cards
document.querySelectorAll(".card, .panel, .stat").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -2; // Max rotation deg
    const rotateY = ((x - centerX) / centerX) * 2;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = "transform 0.1s ease";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    card.style.transition = "transform 0.5s ease";
  });
});
