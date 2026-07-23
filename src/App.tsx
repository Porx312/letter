import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type TouchEvent,
} from "react";
import coverArt from "./assets/download.jpg";
import panelA from "./assets/torffin.png";
import "./App.css";
import Itachi from "./assets/ITachi.png";
import reze from "./assets/reze.png";
import denji from "./assets/denji.png";
import gojo from "./assets/gojo.png";
import eren from "./assets/eren.png";
import ken from "./assets/ken.png";
import edward from "./assets/edward.png";
import luffy from "./assets/luffy.png"
import shojo from "./assets/shojo.png"
type Phase = "sealed" | "opening" | "reading";

type Chapter = {
  id: string;
  /** Número grande tipo libro: 0, I, II, IX… */
  roman: string;
  title: string;
  subtitle?: string;
  /** Imagen opcional (solo si hace falta) */
  art?: {
    src: string;
    side: "left" | "right";
  };
  /**
   * Texto largo del capítulo.
   * Agregá o editá párrafos aquí — uno por string.
   */
  body: string[];
  ending?: boolean;
};

/**
 * EDITÁ AQUÍ el contenido.
 * - body: párrafos sueltos (podés escribir todo lo que quieras)
 * - art: solo cuando quieras una imagen en ese capítulo
 */
const CHAPTERS: Chapter[] = [
  {
    id: "ch0",
    roman: "0",
    title: "Prologue",
    subtitle: "Antes de empezar",
    body: [
      "Hola.",
      "Si estás leyendo esto, gracias por tomarte el tiempo de llegar hasta aquí.",
      "No hice esta página con la intención de cambiar lo que pasó, ni esperando una respuesta.",
      "Solo quería pedirte perdón de la forma en que debí haberlo hecho desde el principio.",
    ],
    art: {
      src: Itachi,
      side: "left",
    },
  },

  {
    id: "ch1",
    roman: "I",
    title: "The Beginning",
    subtitle: "Cómo empezó todo",
    body: [
      "Desde el principio me dijiste que eras una persona difícil de conocer. Que no cualquiera llegaba a formar parte de tu vida, pero que, cuando alguien lo hacía, tus valores hablaban por ti.",
      "Aun así, poco a poco empezaste a confiar en mí. Me hablaste de lo que habías vivido, de tu familia, de las dificultades que estabas atravesando y de tu sueño de convertirte en médico cirujano.",
      "Creo que fue ahí cuando empezaste a importarme. Admiraba la forma en la que, a pesar de todo, seguías enfocada en tus metas y en la persona que querías llegar a ser.",
      "Eso significó mucho más para mí de lo que alguna vez llegué a decir.",
    ],
    art: {
      src: reze,
      side: "right",
    },
  },

  {
    id: "ch2",
    roman: "II",
    title: "A Beautiful Coincidence",
    subtitle: "La casualidad",
    body: [
      "Todavía recuerdo cómo empezó todo.",
      "Ese día llegué de trabajar, me acosté un rato y abrí TikTok antes de dormir.",
      "De repente apareció tu perfil.",
      "Lo curioso es que normalmente solo me salen videos de anime, autos y videojuegos. Jaja.",
      "No sé por qué apareciste justo ese día.",
      "Pero, si no hubiera abierto TikTok en ese momento, probablemente esta historia nunca habría existido.",
    ],
    art: {
      src: luffy,
      side: "left",
    },
  },

  {
    id: "ch3",
    roman: "III",
    title: "Our Story",
    subtitle: "Nuestra historia",
    body: [
      "Hacía mucho tiempo que no conocía a alguien con quien sintiera tantas cosas en común.",
      "Sé que solo hablamos durante tres días. Parece muy poco tiempo, pero el hecho de que te interesaras por mí hizo que yo también quisiera conocerte de verdad.",
      "Porque, en tan poco tiempo, sentí una conexión que hacía mucho no sentía. Me caíste muy bien desde el principio: por tu forma de pensar, por las cosas que hacías, por tus gustos y por la forma en la que veías el mundo. Hablar contigo era fácil, y eso es algo que no me pasa muy seguido.",
      "No porque esperara que fueras “algo más”. Aunque solo fuéramos amigos, sentía que había encontrado a una persona que realmente quería seguir conociendo, sin prisas.",
      "Y quizá fue precisamente eso lo que me hizo tener miedo. Cuando alguien empieza a importarme de verdad, a veces dejo que mis inseguridades hablen más fuerte que yo.",
    ],
    art: {
      src: denji,
      side: "right",
    },
  },

  {
    id: "ch4",
    roman: "IV",
    title: "The Mistake",
    subtitle: "Cuando todo cambió",
    body: [
      "Con el tiempo empecé a tener miedo de perder aquello que estaba construyendo.",
      "Hubo un momento en el que interpreté algunas cosas como si me estuvieran alejando. En lugar de hablarlo o dar tiempo a las cosas, dejé que experiencias del pasado y mi ansiedad decidieran por mí.",
      "Te bloqueé impulsivamente, proyectando en ti inseguridades que en realidad no te pertenecían.",
      "Fue una decisión injusta contigo, y asumo completamente la responsabilidad de haberla tomado.",
    ],
    art: {
      src: gojo,
      side: "left",
    },
  },

  {
    id: "ch5",
    roman: "V",
    title: "Acceptance",
    subtitle: "Aceptar",
    body: [
      "No escribo esto esperando que todo vuelva a ser como antes.",
      "Tampoco espero cambiar cómo te sientes.",
      "En lugar de hablar contigo, decidí desaparecer. Te bloqueé sin explicación y te dejé con una pregunta que no te correspondía: “¿Qué hice mal?”.",
      "La respuesta es que no hiciste nada. Fue el miedo y mi pasado hablando por mí.",
      "Lo mínimo que merecías era una conversación, no el silencio. Y por eso quería pedirte perdón.",
    ],
    art: {
      src: eren,
      side: "right",
    },
  },

  {
    id: "ch6",
    roman: "VI",
    title: "The Journey",
    subtitle: "Lo que aprendí",
    body: [
      "Con el tiempo entendí que todavía me cuesta cuidar a las personas que terminan siendo importantes para mí.",
      "Aunque solo fuéramos amigos, llegaste a importar más de lo que probablemente imaginaste.",
      "Cuando alguien empieza a ocupar un lugar importante en mi vida, muchas veces dejo que el miedo tome decisiones por mí. En lugar de hablar, me callo. En lugar de confiar, imagino lo peor. Y, sin darme cuenta, termino alejando justamente a las personas que más quería conservar.",
      "Lo irónico es que aquello que más valoro suele ser lo que más termino dañando por miedo a perderlo.",
      "Es una parte de mí que llevo tiempo intentando cambiar. No porque espere recuperar lo que perdí, sino porque no quiero volver a hacer sentir a otra persona lo que tú sentiste por culpa de mis propios miedos.",
      "Quizá sea demasiado tarde para esta historia, pero no para aprender de ella y convertirme en una mejor persona.",
    ],
    art: {
      src: ken,
      side: "left",
    },
  },

  {
    id: "ch7",
    roman: "VII",
    title: "Something Precious",
    subtitle: "Algo valioso",
    body: [
      "Contigo sentí que había encontrado a una persona que realmente quería seguir conociendo… y no supe cuidar esa amistad.",
      "Qué curioso, ¿no?",
      "A veces creemos que, por miedo a perder a alguien, tenemos que controlar lo que sentimos o actuar antes de que nos lastimen. Al final, ese mismo miedo termina alejando a las personas que queríamos conservar.",
      "Creo que esa fue una de las lecciones más importantes que me dejó todo esto.",
    ],
    art: {
      src: shojo,
      side: "right",
    },
  },

  {
    id: "ch8",
    roman: "VIII",
    title: "The Letter",
    subtitle: "La carta",
    body: [
      "Con todo esto solo quería pedirte perdón.",
      "No esperando que me perdones.",
      "Ni esperando que las cosas vuelvan a ser como antes.",
      "Solo quería que supieras que lamento sinceramente la forma en la que terminé las cosas y haberte dejado sin una explicación.",
      "Gracias por esos días, por la confianza que depositaste en mí y por haber compartido una parte de tu historia conmigo.",
      "De verdad, espero que logres todo aquello por lo que estás luchando.",
      "Y, sobre todo, espero que seas muy feliz.",
    ],
    art: {
      src: panelA,
      side: "left",
    },
  },

  {
    id: "final",
    roman: "終",
    title: "Goodbye",
    subtitle: "Hasta aquí",
    ending: true,
    body: [
      "Si llegaste hasta aquí, gracias por leer.",
      "No tienes que responder.",
      "Ya te pedí perdón antes, pero hice esta página porque necesitaba dejar de esperar un mensaje que quizá nunca llegaría y cerrar este capítulo de la forma correcta.",
      "Gracias por esos días, por la confianza que tuviste en mí y por permitirme conocerte un poco.",
      "De corazón, espero que cumplas cada una de las metas por las que tanto luchas y que la vida te trate bonito.",
      "Y si algún día nuestros caminos vuelven a cruzarse y quieres empezar de nuevo, aunque solo sea como amigos, me alegrará conocerte otra vez. Si no, también lo entenderé.",
      "Cuídate.",
    ],
    art: {
      src: edward,
      side: "right",
    },
  },
];

function MediaImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`media-fallback ${className ?? ""}`}
        role="img"
        aria-label={alt ?? "imagen"}
      />
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt ?? ""}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("sealed");
  const [index, setIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [dragY, setDragY] = useState(0);
  const [moreBelow, setMoreBelow] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const coverDrag = useRef<{ y: number } | null>(null);
  const pageRef = useRef<HTMLElement | null>(null);

  const updateMoreBelow = useCallback(() => {
    const el = pageRef.current;
    if (!el) {
      setMoreBelow(false);
      return;
    }
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
    setMoreBelow(remaining > 28);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 60);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    pageRef.current?.scrollTo({ top: 0 });
    const id = window.setTimeout(updateMoreBelow, 80);
    return () => window.clearTimeout(id);
  }, [index, phase, flipping, updateMoreBelow]);

  const openBook = useCallback(() => {
    if (phase !== "sealed") return;
    setPhase("opening");
    setDragY(0);
    window.setTimeout(() => setPhase("reading"), 900);
  }, [phase]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (phase !== "reading" || flipping) return;
      const next = index + dir;
      if (next < 0 || next >= CHAPTERS.length) return;
      setFlipping(true);
      window.setTimeout(() => {
        setIndex(next);
        setFlipping(false);
      }, 320);
    },
    [phase, flipping, index],
  );

  const onCoverPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (phase !== "sealed") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 10 });
  };

  const onCoverPointerLeave = () => {
    setTilt({ x: 0, y: 0 });
    setPressed(false);
    coverDrag.current = null;
    setDragY(0);
  };

  const onCoverPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (phase !== "sealed") return;
    setPressed(true);
    coverDrag.current = { y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onCoverPointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    if (phase !== "sealed") return;
    setPressed(false);
    const start = coverDrag.current;
    coverDrag.current = null;
    if (start && start.y - e.clientY > 70) {
      openBook();
      return;
    }
    if (Math.abs(dragY) < 12) openBook();
    setDragY(0);
  };

  const onCoverPointerDrag = (e: PointerEvent<HTMLButtonElement>) => {
    if (phase !== "sealed" || !coverDrag.current) return;
    onCoverPointerMove(e);
    const delta = coverDrag.current.y - e.clientY;
    setDragY(Math.max(0, Math.min(120, delta)));
  };

  const onPageTouchStart = (e: TouchEvent) => {
    const t = e.changedTouches[0];
    if (!t) return;
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onPageTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    const t = e.changedTouches[0];
    touchStart.current = null;
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // Solo swipe horizontal cambia de capítulo.
    // El scroll vertical del texto no debe pasar páginas.
    if (Math.abs(dx) < 64) return;
    if (Math.abs(dx) < Math.abs(dy) * 1.4) return;
    if (dx < 0) go(1);
    else go(-1);
  };

  const chapter = CHAPTERS[index];
  const isLast = index === CHAPTERS.length - 1;
  const showCover = phase === "sealed" || phase === "opening";
  const openProgress = Math.min(1, dragY / 90);

  const lead = chapter?.body[0];
  const rest = chapter?.body.slice(1) ?? [];

  return (
    <div
      className={[
        "page",
        ready ? "page--ready" : "",
        `page--${phase}`,
      ].join(" ")}
    >
      <div className="tone" aria-hidden />

      <main className="shell">
        <div className="phone">
          {showCover && (
            <button
              type="button"
              className={[
                "cover",
                pressed ? "cover--pressed" : "",
                phase !== "sealed" ? "cover--open" : "",
              ].join(" ")}
              style={
                phase === "sealed"
                  ? {
                      transform: `perspective(900px) rotateX(${tilt.x - openProgress * 18}deg) rotateY(${tilt.y}deg) translateY(${-dragY * 0.35}px) scale(${pressed ? 0.985 : 1})`,
                    }
                  : undefined
              }
              onPointerMove={onCoverPointerDrag}
              onPointerDown={onCoverPointerDown}
              onPointerUp={onCoverPointerUp}
              onPointerCancel={onCoverPointerLeave}
              onPointerLeave={onCoverPointerLeave}
              disabled={phase !== "sealed"}
              aria-label="Abrir el manga"
            >
              <img
                className="cover__photo"
                src={coverArt}
                alt=""
                draggable={false}
              />
              <div className="cover__veil" aria-hidden />
              <div className="cover__spine" aria-hidden />
              <div className="cover__frame" aria-hidden />

              <div className="cover__ui">
                <p className="cover__volume">Volume I</p>
                <div className="cover__titles">
                  <h1 className="cover__title">
                    The Words I
                    <br />
                    Never Said
                  </h1>
                  <p className="cover__tagline">
                    “Some stories deserve a proper ending.”
                  </p>
                </div>
                <div className="cover__cta">
                  <span className="cover__pulse" aria-hidden />
                  <p className="cover__hint">
                    {dragY > 20
                      ? "Suelta para abrir"
                      : "Toca o desliza ↑"}
                  </p>
                  <div className="cover__bar" aria-hidden>
                    <span style={{ transform: `scaleX(${openProgress})` }} />
                  </div>
                </div>
              </div>
            </button>
          )}

          {phase === "reading" && chapter && (
            <div
              className="reader"
              aria-live="polite"
              onTouchStart={onPageTouchStart}
              onTouchEnd={onPageTouchEnd}
            >
              <div className="reader__progress" aria-hidden>
                <span
                  style={{
                    width: `${((index + 1) / CHAPTERS.length) * 100}%`,
                  }}
                />
              </div>

              <article
                ref={pageRef}
                className={[
                  "novel-page",
                  flipping ? "novel-page--flip" : "novel-page--in",
                  chapter.ending ? "novel-page--ending" : "",
                ].join(" ")}
                key={chapter.id}
                onScroll={updateMoreBelow}
              >
                <header className="novel-page__meta">
                  <span>
                    {chapter.ending ? "Final" : `Cap. ${index + 1}`}
                  </span>
                  <span>
                    {index + 1}/{CHAPTERS.length}
                  </span>
                </header>

                <div className="novel-page__spread">
                  {chapter.art ? (
                    <figure
                      className={`novel-art novel-art--${chapter.art.side}`}
                    >
                      <MediaImage
                        src={chapter.art.src}
                        className="novel-art__img"
                      />
                    </figure>
                  ) : null}

                  <p className="novel-roman" aria-hidden>
                    {chapter.roman}
                  </p>

                  <div className="novel-head">
                    <p className="novel-title">{chapter.title}</p>
                    {chapter.subtitle ? (
                      <p className="novel-sub">{chapter.subtitle}</p>
                    ) : null}
                  </div>

                  {lead ? <p className="novel-p">{lead}</p> : null}
                </div>

                {rest.length > 0 ? (
                  <>
                    <div className="novel-rule" aria-hidden />
                    <div className="novel-body">
                      {rest.map((paragraph) => (
                        <p key={paragraph} className="novel-p">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </>
                ) : null}

                {chapter.ending ? (
                  <p className="novel-fin">— fin —</p>
                ) : null}

                <div className="novel-page__turn">
                  {moreBelow ? (
                    <p className="novel-more" aria-hidden>
                      <span className="novel-more__arrow">↓</span>
                      Hay más texto abajo
                    </p>
                  ) : null}
                  <div className="novel-page__nav">
                    <button
                      type="button"
                      className="turn-btn"
                      onClick={() => go(-1)}
                      disabled={index === 0 || flipping}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className="turn-btn turn-btn--next"
                      onClick={() => go(1)}
                      disabled={isLast || flipping}
                    >
                      {isLast ? "Fin" : "Siguiente →"}
                    </button>
                  </div>
                </div>
              </article>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
