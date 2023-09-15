import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/topbar.jsx";
import Sidebar from "./scenes/global/sidebar.jsx";
import Dashboard from "./scenes/dashboard";
import Portfolio from "./scenes/portfolio";
import MostPopular from "./scenes/mostpopular";
import AllCrypto from "./scenes/allcrypto";
import TopGainers from "./scenes/topgainers";
import BigDippers from "./scenes/bigdippers";
// import Feedback from "./scenes/feedback";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/all_crypto" element={<AllCrypto />} />
              <Route path="/most_popular" element={<MostPopular />} />
              <Route path="/top_gainers" element={<TopGainers />} />
              <Route path="/big_dippers" element={<BigDippers />} />
              {/* <Route path="/feedback" element={<Feedback />} /> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
