import { useEffect, useState } from "react";
import "./style.css";

// =========================================================
// CONFIGURAÇÕES
// =========================================================

const WHATSAPP = "5586999273849";

const WHATSAPP_MENSAGEM =
  "Olá, gostaria de agendar um horario";

// =========================================================
// APP
// =========================================================

export default function App() {
  return <Home />;
}

// =========================================================
// SITE PRINCIPAL
// =========================================================

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState("");

  // =======================================================
  // SCROLL DO HEADER
  // =======================================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =======================================================
  // SCROLL PARA SEÇÃO
  // =======================================================

  const scrollTo = (id) => {
    setMenuOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // =======================================================
  // WHATSAPP
  // =======================================================

  const abrirWhatsApp = (servico = "") => {
    const texto = servico
      ? `Olá Jonas, gostaria de agendar um horario.

Serviço: ${servico}`
      : WHATSAPP_MENSAGEM;

    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      texto
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // =======================================================
  // SOLICITAR SERVIÇO
  // =======================================================

  const solicitarServico = () => {
    if (!servicoSelecionado) {
      alert("Escolha um serviço primeiro.");
      return;
    }

    abrirWhatsApp(servicoSelecionado);
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <>
      {/* ===================================================
          HEADER
      =================================================== */}

      <header
        className={`site-header ${
          scrolled ? "scrolled" : ""
        }`}
      >
        <div className="container header-container">
          <a
            href="/"
            className="logo"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src="/imagens/logo.png"
              alt="Zero Fio Barbearia"
              className="logo-img"
            />

            <div className="logo-text">
              <strong>JONAS LOUREIRO</strong>

              <span>STUDIO ✬ ✬ ✬</span>
            </div>
          </a>

          {/* =================================================
              MENU
          ================================================= */}

          <nav
            className={`nav-menu ${
              menuOpen ? "mobile-open" : ""
            }`}
          >
            <button
              onClick={() => scrollTo("inicio")}
            >
              Início
            </button>

            <button
              onClick={() => scrollTo("sobre")}
            >
              Sobre
            </button>

            <button
              onClick={() => scrollTo("precos")}
            >
              Serviços
            </button>

            <button
              onClick={() => scrollTo("experiencia")}
            >
              Experiência
            </button>

            <button
              onClick={() => scrollTo("contato")}
            >
              Agendamento
            </button>
          </nav>

          {/* =================================================
              WHATSAPP
          ================================================= */}

          <a
            className="header-whatsapp"
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
              WHATSAPP_MENSAGEM
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            <span>WhatsApp</span>

            <i className="fa-brands fa-whatsapp" />
          </a>

          {/* =================================================
              MENU MOBILE
          ================================================= */}

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
          >
            <i
              className={`fa-solid ${
                menuOpen ? "fa-xmark" : "fa-bars"
              }`}
            />
          </button>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main>
        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero" id="inicio">
          <div className="hero-background" />

          <div className="hero-overlay" />

          <div className="container hero-container">
            <div className="hero-content reveal visible">
              <div className="hero-label">
                <span className="label-line" />

                STUDIO JONAS LOUREIRO ✬ ✬ ✬
              </div>

              <h1>
                O Primeiro studio
                barbershop de
                Matões-MA

                <span>Seja exclusivo.</span>
              </h1>

              <p className="hero-description">
                Barbearia Masculina Com Essência
                Old school, Técnica Moderna Do Degradê Ao
                Clássico Medio/Liso Old Money.
              </p>

              <div className="hero-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => scrollTo("contato")}
                >
                  Agendar horário

                  <i className="fa-solid fa-arrow-right" />
                </button>

                <button
                  className="btn btn-outline"
                  onClick={() => scrollTo("precos")}
                >
                  Ver serviços
                </button>
              </div>

              <div className="hero-trust">
                <div className="trust-item">
                  <i className="fa-solid fa-scissors" />

                  <div>
                    <strong>Precisão</strong>

                    <span>
                      Acabamento impecável
                    </span>
                  </div>
                </div>

                <div className="trust-divider" />

                <div className="trust-item">
                  <i className="fa-solid fa-chair" />

                  <div>
                    <strong>Experiência</strong>

                    <span>
                      Atendimento personalizado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            SOBRE
        ================================================= */}

        <section
          className="section about-section"
          id="sobre"
        >
          <div className="container">
            <div className="about-grid">
              <div className="about-image-wrapper">
                <div className="about-image">
                  <img
                    src="/imagens/jonas.jpeg"
                    alt="Jonas Loureiro - barbeiro"
                  />

                  <div className="image-frame" />
                </div>

                <div className="experience-badge">
                  <strong>4+</strong>

                  <span>
                    ANOS DE
                    <br />
                    EXPERIÊNCIA
                  </span>
                </div>
              </div>

              <div className="about-content">
                <span className="eyebrow">
                  SOBRE O STUDIO
                </span>

                <h2>
                  Barbearia com{" "}
                  <span>personalidade.</span>
                </h2>

                <div className="gold-line" />

                <p className="lead">
                  A ideia do primeiro studio barbershop
                  de Matões nasceu da paixão pela
                  barbearia clássica e pela busca
                  constante por evolução, técnicas
                  tradicionais, métodos modernos e um
                  atendimento pensado em cada detalhe.
                  Um espaço reduzido para fugir da
                  correria, do barulho e do padrão
                  convencional.
                </p>

                <p>
                  Aqui cada cliente recebe uma
                  experiência única, com técnicas
                  tradicionais, acabamento preciso,
                  toalha quente, vapor de ozônio e
                  muito mais.
                </p>

                <p>
                  Foco em atendimento por agendamento.
                  É só escolher seu serviço e falar
                  diretamente comigo pelo WhatsApp.
                </p>

                <p>
                  Fuja da correria.
                </p>

                <p>
                  Técnicas tradicionais, visagismo,
                  acabamento preciso e uma estética
                  contemporânea e minimalista para
                  criar um visual que combina com
                  você.
                </p>

                <div className="about-signature">
                  <span>Jonas Loureiro</span>

                  <small>
                    BARBEIRO & FUNDADOR
                  </small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            STATEMENT
        ================================================= */}

        <section className="statement-section">
          <div className="container">
            <span className="statement-small">
              • STUDIO •
            </span>

            <h2>
              O clássico nunca sai de moda,{" "}
              <span>Ele evolui!</span>
            </h2>

            <p>• POR JONAS LOUREIRO •</p>
          </div>
        </section>

        {/* =================================================
            SERVIÇOS
        ================================================= */}

        <section
          className="section prices-section"
          id="precos"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  SERVIÇOS
                </span>

                <h2>
                  O essencial{" "}
                  <span>Bem feito!</span>
                </h2>
              </div>

              <p>
                VALOR REDUZIDO TEMPORARIAMENTE
              </p>
            </div>

            <div className="prices-grid">
              <Price
                icon="fa-scissors"
                title="Corte"
                description="Corte masculino com acabamento preciso."
                price="R$ 15"
                onClick={() =>
                  abrirWhatsApp("Corte — R$ 15")
                }
              />

              <Price
                icon="fa-user"
                title="Barba"
                description="Barba com acabamento e definição."
                price="R$ 15"
                onClick={() =>
                  abrirWhatsApp("Barba — R$ 15")
                }
              />

              <Price
                icon="fa-scissors"
                title="Corte + Barba"
                description="Corte e barba para um visual completo."
                price="R$ 30"
                featured
                onClick={() =>
                  abrirWhatsApp(
                    "Corte + Barba — R$ 30"
                  )
                }
              />

              <Price
                icon="fa-eye"
                title="Sobrancelha"
                description="Limpeza e definição sem afinar."
                price="R$ 5"
                onClick={() =>
                  abrirWhatsApp(
                    "Sobrancelha — R$ 5"
                  )
                }
              />

              <Price
                icon="fa-crown"
                title="Corte + Barba + Sobrancelha"
                description="O visual completo para sair do studio renovado."
                price="R$ 35"
                onClick={() =>
                  abrirWhatsApp(
                    "Corte + Barba + Sobrancelha — R$ 35"
                  )
                }
              />
            </div>

            <div className="price-footer">
              <span>
                <i className="fa-solid fa-circle-info" />

                Valores promocionais de inauguração.
              </span>

              <button
                className="text-link"
                onClick={() => scrollTo("contato")}
              >
                Solicitar horário →
              </button>
            </div>
          </div>
        </section>

        {/* =================================================
            EXPERIÊNCIA
        ================================================= */}

        <section
          className="section experience-section"
          id="experiencia"
        >
          <div className="container">
            <div className="section-heading centered">
              <span className="eyebrow">
                NOSSO PADRÃO
              </span>

              <h2>
                O detalhe faz{" "}
                <span>Diferença!</span>
              </h2>
            </div>

            <div className="experience-grid">
              <Experience
                number="01"
                icon="fa-scissors"
                title="Precisão"
                text="Técnica e atenção aos detalhes para um acabamento limpo e consistente."
              />

              <Experience
                number="02"
                icon="fa-chair"
                title="Atendimento"
                text="Um atendimento tranquilo, direto e personalizado para cada cliente."
              />

              <Experience
                number="03"
                icon="fa-gem"
                title="Estilo"
                text="Uma mistura equilibrada entre a tradição da barbearia e o estilo atual."
              />
            </div>
          </div>
        </section>

        {/* =================================================
            ANTES E DEPOIS
        ================================================= */}

        <section className="section transformation-section">
          <div className="container">
            <div className="transformation-grid">
              <div className="transformation-content">
                <span className="eyebrow">
                  RESULTADO
                </span>

                <h2>
                  Antes e{" "}
                  <span>depois.</span>
                </h2>

                <p>
                  Um bom corte não precisa ser
                  exagerado. Precisa ser preciso.
                </p>

                <p>
                  Trabalhamos formato, proporção e
                  acabamento para valorizar seu
                  rosto e seu estilo.
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() => scrollTo("contato")}
                >
                  Quero meu horário

                  <i className="fa-solid fa-arrow-right" />
                </button>
              </div>

              <Comparison />
            </div>
          </div>
        </section>

        {/* =================================================
            NÚMEROS
        ================================================= */}

        <section className="numbers-section">
          <div className="container">
            <div className="numbers-grid">
              <Number
                value="4+"
                text="ANOS DE EXPERIÊNCIA"
              />

              <Number
                value="1000+"
                text="CORTES REALIZADOS"
              />

              <Number
                value="100%"
                text="DEDICAÇÃO"
              />
            </div>
          </div>
        </section>

        {/* =================================================
            DEPOIMENTO
        ================================================= */}

        <section className="section testimonial-section">
          <div className="container">
            <div className="testimonial-card">
              <div className="quote-icon">
                <i className="fa-solid fa-quote-left" />
              </div>

              <p>
                “O objetivo nunca foi apenas
                cortar cabelo. É fazer você sair
                daqui se sentindo melhor do que
                entrou.”
              </p>

              <div className="testimonial-author">
                <span className="author-line" />

                JONAS LOUREIRO

                <span className="author-line" />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            AGENDAMENTO / WHATSAPP
        ================================================= */}

        <section
          className="section booking-section"
          id="contato"
        >
          <div className="container">
            <div className="booking-wrapper">
              <div className="booking-intro">
                <span className="eyebrow">
                  AGENDAMENTO
                </span>

                <h2>
                  Seu próximo corte{" "}
                  <span>começa aqui.</span>
                </h2>

                <p>
                  Escolha o serviço que deseja e
                  fale diretamente comigo pelo
                  WhatsApp. Seu horário será
                  combinado diretamente pelo
                  atendimento.
                </p>

                <div className="booking-note">
                  <i className="fa-brands fa-whatsapp" />

                  <div>
                    <strong>
                      Atendimento
                    </strong>

                    <span>
                      Segunda a sábado, das
                      08:00 às 19:30.
                    </span>
                  </div>
                </div>
              </div>

              {/* =================================================
                  FORMULÁRIO SIMPLIFICADO
              ================================================= */}

              <div className="booking-form">
                <div className="form-group">
                  <label>Escolha seu serviço</label>

                  <div className="input-wrapper">
                    <i className="fa-solid fa-scissors" />

                    <select
                      value={servicoSelecionado}
                      onChange={(e) =>
                        setServicoSelecionado(
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Selecione um serviço
                      </option>

                      <option value="Corte — R$ 15">
                        Corte — R$ 15
                      </option>

                      <option value="Barba — R$ 15">
                        Barba — R$ 15
                      </option>

                      <option value="Corte + Barba — R$ 30">
                        Corte + Barba — R$ 30
                      </option>

                      <option value="Sobrancelha — R$ 5">
                        Sobrancelha — R$ 5
                      </option>

                      <option value="Corte + Barba + Sobrancelha — R$ 35">
                        Corte + Barba + Sobrancelha — R$ 35
                      </option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  className="booking-button"
                  onClick={solicitarServico}
                >
                  <i className="fa-brands fa-whatsapp" />

                  Solicitar pelo WhatsApp
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            {/* MARCA */}

            <div className="footer-brand">
              <img
                src="/imagens/logo.png"
                alt="Zero Fio Barbearia"
              />

              <strong>
                JONAS LOUREIRO
              </strong>

              <p>
                Barbearia clássica, técnica
                moderna e estilo próprio.
              </p>
            </div>

            {/* NAVEGAÇÃO */}

            <div className="footer-column">
              <h4>Navegação</h4>

              <button
                onClick={() => scrollTo("inicio")}
              >
                Início
              </button>

              <button
                onClick={() => scrollTo("sobre")}
              >
                Sobre
              </button>

              <button
                onClick={() => scrollTo("precos")}
              >
                Serviços
              </button>

              <button
                onClick={() => scrollTo("experiencia")}
              >
                Experiência
              </button>

              <button
                onClick={() => scrollTo("contato")}
              >
                Agendamento
              </button>
            </div>

            {/* CONTATO */}

            <div className="footer-column">
              <h4>Contato</h4>

              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
                  WHATSAPP_MENSAGEM
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-whatsapp" />

                WhatsApp
              </a>

              <a
                href="https://instagram.com/jonasloureirobarber"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-brands fa-instagram" />

                Instagram
              </a>
            </div>

            {/* STUDIO */}

            <div className="footer-column">
              <h4>STUDIO</h4>

              <p>Jonas Loureiro</p>

              <p>Barbearia masculina</p>

              <p>Segunda a sábado</p>

              <p>08:00 às 19:30</p>
            </div>
          </div>

          {/* =================================================
              FOOTER BOTTOM
          ================================================= */}

          <div className="footer-bottom">
            <span>
              © 2026 STUDIO BARBEARIA
            </span>

            <span>
              Studio Jonas Loureiro
            </span>

            <span>
              Loureiro.Co Sistemas e desde 2015
            </span>
          </div>
        </div>
      </footer>

      {/* =====================================================
          WHATSAPP FLUTUANTE
      ===================================================== */}

      <a
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
          WHATSAPP_MENSAGEM
        )}`}
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp"
      >
        <i className="fa-brands fa-whatsapp" />

        <span>WhatsApp</span>
      </a>
    </>
  );
}

// =========================================================
// PRICE
// =========================================================

function Price({
  icon,
  title,
  description,
  price,
  featured = false,
  onClick,
}) {
  return (
    <article
      className={`price-card ${
        featured ? "featured" : ""
      }`}
    >
      {featured && (
        <span className="popular-tag">
          MAIS PROCURADO
        </span>
      )}

      <div className="price-icon">
        <i
          className={`fa-solid ${icon}`}
        />
      </div>

      <div className="price-info">
        <h3>{title}</h3>

        <p>{description}</p>
      </div>

      <strong className="price">
        {price}
      </strong>

      <button
        type="button"
        className="price-action"
        onClick={onClick}
      >
        <i className="fa-brands fa-whatsapp" />

        Agendar
      </button>
    </article>
  );
}

// =========================================================
// EXPERIENCE
// =========================================================

function Experience({
  number,
  icon,
  title,
  text,
}) {
  return (
    <article className="experience-card">
      <span className="experience-number">
        {number}
      </span>

      <div className="experience-icon">
        <i
          className={`fa-solid ${icon}`}
        />
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </article>
  );
}

// =========================================================
// NUMBER
// =========================================================

function Number({ value, text }) {
  return (
    <div className="number-item">
      <strong>{value}</strong>

      <span>{text}</span>
    </div>
  );
}

// =========================================================
// COMPARISON
// =========================================================

function Comparison() {
  const [position, setPosition] = useState(50);

  const calcularPosicao = (
    clientX,
    element
  ) => {
    const rect =
      element.getBoundingClientRect();

    const x =
      clientX - rect.left;

    const percentage = Math.max(
      0,
      Math.min(
        100,
        (x / rect.width) * 100
      )
    );

    setPosition(percentage);
  };

  const handleMove = (e) => {
    calcularPosicao(
      e.clientX,
      e.currentTarget
    );
  };

  const handleTouch = (e) => {
    const touch = e.touches[0];

    if (!touch) return;

    calcularPosicao(
      touch.clientX,
      e.currentTarget
    );
  };

  return (
    <div
      className="comparison-card"
      onMouseMove={handleMove}
      onTouchMove={handleTouch}
    >
      <img
        src="/imagens/depois.jpg"
        alt="Resultado depois do corte"
      />

      <div
        className="comparison-before-wrapper"
        style={{
          width: `${position}%`,
        }}
      >
        <img
          src="/imagens/antes.jpg"
          alt="Antes do corte"
        />
      </div>

      <span className="comparison-label before">
        ANTES
      </span>

      <span className="comparison-label after">
        DEPOIS
      </span>

      <div
        className="comparison-slider"
        style={{
          left: `${position}%`,
        }}
      >
        <span>
          <i className="fa-solid fa-arrows-left-right" />
        </span>
      </div>
    </div>
  );
}