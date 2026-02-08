/* =================================================
   🔐 PASSWORD LOGIC (SYNC HTML)
================================================= */
const PASSWORD = "sayang";

const passwordPage = document.getElementById("password-page");
const mainSite = document.getElementById("main-site");
const passwordInput = document.getElementById("password-input");
const passwordBtn = document.getElementById("password-btn");
const passwordError = document.getElementById("password-error");

passwordBtn.addEventListener("click", () => {
  if (passwordInput.value === PASSWORD) {
    passwordPage.style.display = "none";
    mainSite.classList.remove("hidden");
  } else {
    passwordInput.value = "";
    passwordError.textContent = "Password salah 😢";
  }
});

/* =================================================
   🌙 DAY / NIGHT MODE
================================================= */
const themeToggle = document.getElementById("toggle-theme");

function setTheme(theme) {
  document.body.classList.toggle("night-mode", theme === "dark");
  localStorage.setItem("theme", theme);
}

setTheme(localStorage.getItem("theme") || "light");

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("night-mode");
  setTheme(isDark ? "light" : "dark");
});

/* =================================================
   🧠 DATA KENANGAN (TETAP KOMPLEKS)
================================================= */
const memories = [
  {
    year: 2022,
    theme: "#FFD6E8",
    story: "Tahun awal kita saling kenal dan mulai dekat.",
    categories: {
      freefire: {
        photos: ["ff1.webp"],
        videos: ["ff1.mp4"],
        audios: ["ff_theme.mp3"]
      },
      reallife: {
        photos: ["rl1.webp"],
        videos: [],
        audios: []
      }
    }
  },
  {
    year: 2023,
    theme: "#E0C3FC",
    story: "Tahun penuh tawa dan janji.",
    categories: {
      roblox: {
        photos: ["rb1.webp"],
        videos: [],
        audios: []
      }
    }
  }
];

/* =================================================
   🗓️ YEAR NAVIGATION (SYNC HTML)
================================================= */
let currentYearIndex = 0;

const yearText = document.getElementById("current-year");
const yearContent = document.getElementById("year-content");
const prevYear = document.getElementById("prev-year");
const nextYear = document.getElementById("next-year");

function renderYear(index) {
  const data = memories[index];
  yearText.textContent = data.year;
  yearContent.innerHTML = "";

  const section = document.createElement("section");
  section.className = "year-section";
  section.style.setProperty("--accent-main", data.theme);

  section.innerHTML = `
    <h2>${data.year}</h2>
    <p class="year-story">${data.story}</p>
  `;

  Object.entries(data.categories).forEach(([key, val]) => {
    const cat = document.createElement("div");
    cat.className = "category";

    cat.innerHTML = `
      <h3>${key.toUpperCase()}</h3>
      <div class="slider"></div>
    `;

    const slider = cat.querySelector(".slider");

    val.photos.forEach(f => {
      const img = document.createElement("img");
      img.src = `/media/${data.year}/${key}/${f}`;
      img.loading = "lazy";
      slider.appendChild(img);
    });

    val.videos.forEach(f => {
      const video = document.createElement("video");
      video.src = `/media/${data.year}/${key}/${f}`;
      video.controls = true;
      slider.appendChild(video);
    });

    section.appendChild(cat);
  });

  yearContent.appendChild(section);

  activateSliders();
}

prevYear.onclick = () => {
  if (currentYearIndex > 0) {
    currentYearIndex--;
    renderYear(currentYearIndex);
  }
};

nextYear.onclick = () => {
  if (currentYearIndex < memories.length - 1) {
    currentYearIndex++;
    renderYear(currentYearIndex);
  }
};

renderYear(currentYearIndex);

/* =================================================
   📸 SLIDER SWIPE (STABIL)
================================================= */
function activateSliders() {
  document.querySelectorAll(".slider").forEach(slider => {
    let isDown = false, startX, scrollLeft;

    slider.onmousedown = e => {
      isDown = true;
      startX = e.pageX;
      scrollLeft = slider.scrollLeft;
    };

    slider.onmouseup = slider.onmouseleave = () => {
      isDown = false;
    };

    slider.onmousemove = e => {
      if (!isDown) return;
      slider.scrollLeft = scrollLeft - (e.pageX - startX);
    };

    slider.ontouchstart = e => {
      startX = e.touches[0].pageX;
      scrollLeft = slider.scrollLeft;
    };

    slider.ontouchmove = e => {
      slider.scrollLeft = scrollLeft - (e.touches[0].pageX - startX);
    };
  });
}

/* =================================================
   🎵 AUDIO GLOBAL (AMAN)
================================================= */
const bgMusic = document.getElementById("bg-music");
const toggleMusic = document.getElementById("toggle-music");

toggleMusic.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
  } else {
    bgMusic.pause();
  }
});

/* =================================================
   🎂 BIRTHDAY / ANNIVERSARY MODE
================================================= */
const today = new Date();
if (today.getMonth() === 7 && today.getDate() === 16) {
  const hero = document.querySelector(".hero");
  hero.insertAdjacentHTML(
    "afterend",
    `<section class="special">
      <h2>Selamat Ulang Tahun 🤍</h2>
      <p>Terima kasih sudah lahir dan hadir di hidupku.</p>
    </section>`
  );
}

/* =================================================
   ✅ FINAL READY
================================================= */
document.documentElement.classList.add("site-ready");
console.log("✔ JS SYNC & READY");
