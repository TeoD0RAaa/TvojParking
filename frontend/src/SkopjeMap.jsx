import { useState } from 'react'

/*
  Мапа на Скопје нацртана „рачно“.
  Координатите се во систем 1200 x 800 (viewBox).
  Ефектот на цртано доаѓа од SVG филтрите #sketch и #sketch2:
  тие ги „тресат“ линиите малку за да изгледаат како нацртани со рака.
*/

const INK = '#3b3440'

// Цртеж што се исцртува двапати со различно треперење, па изгледа скицирано
function Sketch({ d, fill = 'none', stroke = INK, width = 3, opacity = 1, dash }) {
  return (
    <g>
      <path d={d} fill={fill} fillOpacity={opacity} stroke="none" filter="url(#sketch)" />
      <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round"
            strokeLinejoin="round" strokeDasharray={dash} filter="url(#sketch)" />
      <path d={d} fill="none" stroke={stroke} strokeWidth={width * 0.5} strokeLinecap="round"
            strokeLinejoin="round" strokeDasharray={dash} opacity="0.5" filter="url(#sketch2)" />
    </g>
  )
}

function Label({ x, y, children, size = 30, color = INK, rotate = 0 }) {
  return (
    <text x={x} y={y} fontSize={size} fill={color} textAnchor="middle"
          fontFamily="Caveat, cursive" fontWeight="700"
          transform={`rotate(${rotate} ${x} ${y})`}>
      {children}
    </text>
  )
}

function Tree({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Sketch d="M0 0 L0 18" width={3} stroke="#7a5236" />
      <Sketch d="M-14 2 C-22 -10 -12 -26 0 -24 C12 -28 22 -12 14 2 C8 8 -8 8 -14 2 Z"
              fill="#8fc79a" width={2.5} />
    </g>
  )
}

function Pin({ p, active, onClick }) {
  const free = p.free_spots > 0
  const color = free ? '#5fb36b' : '#e46a6a'
  return (
    <g transform={`translate(${p.x} ${p.y})`} onClick={onClick} style={{ cursor: 'pointer' }}>
      <ellipse cx="0" cy="4" rx="12" ry="4" fill="#000" opacity="0.15" />
      <Sketch d="M0 0 C-6 -14 -22 -24 -22 -40 C-22 -54 -11 -62 0 -62 C11 -62 22 -54 22 -40 C22 -24 6 -14 0 0 Z"
              fill={color} width={active ? 4 : 3} />
      <Label x={0} y={-30} size={30} color="#fff">P</Label>
    </g>
  )
}

function Popup({ p, onClose }) {
  const w = 230, h = 92
  // попапот да не излезе надвор од мапата
  const x = Math.min(Math.max(p.x - w / 2, 10), 1200 - w - 10)
  const y = p.y - 70 - h < 10 ? p.y + 20 : p.y - 70 - h
  return (
    <g transform={`translate(${x} ${y})`} onClick={onClose} style={{ cursor: 'pointer' }}>
      <Sketch d={`M8 0 H${w - 8} Q${w} 0 ${w} 8 V${h - 8} Q${w} ${h} ${w - 8} ${h} H8 Q0 ${h} 0 ${h - 8} V8 Q0 0 8 0 Z`}
              fill="#fffaf0" width={2.5} />
      <Label x={w / 2} y={36} size={28}>{p.name}</Label>
      <Label x={w / 2} y={72} size={26} color={p.free_spots > 0 ? '#3c8d48' : '#c94a4a'}>
        {p.free_spots > 0 ? `${p.free_spots} од ${p.total_spots} слободни` : 'Полн е 😕'}
      </Label>
    </g>
  )
}

