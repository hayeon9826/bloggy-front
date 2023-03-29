import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

function App() {
  const [prompt, updatePrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");

  const sendPrompt = async (event: any) => {
    if (event.key !== "Enter") {
      return;
    }

    try {
      setLoading(true);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      };

      const res = await fetch(`/api/gpt`, requestOptions);

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const { message } = await res.json();
      setAnswer(message);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("err", err);
    }
    console.log("prompt", prompt);
  };

  useEffect(() => {
    if (prompt != null && prompt.trim() === "") {
      setAnswer("");
    }
  }, [prompt]);

  return (
    <div className={styles.app}>
      <div className={styles.app_container}>
        <div className={styles.spotlight__wrapper}>
          <input
            type="text"
            className={styles.spotlight__input}
            disabled={loading}
            onChange={(e) => updatePrompt(e.target.value)}
            onKeyDown={(e) => sendPrompt(e)}
            placeholder="Ask me anything..."
            style={{
              backgroundImage: loading ? `url("/assets/loader.gif")` : `url("/assets/lens.png")`,
            }}
          />
          <div className={styles.spotlight__answer}>{answer && <p>{answer}</p>}</div>
        </div>
      </div>
    </div>
  );
}

export default App;