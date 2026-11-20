# Nuclear Glow Up! (CHEM 3A Chapter 14: Radioactivity and Nuclear Chemistry)

Study game for CHEM 3A, matched to Lecture 30 (Nuclear Chemistry), the Chapter 14 learning objectives in Canvas, the Week 17 MyOpenMath homework, and the CHEM 3A textbook's Chapter 14. Live at https://itsdrdan.github.io/nuclear/.

Current version: 1.1

- `index.html`: the whole game (standalone). Loads the brand kit (`games/brand/itsdrdan.css`, `embed.js`), `chemparse.v2.js` and `games/track.js` for anonymous stats.
- Modes:
  - ⚛️ Decay Lab: a nucleus of real protons and neutrons; tap α, β⁻, β⁺, EC or γ and watch it change, with the balanced equation, n/p ratio and a band-of-stability chart (U-238, Ra-226, Am-241, C-14, I-131, Co-60, F-18, I-125, Tc-99m).
  - ⚖️ Balance It!: MyOpenMath-style boxes (top number, bottom number, symbol) for alpha, beta, positron, electron capture, gamma and bombardment; step 2 asks the type of decay; mistake-specific feedback (unbalanced top/bottom, swapped numbers, kept the old symbol, wrong sign on a beta particle).
  - 🛡️ Shield Lab: α, β, γ and neutron sources, paper / aluminum / lead / concrete-water shields, a Geiger counter with background radiation, a distance slider (inverse square, alpha range in air) and ion marks along each track (ionizing power).
  - ⏳ Half-Life Lab: 400 nuclei that halve with each ⏭ half-life, amount-vs-time graph, mass and percent readouts (textbook half-lives), plus typed problems: amount left, time, starting amount, half-life, radiocarbon age, mCi activity (whole numbers of half-lives, 3 sig figs).
  - 🔥 Fission & Fusion: U-235 chain reaction with fuel amount (critical mass) and control rods; D–T fusion that only happens when hot; fission/fusion equations (challenge).
  - 🏥 Radiation & You: isotopes and nuclide symbols, stability, units (Bq, Ci, Gy, Sv), biological effects, background and radon, medical isotopes (Tc-99m, I-131, F-18 PET, brachytherapy), fission/fusion ideas.
  - 🎯 Skill Check: 10 questions across 10 topics, one try each, then a study plan.
- Deep links: `?mode=decay|balance|shield|half|power|ideas|quiz`, and `&sys=<sample>` for the Decay Lab (`u238 ra226 am241 c14 i131 co60 f18 i125 tc99m`) or Half-Life Lab (`i131 tc99m c14 co60 ir192 rn222 f18`), e.g. `?mode=decay&sys=c14`.
- Source: edit `tools/page-src.html` (page, questions, UI) and `tools/engine-src.js` (nuclear data and the four labs), then `node tools/build.js` to rebuild `index.html`.
- Tests: `node tools/check.js` (≈35,000 checks: every generated question has its answer among the choices and a reason for each wrong choice; every nuclear equation balances with real element symbols; numeric answers pass their own sig-fig rule; lecture-slide and MyOpenMath values; the fission lab sustains a chain with large fuel, fizzles with small fuel and stops with the rods in; fusion only when hot).

Game design and chemistry by ItsDrDan. Code written with AI assistance (Claude) and checked by the author. © ItsDrDan, all rights reserved; free to play, reuse by permission only (see LICENSE).
