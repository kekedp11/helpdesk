import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { LoginRequest } from "../types/auth.types";

function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setError("");

      const loggedInUser = await login(formData);

      if (loggedInUser.role === "AGENT") {
        navigate("/agent");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;