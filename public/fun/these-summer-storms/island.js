import * as THREE from "./three.module.min.js";

/* ==========================================================================
   Storm Island — an interactive reading map
   Built for book clubs reading These Summer Storms by Sarah MacLean.
   ========================================================================== */

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (a, b, lambda, dt) => a + (b - a) * (1 - Math.exp(-lambda * dt));
const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260826);

function hash2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function vnoise(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}

function fbm2(x, y) {
  let v = 0;
  let amp = 0.5;
  for (let i = 0; i < 4; i++) {
    v += amp * vnoise(x, y);
    x *= 2.03;
    y *= 2.01;
    amp *= 0.5;
  }
  return v;
}

function makeNoiseTexture(size = 128, low = 0.72, repeatX = 1, repeatY = 1) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const n = low + (1 - low) * rand();
    const v = Math.round(n * 255);
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 4;
  return tex;
}

function makeWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#e8dcc8";
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 90; i++) {
    const y = rand() * 256;
    ctx.strokeStyle = `rgba(90,60,38,${0.03 + rand() * 0.1})`;
    ctx.lineWidth = 0.5 + rand() * 1.6;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 256; x += 32) {
      ctx.lineTo(x, y + Math.sin(x * 0.04 + i) * 2.2);
    }
    ctx.stroke();
  }
  for (let i = 0; i < 5; i++) {
    const x = rand() * 256;
    const y = rand() * 256;
    ctx.strokeStyle = "rgba(80,52,30,.16)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x, y, 5 + rand() * 8, 2 + rand() * 3, rand() * Math.PI, 0, Math.PI * 2);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 2);
  tex.anisotropy = 4;
  return tex;
}

function makeShingleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#e9ddc9";
  ctx.fillRect(0, 0, 256, 256);
  const rowH = 26;
  for (let row = 0; row < 11; row++) {
    const y = row * rowH;
    ctx.fillStyle = "rgba(70,46,28,0.13)";
    ctx.fillRect(0, y, 256, 2);
    const offset = row % 2 === 0 ? 0 : 17;
    for (let x = offset; x < 256; x += 34) {
      ctx.fillStyle = "rgba(70,46,28,0.085)";
      ctx.fillRect(x, y + 2, 1.5, rowH - 2);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.anisotropy = 4;
  return tex;
}

function makeRoofTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#e4e4de";
  ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 20) {
    ctx.fillStyle = "rgba(30,38,42,0.18)";
    ctx.fillRect(0, y, 256, 2);
    const offset = (y / 20) % 2 === 0 ? 0 : 15;
    for (let x = offset; x < 256; x += 30) {
      ctx.fillStyle = "rgba(30,38,42,0.09)";
      ctx.fillRect(x, y + 2, 1.5, 18);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = 4;
  return tex;
}

function makeMasonryTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#e6e1d6";
  ctx.fillRect(0, 0, 256, 256);
  const rowH = 30;
  for (let row = 0; row < 9; row++) {
    const y = row * rowH;
    const offset = row % 2 === 0 ? 0 : 32;
    for (let x = -32 + offset; x < 256; x += 64) {
      const shade = 0.86 + Math.random() * 0.14;
      ctx.fillStyle = `rgba(${Math.round(234 * shade)},${Math.round(226 * shade)},${Math.round(210 * shade)},1)`;
      ctx.fillRect(x + 2, y + 2, 60, rowH - 4);
    }
    ctx.fillStyle = "rgba(60,52,38,0.18)";
    ctx.fillRect(0, y, 256, 2);
    for (let x = offset; x < 256; x += 64) {
      ctx.fillRect(x, y, 2, rowH);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeSignTexture(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#e7dcc6";
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = "#3c3a30";
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, 496, 112);
  ctx.fillStyle = "#2d322b";
  ctx.font = "500 44px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 68);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

function makeWakeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.35, "rgba(235,245,242,0.24)");
  g.addColorStop(1, "rgba(255,255,255,0.7)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 256);
  ctx.globalCompositeOperation = "destination-in";
  const r = ctx.createLinearGradient(0, 0, 128, 0);
  r.addColorStop(0, "rgba(0,0,0,0)");
  r.addColorStop(0.5, "rgba(0,0,0,1)");
  r.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = r;
  ctx.fillRect(0, 0, 128, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/* --------------------------------------------------------------------------
   Island shape
   -------------------------------------------------------------------------- */

function islandRadius(theta) {
  return (
    27.0 +
    2.35 * Math.sin(3 * theta + 0.7) +
    1.6 * Math.cos(5 * theta - 1.2) +
    0.75 * Math.sin(7 * theta + 2.0)
  );
}

const PLATEAU_Y = 7.85;
const MANOR_X = -2;
const MANOR_Z = -2;

function terrainHeight(x, z) {
  const theta = Math.atan2(z, x);
  const R = islandRadius(theta);
  const d = Math.hypot(x, z);
  const r = d / R;
  const inside = smoothstep(1.02, 0.9, r);
  const base = 1.35 + 3.35 * inside;
  const hill = 4.6 * Math.exp(-((x + 2) ** 2 + (z + 2) ** 2) / (2 * 8.8 * 8.8));
  let h = inside * base + hill * inside;
  h += 0.55 * inside * fbm2(x * 0.31 + 4, z * 0.31 - 2);

  // a small cove for the secret beach
  h -= 1.6 * Math.exp(-(((x - 21.4) ** 2 + (z - 14.4) ** 2) / (2 * 3.6 * 3.6)));

  // flatten the manor's plateau
  const dm = Math.hypot(x - MANOR_X, z - MANOR_Z);
  h = lerp(h, PLATEAU_Y, smoothstep(8.7, 3.6, dm) * 0.96);

  if (r > 1.0) h = -(r - 1) * 30;
  return h;
}

function waveHeight(x, z, t, amp = 0.3) {
  return (
    (Math.sin(x * 0.16 + t * 1.1) * 0.5 +
      Math.sin(z * 0.21 - t * 0.85) * 0.35 +
      Math.sin((x + z) * 0.09 + t * 1.6) * 0.4) *
    amp
  );
}

/* --------------------------------------------------------------------------
   Content
   -------------------------------------------------------------------------- */

const ICONS = {
  dock: '<path d="M3 9h18M5 9v11M19 9v11M12 9v6M9 20h6M12 15v5M2.5 20h19"/>',
  manor:
    '<path d="M3.5 20V11l3-2V6h2v2l3.5-2.5L19 9v11M3 20h18M10 20v-4.5h4V20M5.5 12.5h1M7.5 12.5h1"/>',
  study:
    '<rect x="4.5" y="4" width="15" height="16" rx="1"/><circle cx="12" cy="9.6" r="2.2"/><path d="M12 11.8v4.4"/>',
  boathouse:
    '<path d="M3 11.2 12 5l9 6.2M5.2 10.3V20h13.6v-9.7M10 20v-6.2h4V20M2.5 20h19"/>',
  oak: '<path d="M12 20v-6.4M12 16.2l-3.2-3M12 14.4l3.4-3.2"/><circle cx="12" cy="9" r="4.8"/>',
  bell:
    '<path d="M8 17.2h8M9.2 17.2c0-.9.6-1.6.6-2.6v-3.4a2.2 2.2 0 0 1 4.4 0v3.4c0 1 .6 1.7.6 2.6M12 8.2V7M11 19.6h2M4.5 20h15"/>',
  thyme:
    '<path d="M12 20V8.5M12 13.2c-3.2 0-4.2-2.2-4.2-4.2 2.2 0 4.2 1.2 4.2 4.2ZM12 11c3.2 0 4.2-2.2 4.2-4.2-2.2 0-4.2 1.2-4.2 4.2ZM12 16.4c-2.4 0-3.3-1.7-3.3-3.3 1.7 0 3.3 1 3.3 3.3Z"/>',
  beach:
    '<path d="M3 15.5c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0M3 19.6c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0"/><circle cx="17" cy="6.8" r="2.2"/>',
  lizzie:
    '<path d="M12 3.5v13M12 4.5l6.4 9.4H12M12 7.2 7.8 13.9H12M3.5 16.6h17L18 20H6z"/>',
};

const PLACES = [
  {
    id: "dock",
    no: "01",
    name: "The Dock",
    sub: "Landing",
    icon: "dock",
    at: [7.0, 21.6],
    lift: 2.6,
    lookLift: 1.2,
    cam: { theta: 0.12, phi: 0.99, radius: 28 },
    tagline: "Auka — tempest. The island was named for weather before it was named for a family.",
    body: [
      "Storm Island is sixty-three private acres in Narragansett Bay, reachable by boat or by helicopter and by nothing else. That fact does more work than any lock on the house. Every arrival is negotiated; every departure can be withheld. Franklin Storm understood that a place you cannot simply walk away from is a place where people will finally talk to each other.",
      "The dock is where the novel keeps returning — the first crossing, the last crossing, the cut mooring lines, the boat that will not take Alice anywhere. Slate steps climb from the water to the house, and the climb is the point. You feel the island's elevation in your legs before you feel the family's gravity.",
    ],
    pull: "Every arrival is a decision. Every departure has to be arranged.",
    tags: ["Isolation", "Access", "Return"],
    questions: [
      "The island can only be reached by boat or helicopter. How does that enforced distance shape the way the Storm siblings treat one another — and the way they treat the truth?",
      "Alice arrives after five years away. Is she coming home, attending a funeral, or walking into an audit? What does the difference mean for how you read her?",
    ],
  },
  {
    id: "manor",
    no: "02",
    name: "The Manor",
    sub: "House Rules",
    icon: "manor",
    at: [-2, 5.6],
    lift: 2.0,
    lookLift: 3.2,
    cam: { theta: 0.47, phi: 0.99, radius: 31 },
    tagline: "A Gilded Age Gothic manor with no Wi-Fi and a very clear idea of who is in charge.",
    body: [
      "Franklin built his empire on connection — Storm Inc., the cyclone mark, the reach of it — and then kept the island deliberately offline. The manor is opulent, but its real luxury is control: no notifications, no outside counsel, no second opinion. The house makes a small, captive audience of the people who love him.",
      "For the memorial, the siblings are dressed and arranged like a family photograph. Dignitaries arrive by helicopter; Elisabeth performs grief with the timing of a hostess. Under the chandeliers the inheritance game continues, and every polite exchange is a bid. Beyond the lawn, the three staff cottages on the north side keep their own doors closed.",
      "Alice's childhood bedroom is in the turret — a round room that once made her feel like a lost princess in a fairy tale. When she comes back after five years and finds Jack in it, he explains that Franklin had been lending her room to his fixer whenever business brought him to the island. The house keeps reassigning the people inside it.",
    ],
    pull: "The house makes a small, captive audience of the people who love him.",
    tags: ["Control", "Performance", "Wealth"],
    questions: [
      "Franklin's house rules outlive him. Which of his forms of control are still running by the end of the novel — and which ones do the siblings finally switch off?",
      "Alice's turret bedroom was reassigned to Jack whenever he visited. What does that arrangement say about Franklin's control — and about what Alice and Jack are reclaiming when they choose each other?",
    ],
  },
  {
    id: "study",
    no: "03",
    name: "The Study",
    sub: "The Vault",
    icon: "study",
    at: [5.8, 2.2],
    lift: 3.2,
    lookLift: 3.0,
    cam: { theta: 0.92, phi: 1.01, radius: 24 },
    tagline: "A locked room, a painting bought at auction, and a letter that waited years to be read.",
    body: [
      "Franklin's office is the house's inner sanctum, and the vault inside it is where the novel stores its most literal secret: Alice's letter, hidden behind one of her own paintings, a canvas she believed had been sold to a stranger. He had been collecting her work all along.",
      "The inheritance game is full of these double objects — money that is also a test, a task that is also an accusation, affection that arrives in the shape of surveillance. Franklin's genius was making people feel chosen at the exact moment he made them powerless.",
    ],
    pull: "He had been collecting her work all along.",
    tags: ["Letters", "Inheritance", "Secrets"],
    questions: [
      "Franklin bought Alice's early paintings and hid her letter inside one of them. Did you read that as a father's devotion, a collector's possessiveness, or both at once?",
      "Why hide the letter instead of sending it with Jack? What does the hiding place say about how Franklin understood forgiveness?",
    ],
  },
  {
    id: "boathouse",
    no: "04",
    name: "The Boathouse",
    sub: "Cut Lines",
    icon: "boathouse",
    at: [-24.6, 8.2],
    lift: 4.4,
    lookLift: 2.2,
    cam: { theta: -1.34, phi: 1.0, radius: 32 },
    tagline: "Cedar shingles, a boat-sized door, and the only room on the island that feels honest.",
    body: [
      "The boathouse is weathered cedar and salt air, built big enough to winter Franklin's sailboat, The Lizzie. It is practical in a way the manor is not. When the storm comes and the power fails, it becomes the place where Alice and Jack stop negotiating and start choosing each other.",
      "By morning, someone has cut the lines holding every skiff. The island's exits have been edited overnight. In a novel about inheritance, the boathouse is the reminder that escape is a material problem — you need a boat, a line, a tide, and someone willing to untie it with you.",
    ],
    pull: "The island's exits have been edited overnight.",
    tags: ["Shelter", "Trust", "Escape"],
    questions: [
      "The boathouse is where Alice and Jack are most themselves. What makes a space — rather than a conversation — able to change a relationship?",
      "Someone cuts the skiffs loose. Who did you suspect first, and what did that suspicion reveal about how the inheritance game had taught you to read the family?",
    ],
  },
  {
    id: "oak",
    no: "05",
    name: "The Red Oak",
    sub: "What Falls",
    icon: "oak",
    at: [6.5, -7],
    lift: 5.2,
    lookLift: 4.0,
    cam: { theta: 0.68, phi: 0.98, radius: 24 },
    tagline: "Franklin's red oak stood over the house for generations. The storm takes it through his office window.",
    body: [
      "A large red oak, old enough to have opinions, anchors the grounds. It is the kind of tree a patriarch plants so that later generations will have to walk around it. When the storm brings it down, it comes through the window of the office — the room where Franklin kept his version of events.",
      "The fallen tree is the novel's cleanest image of inheritance: what you keep, what keeps you, and what has to come down before anything new gets light. The siblings cannot save the oak. They can decide what to do with the wood.",
    ],
    pull: "What you keep. What keeps you. What has to come down.",
    tags: ["Legacy", "Rupture", "Renewal"],
    questions: [
      "The oak falls through the office window, not the family wing. Why is that the right room for the wreckage to enter?",
      "Which family patterns in the novel deserve to be saved, and which ones need to come down? What would you keep if you were one of the Storms?",
    ],
  },
  {
    id: "bell",
    no: "06",
    name: "The Fog Bell",
    sub: "Upkeep",
    icon: "bell",
    at: [9.5, 16],
    lift: 3.0,
    lookLift: 2.0,
    cam: { theta: 0.3, phi: 1.03, radius: 17 },
    tagline: "An antique fog bell, maintained by hand, marking time on an island that prefers to keep its own.",
    body: [
      "The fog bell is old, heavy, and entirely unnecessary in an age of radar. Someone still climbs to it and keeps it in working order — a task, in Franklin's game, but also a ritual. The sound travels farther than a voice does. It tells the bay where the island is without asking anything in return.",
      "In a family that communicates through money, tasks, and withheld information, upkeep is its own language. To maintain the bell is to say: we are still here, and we are still keeping something for the next person who arrives.",
    ],
    pull: "It tells the bay where the island is without asking anything in return.",
    tags: ["Ritual", "Care", "Continuity"],
    questions: [
      "The fog bell is obsolete and maintained anyway. When is upkeep an act of love, and when is it just another inherited obligation?",
      "Which rituals from your own family would you keep if no one assigned them to you? Which would you let fall silent?",
    ],
  },
  {
    id: "thyme",
    no: "07",
    name: "The Thyme Field",
    sub: "Neutral Ground",
    icon: "thyme",
    at: [-9.5, 10.5],
    lift: 1.6,
    lookLift: 2.0,
    cam: { theta: -0.38, phi: 0.97, radius: 27 },
    tagline: "Wild thyme in deep green, white, and purple; old stone walls; ground that finally belongs to someone else.",
    body: [
      "The island is covered in wild thyme — acres of it, blooming in deep greens, bright whites, and purples, threaded through old stone walls. It is not a formal garden. It grows where the wind and the weather allow, which makes it the least Franklin-like thing on the island.",
      "Elisabeth inherits the island and the house, and the ending quietly changes the map: the place that was Franklin's instrument becomes contested ground, a possible neutral territory. Thyme is a small plant with a long memory. It takes over where the soil has been disturbed.",
    ],
    pull: "It takes over where the soil has been disturbed.",
    tags: ["Ground", "Inheritance", "Possibility"],
    questions: [
      "Elisabeth inherits the island. Does that make it neutral ground, or does it simply move the control from one pair of hands to another?",
      "The thyme grows where it isn't managed. What would an unmanaged version of the Storm family look like — and is that a happy ending?",
    ],
  },
  {
    id: "beach",
    no: "08",
    name: "The Secret Beach",
    sub: "Overboard",
    icon: "beach",
    at: [21.9, 14.1],
    lift: 1.8,
    lookLift: 2.4,
    cam: { theta: 1.2, phi: 0.95, radius: 28 },
    tagline: "A hidden cove, a jump overboard, and the first honest kiss in the novel.",
    body: [
      "Alice's escape route is literal: she jumps off The Lizzie and swims for a beach the family has mostly forgotten. Jack jumps in after her. What happens on the sand is not a rescue scene. It is two people choosing, in salt water and bad weather, to stop pretending the attraction is an inconvenience.",
      "The secret beach is the counter-image to the manor. No staff, no portraits, no inheritance tasks — just a small crescent of shore that the family's money never made beautiful. Alice can leave the house. The question the novel keeps asking is whether she can leave its logic.",
    ],
    pull: "Alice can leave the house. Can she leave its logic?",
    tags: ["Autonomy", "Desire", "Escape"],
    questions: [
      "Alice tries to escape by swimming. What does it mean that the first real intimacy in the book happens away from the house, and that Jack follows her into the water?",
      "Alice has spent five years building a life off the island. What does the novel suggest she gains by returning — and what does she risk by staying?",
    ],
  },
  {
    id: "lizzie",
    no: "09",
    name: "The Lizzie",
    sub: "The Fixer",
    icon: "lizzie",
    at: null,
    lift: 0,
    lookLift: 0,
    cam: { theta: -0.7, phi: 0.99, radius: 24 },
    tagline: "The sailboat that winters in the boathouse and carries the novel's most complicated passenger.",
    body: [
      "Jack Dean is Franklin's fixer: the man who arrives early, handles what needs handling, and understands more than he says. He is also the man who takes Alice sailing. Franklin may have sent him, but the wind, the water, and the choice are theirs.",
      "By the end, Jack resigns his position and gives up his reward. The will leaves each sibling $1,107 — the exact amount Franklin used to start Storm Inc. The gesture is either a lesson or a last joke. The Lizzie keeps sailing, which feels like the novel's answer: inherit the boat, not the weather.",
    ],
    pull: "Inherit the boat, not the weather.",
    tags: ["Choice", "Repair", "Love"],
    questions: [
      "Jack starts as Franklin's instrument and ends by choosing Alice over the inheritance. Is that a redemption, a resignation, or simply the first decision that was fully his?",
      "Each sibling receives $1,107 — Franklin's original stake. Is that a generous ending, a cruel one, or the only honest accounting of what a legacy is worth?",
    ],
  },
];

PLACES.forEach((p) => {
  if (!p.at) {
    p.anchor = new THREE.Vector3();
    p.target = new THREE.Vector3();
    return;
  }
  const ground = terrainHeight(p.at[0], p.at[1]);
  p.anchor = new THREE.Vector3(p.at[0], ground + p.lift, p.at[1]);
  p.target = new THREE.Vector3(p.at[0], ground + p.lookLift, p.at[1]);
});

/* --------------------------------------------------------------------------
   Renderer, camera, lights
   -------------------------------------------------------------------------- */

const canvas = document.getElementById("world");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const scene = new THREE.Scene();
const calmFog = new THREE.Color("#bda88d");
const stormFog = new THREE.Color("#4b5c5e");
scene.fog = new THREE.FogExp2(calmFog.clone(), 0.0031);

const camera = new THREE.PerspectiveCamera(
  36,
  window.innerWidth / window.innerHeight,
  0.1,
  800
);

const hemi = new THREE.HemisphereLight(0x9db4bd, 0x333b27, 1.0);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xffc98f, 3.0);
sun.position.set(-42, 58, 34);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -52;
sun.shadow.camera.right = 52;
sun.shadow.camera.top = 52;
sun.shadow.camera.bottom = -52;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 180;
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.025;
scene.add(sun);
scene.add(sun.target);

const fill = new THREE.DirectionalLight(0x8fa9bd, 0.65);
fill.position.set(40, 28, -30);
scene.add(fill);

const ambient = new THREE.AmbientLight(0x6b7d7a, 0.18);
scene.add(ambient);

const flashLight = new THREE.DirectionalLight(0xcfe0ff, 0);
flashLight.position.set(0, 60, 0);
scene.add(flashLight);

/* --------------------------------------------------------------------------
   Sky
   -------------------------------------------------------------------------- */

const skyUniforms = {
  uTop: { value: new THREE.Color("#17323e") },
  uHorizon: { value: new THREE.Color("#e9b587") },
  uFog: { value: calmFog.clone() },
  uSunColor: { value: new THREE.Color("#ffd39c") },
  uSunDir: { value: new THREE.Vector3(-0.55, 0.18, 0.32).normalize() },
  uTime: { value: 0 },
  uStorm: { value: 0 },
  uFlash: { value: 0 },
};

const skyMat = new THREE.ShaderMaterial({
  uniforms: skyUniforms,
  side: THREE.BackSide,
  depthWrite: false,
  fragmentShader: /* glsl */ `
    uniform vec3 uTop;
    uniform vec3 uHorizon;
    uniform vec3 uFog;
    uniform vec3 uSunColor;
    uniform vec3 uSunDir;
    uniform float uTime;
    uniform float uStorm;
    uniform float uFlash;
    varying vec3 vDir;

    float hash(vec3 p) {
      p = fract(p * 0.3183099 + 0.1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }
    float noise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
    }
    float fbm(vec3 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
      return v;
    }

    void main() {
      vec3 d = normalize(vDir);
      float hy = clamp(d.y, -1.0, 1.0);
      vec3 col = mix(uHorizon, uTop, smoothstep(0.0, 0.52, hy));

      float sd = max(dot(d, normalize(uSunDir)), 0.0);
      col += uSunColor * pow(sd, 300.0) * (1.0 - uStorm * 0.8) * 1.4;
      col += uSunColor * pow(sd, 6.0) * (1.0 - uStorm * 0.7) * 0.16;

      vec2 cuv = d.xz / (0.12 + max(hy, 0.0) * 0.75) * 6.0;
      cuv += vec2(uTime * 0.006, uTime * 0.002);
      float cl = fbm(vec3(cuv, 0.6 + uTime * 0.008));
      float band = smoothstep(0.02, 0.13, hy) * (1.0 - smoothstep(0.26, 0.6, hy));
      cl = smoothstep(0.55, 0.82, cl) * band;
      vec3 cloudCol = mix(vec3(0.98, 0.9, 0.8), vec3(0.2, 0.24, 0.26), uStorm);
      col = mix(col, cloudCol, cl * uStorm * 0.55);

      col += uFlash * vec3(0.82, 0.9, 1.0) * (0.35 + cl * 0.65);

      col = mix(uFog, col, smoothstep(-0.04, 0.16, d.y));

      gl_FragColor = vec4(col, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
  vertexShader: /* glsl */ `
    varying vec3 vDir;
    void main() {
      vDir = position;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
    }
  `,
});

const sky = new THREE.Mesh(new THREE.SphereGeometry(420, 32, 20), skyMat);
sky.renderOrder = -10;
sky.frustumCulled = false;
scene.add(sky);

/* --------------------------------------------------------------------------
   Water
   -------------------------------------------------------------------------- */

const waterUniforms = {
  uTime: { value: 0 },
  uStorm: { value: 0 },
  uDeep: { value: new THREE.Color("#0d3d40") },
  uShallow: { value: new THREE.Color("#357a70") },
  uStormDeep: { value: new THREE.Color("#071e22") },
  uStormShallow: { value: new THREE.Color("#1b4245") },
  uSky: { value: new THREE.Color("#d8b795") },
  uSun: { value: new THREE.Color("#ffd8a8") },
  uFogColor: { value: calmFog.clone() },
  uFogDensity: { value: 0.0031 },
  uCamPos: { value: new THREE.Vector3() },
};

const waterMat = new THREE.ShaderMaterial({
  uniforms: waterUniforms,
  fragmentShader: /* glsl */ `
    uniform float uStorm;
    uniform vec3 uDeep;
    uniform vec3 uShallow;
    uniform vec3 uStormDeep;
    uniform vec3 uStormShallow;
    uniform vec3 uSky;
    uniform vec3 uSun;
    uniform vec3 uFogColor;
    uniform float uFogDensity;
    uniform vec3 uCamPos;
    varying vec3 vWorld;
    varying vec3 vNormalW;
    varying float vWave;

    void main() {
      vec3 N = normalize(vNormalW);
      vec3 V = normalize(uCamPos - vWorld);
      float dist = length(uCamPos - vWorld);
      float farFade = 1.0 - smoothstep(45.0, 140.0, dist);
      vec3 deep = mix(uDeep, uStormDeep, uStorm);
      vec3 shallow = mix(uShallow, uStormShallow, uStorm);
      vec3 col = mix(deep, shallow, smoothstep(-0.65, 0.85, vWave) * 0.85);

      float fres = pow(1.0 - max(dot(N, V), 0.0), 3.2);
      col = mix(col, uSky, fres * 0.4 * farFade);

      float ndl = max(dot(N, normalize(vec3(-0.45, 0.55, 0.4))), 0.0);
      col *= 0.82 + 0.3 * ndl;

      vec3 L = normalize(vec3(-0.5, 0.42, 0.4));
      vec3 H = normalize(L + V);
      float specA = pow(max(dot(N, H), 0.0), 70.0) * 0.32;
      float specB = pow(max(dot(N, H), 0.0), 420.0) * 1.1;
      col += uSun * (specA + specB) * (0.8 + uStorm * 0.4) * farFade;
      col += vec3(0.02, 0.05, 0.04) * smoothstep(0.3, 1.0, vWave) * farFade;

      float foam = smoothstep(0.55, 0.95, vWave + 0.1) * (0.12 + uStorm * 0.22);
      col = mix(col, vec3(0.72, 0.8, 0.78), foam);

      float f = smoothstep(55.0, 175.0 - uStorm * 55.0, dist);
      col = mix(col, uFogColor, clamp(f, 0.0, 1.0));

      gl_FragColor = vec4(col, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform float uStorm;
    varying vec3 vWorld;
    varying vec3 vNormalW;
    varying float vWave;

    void main() {
      vec3 p = position;
      float t = uTime;
      float amp = 0.32 + uStorm * 0.55;
      float w1 = sin(p.x * 0.16 + t * 1.1);
      float w2 = sin(p.z * 0.21 - t * 0.85);
      float w3 = sin((p.x + p.z) * 0.09 + t * 1.6);
      float w4 = sin(p.x * 0.51 + p.z * 0.23 + t * 2.1);
      float h = (w1 * 0.5 + w2 * 0.35 + w3 * 0.4 + w4 * 0.26) * amp;

      float dx = (cos(p.x * 0.16 + t * 1.1) * 0.5 * 0.16
                + cos((p.x + p.z) * 0.09 + t * 1.6) * 0.4 * 0.09
                + cos(p.x * 0.51 + p.z * 0.23 + t * 2.1) * 0.26 * 0.51) * amp;
      float dz = (cos(p.z * 0.21 - t * 0.85) * 0.35 * 0.21
                + cos((p.x + p.z) * 0.09 + t * 1.6) * 0.4 * 0.09
                + cos(p.x * 0.51 + p.z * 0.23 + t * 2.1) * 0.26 * 0.23) * amp;
      float dx2 = cos(p.x * 0.82 + t * 2.3) * 0.045 + cos((p.x - p.z) * 0.61 + t * 1.9) * 0.032;
      float dz2 = cos(p.z * 0.74 - t * 2.0) * 0.045 + cos((p.x - p.z) * 0.61 + t * 1.9) * 0.032;

      p.y += h;
      vWave = h / amp;
      vNormalW = normalize(vec3(-(dx + dx2), 1.0, -(dz + dz2)));

      vec4 wp = modelMatrix * vec4(p, 1.0);
      vWorld = wp.xyz;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `,
});

const waterGeo = new THREE.PlaneGeometry(620, 620, 160, 160);
waterGeo.rotateX(-Math.PI / 2);
const water = new THREE.Mesh(waterGeo, waterMat);
water.position.y = 0;
water.receiveShadow = false;
scene.add(water);

/* --------------------------------------------------------------------------
   Terrain
   -------------------------------------------------------------------------- */

const terrainGeo = new THREE.PlaneGeometry(80, 80, 128, 128);
terrainGeo.rotateX(-Math.PI / 2);
const tPos = terrainGeo.attributes.position;
const tColors = new Float32Array(tPos.count * 3);
const cDeep = new THREE.Color("#44544c");
const cSand = new THREE.Color("#b09a74");
const cWet = new THREE.Color("#6a7261");
const cRock = new THREE.Color("#59605b");
const cGrassA = new THREE.Color("#34452c");
const cGrassB = new THREE.Color("#5c6642");
const cThyme = new THREE.Color("#6c5e7e");
const cTemp = new THREE.Color();

for (let i = 0; i < tPos.count; i++) {
  const x = tPos.getX(i);
  const z = tPos.getZ(i);
  const h = terrainHeight(x, z);
  tPos.setY(i, h);

  const e = 0.7;
  const sx = (terrainHeight(x + e, z) - terrainHeight(x - e, z)) / (2 * e);
  const sz = (terrainHeight(x, z + e) - terrainHeight(x, z - e)) / (2 * e);
  const slope = Math.hypot(sx, sz);
  const n = fbm2(x * 0.21 + 3, z * 0.21 - 7);

  if (h < 0.25) cTemp.copy(cDeep);
  else if (h < 0.9) cTemp.copy(cWet);
  else if (h < 1.9) cTemp.copy(cSand);
  else if (slope > 0.62) cTemp.copy(cRock);
  else {
    cTemp.copy(cGrassA).lerp(cGrassB, clamp(n * 1.15, 0, 1));
    const thyme = fbm2(x * 0.085 - 20, z * 0.085 + 8);
    if (thyme > 0.58 && h > 2.4) cTemp.lerp(cThyme, clamp((thyme - 0.58) * 1.5, 0, 0.55));
  }
  // a broad pale apron of sand around the secret cove
  const coveD = Math.hypot(x - 22.5, z - 14.5);
  if (coveD < 6.9 && h > 0.1 && h < 3.6) {
    cTemp.lerp(cSand, smoothstep(6.9, 2.0, coveD) * 0.9);
  }
  if (slope > 0.92) cTemp.lerp(cRock, 0.5);
  if (h < 1.9 && slope < 0.35) cTemp.lerp(cSand, 0.4);

  cTemp.offsetHSL(0, 0, (fbm2(x * 0.9 + 11, z * 0.9) - 0.5) * 0.045);
  tColors[i * 3] = cTemp.r;
  tColors[i * 3 + 1] = cTemp.g;
  tColors[i * 3 + 2] = cTemp.b;
}

terrainGeo.setAttribute("color", new THREE.BufferAttribute(tColors, 3));
terrainGeo.computeVertexNormals();

const terrainMat = new THREE.MeshStandardMaterial({
  vertexColors: true,
  roughness: 1,
  metalness: 0,
  flatShading: true,
  map: makeNoiseTexture(128, 0.8, 26, 26),
});
const terrain = new THREE.Mesh(terrainGeo, terrainMat);
terrain.receiveShadow = true;
terrain.castShadow = false;
scene.add(terrain);

// a soft surf line that follows the island's outline
{
  const segments = 160;
  const positions = [];
  const indices = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const r = islandRadius(a);
    positions.push(Math.cos(a) * r * 0.995, 0.1, Math.sin(a) * r * 0.995);
    positions.push(Math.cos(a) * r * 1.018, 0.06, Math.sin(a) * r * 1.018);
  }
  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  const m = new THREE.MeshBasicMaterial({
    color: 0xa9c6bd,
    transparent: true,
    opacity: 0.05,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const surf = new THREE.Mesh(g, m);
  surf.renderOrder = 2;
  scene.add(surf);
  window.__surf = surf;
}

/* --------------------------------------------------------------------------
   Materials
   -------------------------------------------------------------------------- */

const stoneTex = makeNoiseTexture(128, 0.72, 2.2, 2.2);
const masonryTex = makeMasonryTexture();
const woodTex = makeWoodTexture();
const stoneMat = new THREE.MeshStandardMaterial({
  color: 0xa39c8b,
  roughness: 0.92,
  flatShading: true,
  map: masonryTex,
});
const stoneDarkMat = new THREE.MeshStandardMaterial({
  color: 0x6f7168,
  roughness: 0.95,
  flatShading: true,
  map: stoneTex,
});
const slateMat = new THREE.MeshStandardMaterial({
  color: 0x414d53,
  roughness: 0.82,
  flatShading: true,
  map: stoneTex,
});
const roofMat = new THREE.MeshStandardMaterial({
  color: 0x5b686e,
  roughness: 0.78,
  flatShading: true,
  map: makeRoofTexture(),
});
const cedarMat = new THREE.MeshStandardMaterial({
  color: 0xa98463,
  roughness: 0.92,
  flatShading: true,
  map: makeShingleTexture(),
});
const woodMat = new THREE.MeshStandardMaterial({
  color: 0x8a6a4a,
  roughness: 0.9,
  flatShading: true,
  map: woodTex,
});
const woodDarkMat = new THREE.MeshStandardMaterial({
  color: 0x5c4632,
  roughness: 0.92,
  flatShading: true,
  map: woodTex,
});
const bronzeMat = new THREE.MeshStandardMaterial({
  color: 0x9a7a3c,
  roughness: 0.42,
  metalness: 0.72,
  flatShading: true,
});
const darkMat = new THREE.MeshStandardMaterial({
  color: 0x171b18,
  roughness: 0.95,
});
const creamMat = new THREE.MeshStandardMaterial({
  color: 0xd9cfb8,
  roughness: 0.85,
  flatShading: true,
});
const trunkMat = new THREE.MeshStandardMaterial({
  color: 0x55402e,
  roughness: 0.98,
  flatShading: true,
});

/* --------------------------------------------------------------------------
   Geometry helpers
   -------------------------------------------------------------------------- */

function box(w, h, d, mat, x = 0, y = 0, z = 0, parent, shadow = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = shadow;
  mesh.receiveShadow = true;
  if (parent) parent.add(mesh);
  return mesh;
}

function gable(w, h, d, mat) {
  const hw = w / 2;
  const hd = d / 2;
  const pos = [
    -hw, 0, -hd, hw, 0, -hd, 0, h, -hd,
    -hw, 0, hd, hw, 0, hd, 0, h, hd,
  ];
  const idx = [
    0, 2, 1,
    3, 4, 5,
    0, 5, 2, 0, 3, 5,
    1, 2, 5, 1, 5, 4,
  ];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function archWindow(w, h, warm = true) {
  const r = w / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-r, 0);
  shape.lineTo(r, 0);
  shape.lineTo(r, h - r);
  shape.absarc(0, h - r, r, 0, Math.PI, false);
  shape.lineTo(-r, 0);
  const geo = new THREE.ShapeGeometry(shape, 10);
  const mat = new THREE.MeshBasicMaterial({
    color: warm ? 0xffbd72 : 0x1c2320,
    toneMapped: false,
  });
  return new THREE.Mesh(geo, mat);
}

function addWindow(parent, x, y, z, rotY, w = 0.62, h = 1.3, warm = true) {
  const frame = archWindow(w + 0.2, h + 0.2, false);
  frame.position.set(x, y - 0.1, z);
  frame.rotation.y = rotY;
  frame.position.x += Math.sin(rotY) * 0.02;
  frame.position.z += Math.cos(rotY) * 0.02;
  parent.add(frame);

  const win = archWindow(w, h, warm);
  win.position.set(x, y, z);
  win.rotation.y = rotY;
  win.position.x += Math.sin(rotY) * 0.045;
  win.position.z += Math.cos(rotY) * 0.045;
  parent.add(win);
}

/* --------------------------------------------------------------------------
   Manor
   -------------------------------------------------------------------------- */

const manorGroup = new THREE.Group();
const manorY = terrainHeight(MANOR_X, MANOR_Z);
manorGroup.position.set(MANOR_X, manorY, MANOR_Z);
manorGroup.userData.placeId = "manor";
scene.add(manorGroup);

// terrace and foundation
box(13.5, 0.22, 10.5, stoneDarkMat, 0, 0.06, 1.2, manorGroup);
box(11.4, 1.7, 9.2, stoneDarkMat, 0, 0.9, 0, manorGroup);
box(7.7, 4.5, 8.7, stoneMat, 0, 3.95, 0, manorGroup);

// roof
const mainRoof = gable(8.6, 3.0, 9.7, roofMat);
mainRoof.position.set(0, 6.2, 0);
manorGroup.add(mainRoof);
box(0.22, 0.16, 9.75, roofMat, 0, 9.24, 0, manorGroup);

// east wing
box(3.7, 3.6, 5.4, stoneMat, 4.85, 3.05, 1.15, manorGroup);
const wingRoof = gable(4.5, 2.3, 6.1, roofMat);
wingRoof.position.set(4.85, 4.85, 1.15);
manorGroup.add(wingRoof);

// tower — Alice's turret
const turret = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.72, 6.6, 12), stoneMat);
turret.position.set(-3.65, 4.1, 2.85);
turret.castShadow = true;
turret.receiveShadow = true;
manorGroup.add(turret);
const turretCorbel = new THREE.Mesh(new THREE.CylinderGeometry(1.82, 1.82, 0.3, 12), stoneDarkMat);
turretCorbel.position.set(-3.65, 7.34, 2.85);
turretCorbel.castShadow = true;
manorGroup.add(turretCorbel);
const turretLedge = new THREE.Mesh(new THREE.CylinderGeometry(1.74, 1.74, 0.14, 12), stoneDarkMat);
turretLedge.position.set(-3.65, 4.16, 2.85);
manorGroup.add(turretLedge);
const towerRoof = new THREE.Mesh(new THREE.ConeGeometry(2.12, 3.7, 12), roofMat);
towerRoof.position.set(-3.65, 9.35, 2.85);
towerRoof.castShadow = true;
manorGroup.add(towerRoof);
const finial = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 4), darkMat);
finial.position.set(-3.65, 11.5, 2.85);
manorGroup.add(finial);

// chimneys
for (const [cx, cz, h] of [
  [-2.2, -1.6, 2.1],
  [1.7, 0.9, 1.8],
]) {
  box(0.72, h, 0.72, stoneDarkMat, cx, 7.4 + h / 2 - 0.6, cz, manorGroup);
  box(0.94, 0.18, 0.94, stoneDarkMat, cx, 7.4 + h - 0.6, cz, manorGroup);
}

// windows — front
for (const [x, y, warm] of [
  [-2.35, 2.3, true],
  [-2.35, 4.3, true],
  [-1.1, 2.3, true],
  [-1.1, 4.3, false],
  [1.35, 2.3, true],
  [1.35, 4.3, true],
  [2.9, 2.4, false],
]) {
  addWindow(manorGroup, x, y, 4.39, 0, 0.6, 1.45, warm);
}
// tower front
addWindow(manorGroup, -3.65, 5.05, 4.44, 0, 0.62, 1.25, true);
addWindow(manorGroup, -3.65, 6.45, 4.44, 0, 0.5, 0.9, false);
addWindow(manorGroup, -3.65, 3.55, 4.44, 0, 0.56, 1.1, true);
// turret side window, facing west
addWindow(manorGroup, -5.19, 4.8, 2.85, -Math.PI / 2, 0.5, 0.9, true);
// sides
for (const [x, z, rot, y] of [
  [3.88, -1.9, Math.PI / 2, 2.4],
  [3.88, 1.0, Math.PI / 2, 2.4],
  [-3.88, -1.5, -Math.PI / 2, 3.0],
  [-3.88, -1.5, -Math.PI / 2, 4.6],
]) {
  addWindow(manorGroup, x, y, z, rot, 0.62, 1.35, true);
}
// wing windows
addWindow(manorGroup, 4.85, 2.4, 3.86, 0, 0.55, 1.15, true);
addWindow(manorGroup, 4.85, 2.4, -1.56, Math.PI, 0.55, 1.15, false);

// entrance
box(1.35, 2.55, 0.22, woodDarkMat, 0.1, 2.15, 4.43, manorGroup);
const doorArch = archWindow(1.5, 2.9, false);
doorArch.position.set(0.1, 0.9, 4.46);
manorGroup.add(doorArch);
for (const s of [0, 1, 2]) {
  box(2.5 - s * 0.2, 0.18, 0.55, stoneDarkMat, 0.1, 0.95 - s * 0.19, 5.15 + s * 0.5, manorGroup);
}
for (const cx of [-1.25, 1.45]) {
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 2.7, 7), stoneDarkMat);
  col.position.set(cx, 2.55, 5.25);
  col.castShadow = true;
  manorGroup.add(col);
}
const portico = gable(3.0, 0.72, 1.3, roofMat);
portico.position.set(0.1, 3.95, 5.42);
manorGroup.add(portico);
const lantern = new THREE.PointLight(0xffa95e, 18, 14, 2);
lantern.position.set(0.1, 3.4, 5.6);
manorGroup.add(lantern);
const turretLight = new THREE.PointLight(0xffb46a, 7, 8, 2);
turretLight.position.set(-3.65, 4.3, 5.1);
manorGroup.add(turretLight);

// stone terrace furniture — a bench and urns
for (const x of [-4.2, 4.4]) {
  const urn = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.18, 0.6, 8), stoneMat);
  urn.position.set(x, 0.5, 5.3);
  urn.castShadow = true;
  manorGroup.add(urn);
  const plant = new THREE.Mesh(new THREE.IcosahedronGeometry(0.46, 0), new THREE.MeshStandardMaterial({ color: 0x465a38, roughness: 1, flatShading: true }));
  plant.position.set(x, 0.98, 5.3);
  manorGroup.add(plant);
}

/* --------------------------------------------------------------------------
   Boathouse
   -------------------------------------------------------------------------- */

const bhTheta = 2.82;
const bhRadius = islandRadius(bhTheta) * 1.025;
const bhPos = new THREE.Vector3(Math.cos(bhTheta) * bhRadius, 0, Math.sin(bhTheta) * bhRadius);
const boathouse = new THREE.Group();
boathouse.position.set(bhPos.x, 0.3, bhPos.z);
boathouse.rotation.y = Math.atan2(bhPos.x, bhPos.z);
boathouse.userData.placeId = "boathouse";
scene.add(boathouse);

// piles
for (const [px, pz] of [
  [-2.4, -2.2],
  [2.4, -2.2],
  [-2.4, 2.3],
  [2.4, 2.3],
  [0, -2.2],
]) {
  const pile = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 5, 6), woodDarkMat);
  pile.position.set(px, -1.2, pz);
  pile.castShadow = true;
  boathouse.add(pile);
}
box(7.2, 0.32, 6.6, woodMat, 0, 1.35, 0.25, boathouse);
box(5.9, 3.15, 5.5, cedarMat, 0, 3.1, -0.15, boathouse);
const bhRoof = gable(6.7, 1.95, 6.2, roofMat);
bhRoof.position.set(0, 4.68, -0.15);
boathouse.add(bhRoof);
box(0.18, 0.14, 6.25, roofMat, 0, 6.66, -0.15, boathouse);
box(6.0, 0.18, 0.22, creamMat, 0, 4.5, 2.54, boathouse);
box(0.18, 3.2, 0.16, creamMat, -2.85, 3.05, 2.56, boathouse);
box(0.18, 3.2, 0.16, creamMat, 2.85, 3.05, 2.56, boathouse);

// big boat door
box(3.1, 2.55, 0.16, woodDarkMat, 0.15, 2.55, 2.66, boathouse);
box(0.24, 2.6, 0.5, creamMat, -1.55, 2.55, 2.62, boathouse);
box(0.24, 2.6, 0.5, creamMat, 1.87, 2.55, 2.62, boathouse);
box(0.2, 2.6, 0.3, creamMat, 0.15, 2.55, 2.7, boathouse);
// name board
const bhSign = new THREE.Mesh(
  new THREE.PlaneGeometry(1.45, 0.36),
  new THREE.MeshBasicMaterial({ map: makeSignTexture("THE LIZZIE") })
);
bhSign.position.set(0.2, 4.04, 2.69);
boathouse.add(bhSign);
// small side window
addWindow(boathouse, 2.3, 3.15, 2.72, 0, 0.42, 0.7, true);
// roof vent
box(0.5, 0.55, 0.5, roofMat, 0.8, 7.15, 0.2, boathouse);

// rowboat tied up outside
function makeRowboat(scale = 1) {
  const g = new THREE.Group();
  const hull = new THREE.Mesh(makeHullGeometry(), creamMat);
  hull.scale.set(0.62, 0.55, 0.68);
  hull.castShadow = true;
  hull.receiveShadow = true;
  g.add(hull);
  box(0.95, 0.06, 2.6, woodMat, 0, 0.31, -0.1, g);
  box(1.0, 0.1, 0.26, woodMat, 0, 0.35, 0.2, g);
  g.scale.setScalar(scale);
  g.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return g;
}

const rowboat = makeRowboat(0.6);
rowboat.position.set(2.7, -0.12, 4.9);
rowboat.rotation.y = 0.5;
boathouse.add(rowboat);

const boathousePlace = PLACES.find((p) => p.id === "boathouse");
boathousePlace.anchor.set(bhPos.x, 7.1, bhPos.z);
boathousePlace.target.set(bhPos.x, 3.2, bhPos.z);

/* --------------------------------------------------------------------------
   Dock and steps
   -------------------------------------------------------------------------- */

const dockTheta = 1.235;
const dockR = islandRadius(dockTheta) * 0.955;
const dockPos = new THREE.Vector3(Math.cos(dockTheta) * dockR, 0, Math.sin(dockTheta) * dockR);
const dockGroup = new THREE.Group();
dockGroup.position.set(dockPos.x, 0.55, dockPos.z);
dockGroup.rotation.y = Math.atan2(Math.cos(dockTheta), Math.sin(dockTheta));
dockGroup.userData.placeId = "dock";
scene.add(dockGroup);

const dockPlace = PLACES.find((p) => p.id === "dock");
const dockOut = new THREE.Vector3(Math.cos(dockTheta), 0, Math.sin(dockTheta));
dockPlace.anchor.set(dockPos.x + dockOut.x * 7.0, 2.1, dockPos.z + dockOut.z * 7.0);
dockPlace.target.set(dockPos.x + dockOut.x * 4.8, 1.1, dockPos.z + dockOut.z * 4.8);

box(2.6, 0.22, 10.5, woodMat, 0, 0, 3.6, dockGroup);
box(0.18, 0.28, 10.5, woodDarkMat, -1.22, 0.08, 3.6, dockGroup);
box(0.18, 0.28, 10.5, woodDarkMat, 1.22, 0.08, 3.6, dockGroup);
for (let i = 0; i < 7; i++) {
  const z = -1.2 + i * 1.55;
  for (const x of [-1.15, 1.15]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 5.5, 6), woodDarkMat);
    post.position.set(x, -2.1, z);
    post.castShadow = true;
    dockGroup.add(post);
  }
}
// cleats and a coil of rope
for (const z of [1.2, 6.4]) {
  box(0.42, 0.12, 0.12, darkMat, 0.85, 0.2, z, dockGroup);
  box(0.12, 0.12, 0.42, darkMat, 0.85, 0.2, z, dockGroup);
}
const rope = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.055, 5, 12), new THREE.MeshStandardMaterial({ color: 0xc9b792, roughness: 1 }));
rope.rotation.x = Math.PI / 2;
rope.position.set(0.62, 0.18, 4.9);
dockGroup.add(rope);

// slate steps from the dock up to the manor
const stepStart = new THREE.Vector2(
  Math.cos(dockTheta) * islandRadius(dockTheta) * 0.9,
  Math.sin(dockTheta) * islandRadius(dockTheta) * 0.9
);
const stepEnd = new THREE.Vector2(MANOR_X + 0.1, MANOR_Z + 8.2);
const stepMid = new THREE.Vector2(
  (stepStart.x + stepEnd.x) / 2 + 5.4,
  (stepStart.y + stepEnd.y) / 2 - 1.8
);
const stepCurve = new THREE.QuadraticBezierCurve(stepStart, stepMid, stepEnd);
const stepCount = 26;
for (let i = 0; i <= stepCount; i++) {
  const t = i / stepCount;
  const p = stepCurve.getPoint(t);
  const tan = stepCurve.getTangent(t);
  const y = terrainHeight(p.x, p.y);
  const step = box(2.15, 0.24, 0.98, slateMat, p.x, y + 0.16, p.y, null);
  step.rotation.y = Math.atan2(tan.x, tan.y);
  step.rotation.z = (rand() - 0.5) * 0.02;
  scene.add(step);
}

/* --------------------------------------------------------------------------
   Fog bell
   -------------------------------------------------------------------------- */

const bellGroup = new THREE.Group();
const bellGround = terrainHeight(9.5, 16);
bellGroup.position.set(9.5, Math.max(bellGround, 0.2), 16);
bellGroup.userData.placeId = "bell";
scene.add(bellGroup);

box(1.9, 0.3, 1.2, stoneDarkMat, 0, 0.1, 0, bellGroup);
for (const x of [-0.82, 0.82]) {
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 2.7, 6), woodDarkMat);
  post.position.set(x, 1.55, 0);
  post.rotation.z = x > 0 ? -0.11 : 0.11;
  post.castShadow = true;
  bellGroup.add(post);
}
box(2.1, 0.16, 0.16, woodDarkMat, 0, 2.78, 0, bellGroup);
const bellPivot = new THREE.Group();
bellPivot.position.set(0, 2.72, 0);
bellGroup.add(bellPivot);
const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.46, 0.62, 12, 1, true), bronzeMat);
bell.position.y = -0.36;
bell.castShadow = true;
bellPivot.add(bell);
const bellTop = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.2, 0.16, 8), bronzeMat);
bellTop.position.y = -0.02;
bellPivot.add(bellTop);
const clapper = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 4), bronzeMat);
clapper.position.y = -0.64;
bellPivot.add(clapper);
const bellRope = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.7, 4), new THREE.MeshStandardMaterial({ color: 0xbfae8a, roughness: 1 }));
bellRope.position.set(0.1, 1.35, 0);
bellGroup.add(bellRope);

/* --------------------------------------------------------------------------
   Stone walls
   -------------------------------------------------------------------------- */

const wallStones = [];
for (let arc = 0; arc < 2; arc++) {
  const radius = arc === 0 ? 14.2 : 18.6;
  const a0 = arc === 0 ? 2.05 : 2.55;
  const a1 = arc === 0 ? 3.45 : 3.15;
  const count = arc === 0 ? 58 : 42;
  for (let i = 0; i < count; i++) {
    const a = lerp(a0, a1, i / (count - 1));
    const x = MANOR_X + Math.cos(a) * radius;
    const z = MANOR_Z + Math.sin(a) * radius;
    const y = terrainHeight(x, z);
    if (y < 1.2) continue;
    wallStones.push({ x, y, z, a });
  }
}

const wallMesh = new THREE.InstancedMesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x8c897c, roughness: 1, flatShading: true, map: stoneTex }),
  wallStones.length
);
const dummy = new THREE.Object3D();
const wallColor = new THREE.Color();
wallStones.forEach((s, i) => {
  const height = 0.55 + rand() * 0.25;
  dummy.position.set(s.x, s.y + height / 2 + 0.1, s.z);
  dummy.rotation.set(0, -s.a + Math.PI / 2 + (rand() - 0.5) * 0.2, (rand() - 0.5) * 0.06);
  dummy.scale.set(0.8 + rand() * 0.35, height, 0.48 + rand() * 0.18);
  dummy.updateMatrix();
  wallMesh.setMatrixAt(i, dummy.matrix);
  wallColor.setHSL(0.12, 0.05, 0.42 + rand() * 0.18);
  wallMesh.setColorAt(i, wallColor);
});
wallMesh.castShadow = true;
wallMesh.receiveShadow = true;
scene.add(wallMesh);

/* --------------------------------------------------------------------------
   Shoreline boulders
   -------------------------------------------------------------------------- */

const boulderCount = 52;
const boulders = new THREE.InstancedMesh(
  new THREE.DodecahedronGeometry(1, 0),
  new THREE.MeshStandardMaterial({ color: 0x6d6d62, roughness: 1, flatShading: true, map: stoneTex }),
  boulderCount
);
const boulderColor = new THREE.Color();
for (let i = 0; i < boulderCount; i++) {
  const a = rand() * Math.PI * 2;
  const R = islandRadius(a);
  const rr = R * (0.9 + rand() * 0.16);
  const x = Math.cos(a) * rr;
  const z = Math.sin(a) * rr;
  const h = terrainHeight(x, z);
  const s = 0.3 + rand() * 0.8;
  dummy.position.set(x, Math.max(h + 0.15, 0.05), z);
  dummy.rotation.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI);
  dummy.scale.set(s * (1.2 + rand() * 0.5), s * (0.5 + rand() * 0.5), s);
  dummy.updateMatrix();
  boulders.setMatrixAt(i, dummy.matrix);
  boulderColor.setHSL(0.14, 0.04, 0.34 + rand() * 0.16);
  boulders.setColorAt(i, boulderColor);
}
boulders.castShadow = true;
boulders.receiveShadow = true;
scene.add(boulders);

/* --------------------------------------------------------------------------
   Thyme
   -------------------------------------------------------------------------- */

const tuftGeo = new THREE.ConeGeometry(0.17, 0.46, 3);
tuftGeo.translate(0, 0.23, 0);
const bloomGeo = new THREE.IcosahedronGeometry(0.105, 0);
const TUFTS = 1200;
const BLOOMS = 800;
const tuftMesh = new THREE.InstancedMesh(
  tuftGeo,
  new THREE.MeshStandardMaterial({ color: 0x4b5833, roughness: 1, flatShading: true }),
  TUFTS
);
const bloomMesh = new THREE.InstancedMesh(
  bloomGeo,
  new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, flatShading: true }),
  BLOOMS
);
const bloomPalette = [
  new THREE.Color("#cfc4e0"),
  new THREE.Color("#8977ad"),
  new THREE.Color("#6f5f8c"),
  new THREE.Color("#e5dccb"),
  new THREE.Color("#a896c4"),
];

let ti = 0;
let bi = 0;
let attempts = 0;
while ((ti < TUFTS || bi < BLOOMS) && attempts < 24000) {
  attempts++;
  const a = rand() * Math.PI * 2;
  const rad = Math.sqrt(rand()) * 28.5;
  const x = Math.cos(a) * rad;
  const z = Math.sin(a) * rad;
  const h = terrainHeight(x, z);
  if (h < 1.5 || h > 7.6) continue;
  if (Math.hypot(x - MANOR_X, z - MANOR_Z) < 7.4) continue;
  if (Math.hypot(x - 6.5, z + 7) < 2.3) continue;
  if (Math.hypot(x - 9.5, z - 16) < 1.8) continue;
  if (Math.hypot(x - 20, z - 14) < 3.4) continue;
  if (Math.hypot(x - 11.2, z + 12.6) < 3.2) continue;
  if (Math.hypot(x - 14.6, z + 10.0) < 3.2) continue;
  if (Math.hypot(x - 17.4, z + 13.4) < 3.2) continue;
  if (Math.abs(z - 20) < 2.6 && x > 0 && x < 10) continue;

  const s = 0.65 + rand() * 0.95;
  dummy.position.set(x, h + 0.05, z);
  dummy.rotation.set(0, rand() * Math.PI, 0);
  dummy.scale.set(s, s * (0.8 + rand() * 0.7), s);
  dummy.updateMatrix();

  if (ti < TUFTS) {
    tuftMesh.setMatrixAt(ti++, dummy.matrix);
  }
  if (bi < BLOOMS && rand() > 0.22) {
    dummy.position.y = h + 0.3 * s + rand() * 0.18;
    dummy.scale.setScalar(0.7 + rand() * 0.9);
    dummy.updateMatrix();
    bloomMesh.setMatrixAt(bi, dummy.matrix);
    bloomMesh.setColorAt(bi, bloomPalette[Math.floor(rand() * bloomPalette.length)]);
    bi++;
  }
}
if (ti < TUFTS) tuftMesh.count = ti;
if (bi < BLOOMS) bloomMesh.count = bi;
tuftMesh.castShadow = true;
tuftMesh.receiveShadow = true;
bloomMesh.castShadow = false;
bloomMesh.receiveShadow = true;
scene.add(tuftMesh, bloomMesh);

/* --------------------------------------------------------------------------
   Trees
   -------------------------------------------------------------------------- */

const treeSpots = [
  [-8.5, -10.5, 1.25],
  [-13, -2.5, 1.1],
  [-13.5, 13.5, 1.15],
  [14.5, 6.5, 0.95],
  [-20, 13.5, 0.85],
  [10, 9, 0.8],
  [-17.5, -8.5, 1.0],
  [19, -1.5, 0.75],
  [-7.5, 16.5, 0.85],
  [20.5, -5.0, 0.8],
  [9.5, -17.5, 0.9],
  [-14.5, -15.5, 0.95],
];

const trunkGeo = new THREE.CylinderGeometry(0.2, 0.34, 1, 5);
const canopyGeo = new THREE.IcosahedronGeometry(1, 0);
const trunkMesh = new THREE.InstancedMesh(trunkGeo, trunkMat, treeSpots.length);
const canopyMesh = new THREE.InstancedMesh(
  canopyGeo,
  new THREE.MeshStandardMaterial({ color: 0x3b4b2e, roughness: 1, flatShading: true }),
  treeSpots.length * 3
);
const canopyColor = new THREE.Color();

treeSpots.forEach(([x, z, s], i) => {
  const h = terrainHeight(x, z);
  const trunkH = (2.6 + rand() * 1.5) * s;
  dummy.position.set(x, h + trunkH / 2, z);
  dummy.rotation.set(0, rand() * Math.PI, (rand() - 0.5) * 0.06);
  dummy.scale.set(s, trunkH, s);
  dummy.updateMatrix();
  trunkMesh.setMatrixAt(i, dummy.matrix);

  for (let j = 0; j < 3; j++) {
    const k = i * 3 + j;
    const r = (1.25 + rand() * 0.85) * s;
    dummy.position.set(
      x + (rand() - 0.5) * 1.9 * s,
      h + trunkH + (rand() - 0.5) * 0.7 * s,
      z + (rand() - 0.5) * 1.9 * s
    );
    dummy.rotation.set(rand(), rand() * Math.PI, rand());
    dummy.scale.set(r * (1 + rand() * 0.3), r, r * (1 + rand() * 0.3));
    dummy.updateMatrix();
    canopyMesh.setMatrixAt(k, dummy.matrix);
    canopyColor.setHSL(0.24 + rand() * 0.03, 0.24 + rand() * 0.1, 0.27 + rand() * 0.1);
    canopyMesh.setColorAt(k, canopyColor);
  }
});
trunkMesh.castShadow = true;
trunkMesh.receiveShadow = true;
canopyMesh.castShadow = true;
canopyMesh.receiveShadow = true;
scene.add(trunkMesh, canopyMesh);

// Franklin's red oak
const oakGroup = new THREE.Group();
const oakX = 6.5;
const oakZ = -7;
const oakGround = terrainHeight(oakX, oakZ);
oakGroup.position.set(oakX, oakGround, oakZ);
oakGroup.userData.placeId = "oak";
scene.add(oakGroup);

const oakTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.78, 6.2, 7), trunkMat);
oakTrunk.position.y = 3.1;
oakTrunk.castShadow = true;
oakGroup.add(oakTrunk);
for (const [rot, y] of [
  [0.32, 5.1],
  [-0.45, 5.5],
]) {
  const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.32, 3.6, 5), trunkMat);
  branch.position.set(rot * 1.4, y, 0.2);
  branch.rotation.z = -rot;
  branch.castShadow = true;
  oakGroup.add(branch);
}
const oakLeafMat = new THREE.MeshStandardMaterial({
  color: 0x4b5b33,
  roughness: 1,
  flatShading: true,
});
for (let i = 0; i < 9; i++) {
  const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), oakLeafMat);
  const a = (i / 9) * Math.PI * 2;
  const rr = i === 0 ? 0 : 2.1 + rand() * 1.5;
  blob.position.set(Math.cos(a) * rr, 7.4 + rand() * 2.2, Math.sin(a) * rr * 0.85);
  const sc = 1.8 + rand() * 1.6;
  blob.scale.set(sc * (1 + rand() * 0.3), sc, sc * (1 + rand() * 0.2));
  blob.rotation.set(rand(), rand(), rand());
  blob.castShadow = true;
  oakGroup.add(blob);
}

/* --------------------------------------------------------------------------
   Secret beach details
   -------------------------------------------------------------------------- */

const beachGroup = new THREE.Group();
beachGroup.userData.placeId = "beach";
scene.add(beachGroup);

const beachBoat = makeRowboat(0.44);
beachBoat.position.set(21.8, terrainHeight(21.8, 14.2) + 0.18, 14.2);
beachBoat.rotation.set(-0.08, 2.05, 0.12);
beachGroup.add(beachBoat);

const driftwood = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 3.2, 6), woodDarkMat);
driftwood.rotation.set(1.4, 0.4, 0.3);
driftwood.position.set(22.6, terrainHeight(22.6, 14.2) + 0.18, 14.2);
driftwood.castShadow = true;
beachGroup.add(driftwood);

for (const [x, z, s] of [
  [21.2, 13.2, 0.55],
  [22.2, 13.8, 0.32],
  [23.8, 14.8, 0.6],
  [24.1, 13.8, 0.4],
]) {
  const h = terrainHeight(x, z);
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1, 0), stoneDarkMat);
  rock.position.set(x, Math.max(h, 0.05) + 0.08, z);
  rock.scale.set(s * 1.4, s * 0.7, s);
  rock.rotation.set(rand(), rand(), rand());
  rock.castShadow = true;
  beachGroup.add(rock);
}

/* --------------------------------------------------------------------------
   Staff cottages on the north lawn
   -------------------------------------------------------------------------- */

const cottageMats = [
  new THREE.MeshStandardMaterial({ color: 0xdbd2be, roughness: 0.94, flatShading: true, map: masonryTex }),
  new THREE.MeshStandardMaterial({ color: 0xc9c3ad, roughness: 0.94, flatShading: true, map: masonryTex }),
  new THREE.MeshStandardMaterial({ color: 0xbfc6b1, roughness: 0.94, flatShading: true, map: masonryTex }),
];
const shutterMat = new THREE.MeshStandardMaterial({ color: 0x3d4a3e, roughness: 0.9, flatShading: true });

const cottageCluster = new THREE.Group();
scene.add(cottageCluster);

function buildCottage(x, z, rot, idx) {
  const g = new THREE.Group();
  g.position.set(x, terrainHeight(x, z), z);
  g.rotation.y = rot;
  cottageCluster.add(g);

  box(3.5, 0.45, 4.15, stoneDarkMat, 0, 0.22, 0, g);
  box(3.0, 2.5, 3.5, cottageMats[idx], 0, 1.7, 0, g);

  const roof = gable(3.7, 1.65, 4.1, roofMat);
  roof.position.set(0, 2.95, 0);
  g.add(roof);
  box(0.22, 0.14, 4.15, roofMat, 0, 4.63, 0, g);

  box(0.44, 2.0, 0.44, stoneDarkMat, 1.05, 3.9, 0.5, g);
  box(0.6, 0.16, 0.6, stoneDarkMat, 1.05, 4.93, 0.5, g);

  box(0.74, 1.35, 0.14, woodDarkMat, -0.55, 1.2, 1.79, g);
  box(1.2, 0.12, 0.8, woodMat, -0.55, 0.56, 2.12, g);

  addWindow(g, 0.55, 1.1, 1.8, 0, 0.34, 0.6, true);
  addWindow(g, 0.55, 2.02, 1.8, 0, 0.3, 0.42, idx === 1);
  addWindow(g, 1.51, 1.35, -0.2, Math.PI / 2, 0.32, 0.58, true);
  addWindow(g, -1.51, 1.35, -0.2, -Math.PI / 2, 0.32, 0.58, false);

  for (const sx of [0.27, 0.83]) {
    box(0.07, 0.58, 0.06, shutterMat, sx, 1.12, 1.84, g);
  }

  box(0.09, 2.0, 0.09, woodDarkMat, -1.2, 1.45, 2.36, g);
  box(0.09, 2.0, 0.09, woodDarkMat, 0.18, 1.45, 2.36, g);
  const porch = gable(1.8, 0.55, 1.05, roofMat);
  porch.position.set(-0.52, 2.45, 2.3);
  g.add(porch);

  // a narrow flower border under the front window
  box(1.3, 0.12, 0.3, woodDarkMat, 0.55, 0.48, 2.15, g);
  for (let i = 0; i < 5; i++) {
    const bloom = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.1, 0),
      new THREE.MeshStandardMaterial({ color: i % 2 ? 0xc9bed8 : 0xe4dac4, roughness: 0.9 })
    );
    bloom.position.set(0.1 + i * 0.24, 0.64, 2.12 + (i % 2) * 0.08);
    g.add(bloom);
  }
}

[
  { x: 11.2, z: -12.6, rot: -0.1 },
  { x: 14.6, z: -10.0, rot: 0.22 },
  { x: 17.4, z: -13.4, rot: 0.42 },
].forEach((c, i) => buildCottage(c.x, c.z, c.rot, i));

const cottageLight = new THREE.PointLight(0xffb877, 16, 20, 2);
cottageLight.position.set(14.4, 7.3, -11.6);
scene.add(cottageLight);

// stone lane from the manor's east lawn to the cottages
const laneCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(6.2, 0, 4.4),
  new THREE.Vector3(8.6, 0, 0.8),
  new THREE.Vector3(9.7, 0, -5.0),
  new THREE.Vector3(13.2, 0, -9.4),
]);
for (let i = 0; i <= 18; i++) {
  const p = laneCurve.getPoint(i / 18);
  const tan = laneCurve.getTangent(i / 18);
  const slab = box(1.05, 0.1, 0.72, stoneMat, p.x, terrainHeight(p.x, p.z) + 0.07, p.z, null);
  slab.rotation.y = Math.atan2(tan.x, tan.z);
  slab.rotation.z = (rand() - 0.5) * 0.03;
}

// a weathered bench where the lane turns toward the sea
{
  const bench = new THREE.Group();
  const bx = 10.1;
  const bz = -7.6;
  bench.position.set(bx, terrainHeight(bx, bz), bz);
  bench.rotation.y = 1.1;
  box(1.7, 0.12, 0.5, woodMat, 0, 0.55, 0, bench);
  box(1.7, 0.5, 0.1, woodMat, 0, 0.85, -0.22, bench);
  box(0.12, 0.55, 0.42, woodDarkMat, -0.65, 0.28, 0, bench);
  box(0.12, 0.55, 0.42, woodDarkMat, 0.65, 0.28, 0, bench);
  bench.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });
  scene.add(bench);
}

/* --------------------------------------------------------------------------
   The Lizzie
   -------------------------------------------------------------------------- */

function makeHullGeometry() {
  const sections = [
    { z: -2.9, w: 0.5 },
    { z: -2.3, w: 0.84 },
    { z: -0.9, w: 0.98 },
    { z: 0.7, w: 0.95 },
    { z: 1.9, w: 0.66 },
    { z: 2.75, w: 0.16 },
  ];
  const pos = [];
  const idx = [];
  for (const s of sections) {
    pos.push(-s.w, 0.55, s.z, -s.w * 0.93, 0.05, s.z, 0, -0.55, s.z, s.w * 0.93, 0.05, s.z, s.w, 0.55, s.z);
  }
  for (let i = 0; i < sections.length - 1; i++) {
    for (let j = 0; j < 4; j++) {
      const a = i * 5 + j;
      const b = i * 5 + j + 1;
      const c = (i + 1) * 5 + j;
      const d = (i + 1) * 5 + j + 1;
      idx.push(a, b, c, b, d, c);
    }
    // deck strips
    const a = i * 5;
    const b = (i + 1) * 5;
    const c = i * 5 + 4;
    const d = (i + 1) * 5 + 4;
    idx.push(a, b, c, c, b, d);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

const lizzie = new THREE.Group();
scene.add(lizzie);

const hull = new THREE.Mesh(
  makeHullGeometry(),
  new THREE.MeshStandardMaterial({ color: 0xe3d8c2, roughness: 0.7, flatShading: true, side: THREE.DoubleSide })
);
hull.castShadow = true;
hull.receiveShadow = true;
lizzie.add(hull);
box(1.5, 0.07, 4.2, woodMat, 0, 0.57, -0.1, lizzie);
box(1.1, 0.55, 1.6, woodMat, 0, 0.88, -1.15, lizzie);
box(0.7, 0.26, 1.1, darkMat, 0, 1.1, -1.15, lizzie);
box(0.3, 0.2, 0.4, bronzeMat, 0, 1.1, 1.6, lizzie);

// mast
const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.085, 6.4, 6), woodDarkMat);
mast.position.set(0, 3.6, 0.35);
mast.castShadow = true;
lizzie.add(mast);
const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 3.8, 5), woodDarkMat);
boom.position.set(0, 1.7, -1.35);
boom.rotation.x = Math.PI / 2;
lizzie.add(boom);

// main sail
const sailShape = new THREE.Shape();
sailShape.moveTo(0, 0);
sailShape.lineTo(0, 4.7);
sailShape.lineTo(-3.3, 0);
sailShape.lineTo(0, 0);
const sailGeo = new THREE.ShapeGeometry(sailShape);
const sailMat = new THREE.MeshStandardMaterial({
  color: 0xf0e5cf,
  roughness: 0.85,
  flatShading: false,
  side: THREE.DoubleSide,
});
const mainSail = new THREE.Mesh(sailGeo, sailMat);
mainSail.position.set(0.03, 1.85, 0.32);
mainSail.rotation.y = -Math.PI / 2;
mainSail.castShadow = true;
lizzie.add(mainSail);

// jib
const jibShape = new THREE.Shape();
jibShape.moveTo(0, 0);
jibShape.lineTo(0, 5.2);
jibShape.lineTo(2.5, 0);
jibShape.lineTo(0, 0);
const jib = new THREE.Mesh(new THREE.ShapeGeometry(jibShape), sailMat);
jib.position.set(0.02, 1.8, 1.0);
jib.rotation.y = -Math.PI / 2;
jib.castShadow = true;
lizzie.add(jib);

// rigging
{
  const pts = [];
  const top = new THREE.Vector3(0, 6.75, 0.35);
  const bow = new THREE.Vector3(0, 0.62, 2.7);
  const stern = new THREE.Vector3(0, 0.62, -2.85);
  pts.push(top, bow, top, stern, bow, stern);
  const g = new THREE.BufferGeometry().setFromPoints(pts);
  const lines = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x2a2b26, transparent: true, opacity: 0.55 }));
  lizzie.add(lines);
}
// pennant
const pennant = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.16), new THREE.MeshBasicMaterial({ color: 0x9c3d32, side: THREE.DoubleSide }));
pennant.position.set(0.3, 6.75, 0.35);
lizzie.add(pennant);

// white hull stripe
const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 4.1), new THREE.MeshBasicMaterial({ color: 0x2f4a45 }));
stripe.position.set(1.0, 0.36, -0.1);
lizzie.add(stripe);
const stripe2 = stripe.clone();
stripe2.position.x = -1.0;
lizzie.add(stripe2);

// wake
const wake = new THREE.Mesh(
  new THREE.PlaneGeometry(4.2, 11),
  new THREE.MeshBasicMaterial({
    map: makeWakeTexture(),
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
);
wake.rotation.x = -Math.PI / 2;
wake.position.set(0, 0.12, -7.5);
wake.renderOrder = 3;
lizzie.add(wake);

lizzie.userData.placeId = "lizzie";
lizzie.scale.setScalar(1.15);
lizzie.traverse((o) => {
  if (o.isMesh) {
    o.castShadow = true;
    o.receiveShadow = true;
  }
});

let boatAngle = 0.75;
const boat = {
  angle: boatAngle,
  speed: 0.03,
  paused: false,
  pos: new THREE.Vector3(),
};

function updateBoat(dt, time, storm) {
  if (!boat.paused) boat.angle += dt * boat.speed * (1 + storm * 0.5);
  const c = Math.cos(boat.angle);
  const s = Math.sin(boat.angle);
  const x = c * 39.0;
  const z = s * 33.5;
  const dx = -s * 39.0;
  const dz = c * 33.5;
  lizzie.position.set(x, waveHeight(x, z, time, 0.32) + 0.15, z);
  lizzie.rotation.y = Math.atan2(dx, dz);
  lizzie.rotation.z = Math.sin(time * 1.3 + 0.7) * (0.035 + storm * 0.12);
  lizzie.rotation.x = Math.cos(time * 1.05) * (0.02 + storm * 0.07);
  boat.pos.set(x, lizzie.position.y + 4.8, z);
  wake.material.opacity = 0.32 + storm * 0.2;
}

/* --------------------------------------------------------------------------
   Gulls
   -------------------------------------------------------------------------- */

const gullGroup = new THREE.Group();
scene.add(gullGroup);
const gullMat = new THREE.MeshBasicMaterial({ color: 0x313a38, side: THREE.DoubleSide });
const gulls = [];
for (let i = 0; i < 4; i++) {
  const g = new THREE.Group();
  const wingL = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.3), gullMat);
  wingL.position.x = -0.85;
  wingL.rotation.x = -Math.PI / 2;
  const wingR = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.3), gullMat);
  wingR.position.x = 0.85;
  wingR.rotation.x = -Math.PI / 2;
  g.add(wingL, wingR);
  g.scale.setScalar(0.48 + i * 0.05);
  gullGroup.add(g);
  gulls.push({
    group: g,
    wingL,
    wingR,
    radius: 40 + i * 6,
    height: 21 + i * 4,
    angle: rand() * Math.PI * 2,
    speed: 0.05 + rand() * 0.03,
  });
}

/* --------------------------------------------------------------------------
   Rain and lightning
   -------------------------------------------------------------------------- */

const RAIN_DROPS = 1700;
const rainPositions = new Float32Array(RAIN_DROPS * 6);
const rainSpeed = new Float32Array(RAIN_DROPS);
const rainSeed = [];
for (let i = 0; i < RAIN_DROPS; i++) {
  const x = (rand() - 0.5) * 110;
  const y = rand() * 48;
  const z = (rand() - 0.5) * 110;
  rainSeed.push({ x, y, z });
  rainPositions[i * 6] = x;
  rainPositions[i * 6 + 1] = y;
  rainPositions[i * 6 + 2] = z;
  rainPositions[i * 6 + 3] = x + 0.55;
  rainPositions[i * 6 + 4] = y - 1.15;
  rainPositions[i * 6 + 5] = z;
  rainSpeed[i] = 28 + rand() * 24;
}
const rainGeo = new THREE.BufferGeometry();
rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));
const rainMat = new THREE.LineBasicMaterial({
  color: 0xb9ccd0,
  transparent: true,
  opacity: 0,
  depthWrite: false,
});
const rain = new THREE.LineSegments(rainGeo, rainMat);
rain.frustumCulled = false;
scene.add(rain);

const boltMat = new THREE.LineBasicMaterial({
  color: 0xdbe8ff,
  transparent: true,
  opacity: 0,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const boltGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
const bolt = new THREE.Line(boltGeo, boltMat);
bolt.visible = false;
bolt.frustumCulled = false;
scene.add(bolt);

function makeBoltPoints() {
  const pts = [];
  const angle = rand() * Math.PI * 2;
  const dist = 95 + rand() * 55;
  const x = Math.cos(angle) * dist;
  const z = Math.sin(angle) * dist;
  const yTop = 75;
  let px = x;
  let pz = z;
  for (let i = 0; i < 12; i++) {
    pts.push(new THREE.Vector3(px, yTop - i * (yTop / 11), pz));
    px += (rand() - 0.5) * 5.5;
    pz += (rand() - 0.5) * 5.5;
  }
  boltGeo.setFromPoints(pts);
  boltGeo.attributes.position.needsUpdate = true;
}

/* --------------------------------------------------------------------------
   Weather
   -------------------------------------------------------------------------- */

const weather = {
  target: 0,
  amount: 0,
  flash: 0,
  nextBolt: 7,
  storming: false,
};

const calmTop = new THREE.Color("#17323e");
const stormTop = new THREE.Color("#111c20");
const calmHorizon = new THREE.Color("#e9b587");
const stormHorizon = new THREE.Color("#556669");
const calmSun = new THREE.Color("#ffc98f");
const stormSun = new THREE.Color("#c7d6d4");
const calmWaterSky = new THREE.Color("#d8b795");
const stormWaterSky = new THREE.Color("#56696a");

/* --------------------------------------------------------------------------
   Camera rig
   -------------------------------------------------------------------------- */

const cam = {
  theta: 1.35,
  phi: 0.72,
  radius: 118,
  tTheta: 1.35,
  tPhi: 0.72,
  tRadius: 118,
  target: new THREE.Vector3(0, 10, 0),
  tTarget: new THREE.Vector3(0, 10, 0),
  idle: 0,
};

const DEFAULT_VIEW = {
  theta: 0.56,
  phi: 0.945,
  radius: 113,
  target: new THREE.Vector3(-2.4, -2.6, 0),
};

const MAX_RADIUS = 280;

// On a portrait screen the horizontal field of view is much narrower.
// Pull the camera back so the island still fits across the phone.
function aspectBoost() {
  const aspect = window.innerWidth / window.innerHeight;
  return clamp(1.15 / aspect, 1, 2.35);
}

function defaultRadius() {
  return DEFAULT_VIEW.radius * aspectBoost();
}

function setView(theta, phi, radius, target) {
  let th = theta;
  while (th - cam.theta > Math.PI) th -= Math.PI * 2;
  while (th - cam.theta < -Math.PI) th += Math.PI * 2;
  cam.tTheta = th;
  cam.tPhi = clamp(phi, 0.62, 1.22);
  cam.tRadius = clamp(radius, 14, MAX_RADIUS);
  if (target) cam.tTarget.copy(target);
  cam.idle = 0;
}

function updateCamera(dt) {
  const k = 1 - Math.exp(-3.6 * dt);
  cam.theta = lerp(cam.theta, cam.tTheta, k);
  cam.phi = lerp(cam.phi, cam.tPhi, k);
  cam.radius = lerp(cam.radius, cam.tRadius, k);
  cam.target.lerp(cam.tTarget, 1 - Math.exp(-3.2 * dt));

  if (activePlace === "lizzie" && !dragging) {
    cam.tTarget.lerp(boat.pos, 1 - Math.exp(-1.4 * dt));
  }

  if (!dragging && !activePlace && introDismissed) {
    cam.idle += dt;
    if (cam.idle > 9) cam.tTheta += dt * 0.012;
  }

  const sp = Math.sin(cam.phi);
  const cp = Math.cos(cam.phi);
  camera.position.set(
    cam.target.x + cam.radius * sp * Math.sin(cam.theta),
    cam.target.y + cam.radius * cp,
    cam.target.z + cam.radius * sp * Math.cos(cam.theta)
  );
  camera.lookAt(cam.target);
}

/* --------------------------------------------------------------------------
   UI: rail, markers
   -------------------------------------------------------------------------- */

const placesEl = document.getElementById("places");
const markersEl = document.getElementById("markers");
const reader = document.getElementById("reader");
const readerScroll = document.getElementById("readerScroll");
const closeReader = document.getElementById("closeReader");
const trailCount = document.getElementById("trailCount");
const trailBar = document.getElementById("trailBar");
const resetTrail = document.getElementById("resetTrail");
const weatherBtn = document.getElementById("weather");
const weatherTitle = document.getElementById("weatherTitle");
const weatherSub = document.getElementById("weatherSub");
const hints = document.getElementById("hints");
const intro = document.getElementById("intro");
const enterBtn = document.getElementById("enter");
const needle = document.getElementById("needle");

const visited = new Set();
try {
  const saved = JSON.parse(localStorage.getItem("storm-island-trail") || "[]");
  if (Array.isArray(saved)) saved.forEach((id) => visited.add(id));
} catch (e) {
  /* localStorage may be unavailable */
}

PLACES.forEach((p) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "place";
  btn.dataset.id = p.id;
  btn.innerHTML = `<span class="no">${p.no}</span><span class="nm">${p.name}</span>`;
  btn.addEventListener("click", () => openPlace(p.id));
  placesEl.appendChild(btn);
  p.railEl = btn;

  const marker = document.createElement("button");
  marker.type = "button";
  marker.className = "marker";
  marker.dataset.id = p.id;
  marker.innerHTML = `<span class="tag"><span class="no">${p.no}</span><span class="name">${p.name}</span></span><span class="dot"><span>${p.no}</span></span>`;
  marker.setAttribute("aria-label", `${p.no}. ${p.name}`);
  marker.addEventListener("click", () => openPlace(p.id));
  markersEl.appendChild(marker);
  p.markerEl = marker;
});

for (let i = 0; i < PLACES.length; i++) {
  const seg = document.createElement("i");
  trailBar.appendChild(seg);
}

let activePlace = null;
let introDismissed = false;

function saveTrail() {
  try {
    localStorage.setItem("storm-island-trail", JSON.stringify([...visited]));
  } catch (e) {
    /* ignore */
  }
}

function refreshTrail() {
  trailCount.textContent = `${visited.size} / ${PLACES.length}`;
  [...trailBar.children].forEach((seg, i) => {
    seg.classList.toggle("on", i < visited.size);
  });
  PLACES.forEach((p) => {
    p.railEl.classList.toggle("is-visited", visited.has(p.id));
    p.markerEl.classList.toggle("is-visited", visited.has(p.id));
  });
}

function iconSvg(key) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">${ICONS[key]}</svg>`;
}

function openPlace(id) {
  const place = PLACES.find((p) => p.id === id);
  if (!place) return;
  activePlace = id;
  visited.add(id);
  saveTrail();
  refreshTrail();

  PLACES.forEach((p) => {
    p.railEl.classList.toggle("is-active", p.id === id);
    p.markerEl.classList.toggle("is-active", p.id === id);
  });

  if (place.id !== "lizzie") {
    setView(place.cam.theta, place.cam.phi, place.cam.radius * aspectBoost(), place.target);
  } else {
    setView(place.cam.theta, place.cam.phi, place.cam.radius * aspectBoost(), boat.pos);
  }

  const idx = PLACES.indexOf(place);
  const prev = PLACES[(idx - 1 + PLACES.length) % PLACES.length];
  const next = PLACES[(idx + 1) % PLACES.length];

  readerScroll.innerHTML = `
    <div class="sheet-kicker"><span class="n">Nº ${place.no}</span><i></i><span>${place.sub}</span></div>
    <div class="sheet-head">
      <div class="seal">${iconSvg(place.icon)}</div>
      <h2 class="sheet-title">${place.name}</h2>
    </div>
    <p class="sheet-deck">${place.tagline}</p>
    <div class="prose">${place.body.map((para) => `<p>${para}</p>`).join("")}</div>
    <blockquote class="pull">${place.pull}</blockquote>
    <div class="tags">${place.tags.map((t) => `<span>${t}</span>`).join("")}</div>
    <section class="questions">
      <h3>Take it to the circle</h3>
      <ol>${place.questions.map((q) => `<li>${q}</li>`).join("")}</ol>
    </section>
    <div class="sheet-foot">
      <button type="button" class="prev" data-go="${prev.id}">
        <span class="arrow" aria-hidden="true">←</span>
        <span class="which"><span>${prev.name}</span><em>Previous</em></span>
      </button>
      <button type="button" class="next" data-go="${next.id}">
        <span class="which"><span>${next.name}</span><em>Next place</em></span>
        <span class="arrow" aria-hidden="true">→</span>
      </button>
    </div>
    <div class="colophon">${place.no} / 09 &nbsp;·&nbsp; Storm Island &nbsp;·&nbsp; reading map</div>
  `;
  readerScroll.scrollTop = 0;
  reader.classList.add("is-open");
  reader.setAttribute("aria-hidden", "false");
  hints.classList.add("is-gone");

  if (place.id === "bell") bellSwing = 1;
}

function closePanel() {
  reader.classList.remove("is-open");
  reader.setAttribute("aria-hidden", "true");
  activePlace = null;
  PLACES.forEach((p) => {
    p.railEl.classList.remove("is-active");
    p.markerEl.classList.remove("is-active");
  });
}

readerScroll.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-go]");
  if (btn) openPlace(btn.dataset.go);
});
closeReader.addEventListener("click", closePanel);

resetTrail.addEventListener("click", () => {
  visited.clear();
  saveTrail();
  refreshTrail();
});

function setStorm(on) {
  weather.storming = on;
  weather.target = on ? 1 : 0;
  weatherBtn.setAttribute("aria-pressed", String(on));
  weatherTitle.textContent = on ? "Summer storm" : "Calm evening";
  weatherSub.textContent = on ? "Let it pass" : "Summon the storm";
  if (on) weather.nextBolt = 2 + Math.random() * 3;
  hints.classList.add("is-gone");
}

weatherBtn.addEventListener("click", () => setStorm(!weather.storming));

enterBtn.addEventListener("click", () => {
  if (introDismissed) return;
  introDismissed = true;
  intro.classList.add("is-gone");
  document.body.classList.add("entered");
  setView(DEFAULT_VIEW.theta, DEFAULT_VIEW.phi, defaultRadius(), DEFAULT_VIEW.target);
  setTimeout(() => hints.classList.add("is-gone"), 12000);
});

document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  if (e.key === "Escape") {
    if (reader.classList.contains("is-open")) {
      closePanel();
    } else if (!introDismissed) {
      enterBtn.click();
    }
  }
  if ((e.key === "s" || e.key === "S") && introDismissed && !e.metaKey && !e.ctrlKey) {
    setStorm(!weather.storming);
  }
  if (reader.classList.contains("is-open")) {
    const idx = PLACES.findIndex((p) => p.id === activePlace);
    if (e.key === "ArrowRight" && idx >= 0) openPlace(PLACES[(idx + 1) % PLACES.length].id);
    if (e.key === "ArrowLeft" && idx >= 0) openPlace(PLACES[(idx - 1 + PLACES.length) % PLACES.length].id);
  }
  if (/^[1-9]$/.test(e.key) && introDismissed) {
    const p = PLACES[Number(e.key) - 1];
    if (p) openPlace(p.id);
  }
});

// hide the intro if someone reloads deep into a reading session
refreshTrail();

/* --------------------------------------------------------------------------
   Pointer interaction
   -------------------------------------------------------------------------- */

const pointers = new Map();
let dragging = false;
let panning = false;
let downX = 0;
let downY = 0;
let downTime = 0;
let moved = 0;
let pinchStart = 0;
let pinchRadius = 0;
let lastX = 0;
let lastY = 0;

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const pickables = [manorGroup, boathouse, dockGroup, bellGroup, oakGroup, beachGroup, lizzie];

function pickAt(clientX, clientY) {
  ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObjects(pickables, true);
  for (const hit of hits) {
    let o = hit.object;
    while (o) {
      if (o.userData && o.userData.placeId) return o.userData.placeId;
      o = o.parent;
    }
  }
  return null;
}

canvas.addEventListener("pointerdown", (e) => {
  if (!introDismissed) return;
  canvas.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    pinchStart = Math.hypot(a.x - b.x, a.y - b.y);
    pinchRadius = cam.tRadius;
    dragging = false;
    return;
  }
  dragging = true;
  panning = e.button === 2 || e.shiftKey;
  downX = lastX = e.clientX;
  downY = lastY = e.clientY;
  downTime = performance.now();
  moved = 0;
  canvas.style.cursor = "grabbing";
  hints.classList.add("is-gone");
});

canvas.addEventListener("pointermove", (e) => {
  if (!introDismissed) return;
  if (pointers.has(e.pointerId)) {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  }
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (pinchStart > 0) cam.tRadius = clamp((pinchRadius * pinchStart) / Math.max(d, 1), 14, MAX_RADIUS);
    return;
  }
  if (dragging) {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    moved += Math.abs(dx) + Math.abs(dy);
    if (panning) {
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 1);
      const scale = cam.radius * 0.0016;
      cam.tTarget.addScaledVector(right, -dx * scale);
      cam.tTarget.addScaledVector(up, dy * scale * 0.7);
      cam.tTarget.x = clamp(cam.tTarget.x, -38, 38);
      cam.tTarget.z = clamp(cam.tTarget.z, -38, 38);
      cam.tTarget.y = clamp(cam.tTarget.y, 0.5, 16);
      cam.target.copy(cam.tTarget);
    } else {
      cam.tTheta = cam.theta - dx * 0.0038;
      cam.tPhi = clamp(cam.tPhi - dy * 0.0032, 0.62, 1.22);
      cam.theta = cam.tTheta;
      cam.phi = cam.tPhi;
      cam.idle = 0;
    }
  } else if (e.buttons === 0) {
    const id = pickAt(e.clientX, e.clientY);
    canvas.style.cursor = id ? "pointer" : "grab";
  }
});

