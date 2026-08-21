import CoinTable from './components/CoinTable';
import AiChat from './components/AiChat';

function App() {
  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 16px' }}>
      <h1>Crypto Dashboard</h1>
      <CoinTable />
      <AiChat />
    </div>
  );
}

export default App;
