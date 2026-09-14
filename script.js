const section = document.querySelector("#amiSection");
const progressFill = document.querySelector("#progressFill");

let currentProgress = 0;
let targetProgress = 0;
let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  const progress = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + (outMax - outMin) * progress;
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function updateTargetProgress() {
  const rect = section.getBoundingClientRect();
  const scrollable = rect.height - window.innerHeight;

  targetProgress = clamp(-rect.top / scrollable, 0, 1);
}

function render() {
  if (reducedMotion) {
    document.documentElement.style.setProperty("--zoom", 1.08);
    document.documentElement.style.setProperty("--door-open", 1);
    document.documentElement.style.setProperty("--speakers-out", 1);
    document.documentElement.style.setProperty("--wave", 0.2);
    progressFill.style.width = "100%";
    return;
  }

  currentProgress += (targetProgress - currentProgress) * 0.12;

  const zoom = mapRange(currentProgress, 0, 0.34, 1, 1.26);
  const doorRaw = mapRange(currentProgress, 0.18, 0.62, 0, 1);
  const speakersRaw = mapRange(currentProgress, 0.48, 1, 0, 1);

  const doorOpen = easeOutCubic(doorRaw);
  const speakersOut = easeOutCubic(speakersRaw);

  const wave = (Math.sin(Date.now() * 0.006) + 1) / 2;

  document.documentElement.style.setProperty("--zoom", zoom.toFixed(3));
  document.documentElement.style.setProperty("--door-open", doorOpen.toFixed(3));
  document.documentElement.style.setProperty("--speakers-out", speakersOut.toFixed(3));
  document.documentElement.style.setProperty("--wave", wave.toFixed(3));

  progressFill.style.width = `${Math.round(currentProgress * 100)}%`;

  requestAnimationFrame(render);
}

window.addEventListener("scroll", updateTargetProgress, { passive: true });
window.addEventListener("resize", updateTargetProgress);

updateTargetProgress();
render();
