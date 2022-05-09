import "./App.css";
import Toggle from "./components/Toggle";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import OnBoarding from "./pages/OnBoarding";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

const App = () => {
  const [isDarkMode, setDarkMode] = useState("false");

  const [cookies] = useCookies(["user"]);

  const authToken = cookies.AuthToken;
  useEffect(() => {
    let darkTheme = localStorage.getItem("DarkMode");
    if (darkTheme === "true") {
      setDarkMode(darkTheme);
    } else {
      setDarkMode("false");
    }
  }, []);

  useEffect(() => {
    let theme = document.getElementsByTagName("link")[1];
    console.log(isDarkMode);
    console.log(theme);
    if (isDarkMode === "true") {
      theme.setAttribute("href", "./css/bootstrap-night.min.css");
    } else {
      theme.setAttribute("href", "./css/bootstrap.min.css");
    }
  }, [isDarkMode]);

  function onThemeSwitch(e) {
    console.log(e.target.checked);

    if (e.target.checked) {
      setDarkMode("true");
      localStorage.setItem("DarkMode", "true");
    } else {
      localStorage.setItem("DarkMode", "false");

      console.log("setting to false");
      setDarkMode("false");
    }
  }

  return (
    <>
      <div className="App d-flex flex-column min-vh-100">
        <BrowserRouter>
          <div className="">
            <Routes>
              <Route path="/" element={<Home />} />
              {authToken && <Route path="/dashboard" element={<Dashboard />} />}
              {authToken && (
                <Route path="/onboarding" element={<OnBoarding />} />
              )}
            </Routes>
          </div>
          <Toggle SwitchTheme={onThemeSwitch} />
        </BrowserRouter>
      </div>
    </>
  );
};

export default App;
