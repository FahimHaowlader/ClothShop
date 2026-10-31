import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import images1 from "../assets/images.webp";

/*
  One circle per character, filling the whole width of the screen, and the section is
  exactly one screen tall. The area of each circle is that character's share of the shop,
  so a bigger circle is a bigger collection.

  Expected data (one entry per character, any number of them):

  {
    id: "ava",                         // unique
    name: "Ava",
    percent: 10,                       // share of the shop, e.g. 10 means 10%
    image: "/images/characters/ava.webp",   // portrait photo or illustration
    count: 20,                         // optional; used for the size if `percent` is missing
    path: "/collections/ava",          // optional, defaults to /collections/<id>
  }

  If `percent` is left out, the size is worked out from `count`. If both are left out,
  every circle is the same size. The numbers don't have to add up to 100.
*/

/* ---------- Default characters (placeholders) ----------
   Portraits are generated silhouettes so the section works with no image files.
   Replace `image` with a real path per character, or pass your own `characters` prop. */

const portrait = (bg, fg) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
      <rect width="400" height="500" fill="${bg}"/>
      <circle cx="200" cy="190" r="72" fill="${fg}"/>
      <path d="M60 500c0-105 62-170 140-170s140 65 140 170z" fill="${fg}"/>
    </svg>`
  )}`;

const TONES = [
  ["#d6d3d1", "#78716c"],
  ["#d1d5db", "#6b7280"],
  ["#d4d4d8", "#71717a"],
  ["#d4d4d4", "#737373"],
];

export const DEFAULT_CHARACTERS = [
  ["ava", "Ava", 7],
  ["marcus", "Marcus", 6],
  ["nora", "Nora", 6],
  ["leo", "Leo", 5],
  ["iris", "Iris", 5],
  ["theo", "Theo", 5],
  ["maya", "Maya", 4],
  ["elias", "Elias", 4],
  ["zara", "Zara", 4],
  ["kai", "Kai", 4],
  ["luna", "Luna", 4],
  ["finn", "Finn", 3],
  ["owen", "Owen", 3],
  ["sage", "Sage", 3],
  ["rhea", "Rhea", 3],
  ["jude", "Jude", 3],
  ["cleo", "Cleo", 3],
  ["ravi", "Ravi", 3],
  ["tess", "Tess", 3],
  ["milo", "Milo", 2],
  ["dani", "Dani", 2],
  ["hugo", "Hugo", 2],
  ["vera", "Vera", 2],
  ["noel", "Noel", 2],
  ["ruby", "Ruby", 2],
  ["arlo", "Arlo", 2],
  ["pia", "Pia", 2],
  ["ezra", "Ezra", 2],
  ["lena", "Lena", 2],
  ["otis", "Otis", 2],
].map(([id, name, percent], i) => ({
  id,
  name,
  percent,
  image: portrait(...TONES[i % TONES.length]),
}));

/* ---------- Arranging the circles ----------
   The circles are sized so together they cover about 60% of the available box, whatever its
   shape. They start spread out across the box, then get pushed apart until none overlap
   and none cross the edges. Same input always gives the same layout. */

const COVERAGE = 0.6;
const GAP = 6;
const EDGE = 8;

const arrange = (shares, width, height) => {
  const w = Math.max(width - EDGE * 2, 1);
  const h = Math.max(height - EDGE * 2, 1);
  const maxShare = Math.max(...shares, 0);
  if (maxShare <= 0) return {};

  // Circle area = share of the covered area; the biggest must still fit the box
  let k = Math.sqrt((COVERAGE * w * h) / Math.PI);
  k = Math.min(k, Math.min(w, h) / 2 / Math.sqrt(maxShare));

  const nodes = shares
    .map((s, i) => ({ i, r: k * Math.sqrt(s) }))
    .filter((n) => n.r > 0)
    .sort((a, b) => b.r - a.r);

  const cx = width / 2;
  const cy = height / 2;

  // Start: spread across the whole box in a sunflower pattern
  nodes.forEach((node, idx) => {
    const t = Math.sqrt((idx + 0.5) / nodes.length);
    const angle = idx * 2.39996323;
    node.x = cx + Math.cos(angle) * t * (w / 2) * 0.85;
    node.y = cy + Math.sin(angle) * t * (h / 2) * 0.85;
  });

  const keepInside = (n) => {
    n.x = Math.max(EDGE + n.r, Math.min(width - EDGE - n.r, n.x));
    n.y = Math.max(EDGE + n.r, Math.min(height - EDGE - n.r, n.y));
  };

  for (let pass = 0; pass < 500; pass++) {
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const A = nodes[a];
        const B = nodes[b];
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        const min = A.r + B.r + GAP;
        if (dist >= min) continue;

        const push = (min - dist) / 2;
        const ux = dx / dist;
        const uy = dy / dist;
        A.x -= ux * push;
        A.y -= uy * push;
        B.x += ux * push;
        B.y += uy * push;
      }
    }
    nodes.forEach(keepInside);
  }

  const result = {};
  nodes.forEach((n) => {
    result[n.i] = { x: n.x, y: n.y, d: n.r * 2 };
  });
  return result;
};

