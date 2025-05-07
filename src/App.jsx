import { useEffect, useState } from "react";
import "./App.css";
import codingPath from "./assets/illustration-Azuc-YCm.svg";
import codelogo from "./assets/logo-BP6-p_L-.svg";
import io from "socket.io-client";
import Editor from "@monaco-editor/react";

// server is running on localhost:5000 port
const socket = io("http://localhost:5000");

const App = () => {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(" // start coding here");
  const [copySuccess, setCopySuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [outPut, setOutPut] = useState("");
  const [version, setVersion] = useState("*");

  // leave room when tab/browser closes
  useEffect(() => {
    const handleBeforeUnload = () => {
      socket.emit("leaveRoom");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // socket listeners for user join and code update
  useEffect(() => {
    socket.on("userJoined", (users) => {
      setUsers(users);
    });

    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    });

    socket.on("userTyping", (user) => {
      setTyping(`${user.slice(0, 10)}...is typing`);
      setTimeout(() => setTyping(""), 2000);
    });

    socket.on("languageUpdate", (newLanguage) => {
      setLanguage(newLanguage);
    });

    socket.on("codeResponse", (response) => {
      setOutPut(response.run.output);
    });

    return () => {
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
      socket.off("codeResponse");
    };
  }, []);

  const joinRoom = () => {
    if (roomId && userName) {
      socket.emit("join", { roomId, userName });
      setJoined(true);
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setRoomId("");
    setUserName("");
    setCode("// start coding");
    setLanguage("JavaScript");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess("! Copied");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });
    socket.emit("typing", { roomId, userName });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("languageChange", { roomId, language: newLanguage });
  };

  const runCode = () => {
    socket.emit("compileCode", { code, roomId, language, version });
  };

  if (!joined) {
    return (
      <div className="container">
        <div className="left">
          <img src={codingPath} alt="Coding It" className="illustration" />
        </div>
        <div className="right">
          <img src={codelogo} alt="logo" className="logo" />
          <input
            type="text"
            placeholder="Room Id"
            value={roomId}
            className="input"
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Name"
            value={userName}
            className="input"
            onChange={(e) => setUserName(e.target.value)}
          />
          <button className="join-btn" onClick={joinRoom}>
            Join Room
          </button>
          <p className="copy">
            copyright @Akshat_kumar 2025 All right reserved
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="sidebar">
        <div className="room-info">
          <h2>Welcome to Code Room: {roomId}</h2>
          <button onClick={copyRoomId} className="copy-btn">
            Copy Room ID
          </button>
          {copySuccess && <span className="copy-success">{copySuccess}</span>}
        </div>
        <h3>Users Active</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.slice(0, 10)}...</li>
          ))}
        </ul>
        <p className="typing-indicator">{typing}</p>
        <select
          className="language-selector"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="c++">C++</option>
          <option value="c">C</option>
          <option value="python">Python</option>
          <option value="c#">C#</option>
          <option value="java">JAVA</option>
        </select>
        <button className="leave-btn" onClick={leaveRoom}>
          Leave Room
        </button>
      </div>
      <div className="editor-wrapper">
        <Editor
          height={"60%"}
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
        <button className="run-btn" onClick={runCode}>
          Execute
        </button>
        <textarea
          className="output-console"
          value={outPut}
          readOnly
          placeholder="// Output will appear here"
        ></textarea>
      </div>
    </div>
  );
};

export default App;
