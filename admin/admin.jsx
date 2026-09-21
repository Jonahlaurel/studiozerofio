import { useEffect, useState } from "react";
import "./admin.css";

/* =========================================================
   COLUNAS DO BANCO DE DADOS
========================================================= */

/*
  ATENÇÃO:
  A coluna "serviço" EXISTE no banco.
  Por isso mantemos o acento.

  A coluna "observações" NÃO EXISTE.
  Usaremos "observacoes" sem acento.
*/
const COLUNA_SERVICO = "serviço";
const COLUNA_OBSERVACOES = "observacoes";

/* =========================================================
   CONSTANTES
========================================================= */

const STATUS_AGENDAMENTO = {
  aguardando: "Aguardando",
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const AGENDAMENTO_INICIAL = {
  cliente_id: "",
  barbeiro_id: "",
  nome: "",
  telefone: "",
  serviço: "",
  data: "",
  horario: "",
  mensagem: "",
  status: "aguardando",
};

const BARBEIRO_INICIAL = {
  nome: "",
  telefone: "",
  email: "",
  especialidade: "",
  foto: "",
};

const CLIENTE_INICIAL = {
  nome: "",
  telefone: "",
  email: "",
  observacoes: "",
};

/* =========================================================
   ADMIN
========================================================= */

export default function Admin({ session, supabase }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "fa-chart-line",
    },
    {
      id: "atendimentos",
      label: "Atendimentos",
      icon: "fa-scissors",
    },
    {
      id: "agendamentos",
      label: "Agendamentos",
      icon: "fa-calendar-days",
    },
    {
      id: "clientes",
      label: "Clientes",
      icon: "fa-users",
    },
    {
      id: "barbeiros",
      label: "Barbeiros",
      icon: "fa-user-tie",
    },
    {
      id: "financeiro",
      label: "Financeiro",
      icon: "fa-wallet",
    },
    {
      id: "relatorios",
      label: "Relatórios",
      icon: "fa-chart-column",
    },
    {
      id: "configuracoes",
      label: "Configurações",
      icon: "fa-gear",
    },
  ];

  function renderPage() {
    switch (activePage) {
      case "atendimentos":
        return <Atendimentos supabase={supabase} />;

      case "agendamentos":
        return <Agendamentos supabase={supabase} />;

      case "clientes":
        return <Clientes supabase={supabase} />;

      case "barbeiros":
        return <Barbeiros supabase={supabase} />;

      case "financeiro":
        return <Financeiro />;

      case "relatorios":
        return <Relatorios />;

      case "configuracoes":
        return <Configuracoes />;

      default:
        return <Dashboard supabase={supabase} />;
    }
  }

  const paginaAtual =
    menuItems.find((item) => item.id === activePage)?.label ||
    "Dashboard";

  return (
    <div className="admin-app">
      <aside
        className={`admin-sidebar ${menuOpen ? "open" : ""}`}
      >
        <div className="admin-brand">
          <div className="admin-brand-logo">
            <img
              src="/imagens/logo.png"
              alt="Zero Fio"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="admin-brand-text">
            <strong>ZERO FIO</strong>

            <span>PAINEL ADMIN</span>
          </div>
        </div>

        <div className="admin-divider" />

        <nav className="admin-navigation">
          <span className="admin-menu-title">
            MENU PRINCIPAL
          </span>

          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                activePage === item.id
                  ? "active"
                  : ""
              }
              onClick={() => {
                setActivePage(item.id);
                setMenuOpen(false);
              }}
            >
              <i
                className={`fa-solid ${item.icon}`}
              />

              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <i className="fa-solid fa-arrow-left" />

            <span>Voltar para o site</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <button
            type="button"
            className="admin-mobile-button"
            onClick={() =>
              setMenuOpen(!menuOpen)
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

          <div className="admin-header-title">
            <span>PAINEL ADMINISTRATIVO</span>

            <h1>{paginaAtual}</h1>
          </div>

          <div className="admin-header-right">
            <div className="admin-status">
              <span />
              Sistema online
            </div>

            <div className="admin-user">
              <div className="admin-user-avatar">
                JL
              </div>

              <div>
                <strong>Jonas Loureiro</strong>

                <span>Administrador</span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          {renderPage()}
        </main>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={() =>
            setMenuOpen(false)
          }
          aria-label="Fechar menu"
        />
      )}
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ supabase }) {
  const [dados, setDados] = useState({
    agendamentos: 0,
    atendimentos: 0,
    clientes: 0,
    faturamento: 0,
  });

  useEffect(() => {
    async function carregar() {
      if (!supabase) return;

      try {
        const hoje =
          new Date()
            .toISOString()
            .split("T")[0];

        const [
          agendamentosResponse,
          clientesResponse,
        ] = await Promise.all([
          supabase
            .from("agendamentos")
            .select("id", {
              count: "exact",
              head: true,
            })
            .eq("data", hoje),

          supabase
            .from("clientes")
            .select("id", {
              count: "exact",
              head: true,
            }),
        ]);

        if (agendamentosResponse.error) {
          console.error(
            "Erro dashboard agendamentos:",
            agendamentosResponse.error
          );
        }

        if (clientesResponse.error) {
          console.error(
            "Erro dashboard clientes:",
            clientesResponse.error
          );
        }

        setDados({
          agendamentos:
            agendamentosResponse.count || 0,

          atendimentos: 0,

          clientes:
            clientesResponse.count || 0,

          faturamento: 0,
        });
      } catch (error) {
        console.error(
          "Erro ao carregar dashboard:",
          error
        );
      }
    }

    carregar();
  }, [supabase]);

  return (
    <div className="admin-page">
      <div className="admin-welcome">
        <div>
          <span>VISÃO GERAL</span>

          <h2>Bom trabalho, Jonas.</h2>

          <p>
            Aqui está o resumo da Zero Fio hoje.
          </p>
        </div>

        <div className="today-date">
          <i className="fa-regular fa-calendar" />

          {new Date().toLocaleDateString(
            "pt-BR",
            {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            }
          )}
        </div>
      </div>

      <div className="dashboard-cards">
        <DashboardCard
          icon="fa-calendar-check"
          label="Agendamentos hoje"
          value={dados.agendamentos}
          detail="Agendamentos"
        />

        <DashboardCard
          icon="fa-scissors"
          label="Atendimentos"
          value={dados.atendimentos}
          detail="Hoje"
        />

        <DashboardCard
          icon="fa-user-plus"
          label="Clientes"
          value={dados.clientes}
          detail="Cadastrados"
        />

        <DashboardCard
          icon="fa-money-bill-trend-up"
          label="Faturamento"
          value={formatarMoeda(
            dados.faturamento
          )}
          detail="Hoje"
        />
      </div>

      <section className="admin-panel">
        <div className="panel-header">
          <div>
            <span>AGENDA</span>

            <h3>Atendimentos de hoje</h3>
          </div>
        </div>

        <EmptyState
          icon="fa-calendar"
          title="Agenda disponível"
          text="Acesse Agendamentos para visualizar os horários."
        />
      </section>
    </div>
  );
}

