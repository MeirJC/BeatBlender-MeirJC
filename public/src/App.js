import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Secret from "./pages/Secret";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/NavBar/NavBar";
// import EnsambleRack from "./components/EnsambleRack";
import StreetLights from "./components/StreetLights";
import ConcreteJungle from "./components/ConcreteJungle";
import Cityscape from "./components/Cityscape";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Secret />} />
            <Route path="/streetlights" element={<StreetLights />} />
            <Route path="/concretejungle" element={<ConcreteJungle />} />
            <Route path="/cityscape" element={<Cityscape />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
