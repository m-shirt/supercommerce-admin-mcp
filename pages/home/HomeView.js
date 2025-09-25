// /pages/home/HomeView.js
import React from "react";
import JsonView from "react18-json-view";
import styles from "./Home.module.css";
import "react18-json-view/src/style.css";

export default function HomeView({
  tools,
  selected,
  selectTool,
  paramsText,
  setParamsText,
  paramsForm,
  setParamsForm,
  mode,
  setMode,
  runTool,
  loading,
  err,
  parsedResponse,
  connected,
  connect,
  disconnect,
  reconnect,
  serverInput,
  setServerInput,
  logs,
}) {
  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2>MCP Tools</h2>
        {tools?.length === 0 ? (
          <div className={styles.empty}>No tools found.</div>
        ) : (
          <ul>
            {tools?.map((t) => (
              <li key={t.name}>
                <button
                  onClick={() => selectTool(t)}
                  className={`${styles.toolBtn} ${
                    selected?.name === t.name ? styles.active : ""
                  }`}
                >
                  <div className={styles.toolName}>{t.name}</div>
                  <div className={styles.toolDesc}>{t.description}</div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {selected ? (
          <>
            <div>
              <h1>{selected.name}</h1>
              <p className={styles.description}>{selected.description}</p>
            </div>

            <div>
              <div className={styles.paramsHeader}>
                <h3>Parameters</h3>
                <div className={styles.modeToggle}>
                  <button
                    onClick={() => setMode("json")}
                    className={`${styles.modeBtn} ${
                      mode === "json" ? styles.active : ""
                    }`}
                  >
                    JSON
                  </button>
                  <button
                    onClick={() => setMode("form")}
                    className={`${styles.modeBtn} ${
                      mode === "form" ? styles.active : ""
                    }`}
                  >
                    Form
                  </button>
                </div>
              </div>

              {mode === "json" ? (
                <textarea
                  value={paramsText}
                  onChange={(e) => setParamsText(e.target.value)}
                  className={styles.jsonEditor}
                />
              ) : (
                <form className={styles.form}>
                  {Object.keys(paramsForm || {}).length === 0 ? (
                    <div className={styles.empty}>No parameters</div>
                  ) : (
                    Object.entries(paramsForm).map(([key, value]) => (
                      <div key={key} className={styles.formField}>
                        <label>
                          {key}
                          {selected.inputSchema?.required?.includes(key) && (
                            <span className={styles.required}>*</span>
                          )}
                        </label>
                        <input
                          type="text"
                          value={value}
                          placeholder={
                            selected.inputSchema?.properties?.[key]?.description ||
                            ""
                          }
                          onChange={(e) =>
                            setParamsForm({
                              ...paramsForm,
                              [key]: e.target.value,
                            })
                          }
                        />
                      </div>
                    ))
                  )}
                </form>
              )}

              <button
                onClick={runTool}
                disabled={loading}
                className={styles.runBtn}
              >
                {loading ? "Running…" : "Run Tool"}
              </button>

              {err && <div className={styles.error}>Error: {err}</div>}
            </div>

            <section className={styles.response}>
              <h3>Response</h3>
              {parsedResponse ? (
                <JsonView
                  src={parsedResponse}
                  name={false}
                  theme="vscode"
                  collapsed={false}
                  enableClipboard={true}
                  displayDataTypes={false}
                />
              ) : (
                <pre>No response yet.</pre>
              )}
            </section>
          </>
        ) : (
          <div className={`${styles.empty} ${styles.center}`}>
            Select a tool from the sidebar.
          </div>
        )}
      </main>

      {/* Connection Panel */}
      <aside className={styles.connection}>
        <h2>MCP Connection</h2>
        <label>URL</label>
        <input
          type="text"
          value={serverInput}
          onChange={(e) => setServerInput(e.target.value)}
        />

        {!connected ? (
          <button onClick={connect} className={styles.connectBtn}>
            Connect
          </button>
        ) : (
          <div className={styles.btnRow}>
            <button onClick={reconnect} className={styles.connectBtn}>
              Reconnect
            </button>
            <button onClick={disconnect} className={styles.disconnectBtn}>
              Disconnect
            </button>
          </div>
        )}

        <div className={styles.status}>
          <span
            className={`${styles.statusDot} ${
              connected ? styles.green : styles.red
            }`}
          />
          <span>{connected ? "Connected" : "Not Connected"}</span>
        </div>

        <h3>Logs</h3>
        <div className={styles.logs}>
          {logs?.length === 0 ? "No logs yet." : logs?.join("\n")}
        </div>
      </aside>
    </div>
  );
}
