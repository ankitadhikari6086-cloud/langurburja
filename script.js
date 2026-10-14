// Langur Burja – six dice, six faces
const FACES = [
  { key: 'jhanda', name: 'Jhanda', desc: 'Flag', svg: `
    <rect x="26" y="10" width="6" height="80" rx="3" fill="#5a3b1e"/>
    <path d="M32 14 L84 30 L32 54 Z" fill="#d62828" stroke="#f6a712" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="48" cy="33" r="5" fill="#fff4dc"/>
    <ellipse cx="29" cy="90" rx="16" ry="4" fill="#5a3b1e"/>` },
  { key: 'burja', name: 'Burja', desc: 'Tower', svg: `
    <path d="M24 88V40h8V28h12v12h4V28h12v12h4V28h12v12h8v48Z" fill="#c8891a" stroke="#5a3b1e" stroke-width="3" stroke-linejoin="round"/>
    <path d="M42 88V66a8 8 0 0 1 16 0v22Z" fill="#4a0910"/>
    <rect x="30" y="48" width="8" height="10" rx="2" fill="#4a0910"/>
    <rect x="62" y="48" width="8" height="10" rx="2" fill="#4a0910"/>` },
  { key: 'paan', name: 'Paan', desc: 'Heart', svg: `
    <path d="M50 88C8 58 10 20 33 20c9 0 15 6 17 13 2-7 8-13 17-13 23 0 25 38-17 68Z" fill="#d62828"/>` },
  { key: 'chidi', name: 'Chidi', desc: 'Club', svg: `
    <g fill="#1d1d1d"><circle cx="50" cy="29" r="19"/><circle cx="29" cy="60" r="19"/><circle cx="71" cy="60" r="19"/>
    <path d="M50 50 38 90h24Z"/></g>` },
  { key: 'hukum', name: 'Hukum', desc: 'Spade', svg: `
    <path d="M50 8S86 38 86 60c0 15-20 19-30 7 2 12 5 18 11 23H33c6-5 9-11 11-23-10 12-30 8-30-7C14 38 50 8 50 8Z" fill="#1d1d1d"/>` },
  { key: 'itta', name: 'Itta', desc: 'Diamond', svg: `
    <path d="M50 6 84 50 50 94 16 50Z" fill="#d62828"/>` }
];
const icon = f => `<svg viewBox="0 0 100 100" role="img" aria-label="${f.name}">${f.svg}</svg>`;
const rand = () => {
  const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % FACES.length;
};

const board = document.getElementById('board');
const btn = document.getElementById('rollBtn');
const tally = document.getElementById('tally');
const rollCount = document.getElementById('rollCount');
const NUM = 6;
let rolls = 0, busy = false;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// build dice
const dice = [];
for (let i = 0; i < NUM; i++) {
  const d = document.createElement('div');
  d.className = 'die'; d.tabIndex = 0; d.setAttribute('role', 'button');
  d.setAttribute('aria-label', 'Roll the dice');
  d.innerHTML = icon(FACES[i]);
  d.addEventListener('click', roll);
  d.addEventListener('keydown', e => { if (e.key === 'Enter') roll(); });
  board.appendChild(d); dice.push(d);
}

// legend
document.getElementById('legend').innerHTML = FACES.map(f =>
  `<li>${icon(f)}<span><b>${f.name}</b><small>${f.desc}</small></span></li>`).join('');

function showTally(results) {
  const counts = FACES.map((_, i) => results.filter(r => r === i).length);
  tally.innerHTML = FACES.map((f, i) =>
    `<li class="${counts[i] ? '' : 'zero'}">${icon(f)}<b>× ${counts[i]}</b></li>`).join('');
}

function roll() {
  if (busy) return;
  busy = true; btn.disabled = true; btn.textContent = 'Rolling…';
  const finals = Array.from({ length: NUM }, rand);
  let stopped = 0;

  dice.forEach((d, i) => {
    d.classList.remove('landed'); d.classList.add('rolling');
    const spin = setInterval(() => { d.innerHTML = icon(FACES[rand()]); }, 80);
    setTimeout(() => {              // each die stops one after another
      clearInterval(spin);
      d.classList.remove('rolling');
      d.innerHTML = icon(FACES[finals[i]]);
      d.classList.add('landed');
      if (++stopped === NUM) {
        rolls++; rollCount.textContent = `(#${rolls})`;
        showTally(finals);
        busy = false; btn.disabled = false; btn.textContent = 'Roll again';
      }
    }, (reduce ? 200 : 900) + i * (reduce ? 50 : 250));
  });
}

btn.addEventListener('click', roll);
document.addEventListener('keydown', e => {
  if (e.code === 'Space' && e.target === document.body) { e.preventDefault(); roll(); }
});
showTally([]);
