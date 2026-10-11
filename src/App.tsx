import CoinTable from './components/CoinTable';
import AiChat from './components/AiChat';
import './App.css';
import AlertsPanel from './components/AlertsPanel';

function App() {
  return (
    <div className="page">
      <h1>Crypto Dashboard</h1>

      <div className="main-grid">
        <CoinTable />
        <AlertsPanel />
      </div>

      <AiChat />
    </div>
  );
}

export default App;
