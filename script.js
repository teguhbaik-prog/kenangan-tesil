/* =================================================
   🔐 PASSWORD LOGIC
================================================= */
const PASSWORD = "sayang"; // ganti bebas

const passwordPage = document.getElementById("password-page");
const app = document.getElementById("app");
const passwordInput = document.getElementById("passwordInput");
const passwordSubmit = document.getElementById("passwordSubmit");

passwordSubmit.addEventListener("click", () => {
  if (passwordInput.value === PASSWORD) {
    passwordPage.style.display = "none";
    app.hidden = false;
  } else {
    passwordInput.value = "";
    passwordInput.placeholder = "Password salah 😢";
  }
});

/* =================================================
   🌙 DAY / NIGHT MODE
================================================= */
const themeToggle = document.getElementById("themeToggle");

function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = document.body.dataset.theme;
  setTheme(current === "dark" ? "light" : "dark");
});

/* =================================================
   🧠 DATA ARSIP KENANGAN (SCALABLE)
================================================= */
const memories = [
  {
    year: 2022,
    theme: "#FFD6E8",
    story: "Tahun awal kita saling kenal dan mulai dekat.",
    stickers: ["dudu1.png", "bubu1.png"],
    categories: {
      freefire: {
        photos: ["ff1.webp", "ff2.webp"],
        videos: ["ff1.mp4"],
        audios: ["ff_theme.mp3"]
      },
      roblox: {
        photos: ["rb1.webp"],
        videos: [],
        audios: []
      },
      reallife: {
        photos: ["rl1.webp"],
        videos: ["rl1.mp4"],
        audios: ["rl1.mp3"]
      }
    }
  },
  {
    year: 2023,
    theme: "#E0C3FC",
    story: "Tahun penuh tawa, game, dan janji.",
    stickers: ["dudu2.png", "bubu2.png"],
    categories: {
      freefire: { photos: [], videos: [], audios: [] },
      roblox: { photos: [], videos: [], audios: [] },
      reallife: { photos: [], videos: [], audios: [] }
    }
  }
];

/* =================================================
   🗓️ YEAR NAVIGATION
================================================= */
const yearNav = document.getElementById("year-navigation");
const yearsContainer = document.getElementById("years-container");

memories.forEach(memory => {
  // tombol navigasi tahun
  const btn = document.createElement("button");
  btn.className = "year-button";
  btn.textContent = memory.year;
  btn.addEventListener("click", () => {
    document
      .getElementById(`year-${memory.year}`)
      .scrollIntoView({ behavior: "smooth" });
  });
  yearNav.appendChild(btn);

  // section tahun
  const section = document.createElement("section");
  section.className = "year-section";
  section.id = `year-${memory.year}`;
  section.style.setProperty("--accent-main", memory.theme);

  section.innerHTML = `
    <h2>${memory.year}</h2>
    <p class="year-story">${memory.story}</p>
  `;

  // kategori per dunia
  Object.entries(memory.categories).forEach(([key, data]) => {
    const category = document.createElement("div");
    category.className = "category";

    category.innerHTML = `
      <h3>${key.toUpperCase()}</h3>
      <div class="slider"></div>
    `;

    const slider = category.querySelector(".slider");

    // foto
    data.photos.forEach(file => {
      const img = document.createElement("img");
      img.dataset.src = `/media/${memory.year}/${key}/${file}`;
      img.alt = `${memory.year} ${key}`;
      img.loading = "lazy";
      slider.appendChild(img);
      observer.observe(img);
    });

    // video
    data.videos.forEach(file => {
      const video = document.createElement("video");
      video.controls = true;
      video.preload = "none";
      video.dataset.src = `/media/${memory.year}/${key}/${file}`;
      slider.appendChild(video);
      observer.observe(video);
    });

    section.appendChild(category);
  });

  yearsContainer.appendChild(section);
});

/* =================================================
   👀 INTERSECTION OBSERVER (LAZY LOAD)
================================================= */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;

      if (el.tagName === "IMG") {
        el.src = el.dataset.src;
      }

      if (el.tagName === "VIDEO") {
        el.src = el.dataset.src;
      }

      observer.unobserve(el);
    });
  },
  {
    threshold: 0.2
  }
);

/* =================================================
   🎬 LANDING BUTTON
================================================= */
const startBtn = document.getElementById("startJourney");

startBtn.addEventListener("click", () => {
  yearNav.scrollIntoView({ behavior: "smooth" });
});
/* =================================================
   🎵 STEP 2 — AUDIO PLAYER & PLAYLIST
================================================= */

