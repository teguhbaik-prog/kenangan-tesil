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
