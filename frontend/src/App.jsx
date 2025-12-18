import { useState } from "react";

function App() {
  const [movie, setMovie] = useState("");
  const [results, setResults] = useState([]);
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
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-5">
      <h2 className="text-center text-3xl font-bold bg-green-500 text-white py-4 px-6 w-fit mx-auto rounded-2xl shadow" >Watch What You Love</h2>

      <div className="relative max-w-md mx-auto mt-8">
        <input 
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          type="text"
          value={movie}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Enter movie name"
        />

        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto">
            {suggestions.map((s, i) => (
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                key={i}
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
      <div className="text-center mt-6">
        <button onClick={recommendMovie} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition">Recommend</button>
      </div>
      

      {loading && <p className="text-center mt-6 text-gray-600">Loading...</p>}

      <ul className="flex flex-wrap justify-center gap-6 my-5 ">
        {results.map((m) => (
          <li key={m.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center" style={{ marginBottom: "20px" }}>
            <img
             className="rounded-md mb-3"
              src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
              alt={m.original_title}
            />
            <h4 className="font-semibold text-lg text-center">
              {m.original_title}
            </h4>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
