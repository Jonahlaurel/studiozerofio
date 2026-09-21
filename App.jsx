import { useEffect, useState } from "react";

import "./style.css";

import Admin from "./admin/Admin.jsx";

import { createClient } from "@supabase/supabase-js";

// =========================================================
// CONFIGURAÇÕES
// =========================================================

const WHATSAPP = "5586999273849";

const WHATSAPP_MENSAGEM =
  "Oi Jonas, gostaria de agendar um horario!";

const HORA_INICIO = 8;

const HORA_FIM = 19.5;

// =========================================================
// CREDENCIAIS DO ADMIN
// =========================================================

const ADMIN_USUARIO = "jonasloureiro";

const ADMIN_SENHA = "84471874";

const ADMIN_STORAGE_KEY = "zero_fio_admin_autenticado";

// =========================================================
// SUPABASE
// =========================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(
        supabaseUrl,
        supabaseAnonKey
      )
    : null;

// =========================================================
// APP
// =========================================================

export default function App() {
  const pathname = window.location.pathname
    .replace(/\/+$/, "")
    .toLowerCase();

  // =======================================================
  // ADMIN
  // =======================================================

  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  ) {
    return <AdminArea />;
  }

  // =======================================================
  // SITE PRINCIPAL
  // =======================================================

  return <Home />;
}

// =========================================================
// LOGIN ADMINISTRATIVO
// =========================================================