// elemen audio
const audioPlayer = document.getElementById("audioPlayer");
const audioTitle = document.getElementById("audio-title");

// helper: format judul audio
function formatAudioTitle(year, category, file) {
  const name = file
    .replace(".mp3", "")
    .replace(/_/g, " ");
  return `${year} • ${category.toUpperCase()} • ${name}`;
}

// render tombol audio per kategori
memories.forEach(memory => {
  Object.entries(memory.categories).forEach(([category, data]) => {
    if (!data.audios || data.audios.length === 0) return;

    const yearSection = document.getElementById(`year-${memory.year}`);
    if (!yearSection) return;

    // cari category div yang sesuai
    const categoryBlocks = yearSection.querySelectorAll(".category");
    let targetCategory = null;

    categoryBlocks.forEach(block => {
      const title = block.querySelector("h3");
      if (title && title.textContent === category.toUpperCase()) {
        targetCategory = block;
      }
    });

    if (!targetCategory) return;

    // container audio buttons
    const audioContainer = document.createElement("div");
    audioContainer.className = "audio-list";

    data.audios.forEach(file => {
      const btn = document.createElement("button");
      btn.className = "audio-button";
      btn.textContent = "🎵 Putar Audio";

      btn.addEventListener("click", () => {
        const src = `/media/${memory.year}/${category}/${file}`;

        // ganti audio hanya jika berbeda
        if (audioPlayer.src !== src) {
          audioPlayer.src = src;
        }

        audioTitle.textContent =
          formatAudioTitle(memory.year, category, file);

        audioPlayer.play().catch(() => {
          // play gagal (misal belum interaksi user)
        });
      });

      audioContainer.appendChild(btn);
    });

    targetCategory.appendChild(audioContainer);
  });
});

/* =================================================
   🎧 AUDIO STATE HANDLER (OPSIONAL AMAN)
================================================= */

// update title saat audio selesai
audioPlayer.addEventListener("ended", () => {
  audioTitle.textContent = "Audio selesai 🎶";
});

// jika audio di-pause manual
audioPlayer.addEventListener("pause", () => {
  if (!audioPlayer.ended) {
    audioTitle.textContent += " (paused)";
  }
});
/* =================================================
   🎂 STEP 3 — BIRTHDAY & ANNIVERSARY MODE
================================================= */

/**
 * KONFIGURASI TANGGAL SPESIAL
 * month: 0–11 (Januari = 0)
 */
const specialDates = {
  birthday: {
    month: 7, // Agustus
    date: 16,
    title: "Selamat Ulang Tahun 🤍",
    message:
      "Hari ini bukan hari biasa. Ini hari lahirmu, dan aku bersyukur kamu lahir ke dunia."
  },
  anniversary: {
    month: 10, // November
    date: 3,
    title: "Happy Anniversary 💍",
    message:
      "Terima kasih sudah berjalan sejauh ini. Tahun demi tahun, kamu tetap pilih aku."
  }
};

// ambil tanggal hari ini
const today = new Date();
const todayMonth = today.getMonth();
const todayDate = today.getDate();

/* =================================================
   🎉 CEK MODE AKTIF
================================================= */
let activeSpecial = null;

Object.values(specialDates).forEach(event => {
  if (event.month === todayMonth && event.date === todayDate) {
    activeSpecial = event;
  }
});

/* =================================================
   ✨ AKTIFKAN MODE SPESIAL
================================================= */
if (activeSpecial) {
  activateSpecialMode(activeSpecial);
}