function endPointer(e) {
  const wasDragging = dragging;
  const wasPanning = panning;
  pointers.delete(e.pointerId);
  if (pointers.size > 0) return;
  dragging = false;
  panning = false;
  canvas.style.cursor = "grab";
  if (!introDismissed) return;
  if (wasDragging && !wasPanning && moved < 7 && performance.now() - downTime < 650) {
    const id = pickAt(e.clientX, e.clientY);
    if (id) openPlace(id);
  }
}

canvas.addEventListener("pointerup", endPointer);
canvas.addEventListener("pointercancel", (e) => {
  pointers.delete(e.pointerId);
  dragging = false;
  canvas.style.cursor = "grab";
});

canvas.addEventListener("contextmenu", (e) => e.preventDefault());
canvas.addEventListener(
  "wheel",
  (e) => {
    if (!introDismissed) return;
    e.preventDefault();
    cam.tRadius = clamp(cam.tRadius * Math.exp(e.deltaY * 0.0011), 14, MAX_RADIUS);
    cam.idle = 0;
    hints.classList.add("is-gone");
  },
  { passive: false }
);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* --------------------------------------------------------------------------
   Animation
   -------------------------------------------------------------------------- */

let bellSwing = 0;
const markerVec = new THREE.Vector3();
const clock = new THREE.Clock();
let elapsed = 0;
let firstFrame = true;