function AdminLogin({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // =======================================================
  // ENTRAR
  // =======================================================

  function entrar(e) {
    e.preventDefault();

    setErro("");

    const usuarioDigitado = usuario
      .trim()
      .toLowerCase();

    // -------------------------------------------------------
    // USUÁRIO
    // -------------------------------------------------------

    if (!usuarioDigitado) {
      setErro("Digite o usuário.");
      return;
    }

    // -------------------------------------------------------
    // SENHA
    // -------------------------------------------------------

    if (!senha) {
      setErro("Digite a senha.");
      return;
    }

    setLoading(true);

    // -------------------------------------------------------
    // VALIDAR
    // -------------------------------------------------------

    if (
      usuarioDigitado !== ADMIN_USUARIO ||
      senha !== ADMIN_SENHA
    ) {
      setErro("Usuário ou senha incorretos.");
      setSenha("");
      setLoading(false);
      return;
    }

    // -------------------------------------------------------
    // SALVAR LOGIN
    // -------------------------------------------------------

    try {
      localStorage.setItem(
        ADMIN_STORAGE_KEY,
        "true"
      );
    } catch (error) {
      console.error(
        "Erro ao salvar login:",
        error
      );
    }

    // -------------------------------------------------------
    // CRIAR SESSÃO LOCAL DO ADMIN
    // -------------------------------------------------------

    const sessaoAdmin = {
      user: {
        id: "zero-fio-admin",
        email: "jonasloureiro@zerofio.local",
        user_metadata: {
          username: ADMIN_USUARIO,
        },
      },
      admin: true,
    };

    // -------------------------------------------------------
    // ENTRAR
    // -------------------------------------------------------

    setTimeout(() => {
      setLoading(false);

      if (typeof onLogin === "function") {
        onLogin(sessaoAdmin);
      }
    }, 300);
  }

  // =======================================================
  // TELA
  // =======================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(circle at top, #181815 0%, #0a0a09 55%, #050505 100%)",
        color: "#f4f0e7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background:
            "linear-gradient(145deg, #151512, #0e0e0c)",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius: "16px",
          padding: "35px",
          boxShadow:
            "0 25px 70px rgba(0,0,0,.65)",
          boxSizing: "border-box",
        }}
      >
        {/* =================================================
            LOGO
        ================================================= */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <img
            src="/imagens/logo.png"
            alt="Zero Fio"
            style={{
              width: "78px",
              height: "78px",
              objectFit: "contain",
              marginBottom: "15px",
            }}
          />

          <h1
            style={{
              margin: 0,
              fontSize: "26px",
              letterSpacing: "4px",
              fontFamily: "Georgia, serif",
            }}
          >
            JONAS LOUREIRO
          </h1>

          <p
            style={{
              marginTop: "9px",
              marginBottom: 0,
              color: "#777169",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Painel administrativo
          </p>
        </div>

        {/* =================================================
            FORMULÁRIO
        ================================================= */}

        <form onSubmit={entrar}>
          {/* USUÁRIO */}

          <div
            style={{
              marginBottom: "17px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "11px",
                color: "#aaa49a",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Usuário
            </label>

            <input
              type="text"
              placeholder="jonasloureiro"
              value={usuario}
              onChange={(e) =>
                setUsuario(e.target.value)
              }
              required
              autoComplete="username"
              autoFocus
              disabled={loading}
              style={{
                width: "100%",
                height: "48px",
                padding: "0 14px",
                borderRadius: "8px",
                border:
                  "1px solid rgba(255,255,255,.10)",
                background: "#0b0b0a",
                color: "#fff",
                outline: "none",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* SENHA */}

          <div
            style={{
              marginBottom: "17px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "11px",
                color: "#aaa49a",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Senha
            </label>

            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              required
              autoComplete="current-password"
              disabled={loading}
              style={{
                width: "100%",
                height: "48px",
                padding: "0 14px",
                borderRadius: "8px",
                border:
                  "1px solid rgba(255,255,255,.10)",
                background: "#0b0b0a",
                color: "#fff",
                outline: "none",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* ERRO */}

          {erro && (
            <div
              style={{
                marginBottom: "17px",
                padding: "12px 13px",
                borderRadius: "8px",
                background:
                  "rgba(201,111,111,.10)",
                border:
                  "1px solid rgba(201,111,111,.20)",
                color: "#c96f6f",
                fontSize: "12px",
                lineHeight: "1.5",
              }}
            >
              {erro}
            </div>
          )}

          {/* BOTÃO */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "48px",
              border: 0,
              borderRadius: "8px",
              background:
                "linear-gradient(135deg,#e7ca8b,#d7b56d)",
              color: "#17130d",
              fontWeight: "800",
              fontSize: "13px",
              letterSpacing: "0.5px",
              cursor: loading
                ? "wait"
                : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all .2s ease",
            }}
          >
            {loading
              ? "ENTRANDO..."
              : "ENTRAR NO PAINEL"}
          </button>
        </form>

        {/* =================================================
            RODAPÉ
        ================================================= */}

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#55514b",
            fontSize: "10px",
            letterSpacing: "1px",
          }}
        >
          STUDIO JONAS LOUREIRO
        </div>
      </div>
    </div>
  );
}

// =========================================================
// ADMIN
// =========================================================

function AdminArea() {
  const [autenticado, setAutenticado] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  // =======================================================
  // VERIFICAR LOGIN LOCAL
  // =======================================================

  useEffect(() => {
    let ativo = true;

    try {
      const loginSalvo =
        localStorage.getItem(
          ADMIN_STORAGE_KEY
        );

      if (!ativo) return;

      setAutenticado(
        loginSalvo === "true"
      );

      setLoading(false);
    } catch (error) {
      console.error(
        "Erro ao verificar login:",
        error
      );

      if (ativo) {
        setAutenticado(false);
        setLoading(false);
      }
    }

    return () => {
      ativo = false;
    };
  }, []);

  // =======================================================
  // CARREGANDO
  // =======================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top,#1b1b18,#080807 70%)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <img
            src="/imagens/logo.png"
            alt="Zero Fio"
            style={{
              width: "90px",
              height: "90px",
              objectFit: "contain",
              marginBottom: "20px",
            }}
          />

          <div
            style={{
              width: "35px",
              height: "35px",
              border:
                "3px solid rgba(255,255,255,.15)",
              borderTopColor:
                "#d7b56d",
              borderRadius: "50%",
              animation:
                "adminSpin 1s linear infinite",
              margin:
                "0 auto 15px",
            }}
          />

          <p
            style={{
              color: "#aaa",
              margin: 0,
            }}
          >
            Verificando acesso...
          </p>

          <style>
            {`
              @keyframes adminSpin {
                to {
                  transform: rotate(360deg);
                }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  // =======================================================
  // NÃO AUTENTICADO
  // =======================================================

  if (!autenticado) {
    return (
      <AdminLogin
        onLogin={() => {
          setAutenticado(true);
        }}
      />
    );
  }

  // =======================================================
  // SESSÃO ADMINISTRATIVA
  // =======================================================

  const sessaoAdmin = {
    user: {
      id: "zero-fio-admin",
      email:
        "jonasloureiro@zerofio.local",
      user_metadata: {
        username: ADMIN_USUARIO,
      },
    },
    admin: true,
  };

  // =======================================================
  // SUPABASE NÃO CONFIGURADO
  // =======================================================

  if (!supabase) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0b0b0a",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "30px",
            borderRadius: "15px",
            background: "#151512",
            border:
              "1px solid rgba(255,255,255,.1)",
          }}
        >
          <h1>
            STUDIO JONAS LOUREIRO
          </h1>

          <h2>
            Supabase não configurado
          </h2>

          <p>
            O login administrativo
            funcionou, porém o sistema
            não encontrou as variáveis
            do Supabase.
          </p>

          <pre
            style={{
              background: "#080808",
              padding: "15px",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
{`VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...`}
          </pre>
        </div>
      </div>
    );
  }

  // =======================================================
  // PAINEL
  // =======================================================

  return (
    <Admin
      session={sessaoAdmin}
      supabase={supabase}
    />
  );
}

// =========================================================
// SITE PRINCIPAL
// =========================================================

function Home() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    servico: "",
    data: "",
    horario: "",
    mensagem: "",
  });

  const [
    horariosDisponiveis,
    setHorariosDisponiveis,
  ] = useState([]);

  const [
    carregandoHorarios,
    setCarregandoHorarios,
  ] = useState(false);

  const [
    mensagemStatus,
    setMensagemStatus,
  ] = useState("");

  const [enviando, setEnviando] =
    useState(false);

  // =======================================================
  // SCROLL
  // =======================================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 30
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // =======================================================
  // GERAR HORÁRIOS
  // =======================================================

  const gerarHorarios = () => {
    const horarios = [];

    for (
      let minutos =
        HORA_INICIO * 60;
      minutos <= HORA_FIM * 60;
      minutos += 30
    ) {
      const hora = Math.floor(
        minutos / 60
      );

      const minuto = minutos % 60;

      horarios.push(
        `${String(hora).padStart(
          2,
          "0"
        )}:${String(minuto).padStart(
          2,
          "0"
        )}`
      );
    }

    return horarios;
  };

  // =======================================================
  // VERIFICAR DOMINGO
  // =======================================================

  const ehDomingo = (
    dataSelecionada
  ) => {
    if (!dataSelecionada) {
      return false;
    }

    const dataObj = new Date(
      `${dataSelecionada}T12:00:00`
    );

    return dataObj.getDay() === 0;
  };

  // =======================================================
  // CARREGAR HORÁRIOS
  // =======================================================

  const carregarHorarios = async (
    dataSelecionada
  ) => {
    if (!dataSelecionada) {
      setHorariosDisponiveis([]);
      setMensagemStatus("");
      return;
    }

    if (
      ehDomingo(dataSelecionada)
    ) {
      setHorariosDisponiveis([]);

      setMensagemStatus(
        "O studio funciona aos domingos de 8h as 12h."
      );

      return;
    }

    if (!supabase) {
      setHorariosDisponiveis([]);

      setMensagemStatus(
        "Supabase não configurado."
      );

      return;
    }

    setCarregandoHorarios(true);
    setMensagemStatus("");

    try {
      const {
        data,
        error,
      } = await supabase
        .from("agendamentos")
        .select("horario")
        .eq(
          "data",
          dataSelecionada
        );

      if (error) {
        throw error;
      }

      const ocupados =
        (data || [])
          .map((item) =>
            item?.horario
              ? String(
                  item.horario
                ).substring(0, 5)
              : null
          )
          .filter(Boolean);

      const todos =
        gerarHorarios();

      const disponiveis =
        todos.filter(
          (horario) =>
            !ocupados.includes(
              horario
            )
        );

      setHorariosDisponiveis(
        disponiveis
      );

      setMensagemStatus(
        disponiveis.length
          ? `${disponiveis.length} horário(s) disponível(is).`
          : "Não há horários disponíveis para esta data."
      );
    } catch (error) {
      console.error(
        "Erro ao carregar horários:",
        error
      );

      setHorariosDisponiveis([]);

      setMensagemStatus(
        "Não foi possível verificar os horários."
      );
    } finally {
      setCarregandoHorarios(false);
    }
  };

  // =======================================================
  // ALTERAÇÃO DO FORMULÁRIO
  // =======================================================

  const handleChange = async (e) => {
    const {
      name,
      value,
    } = e.target;

    if (name === "data") {
      setForm((prev) => ({
        ...prev,
        data: value,
        horario: "",
      }));

      setHorariosDisponiveis([]);

      setMensagemStatus(
        "Verificando horários..."
      );

      await carregarHorarios(
        value
      );

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =======================================================
  // FORMATAR DATA
  // =======================================================

  const formatarData = (data) => {
    if (!data) return "";

    const partes =
      data.split("-");

    if (
      partes.length !== 3
    ) {
      return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  // =======================================================
  // SALVAR AGENDAMENTO
  // =======================================================

  const salvarAgendamento =
    async () => {
      if (!supabase) {
        throw new Error(
          "Supabase não configurado."
        );
      }

      if (
        !form.data ||
        !form.horario
      ) {
        throw new Error(
          "Escolha uma data e um horário."
        );
      }

      if (
        ehDomingo(form.data)
      ) {
        throw new Error(
          "Não atendemos aos domingos."
        );
      }

      // ---------------------------------------------------
      // VERIFICAR SE O HORÁRIO JÁ FOI OCUPADO
      // ---------------------------------------------------

      const {
        data: existente,
        error: erroConsulta,
      } = await supabase
        .from("agendamentos")
        .select("id")
        .eq(
          "data",
          form.data
        )
        .eq(
          "horario",
          form.horario
        )
        .limit(1);

      if (erroConsulta) {
        throw new Error(
          `Não foi possível verificar o horário: ${erroConsulta.message}`
        );
      }

      if (
        existente &&
        existente.length
      ) {
        setHorariosDisponiveis(
          (prev) =>
            prev.filter(
              (item) =>
                item !==
                form.horario
            )
        );

        setForm((prev) => ({
          ...prev,
          horario: "",
        }));

        throw new Error(
          "Esse horário acabou de ser preenchido. Escolha outro."
        );
      }

      // ---------------------------------------------------
      // INSERIR AGENDAMENTO
      // ---------------------------------------------------

      const {
        error,
      } = await supabase
        .from("agendamentos")
        .insert([
          {
            nome:
              form.nome,

            telefone:
              form.telefone,

            serviço:
              form.servico,

            data:
              form.data,

            horario:
              form.horario,

            status:
              "pendente",

            mensagem:
              form.mensagem ||
              null,
          },
        ]);

      if (error) {
        throw new Error(
          `Não foi possível salvar o agendamento: ${error.message}`
        );
      }

      return true;
    };

  // =======================================================
  // ENVIAR WHATSAPP
  // =======================================================

  const enviarWhatsApp =
    async (e) => {
      e.preventDefault();

      if (enviando) return;

      if (
        !form.nome ||
        !form.telefone ||
        !form.servico ||
        !form.data ||
        !form.horario
      ) {
        setMensagemStatus(
          "Preencha todos os campos obrigatórios."
        );

        return;
      }

      if (
        ehDomingo(form.data)
      ) {
        setMensagemStatus(
          "Não atendemos aos domingos."
        );

        return;
      }

      setEnviando(true);

      setMensagemStatus(
        "Salvando seu agendamento..."
      );

      try {
        await salvarAgendamento();

        // =================================================
        // MENSAGEM DO AGENDAMENTO
        // =================================================

        const texto =
`Olá, gostaria de agendar um horario.

Nome: ${form.nome}

Telefone: ${form.telefone}

Serviço: ${form.servico}

Data: ${formatarData(form.data)}

Horário: ${form.horario}

Observação:
${form.mensagem || "Nenhuma"}

Aguardo a confirmação do meu horário.`;

        // =================================================
        // URL DO WHATSAPP
        // =================================================

        const url =
          `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

        setMensagemStatus(
          "Agendamento salvo! Abrindo WhatsApp..."
        );

        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );

        setForm({
          nome: "",
          telefone: "",
          servico: "",
          data: "",
          horario: "",
          mensagem: "",
        });

        setHorariosDisponiveis([]);
      } catch (error) {
        console.error(
          "Erro no agendamento:",
          error
        );

        setMensagemStatus(
          error?.message ||
          "Não foi possível salvar o agendamento."
        );
      } finally {
        setEnviando(false);
      }
    };

  // =======================================================
  // SCROLL PARA SEÇÃO
  // =======================================================

  const scrollTo = (id) => {
    setMenuOpen(false);

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  // =======================================================
  // DATA MÍNIMA
  // =======================================================

  const hoje = new Date();

  const dataMinima =
    `${hoje.getFullYear()}-${String(
      hoje.getMonth() + 1
    ).padStart(
      2,
      "0"
    )}-${String(
      hoje.getDate()
    ).padStart(
      2,
      "0"
    )}`;

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
            onClick={() =>
              setMenuOpen(false)
            }
          >
            <img
              src="/imagens/logo.png"
              alt="Zero Fio Barbearia"
              className="logo-img"
            />

            <div className="logo-text">
              <strong>
                JONAS LOUREIRO
              </strong>

              <span>
                STUDIO ✬ ✬ ✬
              </span>
            </div>
          </a>

          {/* =================================================
              MENU
          ================================================= */}

          <nav
            className={`nav-menu ${
              menuOpen
                ? "mobile-open"
                : ""
            }`}
          >
            <button
              onClick={() =>
                scrollTo("inicio")
              }
            >
              Início
            </button>

            <button
              onClick={() =>
                scrollTo("sobre")
              }
            >
              Sobre
            </button>

            <button
              onClick={() =>
                scrollTo("precos")
              }
            >
              Serviços
            </button>

            <button
              onClick={() =>
                scrollTo("experiencia")
              }
            >
              Experiência
            </button>

            <button
              onClick={() =>
                scrollTo("contato")
              }
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
            <span>
              WhatsApp
            </span>

            <i className="fa-brands fa-whatsapp" />
          </a>

          {/* =================================================
              MENU MOBILE
          ================================================= */}

          <button
            className="mobile-menu-btn"
            onClick={() =>
              setMenuOpen(
                !menuOpen
              )
            }
          >
            <i
              className={`fa-solid ${
                menuOpen
                  ? "fa-xmark"
                  : "fa-bars"
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

        <section
          className="hero"
          id="inicio"
        >
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

                <span>
                  Seja exclusivo.
                </span>
              </h1>

              <p className="hero-description">
                Barbearia Masculina Com Essência
                Old school, Técnica Moderna Do Degradê Ao
                Clássico Medio/Liso Old Money.
              </p>

              <div className="hero-actions">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    scrollTo("contato")
                  }
                >
                  Agendar horário

                  <i className="fa-solid fa-arrow-right" />
                </button>

                <button
                  className="btn btn-outline"
                  onClick={() =>
                    scrollTo("precos")
                  }
                >
                  Ver serviços
                </button>
              </div>

              <div className="hero-trust">
                <div className="trust-item">
                  <i className="fa-solid fa-scissors" />

                  <div>
                    <strong>
                      Precisão
                    </strong>

                    <span>
                      Acabamento impecável
                    </span>
                  </div>
                </div>

                <div className="trust-divider" />

                <div className="trust-item">
                  <i className="fa-solid fa-chair" />

                  <div>
                    <strong>
                      Experiência
                    </strong>

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
                  <strong>
                    4+
                  </strong>

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
                  <span>
                    personalidade.
                  </span>
                </h2>

                <div className="gold-line" />

                <p className="lead">
                  A ideia do primeiro studio barbershop de Matões nasceu da paixão pela barbearia clássica e pela busca constante por evolução,
                  técnicas tradicionais, métodos modernos e um atendimento pensado em cada detalhe. Um espaço reduzido para fugir da correria,
                  do barulho e do padrão convencional. Aqui cada cliente recebe uma experiência única, como toalha quente, vapor de ozônio e muito mais.
                  Foco em atendimento por agendamento. É só chegar e cortar, sem fila de espera, sem frustração, ou até mesmo você perder uma manhã
                  ou uma tarde aguardando atendimento.
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
                  <span>
                    Jonas Loureiro
                  </span>

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
              <span>
                Ele evolui!
              </span>
            </h2>

            <p>
              • POR JONAS LOUREIRO •
            </p>
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
                  <span>
                    Bem feito!
                  </span>
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
              />

              <Price
                icon="fa-user"
                title="Barba"
                description="Barba com acabamento e definição."
                price="R$ 15"
              />

              <Price
                icon="fa-scissors"
                title="Corte + Barba"
                description="Corte e barba para um visual completo."
                price="R$ 30"
                featured
              />

              <Price
                icon="fa-eye"
                title="Sobrancelha"
                description="Limpeza e definição sem afinar."
                price="R$ 5"
              />

              <Price
                icon="fa-crown"
                title="Corte + Barba + Sobrancelha"
                description="O visual completo para sair do studio renovado."
                price="R$ 35"
              />
            </div>

            <div className="price-footer">
              <span>
                <i className="fa-solid fa-circle-info" />

                Valores promocionais de inauguração.
              </span>

              <button
                className="text-link"
                onClick={() =>
                  scrollTo("contato")
                }
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
                <span>
                  Diferença!
                </span>
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
                  <span>
                    depois.
                  </span>
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
                  onClick={() =>
                    scrollTo("contato")
                  }
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
            AGENDAMENTO
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
                  <span>
                    começa aqui.
                  </span>
                </h2>

                <p>
                  Escolha uma data e um horário
                  disponível. O pedido será salvo
                  automaticamente no sistema e
                  enviado para o WhatsApp.
                </p>

                <div className="booking-note">
                  <i className="fa-brands fa-whatsapp" />

                  <div>
                    <strong>
                      Segunda a sábado
                    </strong>

                    <span>
                      Atendimento das 08:00 às
                      19:30.
                    </span>
                  </div>
                </div>
              </div>

              {/* =================================================
                  FORMULÁRIO
              ================================================= */}

              <form
                className="booking-form"
                onSubmit={enviarWhatsApp}
              >
                <div className="form-row">
                  <FormInput
                    label="Nome"
                    name="nome"
                    placeholder="Seu nome"
                    value={form.nome}
                    onChange={handleChange}
                    icon="fa-user"
                    required
                  />

                  <FormInput
                    label="Telefone"
                    name="telefone"
                    placeholder="(86) 99927-3849"
                    value={form.telefone}
                    onChange={handleChange}
                    icon="fa-phone"
                    required
                  />
                </div>

                {/* SERVIÇO */}

                <div className="form-group">
                  <label>
                    Serviço
                  </label>

                  <div className="input-wrapper">
                    <i className="fa-solid fa-scissors" />

                    <select
                      name="servico"
                      value={form.servico}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Selecione um serviço
                      </option>

                      <option value="Corte">
                        Corte — R$ 15
                      </option>

                      <option value="Barba">
                        Barba — R$ 15
                      </option>

                      <option value="Corte + Barba">
                        Corte + Barba — R$ 30
                      </option>

                      <option value="Sobrancelha">
                        Sobrancelha — R$ 5
                      </option>

                      <option value="Corte + Barba + Sobrancelha">
                        Corte + Barba + Sobrancelha — R$ 35
                      </option>
                    </select>
                  </div>
                </div>

                {/* DATA E HORÁRIO */}

                <div className="form-row">
                  <FormInput
                    label="Data"
                    name="data"
                    type="date"
                    value={form.data}
                    onChange={handleChange}
                    icon="fa-calendar"
                    required
                    min={dataMinima}
                  />

                  <div className="form-group">
                    <label>
                      Horário
                    </label>

                    <div className="input-wrapper">
                      <i className="fa-solid fa-clock" />

                      <select
                        name="horario"
                        value={form.horario}
                        onChange={handleChange}
                        required
                        disabled={
                          !form.data ||
                          carregandoHorarios ||
                          horariosDisponiveis.length === 0
                        }
                      >
                        <option value="">
                          {!form.data
                            ? "Selecione a data primeiro"
                            : carregandoHorarios
                            ? "Verificando horários..."
                            : horariosDisponiveis.length === 0
                            ? "Nenhum horário disponível"
                            : "Selecione um horário"}
                        </option>

                        {horariosDisponiveis.map(
                          (horario) => (
                            <option
                              key={horario}
                              value={horario}
                            >
                              {horario}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* STATUS */}

                {mensagemStatus && (
                  <div
                    className="booking-status"
                    role="status"
                  >
                    {mensagemStatus}
                  </div>
                )}

                {/* OBSERVAÇÃO */}

                <div className="form-group">
                  <label>
                    Observação
                  </label>

                  <div className="input-wrapper textarea-wrapper">
                    <i className="fa-solid fa-message" />

                    <textarea
                      name="mensagem"
                      value={form.mensagem}
                      onChange={handleChange}
                      placeholder="Alguma observação?"
                    />
                  </div>
                </div>

                {/* BOTÃO */}

                <button
                  type="submit"
                  className="booking-button"
                  disabled={
                    enviando ||
                    carregandoHorarios ||
                    !form.horario
                  }
                >
                  <i className="fa-brands fa-whatsapp" />

                  {enviando
                    ? "Salvando agendamento..."
                    : "Solicitar pelo WhatsApp"}
                </button>
              </form>
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
              <h4>
                Navegação
              </h4>

              <button
                onClick={() =>
                  scrollTo("inicio")
                }
              >
                Início
              </button>

              <button
                onClick={() =>
                  scrollTo("sobre")
                }
              >
                Sobre
              </button>

              <button
                onClick={() =>
                  scrollTo("precos")
                }
              >
                Serviços
              </button>

              <button
                onClick={() =>
                  scrollTo("experiencia")
                }
              >
                Experiência
              </button>

              <button
                onClick={() =>
                  scrollTo("contato")
                }
              >
                Agendamento
              </button>
            </div>

            {/* CONTATO */}

            <div className="footer-column">
              <h4>
                Contato
              </h4>

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

            {/* ZERO FIO */}

            <div className="footer-column">
              <h4>
                STUDIO
              </h4>

              <p>
                Jonas Loureiro
              </p>

              <p>
                Barbearia masculina
              </p>

              <p>
                Segunda a sábado
              </p>

              <p>
                08:00 às 19:30
              </p>
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

        <span>
          WhatsApp
        </span>
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
        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>
      </div>

      <strong className="price">
        {price}
      </strong>
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

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>
    </article>
  );
}

// =========================================================
// NUMBER
// =========================================================

function Number({
  value,
  text,
}) {
  return (
    <div className="number-item">
      <strong>
        {value}
      </strong>

      <span>
        {text}
      </span>
    </div>
  );
}

// =========================================================
// FORM INPUT
// =========================================================

function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  required = false,
  min,
}) {
  return (
    <div className="form-group">
      <label>
        {label}
      </label>

      <div className="input-wrapper">
        <i
          className={`fa-solid ${icon}`}
        />

        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
        />
      </div>
    </div>
  );
}

// =========================================================
// COMPARISON
// =========================================================

function Comparison() {
  const [position, setPosition] =
    useState(50);

  const calcularPosicao = (
    clientX,
    element
  ) => {
    const rect =
      element.getBoundingClientRect();

    const x =
      clientX - rect.left;

    const percentage =
      Math.max(
        0,
        Math.min(
          100,
          (x / rect.width) * 100
        )
      );

    setPosition(
      percentage
    );
  };

  const handleMove = (e) => {
    calcularPosicao(
      e.clientX,
      e.currentTarget
    );
  };

  const handleTouch = (e) => {
    const touch =
      e.touches[0];

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