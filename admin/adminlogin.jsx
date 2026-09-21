import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// =========================================================
// SUPABASE
// =========================================================

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;

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
// CREDENCIAIS DO ADMIN
// =========================================================

const ADMIN_USUARIO = "jonasloureiro";
const ADMIN_SENHA = "84471874";

// =========================================================
// LOGIN ADMINISTRATIVO
// =========================================================

export default function AdminLogin({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [erro, setErro] =
    useState("");

  // =======================================================
  // ENTRAR
  // =======================================================

  async function entrar(e) {
    e.preventDefault();

    setErro("");

    const usuarioDigitado =
      usuario.trim().toLowerCase();

    // =====================================================
    // VALIDAR USUÁRIO
    // =====================================================

    if (!usuarioDigitado) {
      setErro("Digite o usuário.");
      return;
    }

    if (!senha) {
      setErro("Digite a senha.");
      return;
    }

    // =====================================================
    // VALIDAR CREDENCIAIS
    // =====================================================

    if (
      usuarioDigitado !==
        ADMIN_USUARIO ||
      senha !== ADMIN_SENHA
    ) {
      setErro(
        "Usuário ou senha incorretos."
      );

      setSenha("");

      return;
    }

    // =====================================================
    // VERIFICAR SUPABASE
    // =====================================================

    if (!supabase) {
      setErro(
        "Supabase não está configurado. Verifique o arquivo .env."
      );

      return;
    }

    setLoading(true);

    try {
      // ===================================================
      // IMPORTANTE
      //
      // O usuário visualiza:
      //
      // jonasloureiro
      //
      // mas o painel continua utilizando a autenticação
      // do Supabase através de uma sessão administrativa.
      // ===================================================

      const {
        data: sessionData,
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error(
          "Erro ao verificar sessão:",
          sessionError
        );
      }

      // ===================================================
      // SE JÁ EXISTIR UMA SESSÃO
      // ===================================================

      if (sessionData?.session) {
        if (
          typeof onLogin ===
          "function"
        ) {
          onLogin(
            sessionData.session
          );

          return;
        }
      }

      // ===================================================
      // ATENÇÃO
      //
      // O login abaixo usa o usuário cadastrado no
      // Supabase Auth.
      //
      // Se seu usuário do Supabase tiver um e-mail,
      // coloque esse e-mail aqui.
      // ===================================================

      const emailAdmin =
        import.meta.env
          .VITE_ADMIN_EMAIL;

      if (!emailAdmin) {
        setErro(
          "Configure VITE_ADMIN_EMAIL no arquivo .env para conectar o usuário ao Supabase."
        );

        return;
      }

      // ===================================================
      // LOGIN SUPABASE
      // ===================================================

      const {
        data,
        error,
      } =
        await supabase.auth.signInWithPassword({
          email: emailAdmin,
          password: ADMIN_SENHA,
        });

      if (error) {
        console.error(
          "Erro no login Supabase:",
          error
        );

        setErro(
          "Não foi possível entrar no painel. Verifique o usuário administrativo no Supabase."
        );

        return;
      }

      // ===================================================
      // LOGIN OK
      // ===================================================

      if (data?.session) {
        if (
          typeof onLogin ===
          "function"
        ) {
          onLogin(
            data.session
          );

          return;
        }

        window.location.reload();

        return;
      }

      setErro(
        "Login realizado, mas a sessão não foi criada."
      );

    } catch (error) {
      console.error(
        "Erro inesperado:",
        error
      );

      setErro(
        "Não foi possível realizar o login. Tente novamente."
      );

    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // TELA
  // =========================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #181815 0%, #0a0a09 55%)",
        color: "#f4f0e7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
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
          borderRadius: "14px",
          padding: "35px",
          boxShadow:
            "0 25px 70px rgba(0,0,0,.55)",
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
              width: "75px",
              height: "75px",
              objectFit: "contain",
              marginBottom: "15px",
            }}
          />

          <h1
            style={{
              margin: 0,
              fontSize: "25px",
              letterSpacing: "3px",
              fontFamily:
                "Georgia, serif",
            }}
          >
            ZERO FIO
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#777169",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform:
                "uppercase",
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
              marginBottom: "16px",
            }}
          >

            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "11px",
                color: "#aaa49a",
              }}
            >
              Usuário
            </label>

            <input
              type="text"
              placeholder="jonasloureiro"
              value={usuario}
              onChange={(e) =>
                setUsuario(
                  e.target.value
                )
              }
              required
              autoComplete="username"
              autoFocus
              disabled={loading}
              style={{
                width: "100%",
                height: "46px",
                padding: "0 13px",
                borderRadius: "7px",
                border:
                  "1px solid rgba(255,255,255,.09)",
                background: "#0b0b0a",
                color: "#fff",
                outline: "none",
                fontSize: "13px",
                boxSizing:
                  "border-box",
              }}
            />

          </div>

          {/* SENHA */}

          <div
            style={{
              marginBottom: "16px",
            }}
          >

            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "11px",
                color: "#aaa49a",
              }}
            >
              Senha
            </label>

            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) =>
                setSenha(
                  e.target.value
                )
              }
              required
              autoComplete="current-password"
              disabled={loading}
              style={{
                width: "100%",
                height: "46px",
                padding: "0 13px",
                borderRadius: "7px",
                border:
                  "1px solid rgba(255,255,255,.09)",
                background: "#0b0b0a",
                color: "#fff",
                outline: "none",
                fontSize: "13px",
                boxSizing:
                  "border-box",
              }}
            />

          </div>

          {/* ERRO */}

          {erro && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                borderRadius: "7px",
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
              height: "46px",
              border: 0,
              borderRadius: "7px",
              background:
                "linear-gradient(135deg,#e7ca8b,#d7b56d)",
              color: "#17130d",
              fontWeight: "800",
              cursor: loading
                ? "wait"
                : "pointer",
              opacity:
                loading ? 0.7 : 1,
              transition:
                "all .2s ease",
            }}
          >
            {loading
              ? "ENTRANDO..."
              : "ENTRAR NO PAINEL"}
          </button>

        </form>

        {/* RODAPÉ */}

        <div
          style={{
            textAlign: "center",
            marginTop: "25px",
            color: "#55514b",
            fontSize: "10px",
          }}
        >
          ZERO FIO • STUDIO JONAS LOUREIRO
        </div>

      </div>

    </div>
  );
}