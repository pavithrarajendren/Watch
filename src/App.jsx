import { useState } from "react";
import "./App.css";
import Register from "./pavi/Register";
import Storefront from "./Storefront.jsx";

const USERS_KEY = "maison-noir-users";
const SESSION_KEY = "maison-noir-session";

function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return session && typeof session.email === "string" ? session : null;
  } catch {
    return null;
  }
}

// --- Main App Component ---
function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(readSession);
  const [notice, setNotice] = useState("");

  function handleRegister({ fullName, email: registeredEmail, password: registeredPassword }) {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      if (!Array.isArray(users)) {
        throw new Error("Stored account data is invalid.");
      }

      const normalizedEmail = registeredEmail.trim().toLowerCase();
      if (users.some((account) => account.email === normalizedEmail)) {
        setNotice("Email already registered");
        return;
      }

      users.push({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password: registeredPassword,
      });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      setShowRegister(false);
      setEmail(normalizedEmail);
      setPassword("");
      setNotice("Registration successful. Please sign in.");
    } catch {
      setNotice("Unable to save your account. Check browser storage and try again.");
    }
  }

  function handleLogin(event) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setNotice("Enter your email address and password.");
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      if (!Array.isArray(users)) {
        throw new Error("Stored account data is invalid.");
      }

      const normalizedEmail = email.trim().toLowerCase();
      const account = users.find(
        (registeredUser) =>
          registeredUser.email === normalizedEmail &&
          registeredUser.password === password,
      );

      if (!account) {
        setNotice("Invalid email or password");
        return;
      }

      const activeSession = {
        fullName: account.fullName,
        email: account.email,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(activeSession));
      setNotice("Login successful");
      setUser(activeSession);
    } catch {
      setNotice("Unable to read account details. Check browser storage and try again.");
    }
  }

  function handleLogout() {
    try {
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
      setEmail("");
      setPassword("");
      setNotice("");
      setShowRegister(false);
    } catch {
      setNotice("Unable to log out. Check browser storage and try again.");
    }
  }

  if (user) {
    return <Storefront user={user} notice={notice} onLogout={handleLogout} />;
  }

  if (showRegister) {
    return (
      <Register
        notice={notice}
        onRegister={handleRegister}
        onLogin={() => {
          setNotice("");
          setShowRegister(false);
        }}
      />
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Login to your account</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {notice && <p className="subtitle" role="status">{notice}</p>}

          <button className="auth-button" type="submit">
            LOGIN
          </button>
        </form>

        <p className="switch-text">
          Don't have an account?{" "}
          <button className="auth-switch" type="button" onClick={() => {
            setNotice("");
            setShowRegister(true);
          }}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default App;