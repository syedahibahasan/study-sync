import logo from "./logo.svg";
import "./App.css";
import AppRoutes from "./AppRoutes";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar/navbar.js";
import { useAuth } from "./hooks/useauth.js";
import { AuthProvider } from "./hooks/useauth.js";

function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      <Navbar key={user ? user.id : "logged-out"} />
      <AppRoutes />
    </div>
  );
}

export default App;
