const CONFIG = {
  PUBLIC_KEY: '2xKzzl-oRCl0OIWks',
  SERVICE_ID: 'service_c9hi5ob',
  TEMPLATE_ID: 'template_jwa3gyf'
};
const configurado = !Object.values(CONFIG).some(v => v.startsWith('TU_'));
const reducirMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Inicializar EmailJS
if (configurado) {
  emailjs.init({
    publicKey: CONFIG.PUBLIC_KEY
  });
} else {
  document.getElementById('notaDemo').textContent =
    '// modo demo: configura EmailJS para enviar correos reales';
}

/* ---------- Estrellas con parallax ---------- */
const lienzo = document.getElementById('estrellas');
const ctx = lienzo.getContext('2d');

let estrellas = [];
let ratonX = 0;
let ratonY = 0;

function ajustar() {
  lienzo.width = innerWidth;
  lienzo.height = innerHeight;

  estrellas = Array.from({
    length: Math.min(160, Math.floor(innerWidth / 8))
  }, () => ({
    x: Math.random() * lienzo.width,
    y: Math.random() * lienzo.height,
    r: Math.random() * 1.4 + .3,
    p: Math.random() * .04 + .005,
    t: Math.random() * Math.PI * 2,
    verde: Math.random() < .12
  }));
}

addEventListener('resize', ajustar);
ajustar();

addEventListener('mousemove', e => {
  ratonX = e.clientX / innerWidth - .5;
  ratonY = e.clientY / innerHeight - .5;
});

function dibujarEstrellas() {
  ctx.clearRect(0, 0, lienzo.width, lienzo.height);

  for (const s of estrellas) {
    s.t += .02;
    s.y -= s.p * 8;

    if (s.y < -2) {
      s.y = lienzo.height + 2;
      s.x = Math.random() * lienzo.width;
    }

    const x = s.x - ratonX * s.r * 40;
    const y = s.y - ratonY * s.r * 40;

    ctx.globalAlpha = .45 + Math.sin(s.t) * .35;
    ctx.fillStyle = s.verde ? '#39FF14' : '#A5A5C7';

    ctx.beginPath();
    ctx.arc(x, y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(dibujarEstrellas);
}

if (!reducirMovimiento) dibujarEstrellas();

/* ---------- Titular con efecto de escritura ---------- */
const frases = [
  'Multiverse.',
  'new dimensions.',
  'another reality.',
  'your journey.'
];

const tipeo = document.getElementById('tipeo');

let fi = 0;
let ci = 0;
let borrando = false;

function escribir() {
  const f = frases[fi];

  tipeo.textContent = f.slice(0, ci);

  if (!borrando && ci === f.length) {
    borrando = true;
    return setTimeout(escribir, 1700);
  }

  if (borrando && ci === 0) {
    borrando = false;
    fi = (fi + 1) % frases.length;
  }

  ci += borrando ? -1 : 1;

  setTimeout(escribir, borrando ? 35 : 80);
}

if (reducirMovimiento) {
  tipeo.textContent = frases[0];
} else {
  escribir();
}

/* ---------- Marquesina ---------- */
const mensajes = [
  'Explore the Multiverse',
  'Your journey starts here',
  'Discover new dimensions',
  'Enter another reality',
  'Stay connected to the multiverse'
];

const pista = document.getElementById('pista');

pista.innerHTML = [...mensajes, ...mensajes, ...mensajes, ...mensajes]
  .map(m => `<span><b>◉</b> ${m}</span>`)
  .join('');

/* ---------- Contadores animados ---------- */
function contar(el, meta, dur = 1800) {
  const ini = performance.now();

  (function paso(t) {
    const p = Math.min((t - ini) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);

    el.textContent = Math.round(meta * e).toLocaleString('es-CO');

    if (p < 1) requestAnimationFrame(paso);
  })(ini);
}

const contador = document.getElementById('contador');
let totalExploradores = 1284;

contar(contador, totalExploradores);

document.querySelectorAll('[data-n]').forEach(el => {
  contar(el, +el.dataset.n);
});

setInterval(() => {
  if (document.body.classList.contains('listo')) return;

  totalExploradores += Math.random() < .5 ? 1 : 0;

  contador.textContent = totalExploradores.toLocaleString('es-CO');
}, 4500);

/* ---------- Scroll reveal ---------- */
const obs = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { threshold: .15 });

document.querySelectorAll('.rev').forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 120 + 'ms';
  obs.observe(el);
});

/* ---------- Tarjetas con tilt ---------- */
document.querySelectorAll('.tarjeta').forEach(t => {
  t.addEventListener('mousemove', e => {
    const r = t.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    t.style.setProperty('--mx', x + 'px');
    t.style.setProperty('--my', y + 'px');
    t.style.setProperty('--ry', ((x / r.width) - .5) * 12 + 'deg');
    t.style.setProperty('--rx', (.5 - (y / r.height)) * 12 + 'deg');
  });

  t.addEventListener('mouseleave', () => {
    t.style.setProperty('--rx', '0deg');
    t.style.setProperty('--ry', '0deg');
  });
});

/* ---------- Portal con parallax ---------- */
const portal = document.getElementById('portal');