/* =========================================================
   DASHBOARD CARD
========================================================= */

function DashboardCard({
  icon,
  label,
  value,
  detail,
}) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-top">
        <div className="dashboard-card-icon">
          <i
            className={`fa-solid ${icon}`}
          />
        </div>

        <i className="fa-solid fa-ellipsis" />
      </div>

      <span>{label}</span>

      <strong>{value}</strong>

      <small>{detail}</small>
    </div>
  );
}

/* =========================================================
   ATENDIMENTOS
========================================================= */

function Atendimentos() {
  return (
    <div className="admin-page">
      <PageTitle
        eyebrow="OPERAÇÃO"
        title="Atendimentos do dia"
        description="Controle os clientes que estão sendo atendidos hoje."
      />

      <section className="admin-panel">
        <div className="panel-header">
          <div>
            <span>ATENDIMENTOS</span>

            <h3>Clientes de hoje</h3>
          </div>
        </div>

        <EmptyState
          icon="fa-scissors"
          title="Nenhum atendimento registrado"
          text="Os atendimentos serão organizados aqui."
        />
      </section>
    </div>
  );
}

/* =========================================================
   AGENDAMENTOS
========================================================= */

function Agendamentos({ supabase }) {
  const [agendamentos, setAgendamentos] =
    useState([]);

  const [barbeiros, setBarbeiros] =
    useState([]);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [busca, setBusca] =
    useState("");

  const [filtroStatus, setFiltroStatus] =
    useState("todos");

  const [agendamento, setAgendamento] =
    useState({
      ...AGENDAMENTO_INICIAL,
    });

  const [alterandoStatus, setAlterandoStatus] =
    useState(null);

  const [excluindo, setExcluindo] =
    useState(null);

  async function carregarDados() {
    if (!supabase) {
      setCarregando(false);
      return;
    }

    setCarregando(true);

    try {
      const [
        agendamentosResponse,
        barbeirosResponse,
      ] = await Promise.all([
        supabase
          .from("agendamentos")
          .select("*")
          .order("data", {
            ascending: true,
          })
          .order("horario", {
            ascending: true,
          }),

        supabase
          .from("barbeiros")
          .select("*")
          .order("nome", {
            ascending: true,
          }),
      ]);

      if (agendamentosResponse.error) {
        throw new Error(
          `Agendamentos: ${agendamentosResponse.error.message}`
        );
      }

      if (barbeirosResponse.error) {
        console.error(
          "Erro ao carregar barbeiros:",
          barbeirosResponse.error
        );
      }

      setAgendamentos(
        agendamentosResponse.data || []
      );

      setBarbeiros(
        barbeirosResponse.data || []
      );
    } catch (error) {
      console.error(
        "Erro ao carregar agendamentos:",
        error
      );

      alert(
        "Erro ao carregar agendamentos:\n\n" +
          error.message
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, [supabase]);

  function alterarCampo(e) {
    const {
      name,
      value,
    } = e.target;

    setAgendamento(
      (anterior) => ({
        ...anterior,
        [name]: value,
      })
    );
  }

  function limparFormulario() {
    setAgendamento({
      ...AGENDAMENTO_INICIAL,
    });
  }

  async function cadastrarAgendamento(e) {
    e.preventDefault();

    if (!supabase) {
      alert("Supabase não configurado.");
      return;
    }

    const nome =
      String(
        agendamento.nome || ""
      ).trim();

    const servico =
      String(
        agendamento[
          COLUNA_SERVICO
        ] || ""
      ).trim();

    if (!nome) {
      alert(
        "Informe o nome do cliente."
      );
      return;
    }

    if (!agendamento.barbeiro_id) {
      alert(
        "Selecione o barbeiro."
      );
      return;
    }

    if (!servico) {
      alert(
        "Informe o serviço."
      );
      return;
    }

    if (!agendamento.data) {
      alert("Informe o dia.");
      return;
    }

    if (!agendamento.horario) {
      alert("Informe o horário.");
      return;
    }

    setSalvando(true);

    try {
      const novoAgendamento = {
        cliente_id:
          agendamento.cliente_id || null,

        barbeiro_id:
          agendamento.barbeiro_id,

        nome,

        telefone:
          String(
            agendamento.telefone || ""
          ).trim() || null,

        [COLUNA_SERVICO]:
          servico,

        data:
          agendamento.data,

        horario:
          agendamento.horario,

        mensagem:
          String(
            agendamento.mensagem || ""
          ).trim() || null,

        status:
          "aguardando",
      };

      console.log(
        "SALVANDO AGENDAMENTO:",
        novoAgendamento
      );

      const { error } =
        await supabase
          .from("agendamentos")
          .insert(
            novoAgendamento
          );

      if (error) {
        console.error(
          "ERRO SUPABASE AGENDAMENTO:",
          error
        );

        throw new Error(
          `${error.message}\n\nCódigo: ${
            error.code || "N/A"
          }`
        );
      }

      await carregarDados();

      limparFormulario();

      setMostrarFormulario(false);

      alert(
        "Agendamento salvo com sucesso!"
      );
    } catch (error) {
      console.error(
        "ERRO FINAL AO SALVAR AGENDAMENTO:",
        error
      );

      alert(
        "Não foi possível salvar o agendamento.\n\n" +
          (
            error?.message ||
            "Erro desconhecido."
          )
      );
    } finally {
      setSalvando(false);
    }
  }

  async function excluirAgendamento(id) {
    if (!supabase) {
      alert(
        "Supabase não configurado."
      );
      return;
    }

    if (
      !window.confirm(
        "Deseja realmente excluir este agendamento?\n\nEssa ação não poderá ser desfeita."
      )
    ) {
      return;
    }

    setExcluindo(id);

    try {
      const { error } =
        await supabase
          .from("agendamentos")
          .delete()
          .eq("id", id);

      if (error) {
        throw error;
      }

      setAgendamentos(
        (anterior) =>
          anterior.filter(
            (item) =>
              String(item.id) !==
              String(id)
          )
      );

      alert(
        "Agendamento excluído com sucesso!"
      );
    } catch (error) {
      console.error(
        "Erro ao excluir agendamento:",
        error
      );

      alert(
        "Erro ao excluir agendamento:\n\n" +
          error.message
      );
    } finally {
      setExcluindo(null);
    }
  }

  async function alterarStatus(
    id,
    novoStatus
  ) {
    if (!supabase) {
      alert(
        "Supabase não configurado."
      );
      return;
    }

    setAlterandoStatus(id);

    try {
      const { error } =
        await supabase
          .from("agendamentos")
          .update({
            status: novoStatus,
          })
          .eq("id", id);

      if (error) {
        throw error;
      }

      setAgendamentos(
        (anterior) =>
          anterior.map(
            (item) =>
              String(item.id) ===
              String(id)
                ? {
                    ...item,
                    status:
                      novoStatus,
                  }
                : item
          )
      );
    } catch (error) {
      console.error(
        "Erro ao alterar status:",
        error
      );

      alert(
        "Erro ao alterar status:\n\n" +
          error.message
      );
    } finally {
      setAlterandoStatus(null);
    }
  }

  async function confirmarAgendamento(id) {
    await alterarStatus(
      id,
      "confirmado"
    );
  }

  async function cancelarAgendamento(id) {
    if (
      !window.confirm(
        "Deseja cancelar este agendamento?"
      )
    ) {
      return;
    }

    await alterarStatus(
      id,
      "cancelado"
    );
  }

  async function concluirAgendamento(id) {
    await alterarStatus(
      id,
      "concluido"
    );
  }

  const agendamentosFiltrados =
    agendamentos.filter((item) => {
      const texto =
        busca
          .toLowerCase()
          .trim();

      const valorServico =
        String(
          item[COLUNA_SERVICO] || ""
        );

      const correspondeBusca =
        !texto ||
        String(item.nome || "")
          .toLowerCase()
          .includes(texto) ||
        valorServico
          .toLowerCase()
          .includes(texto);

      const correspondeStatus =
        filtroStatus === "todos" ||
        item.status ===
          filtroStatus;

      return (
        correspondeBusca &&
        correspondeStatus
      );
    });

  const hoje =
    new Date()
      .toISOString()
      .split("T")[0];

  const agendamentosHoje =
    agendamentos.filter(
      (item) =>
        item.data === hoje
    );

  return (
    <div className="admin-page">
      <PageTitle
        eyebrow="AGENDA"
        title="Agendamentos"
        description="Visualize, crie e organize os horários da Zero Fio."
      />

      <div className="dashboard-cards">
        <DashboardCard
          icon="fa-calendar-day"
          label="Hoje"
          value={
            agendamentosHoje.length
          }
          detail="Agendamentos"
        />

        <DashboardCard
          icon="fa-clock"
          label="Aguardando"
          value={
            agendamentosHoje.filter(
              (item) =>
                item.status ===
                "aguardando"
            ).length
          }
          detail="Hoje"
        />

        <DashboardCard
          icon="fa-circle-check"
          label="Confirmados"
          value={
            agendamentosHoje.filter(
              (item) =>
                item.status ===
                "confirmado"
            ).length
          }
          detail="Hoje"
        />

        <DashboardCard
          icon="fa-circle-xmark"
          label="Cancelados"
          value={
            agendamentosHoje.filter(
              (item) =>
                item.status ===
                "cancelado"
            ).length
          }
          detail="Hoje"
        />
      </div>

      <section className="admin-panel">
        <div className="panel-header">
          <div>
            <span>AGENDA</span>

            <h3>
              Todos os agendamentos
            </h3>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={() => {
              if (!mostrarFormulario) {
                limparFormulario();
              }

              setMostrarFormulario(
                !mostrarFormulario
              );
            }}
          >
            <i
              className={`fa-solid ${
                mostrarFormulario
                  ? "fa-xmark"
                  : "fa-plus"
              }`}
            />

            {mostrarFormulario
              ? "Cancelar"
              : "Novo agendamento"}
          </button>
        </div>

        {mostrarFormulario && (
          <form
            className="product-form"
            onSubmit={
              cadastrarAgendamento
            }
          >
            <div className="product-form-grid">
              <div className="form-group">
                <label>
                  Nome *
                </label>

                <input
                  type="text"
                  name="nome"
                  value={
                    agendamento.nome
                  }
                  onChange={
                    alterarCampo
                  }
                  placeholder="Nome do cliente"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Barbeiro *
                </label>

                <select
                  name="barbeiro_id"
                  value={
                    agendamento.barbeiro_id
                  }
                  onChange={
                    alterarCampo
                  }
                  required
                >
                  <option value="">
                    Selecionar barbeiro
                  </option>

                  {barbeiros.map(
                    (barbeiro) => (
                      <option
                        key={barbeiro.id}
                        value={
                          barbeiro.id
                        }
                      >
                        {barbeiro.nome}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Serviço *
                </label>

                <input
                  type="text"
                  name={
                    COLUNA_SERVICO
                  }
                  value={
                    agendamento[
                      COLUNA_SERVICO
                    ]
                  }
                  onChange={
                    alterarCampo
                  }
                  placeholder="Ex: Corte e Barba"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Dia *
                </label>

                <input
                  type="date"
                  name="data"
                  value={
                    agendamento.data
                  }
                  onChange={
                    alterarCampo
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Horário *
                </label>

                <input
                  type="time"
                  name="horario"
                  value={
                    agendamento.horario
                  }
                  onChange={
                    alterarCampo
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Telefone
                </label>

                <input
                  type="text"
                  name="telefone"
                  value={
                    agendamento.telefone
                  }
                  onChange={
                    alterarCampo
                  }
                  placeholder="(99) 99999-9999"
                />
              </div>
            </div>

            <div
              className="form-group"
              style={{
                marginTop: "20px",
              }}
            >
              <label>
                Observações
              </label>

              <textarea
                name="mensagem"
                value={
                  agendamento.mensagem
                }
                onChange={
                  alterarCampo
                }
                placeholder="Observações sobre o agendamento..."
                rows="4"
              />
            </div>

            <div className="product-form-actions">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={() => {
                  limparFormulario();

                  setMostrarFormulario(
                    false
                  );
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="admin-primary-button"
                disabled={salvando}
              >
                <i
                  className={`fa-solid ${
                    salvando
                      ? "fa-spinner fa-spin"
                      : "fa-calendar-check"
                  }`}
                />

                {salvando
                  ? "Salvando..."
                  : "Salvar agendamento"}
              </button>
            </div>
          </form>
        )}

        {!mostrarFormulario && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "24px",
              marginBottom: "20px",
            }}
          >
            <div
              className="input-wrapper"
              style={{
                maxWidth: "420px",
                flex: "1 1 300px",
              }}
            >
              <i className="fa-solid fa-magnifying-glass" />

              <input
                type="search"
                value={busca}
                onChange={(e) =>
                  setBusca(
                    e.target.value
                  )
                }
                placeholder="Pesquisar cliente ou serviço..."
              />
            </div>

            <select
              value={filtroStatus}
              onChange={(e) =>
                setFiltroStatus(
                  e.target.value
                )
              }
              style={{
                minWidth: "180px",
              }}
            >
              <option value="todos">
                Todos os status
              </option>

              <option value="aguardando">
                Aguardando
              </option>

              <option value="confirmado">
                Confirmados
              </option>

              <option value="concluido">
                Concluídos
              </option>

              <option value="cancelado">
                Cancelados
              </option>
            </select>
          </div>
        )}

        {carregando && (
          <EmptyState
            icon="fa-spinner fa-spin"
            title="Carregando agendamentos..."
            text="Buscando os dados no Supabase."
          />
        )}

        {!carregando &&
          agendamentos.length === 0 &&
          !mostrarFormulario && (
            <EmptyState
              icon="fa-calendar-days"
              title="Nenhum agendamento"
              text="Clique em Novo agendamento para criar o primeiro."
            />
          )}

        {!carregando &&
          agendamentos.length > 0 &&
          agendamentosFiltrados.length === 0 && (
            <EmptyState
              icon="fa-magnifying-glass"
              title="Nenhum resultado"
              text="Tente mudar a busca ou o filtro."
            />
          )}

        {!carregando &&
          agendamentosFiltrados.length > 0 && (
            <div
              className="appointments-list"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {agendamentosFiltrados.map(
                (item) => {
                  const barbeiro =
                    barbeiros.find(
                      (barbeiro) =>
                        String(
                          barbeiro.id
                        ) ===
                        String(
                          item.barbeiro_id
                        )
                    );

                  const status =
                    item.status ||
                    "aguardando";

                  const processandoStatus =
                    alterandoStatus ===
                    item.id;

                  const processandoExclusao =
                    excluindo ===
                    item.id;

                  return (
                    <div
                      className="appointment-item"
                      key={item.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "minmax(220px, 1.4fr) minmax(140px, 1fr) minmax(140px, 1fr) minmax(160px, 1fr)",
                        gap: "18px",
                        alignItems: "center",
                        padding: "20px",
                        border:
                          "1px solid rgba(255,255,255,.08)",
                        borderRadius: "14px",
                      }}
                    >
                      <div>
                        <strong
                          style={{
                            display:
                              "block",
                            marginBottom:
                              "7px",
                          }}
                        >
                          {item.nome ||
                            "Cliente não informado"}
                        </strong>

                        {item.telefone && (
                          <span
                            style={{
                              opacity: ".65",
                              fontSize:
                                "13px",
                            }}
                          >
                            <i className="fa-brands fa-whatsapp" />

                            {" "}

                            {item.telefone}
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="appointment-label">
                          Serviço
                        </span>

                        <strong>
                          {item[
                            COLUNA_SERVICO
                          ] ||
                            "Não informado"}
                        </strong>
                      </div>

                      <div>
                        <span className="appointment-label">
                          Data / horário
                        </span>

                        <strong>
                          {formatarData(
                            item.data
                          )}
                        </strong>

                        <span
                          style={{
                            display:
                              "block",
                            marginTop:
                              "4px",
                          }}
                        >
                          {item.horario ||
                            "—"}
                        </span>
                      </div>

                      <div>
                        <span className="appointment-label">
                          Barbeiro
                        </span>

                        <strong
                          style={{
                            display:
                              "block",
                            marginBottom:
                              "8px",
                          }}
                        >
                          {barbeiro?.nome ||
                            "Não definido"}
                        </strong>

                        <select
                          value={status}
                          onChange={(e) =>
                            alterarStatus(
                              item.id,
                              e.target.value
                            )
                          }
                          className={classeStatus(
                            status
                          )}
                          disabled={
                            processandoStatus ||
                            processandoExclusao
                          }
                          style={{
                            width:
                              "100%",
                            marginBottom:
                              "10px",
                          }}
                        >
                          <option value="aguardando">
                            Aguardando
                          </option>

                          <option value="confirmado">
                            Confirmado
                          </option>

                          <option value="concluido">
                            Concluído
                          </option>

                          <option value="cancelado">
                            Cancelado
                          </option>
                        </select>

                        <div
                          style={{
                            display:
                              "flex",
                            gap: "7px",
                            flexWrap:
                              "wrap",
                          }}
                        >
                          {status !==
                            "confirmado" &&
                            status !==
                              "concluido" && (
                              <button
                                type="button"
                                onClick={() =>
                                  confirmarAgendamento(
                                    item.id
                                  )
                                }
                                disabled={
                                  processandoStatus ||
                                  processandoExclusao
                                }
                                style={{
                                  border:
                                    "none",
                                  cursor:
                                    "pointer",
                                  padding:
                                    "8px 11px",
                                  borderRadius:
                                    "8px",
                                  fontSize:
                                    "12px",
                                  display:
                                    "inline-flex",
                                  alignItems:
                                    "center",
                                  gap:
                                    "6px",
                                  background:
                                    "rgba(34,197,94,.14)",
                                  color:
                                    "#4ade80",
                                }}
                              >
                                <i className="fa-solid fa-check" />

                                Confirmar
                              </button>
                            )}

                          {status ===
                            "confirmado" && (
                            <button
                              type="button"
                              onClick={() =>
                                concluirAgendamento(
                                  item.id
                                )
                              }
                              disabled={
                                processandoStatus ||
                                processandoExclusao
                              }
                              style={{
                                border:
                                  "none",
                                cursor:
                                  "pointer",
                                padding:
                                  "8px 11px",
                                borderRadius:
                                  "8px",
                                fontSize:
                                  "12px",
                                display:
                                  "inline-flex",
                                alignItems:
                                  "center",
                                gap:
                                  "6px",
                                background:
                                  "rgba(59,130,246,.14)",
                                color:
                                  "#60a5fa",
                              }}
                            >
                              <i className="fa-solid fa-scissors" />

                              Concluir
                            </button>
                          )}

                          {status !==
                            "cancelado" &&
                            status !==
                              "concluido" && (
                              <button
                                type="button"
                                onClick={() =>
                                  cancelarAgendamento(
                                    item.id
                                  )
                                }
                                disabled={
                                  processandoStatus ||
                                  processandoExclusao
                                }
                                style={{
                                  border:
                                    "none",
                                  cursor:
                                    "pointer",
                                  padding:
                                    "8px 11px",
                                  borderRadius:
                                    "8px",
                                  fontSize:
                                    "12px",
                                  display:
                                    "inline-flex",
                                  alignItems:
                                    "center",
                                  gap:
                                    "6px",
                                  background:
                                    "rgba(245,158,11,.14)",
                                  color:
                                    "#fbbf24",
                                }}
                              >
                                <i className="fa-solid fa-ban" />

                                Cancelar
                              </button>
                            )}

                          <button
                            type="button"
                            onClick={() =>
                              excluirAgendamento(
                                item.id
                              )
                            }
                            disabled={
                              processandoStatus ||
                              processandoExclusao
                            }
                            style={{
                              border:
                                "none",
                              cursor:
                                processandoExclusao
                                  ? "wait"
                                  : "pointer",
                              padding:
                                "8px 11px",
                              borderRadius:
                                "8px",
                              fontSize:
                                "12px",
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              gap:
                                "6px",
                              background:
                                "rgba(239,68,68,.14)",
                              color:
                                "#f87171",
                            }}
                          >
                            <i
                              className={`fa-solid ${
                                processandoExclusao
                                  ? "fa-spinner fa-spin"
                                  : "fa-trash"
                              }`}
                            />

                            {processandoExclusao
                              ? "Excluindo..."
                              : "Excluir"}
                          </button>
                        </div>

                        {processandoStatus && (
                          <small
                            style={{
                              display:
                                "block",
                              marginTop:
                                "8px",
                              opacity:
                                ".65",
                            }}
                          >
                            <i className="fa-solid fa-spinner fa-spin" />

                            {" "}
                            Atualizando status...
                          </small>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
      </section>
    </div>
  );
}

/* =========================================================
   CLIENTES
========================================================= */

function Clientes({ supabase }) {
  const [clientes, setClientes] =
    useState([]);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [busca, setBusca] =
    useState("");

  /*
    CORREÇÃO:
    O estado agora usa observacoes,
    sem acento, exatamente igual
    à coluna do Supabase.
  */
  const [cliente, setCliente] =
    useState({
      ...CLIENTE_INICIAL,
    });

  async function carregarClientes() {
    if (!supabase) {
      setCarregando(false);
      return;
    }

    setCarregando(true);

    try {
      const { data, error } =
        await supabase
          .from("clientes")
          .select("*")
          .order("criado_em", {
            ascending: false,
          });

      if (error) {
        throw error;
      }

      setClientes(data || []);
    } catch (error) {
      console.error(
        "Erro ao carregar clientes:",
        error
      );

      alert(
        "Erro ao carregar clientes:\n\n" +
          error.message
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, [supabase]);

  function alterarCampo(e) {
    setCliente(
      (anterior) => ({
        ...anterior,
        [e.target.name]:
          e.target.value,
      })
    );
  }

  /* =======================================================
     CADASTRAR CLIENTE
  ======================================================= */

  async function cadastrarCliente(e) {
    e.preventDefault();

    if (!supabase) {
      alert(
        "Supabase não configurado."
      );
      return;
    }

    const nome =
      String(
        cliente.nome || ""
      ).trim();

    const telefone =
      String(
        cliente.telefone || ""
      ).trim();

    if (!nome) {
      alert("Digite o nome.");
      return;
    }

    if (!telefone) {
      alert("Digite o telefone.");
      return;
    }

    setSalvando(true);

    try {
      /*
        IMPORTANTE:
        Agora enviamos "observacoes",
        sem acento.
      */
      const novo = {
        nome,

        telefone,

        email:
          String(
            cliente.email || ""
          ).trim() || null,

        observacoes:
          String(
            cliente.observacoes || ""
          ).trim() || null,
      };

      console.log(
        "CLIENTE ENVIADO AO SUPABASE:",
        novo
      );

      const { error } =
        await supabase
          .from("clientes")
          .insert(novo);

      if (error) {
        console.error(
          "ERRO SUPABASE CLIENTE:",
          error
        );

        throw new Error(
          `${error.message}\n\nCódigo: ${
            error.code || "N/A"
          }`
        );
      }

      await carregarClientes();

      setCliente({
        ...CLIENTE_INICIAL,
      });

      setMostrarFormulario(false);

      alert(
        "Cliente cadastrado com sucesso!"
      );
    } catch (error) {
      console.error(
        "ERRO AO CADASTRAR CLIENTE:",
        error
      );

      alert(
        "Erro ao cadastrar cliente:\n\n" +
          (
            error?.message ||
            "Erro desconhecido."
          )
      );
    } finally {
      setSalvando(false);
    }
  }

  async function excluirCliente(id) {
    if (!supabase) {
      alert(
        "Supabase não configurado."
      );
      return;
    }

    if (
      !window.confirm(
        "Deseja excluir este cliente?"
      )
    ) {
      return;
    }

    try {
      const { error } =
        await supabase
          .from("clientes")
          .delete()
          .eq("id", id);

      if (error) {
        throw error;
      }

      setClientes(
        (anterior) =>
          anterior.filter(
            (item) =>
              String(item.id) !==
              String(id)
          )
      );
    } catch (error) {
      console.error(
        "Erro ao excluir cliente:",
        error
      );

      alert(
        "Erro ao excluir:\n\n" +
          error.message
      );
    }
  }

  const filtrados =
    clientes.filter((item) => {
      const texto =
        busca
          .toLowerCase()
          .trim();

      if (!texto) return true;

      return (
        String(item.nome || "")
          .toLowerCase()
          .includes(texto) ||
        String(item.telefone || "")
          .toLowerCase()
          .includes(texto) ||
        String(item.email || "")
          .toLowerCase()
          .includes(texto)
      );
    });

  return (
    <div className="admin-page">
      <PageTitle
        eyebrow="CADASTRO"
        title="Clientes"
        description="Gerencie os clientes da Zero Fio."
      />

      <section className="admin-panel">
        <div className="panel-header">
          <div>
            <span>CLIENTES</span>

            <h3>
              Cadastro de clientes
            </h3>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={() => {
              if (!mostrarFormulario) {
                setCliente({
                  ...CLIENTE_INICIAL,
                });
              }

              setMostrarFormulario(
                !mostrarFormulario
              );
            }}
          >
            <i
              className={`fa-solid ${
                mostrarFormulario
                  ? "fa-xmark"
                  : "fa-plus"
              }`}
            />

            {mostrarFormulario
              ? "Cancelar"
              : "Novo cliente"}
          </button>
        </div>

        {mostrarFormulario && (
          <form
            className="product-form"
            onSubmit={
              cadastrarCliente
            }
          >
            <div className="product-form-grid">
              <div className="form-group">
                <label>
                  Nome *
                </label>

                <input
                  name="nome"
                  value={
                    cliente.nome
                  }
                  onChange={
                    alterarCampo
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Telefone *
                </label>

                <input
                  name="telefone"
                  value={
                    cliente.telefone
                  }
                  onChange={
                    alterarCampo
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  E-mail
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    cliente.email
                  }
                  onChange={
                    alterarCampo
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Observações
              </label>

              <textarea
                name={
                  COLUNA_OBSERVACOES
                }
                value={
                  cliente[
                    COLUNA_OBSERVACOES
                  ]
                }
                onChange={
                  alterarCampo
                }
                rows="4"
                placeholder="Observações sobre o cliente..."
              />
            </div>

            <div className="product-form-actions">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={() => {
                  setCliente({
                    ...CLIENTE_INICIAL,
                  });

                  setMostrarFormulario(
                    false
                  );
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="admin-primary-button"
                disabled={salvando}
              >
                <i
                  className={`fa-solid ${
                    salvando
                      ? "fa-spinner fa-spin"
                      : "fa-user-plus"
                  }`}
                />

                {salvando
                  ? "Salvando..."
                  : "Cadastrar cliente"}
              </button>
            </div>
          </form>
        )}

        {!mostrarFormulario &&
          clientes.length > 0 && (
            <div
              className="input-wrapper"
              style={{
                maxWidth: "500px",
                marginTop: "24px",
                marginBottom: "20px",
              }}
            >
              <i className="fa-solid fa-magnifying-glass" />

              <input
                type="search"
                value={busca}
                onChange={(e) =>
                  setBusca(
                    e.target.value
                  )
                }
                placeholder="Pesquisar cliente..."
              />
            </div>
          )}

        {carregando && (
          <EmptyState
            icon="fa-spinner fa-spin"
            title="Carregando clientes..."
            text="Buscando dados no Supabase."
          />
        )}

        {!carregando &&
          filtrados.length === 0 &&
          !mostrarFormulario && (
            <EmptyState
              icon="fa-users"
              title="Nenhum cliente encontrado"
              text="Cadastre um cliente ou altere sua busca."
            />
          )}

        {!carregando &&
          filtrados.length > 0 && (
            <div className="clients-list">
              {filtrados.map((item) => (
                <div
                  className="client-item"
                  key={item.id}
                >
                  <div className="client-item-avatar">
                    {String(
                      item.nome || "C"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="client-item-info">
                    <strong>
                      {item.nome}
                    </strong>

                    <span>
                      <i className="fa-brands fa-whatsapp" />

                      {item.telefone}
                    </span>

                    {item.email && (
                      <span>
                        <i className="fa-solid fa-envelope" />

                        {item.email}
                      </span>
                    )}

                    {item.observacoes && (
                      <span>
                        <i className="fa-solid fa-note-sticky" />

                        {item.observacoes}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="product-delete-button"
                    onClick={() =>
                      excluirCliente(
                        item.id
                      )
                    }
                  >
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              ))}
            </div>
          )}
      </section>
    </div>
  );
}

/* =========================================================
   BARBEIROS
========================================================= */

function Barbeiros({ supabase }) {
  const [barbeiros, setBarbeiros] =
    useState([]);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [barbeiro, setBarbeiro] =
    useState({
      ...BARBEIRO_INICIAL,
    });

  const [previewFoto, setPreviewFoto] =
    useState("");

  async function carregarBarbeiros() {
    if (!supabase) {
      setCarregando(false);
      return;
    }

    setCarregando(true);

    try {
      const {
        data,
        error,
      } =
        await supabase
          .from("barbeiros")
          .select("*")
          .order("nome", {
            ascending: true,
          });

      if (error) {
        throw error;
      }

      setBarbeiros(data || []);
    } catch (error) {
      console.error(
        "Erro ao carregar barbeiros:",
        error
      );

      alert(
        "Erro ao carregar barbeiros:\n\n" +
          error.message
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarBarbeiros();
  }, [supabase]);

  function alterarCampo(e) {
    setBarbeiro(
      (anterior) => ({
        ...anterior,
        [e.target.name]:
          e.target.value,
      })
    );
  }

  function comprimirImagem(file) {
    return new Promise(
      (resolve, reject) => {
        if (!file) {
          resolve("");
          return;
        }

        if (
          !file.type.startsWith(
            "image/"
          )
        ) {
          reject(
            new Error(
              "Selecione um arquivo de imagem válido."
            )
          );
          return;
        }

        const leitor =
          new FileReader();

        leitor.onload = () => {
          const imagem =
            new Image();

          imagem.onload = () => {
            const tamanhoMaximo =
              900;

            let largura =
              imagem.width;

            let altura =
              imagem.height;

            if (
              largura >
                tamanhoMaximo ||
              altura >
                tamanhoMaximo
            ) {
              if (
                largura >
                altura
              ) {
                altura =
                  Math.round(
                    altura *
                      (
                        tamanhoMaximo /
                        largura
                      )
                  );

                largura =
                  tamanhoMaximo;
              } else {
                largura =
                  Math.round(
                    largura *
                      (
                        tamanhoMaximo /
                        altura
                      )
                  );

                altura =
                  tamanhoMaximo;
              }
            }

            const canvas =
              document.createElement(
                "canvas"
              );

            canvas.width =
              largura;

            canvas.height =
              altura;

            const contexto =
              canvas.getContext(
                "2d"
              );

            if (!contexto) {
              reject(
                new Error(
                  "Não foi possível criar o processamento da imagem."
                )
              );
              return;
            }

            contexto.drawImage(
              imagem,
              0,
              0,
              largura,
              altura
            );

            const imagemComprimida =
              canvas.toDataURL(
                "image/jpeg",
                0.78
              );

            resolve(
              imagemComprimida
            );
          };

          imagem.onerror = () => {
            reject(
              new Error(
                "Não foi possível processar a imagem."
              )
            );
          };

          imagem.src =
            leitor.result;
        };

        leitor.onerror = () => {
          reject(
            new Error(
              "Não foi possível ler a foto."
            )
          );
        };

        leitor.readAsDataURL(file);
      }
    );
  }

  async function selecionarFoto(e) {
    const arquivo =
      e.target.files?.[0];

    if (!arquivo) return;

    if (
      !arquivo.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Selecione uma imagem válida."
      );

      e.target.value = "";

      return;
    }

    try {
      const imagem =
        await comprimirImagem(
          arquivo
        );

      setPreviewFoto(imagem);

      setBarbeiro(
        (anterior) => ({
          ...anterior,
          foto: imagem,
        })
      );
    } catch (error) {
      console.error(
        "Erro ao selecionar foto:",
        error
      );

      alert(
        "Não foi possível carregar a foto:\n\n" +
          error.message
      );

      e.target.value = "";
    }
  }

  function removerFoto() {
    setPreviewFoto("");

    setBarbeiro(
      (anterior) => ({
        ...anterior,
        foto: "",
      })
    );

    const input =
      document.getElementById(
        "foto-barbeiro"
      );

    if (input) {
      input.value = "";
    }
  }

  function limparFormularioBarbeiro() {
    setBarbeiro({
      ...BARBEIRO_INICIAL,
    });

    setPreviewFoto("");

    const input =
      document.getElementById(
        "foto-barbeiro"
      );

    if (input) {
      input.value = "";
    }
  }

  async function cadastrarBarbeiro(e) {
    e.preventDefault();

    if (!supabase) {
      alert(
        "Supabase não configurado."
      );
      return;
    }

    const nome =
      String(
        barbeiro.nome || ""
      ).trim();

    if (!nome) {
      alert(
        "Digite o nome do barbeiro."
      );
      return;
    }

    setSalvando(true);

    try {
      const novoBarbeiro = {
        nome,

        telefone:
          String(
            barbeiro.telefone || ""
          ).trim() || null,

        email:
          String(
            barbeiro.email || ""
          ).trim() || null,

        especialidade:
          String(
            barbeiro.especialidade ||
              ""
          ).trim() || null,

        foto:
          barbeiro.foto ||
          null,
      };

      console.log(
        "BARBEIRO ENVIADO AO SUPABASE:",
        novoBarbeiro
      );

      const { error } =
        await supabase
          .from("barbeiros")
          .insert(
            novoBarbeiro
          );

      if (error) {
        console.error(
          "ERRO SUPABASE BARBEIRO:",
          error
        );

        throw new Error(
          `${error.message}\n\nCódigo: ${
            error.code || "N/A"
          }`
        );
      }

      await carregarBarbeiros();

      limparFormularioBarbeiro();

      setMostrarFormulario(false);

      alert(
        "Barbeiro cadastrado com sucesso!"
      );
    } catch (error) {
      console.error(
        "ERRO AO CADASTRAR BARBEIRO:",
        error
      );

      alert(
        "Erro ao cadastrar barbeiro:\n\n" +
          (
            error?.message ||
            "Erro desconhecido."
          )
      );
    } finally {
      setSalvando(false);
    }
  }

  async function excluirBarbeiro(id) {
    if (!supabase) {
      alert(
        "Supabase não configurado."
      );
      return;
    }

    if (
      !window.confirm(
        "Deseja realmente excluir este barbeiro?"
      )
    ) {
      return;
    }

    try {
      const { error } =
        await supabase
          .from("barbeiros")
          .delete()
          .eq("id", id);

      if (error) {
        throw error;
      }

      setBarbeiros(
        (anterior) =>
          anterior.filter(
            (item) =>
              String(item.id) !==
              String(id)
          )
      );

      alert(
        "Barbeiro excluído com sucesso!"
      );
    } catch (error) {
      console.error(
        "Erro ao excluir barbeiro:",
        error
      );

      alert(
        "Erro ao excluir barbeiro:\n\n" +
          error.message
      );
    }
  }

  return (
    <div className="admin-page">
      <PageTitle
        eyebrow="EQUIPE"
        title="Barbeiros"
        description="Cadastre e gerencie os profissionais da Zero Fio."
      />

      <section className="admin-panel">
        <div className="panel-header">
          <div>
            <span>EQUIPE</span>

            <h3>Profissionais</h3>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={() => {
              if (!mostrarFormulario) {
                limparFormularioBarbeiro();
              }

              setMostrarFormulario(
                !mostrarFormulario
              );
            }}
          >
            <i
              className={`fa-solid ${
                mostrarFormulario
                  ? "fa-xmark"
                  : "fa-plus"
              }`}
            />

            {mostrarFormulario
              ? "Cancelar"
              : "Novo barbeiro"}
          </button>
        </div>

        {mostrarFormulario && (
          <form
            className="product-form"
            onSubmit={
              cadastrarBarbeiro
            }
          >
            <div className="product-form-grid">
              <div className="form-group">
                <label>
                  Nome *
                </label>

                <input
                  name="nome"
                  value={
                    barbeiro.nome
                  }
                  onChange={
                    alterarCampo
                  }
                  placeholder="Nome do barbeiro"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Telefone
                </label>

                <input
                  name="telefone"
                  value={
                    barbeiro.telefone
                  }
                  onChange={
                    alterarCampo
                  }
                  placeholder="(99) 99999-9999"
                />
              </div>

              <div className="form-group">
                <label>
                  E-mail
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    barbeiro.email
                  }
                  onChange={
                    alterarCampo
                  }
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="form-group">
                <label>
                  Especialidade
                </label>

                <input
                  name="especialidade"
                  value={
                    barbeiro.especialidade
                  }
                  onChange={
                    alterarCampo
                  }
                  placeholder="Ex: Fades e barba"
                />
              </div>
            </div>

            <div
              className="form-group"
              style={{
                marginTop: "24px",
              }}
            >
              <label>
                Foto do barbeiro
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  flexWrap: "wrap",
                  padding: "18px",
                  border:
                    "1px solid rgba(255,255,255,.08)",
                  borderRadius: "14px",
                  background:
                    "rgba(255,255,255,.025)",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "rgba(255,255,255,.06)",
                    border:
                      "2px solid rgba(255,255,255,.1)",
                  }}
                >
                  {previewFoto ? (
                    <img
                      src={previewFoto}
                      alt="Pré-visualização"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit:
                          "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <i
                      className="fa-solid fa-user"
                      style={{
                        fontSize:
                          "28px",
                        opacity: 0.35,
                      }}
                    />
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: "10px",
                  }}
                >
                  <label
                    htmlFor="foto-barbeiro"
                    className="admin-secondary-button"
                    style={{
                      cursor:
                        "pointer",
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      gap: "8px",
                      width:
                        "fit-content",
                    }}
                  >
                    <i className="fa-solid fa-camera" />

                    Escolher foto
                  </label>

                  <input
                    id="foto-barbeiro"
                    type="file"
                    accept="image/*"
                    onChange={
                      selecionarFoto
                    }
                    style={{
                      display: "none",
                    }}
                  />

                  {previewFoto && (
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={
                        removerFoto
                      }
                      style={{
                        width:
                          "fit-content",
                      }}
                    >
                      <i className="fa-solid fa-trash" />

                      Remover foto
                    </button>
                  )}

                  <span
                    style={{
                      fontSize:
                        "12px",
                      opacity: 0.55,
                    }}
                  >
                    A foto é opcional.
                    <br />
                    JPG, PNG ou WEBP.
                  </span>
                </div>
              </div>
            </div>

            <div className="product-form-actions">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={() => {
                  limparFormularioBarbeiro();

                  setMostrarFormulario(
                    false
                  );
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="admin-primary-button"
                disabled={salvando}
              >
                <i
                  className={`fa-solid ${
                    salvando
                      ? "fa-spinner fa-spin"
                      : "fa-user-plus"
                  }`}
                />

                {salvando
                  ? "Salvando..."
                  : "Cadastrar barbeiro"}
              </button>
            </div>
          </form>
        )}

        {carregando && (
          <EmptyState
            icon="fa-spinner fa-spin"
            title="Carregando barbeiros..."
            text="Buscando profissionais no Supabase."
          />
        )}

        {!carregando &&
          barbeiros.length === 0 &&
          !mostrarFormulario && (
            <EmptyState
              icon="fa-user-tie"
              title="Nenhum barbeiro cadastrado"
              text="Cadastre o primeiro profissional."
            />
          )}

        {!carregando &&
          barbeiros.length > 0 && (
            <div className="clients-list">
              {barbeiros.map((item) => (
                <div
                  className="client-item"
                  key={item.id}
                >
                  <div
                    className="client-item-avatar"
                    style={{
                      width: "64px",
                      height: "64px",
                      minWidth:
                        "64px",
                      minHeight:
                        "64px",
                      borderRadius:
                        "50%",
                      overflow:
                        "hidden",
                      flexShrink: 0,
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      background:
                        "rgba(255,255,255,.06)",
                      border:
                        "1px solid rgba(255,255,255,.10)",
                    }}
                  >
                    {item.foto ? (
                      <img
                        src={item.foto}
                        alt={item.nome}
                        style={{
                          width:
                            "100%",
                          height:
                            "100%",
                          objectFit:
                            "cover",
                          borderRadius:
                            "50%",
                          display:
                            "block",
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      String(
                        item.nome ||
                          "B"
                      )
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </div>

                  <div className="client-item-info">
                    <strong>
                      {item.nome}
                    </strong>

                    {item.especialidade && (
                      <span>
                        {
                          item.especialidade
                        }
                      </span>
                    )}

                    {item.telefone && (
                      <span>
                        <i className="fa-brands fa-whatsapp" />

                        {" "}

                        {
                          item.telefone
                        }
                      </span>
                    )}

                    {item.email && (
                      <span>
                        <i className="fa-solid fa-envelope" />

                        {" "}

                        {item.email}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="product-delete-button"
                    onClick={() =>
                      excluirBarbeiro(
                        item.id
                      )
                    }
                    title="Excluir barbeiro"
                  >
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              ))}
            </div>
          )}
      </section>
    </div>
  );
}

/* =========================================================
   FINANCEIRO
========================================================= */

function Financeiro() {
  return (
    <div className="admin-page">
      <PageTitle
        eyebrow="FINANCEIRO"
        title="Financeiro"
        description="Controle as movimentações da Zero Fio."
      />

      <div className="dashboard-cards">
        <DashboardCard
          icon="fa-arrow-trend-up"
          label="Entradas"
          value="R$ 0,00"
          detail="Período"
        />

        <DashboardCard
          icon="fa-arrow-trend-down"
          label="Saídas"
          value="R$ 0,00"
          detail="Período"
        />

        <DashboardCard
          icon="fa-chart-line"
          label="Lucro"
          value="R$ 0,00"
          detail="Resultado"
        />

        <DashboardCard
          icon="fa-scissors"
          label="Atendimentos"
          value="0"
          detail="Período"
        />
      </div>

      <section className="admin-panel">
        <div className="panel-header">
          <div>
            <span>MOVIMENTAÇÕES</span>

            <h3>
              Entradas e saídas
            </h3>
          </div>
        </div>

        <EmptyState
          icon="fa-wallet"
          title="Nenhuma movimentação"
          text="O módulo financeiro será conectado aos lançamentos."
        />
      </section>
    </div>
  );
}

/* =========================================================
   RELATÓRIOS
========================================================= */

function Relatorios() {
  return (
    <div className="admin-page">
      <PageTitle
        eyebrow="ANÁLISE"
        title="Relatórios"
        description="Acompanhe o desempenho da Zero Fio."
      />

      <div className="dashboard-cards">
        <DashboardCard
          icon="fa-chart-column"
          label="Faturamento"
          value="R$ 0,00"
          detail="Período"
        />

        <DashboardCard
          icon="fa-scissors"
          label="Serviços"
          value="0"
          detail="Realizados"
        />

        <DashboardCard
          icon="fa-users"
          label="Clientes"
          value="0"
          detail="Atendidos"
        />

        <DashboardCard
          icon="fa-percent"
          label="Crescimento"
          value="0%"
          detail="Comparativo"
        />
      </div>

      <section className="admin-panel">
        <div className="panel-header">
          <div>
            <span>RELATÓRIO</span>

            <h3>Desempenho</h3>
          </div>
        </div>

        <EmptyState
          icon="fa-chart-line"
          title="Relatórios em preparação"
          text="Os gráficos serão conectados aos dados reais."
        />
      </section>
    </div>
  );
}

/* =========================================================
   CONFIGURAÇÕES
========================================================= */

function Configuracoes() {
  return (
    <div className="admin-page">
      <PageTitle
        eyebrow="SISTEMA"
        title="Configurações"
        description="Configure as informações da Zero Fio."
      />

      <section className="admin-panel settings-panel">
        <SettingItem
          title="Informações do Studio"
          text="Nome, telefone e informações comerciais."
        />

        <SettingItem
          title="Serviços"
          text="Gerencie preços e serviços oferecidos."
        />

        <SettingItem
          title="Horários de funcionamento"
          text="Configure os dias e horários."
        />

        <SettingItem
          title="WhatsApp"
          text="Número utilizado para os agendamentos."
        />
      </section>
    </div>
  );
}

/* =========================================================
   SETTING
========================================================= */

function SettingItem({
  title,
  text,
}) {
  return (
    <div className="setting-item">
      <div>
        <strong>{title}</strong>

        <span>{text}</span>
      </div>

      <button type="button">
        Editar
      </button>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon,
  title,
  text,
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <i
          className={`fa-solid ${icon}`}
        />
      </div>

      <h4>{title}</h4>

      <p>{text}</p>
    </div>
  );
}

/* =========================================================
   PAGE TITLE
========================================================= */

function PageTitle({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="admin-page-title">
      <span>{eyebrow}</span>

      <h2>{title}</h2>

      <p>{description}</p>
    </div>
  );
}

/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function formatarData(data) {
  if (!data) return "—";

  const partes =
    String(data).split("-");

  if (partes.length !== 3) {
    return data;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarMoeda(valor) {
  const numero =
    Number(valor || 0);

  return numero.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );
}

function ordenarAgendamentos(a, b) {
  const dataA =
    `${a.data || ""} ${a.horario || ""}`;

  const dataB =
    `${b.data || ""} ${b.horario || ""}`;

  return dataA.localeCompare(
    dataB
  );
}

function classeStatus(status) {
  switch (status) {
    case "confirmado":
      return "status-confirmado";

    case "concluido":
      return "status-concluido";

    case "cancelado":
      return "status-cancelado";

    default:
      return "status-aguardando";
  }
}