const formatPercent = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, ""));

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const Character = ({ characters = DEFAULT_CHARACTERS }) => {
  const arenaRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Measure the space left under the heading, and again whenever it changes
  useIsoLayoutEffect(() => {
    const el = arenaRef.current;
    if (!el) return;

    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { shares, percents } = useMemo(() => {
    const raw = characters.map((c) => Math.max(Number(c.percent ?? c.count ?? 1) || 0, 0));
    const total = raw.reduce((sum, n) => sum + n, 0) || 1;
    return {
      shares: raw.map((n) => n / total),
      percents: raw.map((n, i) => characters[i].percent ?? (n / total) * 100),
    };
  }, [characters]);

  const spots = useMemo(
    () => (size.w > 0 && size.h > 0 ? arrange(shares, size.w, size.h) : {}),
    [shares, size]
  );

  if (characters.length === 0) return null;

  const pathFor = (c) => c.path || `/collections/${c.id}`;

  return (
    <section
      className="flex h-screen min-h-[560px] w-full flex-col overflow-hidden"
      style={{ height: "100svh" }}
    >
      {/* Heading */}
      <div className="px-5 pt-10 sm:px-8 md:pt-14 lg:px-12">
        <div className="mb-2 flex items-center gap-2.5">
          <span className="h-px w-8 bg-black" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/45">
            Shop by Character
          </span>
        </div>

        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[0.9] tracking-[-0.06em]">
          Choose your character
        </h2>
      </div>

      {/* The circles fill everything that is left, edge to edge */}
      <div ref={arenaRef} className="relative min-h-0 w-full flex-1">
        <ul className="group/cloud absolute inset-0">
          {characters.map((character, i) => {
            const spot = spots[i];
            if (!spot) return null; // not measured yet, or a 0% character

            const percent = formatPercent(percents[i]);
            const showPercent = spot.d >= 96;
            const nameSize = showPercent ? Math.min(22, spot.d * 0.1) : Math.max(10, spot.d * 0.17);

            return (
              <li
                key={character.id}
                className="absolute"
                style={{
                  left: spot.x - spot.d / 2,
                  top: spot.y - spot.d / 2,
                  width: spot.d,
                  height: spot.d,
                }}
              >
                <Link
                  to={pathFor(character)}
                  aria-label={`${character.name}, ${percent}% of the shop`}
                  title={`${character.name}, ${percent}%`}
                  draggable={false}
                  className="
                    group/circle relative flex h-full w-full items-center justify-center overflow-hidden rounded-full
                    bg-neutral-200 text-white
                    transition-all duration-700 ease-out motion-reduce:transition-none
                    hover:z-10 hover:scale-[1.06]
                    group-hover/cloud:opacity-50 hover:!opacity-100
                    focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
                  "
                >
                  {character.image && (
                    <img
                      src={images1}
                      alt=""
                      loading="lazy"
                      draggable={false}
                      className="
                        absolute inset-0 h-full w-full select-none object-cover object-top
                        grayscale transition-[filter] duration-700 ease-out
                        group-hover/circle:grayscale-0 group-focus-visible/circle:grayscale-0
                      "
                    />
                  )}
                  <span className="absolute inset-0 bg-black/45 transition-colors duration-700 group-hover/circle:bg-black/30" />

                  <span className="relative flex flex-col items-center px-[6%] text-center leading-none">
                    {showPercent && (
                      <span
                        className="font-bold tracking-[-0.06em]"
                        style={{ fontSize: Math.min(72, spot.d * 0.3) }}
                      >
                        {percent}%
                      </span>
                    )}
                    <span
                      className="mt-[0.3em] whitespace-nowrap font-semibold tracking-[0.02em]"
                      style={{ fontSize: nameSize }}
                    >
                      {character.name}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Character;