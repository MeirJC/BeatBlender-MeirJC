import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Secret from "./pages/Secret";
import "react-toastify/dist/ReactToastify.css";
import EnsambleRack from "./components/EnsambleRack";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Secret />} />
            <Route path="/music1" element={<EnsambleRack />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
