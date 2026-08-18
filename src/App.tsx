import { useGetTopCoinsQuery } from './services/coinGeckoApi';

function App() {
  const { data, isLoading, error } = useGetTopCoinsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong.</p>;

  return (
    <div>
      <h1>Top Coins</h1>
      <ul>
        {data?.map((coin) => (
          <li key={coin.id}>
            {coin.name}: ${coin.current_price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;