import React, { useEffect, useState } from "react";

const ORANGE_BG =
  "bg-[radial-gradient(ellipse_at_center,rgba(255,200,80,0.5)_0%,rgba(255,140,0,0.35)_25%,rgba(120,60,0,0.5)_70%,rgba(60,30,0,0.85)_100%)]";

const DIPLOMA = {
  status: "ATIVO",
  nome: "Marco Vasconcelos Ferroni",
  curso: "Graduação em Ciências Econômicas (45365)",
  cpf: "441.686.968-12!",
  idDiploma: "108508",
  codigoValidacaoPrefixo: "213.213.50cc",
  emissora: "Centro Universitário Álvares Penteado (213)",
  registradora: "Centro Universitário Álvares Penteado (213)",
  nExpedicao: "165",
  nRegistro: "165",
  ingresso: "26/05/2018",
  conclusao: "25/06/2022",
  expedicao: "23/08/2022",
  registro: "23/08/2022",
  publicacaoDOU: "—",
};

async function makeValidationCode(details) {
  const text = [details.nome, details.cpf, details.curso, details.idDiploma].join("|");
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(text));
  const bytes = Array.from(new Uint8Array(digest));
  const hex = bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  const short = `${hex.slice(0,3)}.${hex.slice(3,6)}.${hex.slice(6,8)}cc${hex.slice(8,10)}${hex.slice(10,12)}${hex.slice(12,14)}${hex.slice(14,16)}`;
  return short;
}

export default function App() {
  const [calcCode, setCalcCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [validated, setValidated] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    (async () => {
      const c = await makeValidationCode(DIPLOMA);
      setCalcCode(c);
    })();
  }, []);

  async function handleValidate() {
    setChecking(true);
    await new Promise((r) => setTimeout(r, 300));
    setValidated(userCode.trim() === calcCode.trim());
    setChecking(false);
  }

  function reset() {
    setUserCode("");
    setValidated(false);
  }

  return (
    <div className={`min-h-screen ${ORANGE_BG} relative overflow-hidden`}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-24 -translate-x-1/2 h-96 w-96 rounded-full blur-3xl opacity-40 bg-yellow-300" />
        <div className="absolute right-16 bottom-24 h-64 w-64 rounded-full blur-2xl opacity-30 bg-amber-400" />
      </div>

      <div className="container mx-auto px-2 py-10">
        <div className="mx-auto max-w-5xl rounded-xl bg-neutral-900/40 shadow-2xl ring-1 ring-black/30 backdrop-blur-md">
          <div className="flex items-center justify-between rounded-t-xl bg-neutral-800 px-4 py-2 text-sm text-neutral-100">
            <span className="font-semibold">Diplomas Ativos</span>
            <button className="rounded bg-neutral-700 px-2 py-0.5 text-xs hover:bg-neutral-600">✕</button>
          </div>

          <div className="border-b border-neutral-700 px-4 py-3 text-neutral-100">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="text-sm">
                <span className="mr-2">Diplomas localizados:</span>
                <select className="rounded border border-neutral-600 bg-neutral-800 px-2 py-1 text-xs">
                  <option>[ATIVO] {DIPLOMA.nome} - {DIPLOMA.cpf} - {DIPLOMA.curso.replace(/ \\(.*\\)/, "")}</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="w-64 rounded border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-400 outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Digite o código de validação"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                />
                <button
                  onClick={handleValidate}
                  className="rounded-lg bg-amber-500/90 px-4 py-2 text-sm font-semibold text-neutral-900 shadow hover:bg-amber-400"
                >
                  {checking ? "Validando..." : "Validar"}
                </button>
                {validated && (
                  <button onClick={reset} className="rounded-lg bg-neutral-700 px-3 py-2 text-sm text-neutral-100 hover:bg-neutral-600">Limpar</button>
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-neutral-400">
              Código esperado (para testes): <code className="select-all rounded bg-neutral-800 px-1 py-0.5 text-amber-300">{calcCode || "calculando..."}</code>
            </div>
          </div>

          <div className="px-4 py-3 text-neutral-100">
            <h3 className="mb-2 text-sm font-semibold">Dados do Diploma</h3>

            {!validated ? (
              <div className="rounded-lg border border-dashed border-neutral-700 p-6 text-sm text-neutral-300">
                Digite um código válido para visualizar os detalhes do diploma.
              </div>
            ) : (
              <div className="space-y-5 text-sm">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-12 md:col-span-6">
                    <div className="text-neutral-400">Graduação</div>
                    <div className="font-medium">{DIPLOMA.curso}</div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="text-neutral-400">Nome</div>
                    <div className="font-medium">{DIPLOMA.nome}</div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="text-neutral-400">Status</div>
                    <div className="font-medium">{DIPLOMA.status}</div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-12 md:col-span-6">
                    <div className="text-neutral-400">Código Validação</div>
                    <div className="font-medium">{DIPLOMA.codigoValidacaoPrefixo}{calcCode ? calcCode.slice(3) : ""}</div>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <div className="text-neutral-400">CPF</div>
                    <div className="font-medium">{DIPLOMA.cpf}</div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-12 md:col-span-6">
                    <div className="text-neutral-400">Emissora</div>
                    <div className="font-medium">{DIPLOMA.emissora}</div>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <div className="text-neutral-400">Registradora</div>
                    <div className="font-medium">{DIPLOMA.registradora}</div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-6 md:col-span-3">
                    <div className="text-neutral-400">Nº Expedição</div>
                    <div className="font-medium">{DIPLOMA.nExpedicao}</div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="text-neutral-400">Nº Registro</div>
                    <div className="font-medium">{DIPLOMA.nRegistro}</div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="text-neutral-400">Publicação DOU</div>
                    <div className="font-medium">{DIPLOMA.publicacaoDOU}</div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="text-neutral-400">ID Diploma</div>
                    <div className="font-medium">{DIPLOMA.idDiploma}</div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-6 md:col-span-3">
                    <div className="text-neutral-400">Ingresso</div>
                    <div className="font-medium">{DIPLOMA.ingresso}</div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="text-neutral-400">Conclusão</div>
                    <div className="font-medium">{DIPLOMA.conclusao}</div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="text-neutral-400">Expedição</div>
                    <div className="font-medium">{DIPLOMA.expedicao}</div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <div className="text-neutral-400">Registro</div>
                    <div className="font-medium">{DIPLOMA.registro}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-neutral-800 pt-3">
                  <IconButton>Validador MEC</IconButton>
                  <IconButton>Visualizar PDF</IconButton>
                  <IconButton>Download PDF</IconButton>
                  <IconButton>Visualizar XML</IconButton>
                  <IconButton>Download XML</IconButton>
                  <IconButton variant="danger">Fechar</IconButton>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-5xl text-xs text-neutral-300">
          <div className="flex items-center justify-between">
            <div className="font-mono tracking-wider">DIPLOMAX</div>
            <a href="#" className="text-neutral-400 hover:text-neutral-200">Debarry – Inovação e Tecnologia 2024 © Todos os direitos reservados</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconButton({ children, variant }) {
  const base =
    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-amber-400";
  const styles =
    variant === "danger"
      ? "bg-neutral-800/80 text-neutral-200 ring-neutral-600 hover:bg-neutral-700"
      : "bg-neutral-800/80 text-neutral-200 ring-neutral-600 hover:bg-neutral-700";
  return <button className={`${base} ${styles}`}>{children}</button>;
}
