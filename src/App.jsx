import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { analyzeName } from "./utils/nameAnalysis";

export default function App() {
  const [name, setName] = useState("");
  const [reading, setReading] = useState("");
  const [nickname, setNickname] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!reading.trim()) return;

    const analysis = analyzeName(reading, name, nickname);

    setResult({
      name: name.trim(),
      reading: reading.trim(),
      nickname: nickname.trim(),
      ...analysis,
    });

    setCopied(false);
  };

  const handleBack = () => {
    setResult(null);
    setCopied(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleHisoHiso = () => {
    if (!result) return;

    const introParts = [
      `おとしるべで「${result.name || result.reading}」を読み解きました。`,
      `読みは「${result.reading}」です。`,
      result.flow,
      result.finalMessage,
      result.personality,
      result.strength,
      result.caution,
    ];

    if (result.nicknameAnalysis) {
      introParts.push(
        `普段の呼ばれ方は「${result.nicknameAnalysis.nickname}」です。`,
        result.nicknameAnalysis.summary,
        result.nicknameAnalysis.personality
      );
    }

    const intro = introParts.filter(Boolean).join("\n\n");

    const params = new URLSearchParams({
      from: "otoshirube",
      genre: "name",
      mode: "otoshirube",
      intro,
    });

    window.open(
      `https://hisohiso.vercel.app/?${params.toString()}`,
      "_blank"
    );
  };

  if (result) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f5f9fc",
          color: "#263238",
          padding: "40px 20px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <button
            onClick={handleBack}
            style={{
              border: "none",
              background: "transparent",
              color: "#607d8b",
              cursor: "pointer",
              padding: 0,
              marginBottom: "30px",
              fontSize: "14px",
            }}
          >
            ← もう一度見る
          </button>

          <header style={{ marginBottom: "45px" }}>
            <h1
              style={{
                margin: "0 0 12px",
                fontSize: "32px",
                fontWeight: "500",
                letterSpacing: "0.08em",
              }}
            >
              {result.name || result.reading}
            </h1>

            <p
              style={{
                margin: 0,
                color: "#78909c",
                fontSize: "16px",
                letterSpacing: "0.08em",
              }}
            >
              {result.reading}
            </p>

            <p
              style={{
                marginTop: "24px",
                color: "#607d8b",
                lineHeight: 1.8,
              }}
            >
              名前の響きから、その人の物語を読み解きます。
            </p>
          </header>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={sectionTitle}>SOUND</h2>

            <div style={{ display: "grid", gap: "18px" }}>
              {result.soundDetails.map((item) => (
                <div
                  key={item.sound}
                  style={{
                    background: "#ffffff",
                    borderRadius: "14px",
                    padding: "22px",
                    boxShadow:
                      "0 4px 18px rgba(80, 110, 130, 0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "14px",
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "25px",
                        fontWeight: "500",
                      }}
                    >
                      {item.sound}
                    </strong>

                    <span
                      style={{
                        color: "#78909c",
                        fontSize: "14px",
                      }}
                    >
                      {item.keywords.join("・")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={sectionTitle}>YOUR SOUND STORY</h2>

            <p style={bodyText}>{result.flow}</p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={sectionTitle}>KANJI</h2>

            <div style={{ display: "grid", gap: "14px" }}>
              {result.kanjiDetails.map((item) => (
                <div
                  key={item.character}
                  style={{
                    background: "#ffffff",
                    borderRadius: "14px",
                    padding: "20px",
                    boxShadow:
                      "0 4px 18px rgba(80, 110, 130, 0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "14px",
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "25px",
                        fontWeight: "500",
                      }}
                    >
                      {item.character}
                    </strong>

                    <span
                      style={{
                        color: "#78909c",
                        fontSize: "14px",
                      }}
                    >
                      {item.keywords.join("・")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={sectionTitle}>PERSONALITY</h2>

            <p style={bodyText}>{result.personality}</p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={sectionTitle}>STRENGTH</h2>

            <p style={bodyText}>{result.strength}</p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={sectionTitle}>CAUTION</h2>

            <p style={bodyText}>{result.caution}</p>
          </section>

          {result.nicknameAnalysis && (
            <section style={{ marginBottom: "48px" }}>
              <h2 style={sectionTitle}>NICKNAME</h2>

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "14px",
                  padding: "22px",
                  boxShadow:
                    "0 4px 18px rgba(80, 110, 130, 0.06)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 18px",
                    fontSize: "22px",
                    fontWeight: "500",
                  }}
                >
                  「{result.nicknameAnalysis.nickname}」
                </h3>

                {result.nicknameAnalysis.soundDetails.map((item) => (
                  <div
                    key={item.sound}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "14px",
                      marginBottom: "20px",
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "25px",
                        fontWeight: "500",
                      }}
                    >
                      {item.sound}
                    </strong>

                    <span
                      style={{
                        color: "#78909c",
                        fontSize: "14px",
                      }}
                    >
                      {item.keywords.join("・")}
                    </span>
                  </div>
                ))}

                <h4
                  style={{
                    margin: "0 0 12px",
                    fontSize: "13px",
                    letterSpacing: "0.12em",
                    color: "#78909c",
                    fontWeight: "600",
                  }}
                >
                  YOUR NICKNAME STORY
                </h4>

                <p style={bodyText}>
                  {result.nicknameAnalysis.flow}
                </p>
              </div>
            </section>
          )}

          <section
            style={{
              marginTop: "60px",
              padding: "30px 20px",
              background: "#ffffff",
              borderRadius: "18px",
              boxShadow:
                "0 6px 24px rgba(80, 110, 130, 0.06)",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "18px",
                fontWeight: "500",
                letterSpacing: "0.06em",
              }}
            >
              この結果、気になった？
            </h2>

            <p
              style={{
                margin: "0 0 24px",
                color: "#78909c",
                fontSize: "13px",
                lineHeight: 1.8,
              }}
            >
              おとしるべで
              <br />
              自分の名前も読み解いてみて
            </p>

            <div
              style={{
                display: "inline-flex",
                padding: "14px",
                background: "#ffffff",
                border: "1px solid #e4ecef",
                borderRadius: "14px",
              }}
            >
              <QRCodeSVG
                value={window.location.href}
                size={150}
                bgColor="#ffffff"
                fgColor="#263238"
                level="M"
              />
            </div>

            <p
              style={{
                margin: "12px 0 20px",
                color: "#90a4ae",
                fontSize: "12px",
              }}
            >
              おとしるべ
            </p>

            <button
              onClick={handleCopyLink}
              style={{
                border: "1px solid #d7e1e6",
                borderRadius: "10px",
                background: "#f8fbfc",
                color: "#607d8b",
                padding: "11px 18px",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              🔗 {copied ? "リンクをコピーしました" : "リンクをコピー"}
            </button>

            <div
              style={{
                marginTop: "28px",
                paddingTop: "24px",
                borderTop: "1px solid #e8eef1",
              }}
            >
              <p
                style={{
                  margin: "0 0 14px",
                  color: "#607d8b",
                  fontSize: "13px",
                  lineHeight: 1.8,
                }}
              >
                もっと話してみたい？
                <br />
                ひそひそで相談できます
              </p>

              <button
                onClick={handleHisoHiso}
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  background: "#607d8b",
                  color: "#ffffff",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                ひそひそで相談する
              </button>
            </div>
          </section>

          <div
            style={{
              marginTop: "40px",
              paddingTop: "24px",
              borderTop: "1px solid #dce5e9",
              color: "#90a4ae",
              fontSize: "12px",
              lineHeight: 1.8,
            }}
          >
            この占いは名前の響きや文字から物語を楽しむためのものです。
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f9fc",
        color: "#263238",
        padding: "40px 20px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          margin: "0 auto",
        }}
      >
        <header style={{ marginBottom: "40px" }}>
          <h1
            style={{
              margin: "0 0 14px",
              fontSize: "32px",
              fontWeight: "500",
              letterSpacing: "0.08em",
            }}
          >
            おとしるべ
          </h1>

          <p
            style={{
              margin: 0,
              color: "#607d8b",
              lineHeight: 1.8,
            }}
          >
            名前の響きには、その人の物語がある。
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#ffffff",
            borderRadius: "18px",
            padding: "28px",
            boxShadow:
              "0 6px 24px rgba(80, 110, 130, 0.08)",
          }}
        >
          <label style={labelStyle}>
            読み

            <input
              value={reading}
              onChange={(event) => setReading(event.target.value)}
              placeholder="例：たろう"
              style={inputStyle}
              required
            />
          </label>

          <label style={labelStyle}>
            名前

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="例：太郎"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            普段の呼ばれ方（任意）

            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="例：たろー"
              style={inputStyle}
            />
          </label>

          <button
            type="submit"
            style={{
              width: "100%",
              border: "none",
              borderRadius: "12px",
              padding: "15px",
              background: "#607d8b",
              color: "#ffffff",
              fontSize: "15px",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            名前を読み解く
          </button>
        </form>
      </div>
    </main>
  );
}

const sectionTitle = {
  margin: "0 0 18px",
  fontSize: "13px",
  letterSpacing: "0.14em",
  color: "#78909c",
  fontWeight: "600",
};

const bodyText = {
  margin: 0,
  fontSize: "16px",
  lineHeight: 1.9,
  whiteSpace: "pre-line",
};

const labelStyle = {
  display: "block",
  marginBottom: "20px",
  fontSize: "13px",
  color: "#607d8b",
};

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: "8px",
  padding: "13px 14px",
  border: "1px solid #d7e1e6",
  borderRadius: "10px",
  background: "#fbfdfe",
  color: "#263238",
  fontSize: "15px",
  outline: "none",
};