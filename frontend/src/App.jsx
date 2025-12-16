import { useState } from "react";

function App() {
  const [movie, setMovie] = useState("");
  const [results, setResults] = useState([]); // MUST be array
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const handleSearch = async (value) => {
  setMovie(value);

  if (value.length < 2) {
    setSuggestions([]);
    return;
  }

  const res = await fetch("http://localhost:5000/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: value }),
  });

  const data = await res.json();
  setSuggestions(data);
};


  const recommendMovie = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:5000/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movie }),
    });

    const data = await res.json();
    setResults(data); // data is an array
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Movie Recommendation System</h2>

      <div style={{ position: "relative", width: "300px" }}>
  <input
    type="text"
    value={movie}
    onChange={(e) => handleSearch(e.target.value)}
    placeholder="Enter movie name"
    style={{ width: "100%" }}
  />

  {suggestions.length > 0 && (
    <ul style={{
      position: "absolute",
      top: "100%",
      left: 0,
      width: "100%",
      border: "1px solid #ccc",
      background: "#fff",
      zIndex: 10,
      padding: 0,
      margin: 0
    }}>
      {suggestions.map((s, i) => (
        <li
          key={i}
          style={{ listStyle: "none", padding: "6px", cursor: "pointer" }}
          onClick={() => {
            setMovie(s);
            setSuggestions([]);
          }}
        >
          {s}
        </li>
      ))}
    </ul>
  )}
</div>

      

      <button onClick={recommendMovie}>Recommend</button>

      {loading && <p>Loading...</p>}

      <ul>
        {results.map((m) => (
          <li key={m.id} style={{ marginBottom: "20px" }}>
            <h4>{m.original_title}</h4>
            <p>IMDb ID: {m.imdb_id}</p>
            <img
              src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
              alt={m.original_title}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
