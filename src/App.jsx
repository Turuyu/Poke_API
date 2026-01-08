import { useEffect, useState } from "react";
import PokemonCard from "./components/PokemonCard";
import pokeballIcon from "./assets/pokeball.svg";


const LIMIT = 6;

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [allPokemons, setAllPokemons] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  // Cargar lista completa para búsqueda
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=2000")
      .then((res) => res.json())
      .then((data) => setAllPokemons(data.results))
      .catch(console.error);
  }, []);

  // Cargar Pokémon paginados
  useEffect(() => {
    if (searchText) return;

    setLoading(true);

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.results.map((pokemon) => {
          const id = pokemon.url.split("/").filter(Boolean).pop();

          return {
            id,
            name: pokemon.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          };
        });

        setPokemons(formatted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [offset, searchText]);

  // Manejar búsqueda
  const handleSearch = (text) => {
    setSearchText(text);

    if (!text) {
      setSearchResults([]);
      return;
    }

    const results = allPokemons
      .filter((pokemon) =>
        pokemon.name.toLowerCase().includes(text.toLowerCase())
      )
      .slice(0, 6)
      .map((pokemon) => {
        const id = pokemon.url.split("/").filter(Boolean).pop();

        return {
          id,
          name: pokemon.name,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      });

    setSearchResults(results);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pokédex</h1>

    <div className="search-container">
      <img
        src={pokeballIcon}
        alt="Pokeball"
        className="search-icon"
      />


      <input
        type="text"
        placeholder="Buscar Pokémon..."
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input"
      />
    </div>



      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div style={styles.grid}>
          {(searchText ? searchResults : pokemons).map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              id={pokemon.id}
              name={pokemon.name}
              sprite={pokemon.sprite}
            />
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => setOffset(offset - LIMIT)}
          disabled={offset === 0}
        >
          ← Anterior
        </button>

        <button
          className="pagination-button"
          onClick={() => setOffset(offset + LIMIT)}
        >
          Siguiente →
        </button>
</div>

    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginTop: "20px",
  },
  input: {
    padding: "8px",
    marginBottom: "16px",
    width: "100%",
    maxWidth: "300px",
  },
  pagination: {
    marginTop: "16px",
    display: "flex",
    gap: "8px",
  },
};

export default App;