function activateSpecialMode(event) {
  // 1. ubah tema sementara
  document.body.style.background =
    "linear-gradient(135deg, #ffd6e8, #cdb4db)";

  // 2. banner spesial
  const banner = document.createElement("section");
  banner.className = "page page-special";
  banner.innerHTML = `
    <h1>${event.title}</h1>
    <p>${event.message}</p>
  `;

  // 3. sisipkan setelah landing
  const landing = document.getElementById("landing");
  landing.after(banner);

  // 4. animasi lembut
  banner.animate(
    [
      { opacity: 0, transform: "translateY(20px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    {
      duration: 1500,
      easing: "ease"
    }
  );

  // 5. update love letter jika ada
  const loveLetterText = document.getElementById("love-letter-text");
  if (loveLetterText) {
    loveLetterText.textContent =
      event.message + " 🤍";
  }
}
/* =================================================
   🗓️ STEP 4 — YEAR ANIMATION & ACTIVE NAV
================================================= */

// ambil semua section tahun & tombol nav
const yearSections = document.querySelectorAll(".year-section");
const yearButtons = document.querySelectorAll(".year-button");

// helper: set tombol tahun aktif
function setActiveYear(yearId) {
  yearButtons.forEach(btn => {
    btn.classList.toggle(
      "active",
      btn.textContent === yearId
    );
  });
}

/* =================================================
   ✨ ANIMASI MASUK TAHUN
================================================= */
const yearObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const section = entry.target;
      const year = section.id.replace("year-", "");

      if (entry.isIntersecting) {
        // animasi masuk
        section.animate(
          [
            { opacity: 0, transform: "translateY(30px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          {
            duration: 900,
            easing: "ease",
            fill: "forwards"
          }
        );

        // set nav aktif
        setActiveYear(year);
      }
    });
  },
  {
    threshold: 0.35
  }
);

// observe semua section tahun
yearSections.forEach(section => {
  // set default sebelum terlihat
  section.style.opacity = "0";
  yearObserver.observe(section);
});

/* =================================================
   🎯 HIGHLIGHT NAV SAAT KLIK
   (sinkron dengan scroll)
================================================= */
yearButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    yearButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
/* =================================================
   📸 STEP 5 — SLIDER SWIPE IMPROVEMENT
================================================= */

function enableSliderSwipe(slider) {
  let isDown = false;
  let startX;
  let scrollLeft;

  /* ===== DESKTOP (MOUSE) ===== */
  slider.addEventListener("mousedown", e => {
    isDown = true;
    slider.classList.add("dragging");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("dragging");
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("dragging");
  });

  slider.addEventListener("mousemove", e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.4; // kecepatan drag
    slider.scrollLeft = scrollLeft - walk;
  });

  /* ===== MOBILE (TOUCH) ===== */
  slider.addEventListener("touchstart", e => {
    isDown = true;
    startX = e.touches[0].pageX;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("touchend", () => {
    isDown = false;
  });

  slider.addEventListener("touchmove", e => {
    if (!isDown) return;
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 1.2;
    slider.scrollLeft = scrollLeft - walk;
  });
}

/* =================================================
   🚀 AKTIFKAN UNTUK SEMUA SLIDER
================================================= */
const sliders = document.querySelectorAll(".slider");

sliders.forEach(slider => {
  enableSliderSwipe(slider);
});
/* =================================================
   🎬 STEP 6 — VIDEO CLICK TO LOAD (CINEMATIC)
================================================= */

/**
 * Ubah video biasa menjadi mode klik
 * Video baru load saat user klik
 */
function makeVideoCinematic(video) {
  // pastikan belum diproses
  if (video.dataset.cinematic === "true") return;
  video.dataset.cinematic = "true";

  // simpan src asli
  const realSrc = video.dataset.src;
  video.removeAttribute("src");
  video.preload = "none";
  video.controls = false;

  // wrapper cinematic
  const wrapper = document.createElement("div");
  wrapper.className = "video-cinematic";

  // tombol play
  const playBtn = document.createElement("div");
  playBtn.className = "video-play-btn";
  playBtn.innerHTML = "▶";

  // styling inline minimal (anti error CSS belum ada)
  Object.assign(wrapper.style, {
    position: "relative",
    width: video.offsetWidth + "px",
    cursor: "pointer"
  });

  Object.assign(playBtn.style, {
    position: "absolute",
    inset: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    color: "white",
    background: "rgba(0,0,0,0.35)",
    borderRadius: "16px",
    transition: "opacity 0.3s"
  });

  // bungkus video
  video.parentNode.insertBefore(wrapper, video);
  wrapper.appendChild(video);
  wrapper.appendChild(playBtn);

  // klik untuk load & play
  wrapper.addEventListener("click", () => {
    if (!video.src) {
      video.src = realSrc;
    }

    video.controls = true;
    video.play().catch(() => {});
    playBtn.style.opacity = "0";
  });

  // kalau video di-pause, tampilkan tombol lagi
  video.addEventListener("pause", () => {
    playBtn.style.opacity = "1";
  });

  // kalau video selesai
  video.addEventListener("ended", () => {
    playBtn.style.opacity = "1";
  });
}

/* =================================================
   🚀 AKTIFKAN UNTUK SEMUA VIDEO
================================================= */
const allVideos = document.querySelectorAll(".slider video");

allVideos.forEach(video => {
  makeVideoCinematic(video);
});
/* =================================================
   🌍 STEP 7 — TRANSISI HALUS ANTAR DUNIA
================================================= */

/**
 * Tambahkan animasi masuk & status aktif
 * untuk setiap category (freefire, roblox, reallife)
 */

const categoryObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const category = entry.target;

      if (entry.isIntersecting) {
        // animasi masuk
        category.animate(
          [
            { opacity: 0, transform: "translateX(30px)" },
            { opacity: 1, transform: "translateX(0)" }
          ],
          {
            duration: 700,
            easing: "ease",
            fill: "forwards"
          }
        );

        // tandai aktif
        category.classList.add("category-active");

        // nonaktifkan saudara dalam tahun yang sama
        const yearSection = category.closest(".year-section");
        if (yearSection) {
          const siblings = yearSection.querySelectorAll(".category");
          siblings.forEach(sib => {
            if (sib !== category) {
              sib.classList.remove("category-active");
            }
          });
        }
      }
    });
  },
  {
    threshold: 0.4
  }
);