addEventListener('mousemove', e => {
  if (document.body.classList.contains('enviando')) return;

  const x = (e.clientX / innerWidth - .5) * 14;
  const y = (e.clientY / innerHeight - .5) * -14;

  portal.style.rotate = '';
  portal.style.transform = '';
  portal.style.translate = `${x}px ${-y}px`;
});

/* ---------- Formulario ---------- */
const form = document.getElementById('formulario');
const input = document.getElementById('email');
const msg = document.getElementById('mensaje');
const boton = document.getElementById('boton');

const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function estado(txt, tipo) {
  msg.textContent = txt;
  msg.className = 'mensaje ' + (tipo || '');
}

input.addEventListener('focus', () => {
  document.body.classList.add('enfoque');
});

input.addEventListener('blur', () => {
  document.body.classList.remove('enfoque');
});

input.addEventListener('input', () => {
  const v = input.value.trim();

  form.classList.remove('invalido');

  if (!v) {
    form.classList.remove('valido');
    return estado('Tu email es el pasaporte interdimensional.');
  }

  if (reEmail.test(v)) {
    form.classList.add('valido');
    estado('Coordenadas válidas ✓ Listo para cruzar.', 'ok');
  } else {
    form.classList.remove('valido');
    estado('Sigue escribiendo… falta algo para llegar a esta dimensión.');
  }
});

/* ---------- Botón magnético y ripple ---------- */
boton.addEventListener('mousemove', e => {
  const r = boton.getBoundingClientRect();

  boton.style.transform =
    `translate(${(e.clientX - r.left - r.width / 2) * .12}px,${(e.clientY - r.top - r.height / 2) * .2}px)`;
});

boton.addEventListener('mouseleave', () => {
  boton.style.transform = '';
});

boton.addEventListener('click', e => {
  const r = boton.getBoundingClientRect();
  const d = Math.max(r.width, r.height);

  const o = document.createElement('span');
  o.className = 'ripple';

  o.style.cssText =
    `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;

  boton.appendChild(o);

  setTimeout(() => o.remove(), 600);
});

/* ---------- Envío real con EmailJS ---------- */
form.addEventListener('submit', async e => {
  e.preventDefault();

  const correo = input.value.trim();

  if (!reEmail.test(correo)) {
    form.classList.add('invalido');

    estado(
      'Esa dirección no existe ni en la dimensión C-500. Revísala.',
      'error'
    );

    return input.focus();
  }

  if (!configurado) {
    estado('Configura EmailJS antes de enviar el formulario.', 'error');
    return;
  }

  const idExplorador =
    'ZX-' + Math.floor(1000 + Math.random() * 9000);

  boton.disabled = true;
  boton.classList.add('cargando');

  document.body.classList.add('enviando');

  estado('Abriendo portal…', 'ok');

  try {
    await emailjs.send(
      CONFIG.SERVICE_ID,
      CONFIG.TEMPLATE_ID,
      {
        to_email: correo,
        id_explorador: idExplorador,
        url_sitio: location.href
      }
    );

    exitoso(correo, idExplorador);

  } catch (err) {
    console.error('Error de EmailJS:', err);

    document.body.classList.remove('enviando');

    boton.disabled = false;
    boton.classList.remove('cargando');

    const detalle = err?.text || err?.message || 'Error desconocido';

    estado(
      'El portal falló. ' + detalle,
      'error'
    );
  }
});

/* ---------- Envío exitoso ---------- */
function exitoso(correo, id) {
  document.body.classList.remove('enviando', 'enfoque');
  document.body.classList.add('listo');

  document.getElementById('emailOk').textContent = correo;
  document.getElementById('idExplorador').textContent = id;

  totalExploradores++;

  contador.textContent =
    totalExploradores.toLocaleString('es-CO');

  if (!reducirMovimiento) confeti();
}

/* ---------- Confeti verde ---------- */
function confeti() {
  const c = document.getElementById('confeti');
  const x = c.getContext('2d');

  c.width = innerWidth;
  c.height = innerHeight;

  const r = portal.getBoundingClientRect();
  const ox = r.left + r.width / 2;
  const oy = r.top + r.height / 2;

  const colores = [
    '#39FF14',
    '#FFFFFF',
    '#A5A5C7',
    '#39FF14'
  ];

  const ps = Array.from({ length: 150 }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = Math.random() * 10 + 3;

    return {
      x: ox,
      y: oy,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 3,
      s: Math.random() * 6 + 3,
      c: colores[Math.floor(Math.random() * colores.length)],
      vida: 1
    };
  });

  (function anim() {
    x.clearRect(0, 0, c.width, c.height);

    let vivo = false;

    for (const p of ps) {
      p.vy += .22;
      p.vx *= .99;
      p.x += p.vx;
      p.y += p.vy;
      p.vida -= .008;

      if (p.vida > 0) {
        vivo = true;

        x.globalAlpha = p.vida;
        x.fillStyle = p.c;
        x.fillRect(p.x, p.y, p.s, p.s * .6);
      }
    }

    if (vivo) {
      requestAnimationFrame(anim);
    } else {
      x.clearRect(0, 0, c.width, c.height);
    }
  })();
}