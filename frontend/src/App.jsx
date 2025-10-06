import { Routes, Route } from "react-router-dom";
import { Splash } from "./Views/Splash";
import { Login } from "./Views/Login";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