export default function SkopjeMap({ parkings = [] }) {
  const [selected, setSelected] = useState(null)
  const sel = parkings.find((p) => p.id === selected)

  return (
    <svg viewBox="0 0 1200 800" className="skopje-map" role="img" aria-label="Цртана мапа на Скопје">
      <defs>
        <filter id="sketch">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="5" />
        </filter>
        <filter id="sketch2">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="11" />
          <feDisplacementMap in="SourceGraphic" scale="7" />
        </filter>
        {/* зрнеста текстура на хартија */}
        <filter id="paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="2" />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.3  0 0 0 0.08 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* Хартија */}
      <rect width="1200" height="800" fill="#fbf4e6" />
      <rect width="1200" height="800" fill="#fbf4e6" filter="url(#paper)" />

      {/* Населби — меки дамки */}
      <Sketch d="M40 150 C120 110 260 130 300 200 C320 270 230 320 120 310 C40 300 10 220 40 150 Z" fill="#f6d6a8" opacity={0.6} width={1.5} stroke="#c9a77a" />
      <Sketch d="M470 60 C580 30 720 50 760 120 C780 180 680 230 560 220 C470 210 420 120 470 60 Z" fill="#f3c6c6" opacity={0.55} width={1.5} stroke="#cf9a9a" />
      <Sketch d="M640 200 C700 170 800 190 820 250 C830 300 760 330 690 320 C630 300 610 240 640 200 Z" fill="#d9c8f0" opacity={0.6} width={1.5} stroke="#a995c8" />
      <Sketch d="M850 150 C960 110 1120 140 1160 230 C1180 300 1080 340 960 330 C860 320 800 230 850 150 Z" fill="#cfe3c0" opacity={0.6} width={1.5} stroke="#9fbb8c" />
      <Sketch d="M130 430 C220 410 360 420 390 480 C410 540 320 580 220 570 C130 560 80 480 130 430 Z" fill="#c8e0ef" opacity={0.6} width={1.5} stroke="#93b6cc" />
      <Sketch d="M500 420 C580 400 690 410 710 470 C720 520 650 545 570 540 C500 530 460 460 500 420 Z" fill="#ffe3a3" opacity={0.6} width={1.5} stroke="#d6b66a" />
      <Sketch d="M780 450 C880 420 1060 440 1100 520 C1120 590 1000 630 880 620 C780 610 730 510 780 450 Z" fill="#f5cfe4" opacity={0.55} width={1.5} stroke="#cf9ab8" />
      <Sketch d="M600 560 C680 545 800 560 810 620 C815 670 730 690 650 680 C580 670 560 590 600 560 Z" fill="#e0d6c3" opacity={0.6} width={1.5} stroke="#b4a689" />

      {/* Водно */}
      <Sketch d="M180 800 C260 720 340 690 420 660 C470 640 500 630 540 650 C600 680 680 720 760 800 Z" fill="#9ccf9a" width={3} />
      <Sketch d="M330 800 C380 740 430 710 470 700 C520 700 560 730 600 800 Z" fill="#7fbf84" width={2.5} />
      {/* Милениумски крст */}
      <g transform="translate(482 600)">
        <Sketch d="M0 0 V50 M-14 14 H14" width={5} stroke="#7a5236" />
      </g>
      <Label x={470} y={760} size={36} color="#2f6b3a">Водно</Label>

      {/* Улици (испрекинати) */}
      <Sketch d="M0 520 C200 500 400 515 600 505 S900 520 1200 540" width={2.5} stroke="#b3a48e" dash="2 12" />
      <Sketch d="M600 0 C610 120 590 250 605 380 S600 600 640 800" width={2.5} stroke="#b3a48e" dash="2 12" />
      <Sketch d="M0 270 C200 290 400 260 620 280 S1000 250 1200 280" width={2.5} stroke="#b3a48e" dash="2 12" />

      {/* Вардар */}
      <Sketch d="M-20 380 C150 350 260 420 400 400 S560 360 640 385 S820 440 950 420 S1120 380 1220 400"
              width={34} stroke="#8ec5e8" />
      <path d="M-20 380 C150 350 260 420 400 400 S560 360 640 385 S820 440 950 420 S1120 380 1220 400"
            fill="none" stroke="#5c9ccb" strokeWidth="2" strokeDasharray="18 22" filter="url(#sketch2)" transform="translate(0 -6)" />
      <path d="M-20 380 C150 350 260 420 400 400 S560 360 640 385 S820 440 950 420 S1120 380 1220 400"
            fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="10 30" opacity="0.8" filter="url(#sketch2)" transform="translate(0 7)" />
      <Label x={150} y={335} size={32} color="#3d7fb0" rotate={-4}>Вардар</Label>

      {/* Камен мост */}
      <g transform="translate(600 378)">
        <Sketch d="M-38 -22 H38 V22 H-38 Z" fill="#e5d2b5" width={2.5} />
        <Sketch d="M-28 22 Q-19 4 -10 22 M-6 22 Q3 4 12 22 M16 22 Q24 6 30 22" width={2} />
      </g>
      <Label x={600} y={345} size={22}>Камен мост</Label>

      {/* Кале */}
      <g transform="translate(520 300)">
        <Sketch d="M-40 20 V-12 H-30 V-22 H-20 V-12 H-10 V-22 H0 V-12 H10 V-22 H20 V-12 H30 V-22 H40 V20 Z" fill="#e8c9a0" width={2.5} />
        <Sketch d="M-6 20 V4 Q0 -4 6 4 V20" fill="#7a5236" width={2} />
      </g>
      <Label x={520} y={352} size={26}>Кале</Label>

      {/* Стара чаршија */}
      <g transform="translate(680 300)">
        <Sketch d="M-26 16 V-4 Q-14 -24 -2 -4 V16 Z" fill="#f2b8a0" width={2.5} />
        <Sketch d="M4 16 V-40 L10 -52 L16 -40 V16 Z" fill="#fbe7c6" width={2.5} />
      </g>
      <Label x={680} y={240} size={24}>Стара чаршија</Label>

      {/* Плоштад Македонија */}
      <g transform="translate(610 445)">
        <Sketch d="M-24 0 C-24 -14 24 -14 24 0 C24 14 -24 14 -24 0 Z" fill="#fff0c2" width={2.5} />
        <Sketch d="M0 6 V-24 M-6 -16 L0 -28 L6 -16" width={2.5} stroke="#b07d2c" />
      </g>

      {/* Градски парк */}
      <Tree x={360} y={460} /><Tree x={400} y={450} s={0.9} /><Tree x={430} y={470} s={1.1} />
      <Tree x={385} y={490} s={0.8} /><Tree x={340} y={490} s={0.9} />
      <Label x={395} y={535} size={22} color="#2f6b3a">Градски парк</Label>

      {/* Имиња на населби */}
      <Label x={165} y={210} size={30}>Ѓорче Петров</Label>
      <Label x={610} y={110} size={30}>Бутел</Label>
      <Label x={735} y={290} size={28}>Чаир</Label>
      <Label x={1000} y={225} size={32}>Гази Баба</Label>
      <Label x={240} y={540} size={32}>Карпош</Label>
      <Label x={560} y={510} size={32}>Центар</Label>
      <Label x={950} y={560} size={34}>Аеродром</Label>
      <Label x={710} y={660} size={28}>Кисела Вода</Label>

      {/* Украси: сонце, облак, компас, наслов */}
      <g transform="translate(1110 80)">
        <Sketch d="M-26 0 A26 26 0 1 0 26 0 A26 26 0 1 0 -26 0 Z" fill="#ffd66b" width={2.5} />
        <Sketch d="M0 -40 V-52 M0 40 V52 M-40 0 H-52 M40 0 H52 M28 28 L36 36 M-28 -28 L-36 -36 M28 -28 L36 -36 M-28 28 L-36 36" width={3} stroke="#e8a93a" />
      </g>
      <Sketch d="M860 70 C860 50 890 44 900 60 C910 40 950 44 950 66 C970 66 972 90 950 92 H870 C850 92 848 70 860 70 Z" fill="#ffffff" width={2.5} />
      <g transform="translate(90 700)">
        <Sketch d="M0 -40 L10 0 L0 40 L-10 0 Z" fill="#f0e0c8" width={2.5} />
        <Sketch d="M0 -40 L10 0 L-10 0 Z" fill="#e46a6a" width={2} />
        <Label x={0} y={-48} size={26}>С</Label>
      </g>
      <Label x={130} y={80} size={64} color="#c95b7a" rotate={-4}>Скопје ♥</Label>

      {/* Паркинзи од backend-от */}
      {parkings.map((p) => (
        <Pin key={p.id} p={p} active={p.id === selected}
             onClick={() => setSelected(p.id === selected ? null : p.id)} />
      ))}
      {sel && <Popup p={sel} onClose={() => setSelected(null)} />}
    </svg>
  )
}