// aktifkan observer untuk semua category
const allCategories = document.querySelectorAll(".category");
allCategories.forEach(cat => {
  // default sebelum terlihat
  cat.style.opacity = "0";
  categoryObserver.observe(cat);
});

/* =================================================
   🎮 LABEL DUNIA (OPSIONAL, RAPI)
================================================= */
allCategories.forEach(category => {
  const title = category.querySelector("h3");
  if (!title) return;

  const label = document.createElement("span");
  label.className = "world-label";
  label.textContent =
    title.textContent === "FREEFIRE"
      ? "🔥 Free Fire World"
      : title.textContent === "ROBLOX"
      ? "🧱 Roblox World"
      : "🌿 Dunia Asli";

  title.after(label);
});
/* =================================================
   💌 STEP 8 — LOVE LETTER TYPING EFFECT
================================================= */

const typingElements = document.querySelectorAll(".typing-text");

typingElements.forEach(el => {
  const fullText = el.textContent.trim();
  el.textContent = "";
  el.dataset.done = "false";

  let index = 0;

  const typeWriter = () => {
    if (index < fullText.length) {
      el.textContent += fullText.charAt(index);
      index++;
      setTimeout(typeWriter, 55); // kecepatan ketik (lebih pelan = lebih dalem)
    }
  };

  const typingObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && el.dataset.done === "false") {
          el.dataset.done = "true";
          typeWriter();
        }
      });
    },
    {
      threshold: 0.6
    }
  );

  typingObserver.observe(el);
});
/* =================================================
   🛠️ STEP 9 — OPTIMASI FINAL & ERROR GUARD
================================================= */

/* ---------- 1. SAFE QUERY HELPER ---------- */
function $(selector, scope = document) {
  try {
    return scope.querySelector(selector);
  } catch (e) {
    console.warn("Selector error:", selector);
    return null;
  }
}

function $all(selector, scope = document) {
  try {
    return scope.querySelectorAll(selector);
  } catch (e) {
    console.warn("Selector error:", selector);
    return [];
  }
}

/* ---------- 2. PREVENT MULTIPLE OBSERVERS ---------- */
const activeObservers = new WeakSet();

function safeObserve(observer, element) {
  if (!activeObservers.has(element)) {
    observer.observe(element);
    activeObservers.add(element);
  }
}

/* ---------- 3. PAUSE VIDEO WHEN OUT OF VIEW ---------- */
const videoObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const video = entry.target;
      if (!video) return;

      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll("video").forEach(video => {
  videoObserver.observe(video);
});

/* ---------- 4. REDUCE MOTION (USER ACCESSIBILITY) ---------- */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {
  document.documentElement.classList.add("reduce-motion");
}

/* ---------- 5. THROTTLE SCROLL EVENT (JIKA ADA) ---------- */
function throttle(fn, delay = 100) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/* ---------- 6. IMAGE LAZY SAFETY ---------- */
document.querySelectorAll("img").forEach(img => {
  if (!img.hasAttribute("loading")) {
    img.setAttribute("loading", "lazy");
  }

  img.onerror = () => {
    img.style.display = "none";
  };
});

/* ---------- 7. GLOBAL ERROR CATCH ---------- */
window.addEventListener("error", e => {
  console.warn("JS Error caught:", e.message);
});

/* ---------- 8. FINAL READY FLAG ---------- */
document.documentElement.classList.add("site-ready");
console.log("💖 Website Kenangan: READY");