function updateMarkers() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (const p of PLACES) {
    if (p.id === "lizzie") p.anchor.copy(boat.pos);
    markerVec.copy(p.anchor);
    markerVec.project(camera);
    const x = (markerVec.x * 0.5 + 0.5) * w;
    const y = (-markerVec.y * 0.5 + 0.5) * h;
    const behind = markerVec.z > 1 || markerVec.z < -1;
    p.markerEl.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    p.markerEl.classList.toggle("is-hidden", behind || x < -70 || x > w + 70 || y < -60 || y > h + 60);
  }
}

function updateStorm(dt) {
  weather.amount = damp(weather.amount, weather.target, 1.1, dt);
  const w = weather.amount;

  hemi.intensity = lerp(1.0, 0.68, w);
  sun.intensity = lerp(3.0, 1.9, w);
  sun.color.copy(calmSun).lerp(stormSun, w);
  ambient.intensity = lerp(0.18, 0.42, w);
  fill.intensity = lerp(0.65, 0.5, w);

  scene.fog.color.copy(calmFog).lerp(stormFog, w);
  scene.fog.density = lerp(0.0031, 0.0062, w);

  waterUniforms.uStorm.value = w;
  waterUniforms.uSky.value.copy(calmWaterSky).lerp(stormWaterSky, w);
  waterUniforms.uFogColor.value.copy(scene.fog.color);
  waterUniforms.uFogDensity.value = scene.fog.density;

  skyUniforms.uTop.value.copy(calmTop).lerp(stormTop, w);
  skyUniforms.uHorizon.value.copy(calmHorizon).lerp(stormHorizon, w);
  skyUniforms.uFog.value.copy(scene.fog.color);
  skyUniforms.uStorm.value = w;

  rainMat.opacity = w * 0.5;
  if (window.__surf) window.__surf.material.opacity = 0.045 + w * 0.02;

  weather.flash *= Math.exp(-dt * 7.5);
  flashLight.intensity = weather.flash * 3.2;
  skyUniforms.uFlash.value = weather.flash;

  if (weather.storming) {
    weather.nextBolt -= dt;
    if (weather.nextBolt <= 0) {
      weather.flash = 1;
      makeBoltPoints();
      bolt.visible = true;
      weather.nextBolt = 5 + Math.random() * 9;
    }
  }
  bolt.visible = weather.flash > 0.04;
  boltMat.opacity = weather.flash;

  gullGroup.visible = w < 0.55;

  if (weather.amount > 0.02) {
    const pos = rainGeo.attributes.position.array;
    for (let i = 0; i < RAIN_DROPS; i++) {
      const seed = rainSeed[i];
      seed.y -= rainSpeed[i] * dt;
      seed.x -= dt * 3.5;
      if (seed.y < -1) {
        seed.y = 42 + rand() * 10;
        seed.x = (rand() - 0.5) * 110;
        seed.z = (rand() - 0.5) * 110;
      }
      pos[i * 6] = seed.x;
      pos[i * 6 + 1] = seed.y;
      pos[i * 6 + 2] = seed.z;
      pos[i * 6 + 3] = seed.x + 0.5;
      pos[i * 6 + 4] = seed.y - 1.25;
      pos[i * 6 + 5] = seed.z;
    }
    rainGeo.attributes.position.needsUpdate = true;
  }
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  elapsed += dt;
  const time = elapsed;

  updateCamera(dt);
  updateStorm(dt);

  waterUniforms.uTime.value = time;
  waterUniforms.uCamPos.value.copy(camera.position);
  skyUniforms.uTime.value = time;

  updateBoat(dt, time, weather.amount);

  // bell swing
  if (bellSwing > 0.001) {
    bellPivot.rotation.z = Math.sin(time * 13) * 0.16 * bellSwing;
    bellSwing *= Math.exp(-dt * 1.7);
  } else {
    bellSwing = 0;
    bellPivot.rotation.z = 0;
  }

  // gulls
  for (const g of gulls) {
    g.angle += dt * g.speed;
    const x = Math.cos(g.angle) * g.radius;
    const z = Math.sin(g.angle) * g.radius * 0.8;
    g.group.position.set(x, g.height + Math.sin(time * 0.8 + g.radius) * 0.8, z);
    g.group.rotation.y = -g.angle + Math.PI / 2;
    const flap = Math.sin(time * 7 + g.radius) * 0.45;
    g.wingL.rotation.z = flap;
    g.wingR.rotation.z = -flap;
  }

  // wake taper
  const wakeScale = 0.9 + Math.sin(time * 1.2) * 0.06;
  wake.scale.set(wakeScale, 1, wakeScale);

  // compass: needle points to world north
  if (needle) {
    needle.style.transform = `rotate(${(cam.theta * 180) / Math.PI}deg)`;
  }

  updateMarkers();

  if (firstFrame) {
    firstFrame = false;
    document.body.classList.add("ready");
  }

  renderer.render(scene, camera);
}

animate();

// Expose a tiny bit of state for debugging and for the browser preview.
window.stormIsland = {
  openPlace,
  closePanel,
  setStorm,
  terrainHeight,
  debugView(theta, phi, radius, target) {
    setView(theta, phi, radius, target ? new THREE.Vector3(target[0], target[1], target[2]) : undefined);
  },
  get weather() {
    return { ...weather };
  },
  get camera() {
    return { theta: cam.theta, phi: cam.phi, radius: cam.radius };
  },
  PLACES,
};
