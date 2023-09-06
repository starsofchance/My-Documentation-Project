import { useState } from "react";
import supabase from "./supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const { user, error } = await supabase.auth.signIn({ email, password });
      if (error) {
        console.error("Login error:", error.message);
      } else {
        console.log("Logged in:", user);
      }
    } catch (error) {
      console.error("Login error:", error.message);
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
