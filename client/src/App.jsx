import { AppProviders } from "./providers/AppProviders";
import AppRoutes from "./routes";
import "./app.css";

function App() {
  return (
    <AppProviders>
      {/* add header later */}
      <main>
        <AppRoutes />
      </main>
      {/* add footer later */}
    </AppProviders>
  );
}

export default App;
