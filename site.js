// Progressive enhancement only: every section is complete and readable without this file.

const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

function currentTheme() {
  return root.dataset.theme || (darkScheme.matches ? "dark" : "light");
}

function initThemeToggle() {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) {
    return;
  }

  const sync = () => {
    const isDark = currentTheme() === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  };

  toggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (error) {
      // Without storage the choice simply lasts for this page view.
    }
    sync();
  });

  darkScheme.addEventListener("change", sync);
  toggle.hidden = false;
  sync();
}

function animateCount(element) {
  const target = Number(element.dataset.countTo);
  const prefix = element.dataset.countPrefix || "";
  const suffix = element.dataset.countSuffix || "";
  const finalText = element.textContent;
  const duration = 1400;
  const start = performance.now();

  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    element.textContent = `${prefix}${Math.round(target * eased).toLocaleString("en-US")}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      element.textContent = finalText;
    }
  };

  requestAnimationFrame(frame);
}

function initReveal() {
  const targets = document.querySelectorAll("[data-reveal], [data-impact]");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    targets.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  // Content already on screen is marked visible before hiding anything, so nothing flashes.
  targets.forEach((element) => {
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
      element.classList.add("is-visible");
    }
  });
  root.classList.add("motion");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.add("is-visible");
        if (entry.target.matches("[data-impact]")) {
          entry.target.querySelectorAll("[data-count-to]").forEach(animateCount);
        }
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );

  targets.forEach((element) => {
    if (!element.classList.contains("is-visible")) {
      observer.observe(element);
    }
  });
}

function initScrollSpy() {
  const links = new Map(
    [...document.querySelectorAll(".primary-nav a[href^='#']")].map((link) => [link.hash.slice(1), link]),
  );
  if (!("IntersectionObserver" in window) || links.size === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        links.forEach((link, id) => {
          if (id === entry.target.id) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  links.forEach((link, id) => {
    const section = document.getElementById(id);
    if (section) {
      observer.observe(section);
    }
  });
}

function initReconciliation(demo) {
  const run = demo.querySelector("[data-recon-run]");
  const reset = demo.querySelector("[data-recon-reset]");
  const status = demo.querySelector("[data-recon-status]");
  const steps = [...demo.querySelectorAll("[data-recon-step]")];
  const records = [...demo.querySelectorAll("[data-recon-record]")];
  const rawFields = [...demo.querySelectorAll("dd[data-raw]")];
  const golden = demo.querySelector("[data-recon-golden]");
  const review = demo.querySelector("[data-recon-review]");
  const finalStatus = status.textContent.replace(/\s+/g, " ").trim();
  let timers = [];

  rawFields.forEach((field) => {
    field.dataset.clean = field.textContent.trim();
  });

  const plan = [
    {
      text: "Normalise: names, email case, and phone formats are rewritten into one shape (phones as +358 …).",
      apply() {
        rawFields.forEach((field) => {
          field.textContent = field.dataset.clean;
          field.classList.remove("is-raw");
          field.classList.add("is-changed");
        });
      },
    },
    {
      text: "Match: three records share the same normalised email and phone. The fourth only shares the name.",
      apply() {
        records.forEach((record) => {
          record.classList.add(record.dataset.reconRecord === "match" ? "is-matched" : "is-conflict");
        });
      },
    },
    {
      text: "Merge: one golden record. Every field can be traced to its sources, and the latest update wins.",
      apply() {
        golden.classList.add("is-revealed");
      },
    },
    {
      text: finalStatus,
      apply() {
        review.classList.add("is-revealed");
      },
    },
  ];

  const markSteps = (activeIndex) => {
    steps.forEach((step, index) => {
      step.classList.toggle("is-done", index < activeIndex);
      step.classList.toggle("is-active", index === activeIndex);
    });
  };

  const setIdle = () => {
    timers.forEach(clearTimeout);
    timers = [];
    demo.classList.add("is-idle");
    rawFields.forEach((field) => {
      field.textContent = field.dataset.raw;
      field.classList.add("is-raw");
      field.classList.remove("is-changed");
    });
    records.forEach((record) => record.classList.remove("is-matched", "is-conflict"));
    golden.classList.remove("is-revealed");
    review.classList.remove("is-revealed");
    markSteps(-1);
    status.textContent = "Four records from three systems. They look different. Are they the same customer?";
    run.disabled = false;
    run.textContent = "Reconcile records";
    reset.hidden = true;
  };

  run.addEventListener("click", () => {
    setIdle();
    run.disabled = true;
    const stepDelay = reducedMotion.matches ? 0 : 1150;

    plan.forEach((item, index) => {
      timers.push(
        setTimeout(() => {
          markSteps(index);
          item.apply();
          status.textContent = item.text;
          if (index === plan.length - 1) {
            markSteps(plan.length);
            run.disabled = false;
            run.textContent = "Run again";
            reset.hidden = false;
          }
        }, stepDelay * index + (stepDelay ? 250 : 0)),
      );
    });
  });

  reset.addEventListener("click", setIdle);

  run.hidden = false;
  setIdle();
}

function initCopyEmail() {
  const button = document.querySelector("[data-copy]");
  const status = document.querySelector("[data-copy-status]");
  if (!button || !status || !navigator.clipboard) {
    return;
  }

  let timer;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      status.textContent = "Copied";
    } catch (error) {
      status.textContent = "Copy failed. Use the link instead.";
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      status.textContent = "";
    }, 2500);
  });
  button.hidden = false;
}

initThemeToggle();
initReveal();
initScrollSpy();
document.querySelectorAll("[data-recon]").forEach(initReconciliation);
initCopyEmail();
