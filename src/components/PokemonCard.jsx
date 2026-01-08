function PokemonCard({ id, name, sprite }) {
  return (
    <div className="pokemon-card retro">
      <div className="pokemon-sprite-container">
        <img
          src={sprite}
          alt={name}
          className="pokemon-sprite"
        />
      </div>

      <div className="pokemon-info">
        <span className="pokemon-id">#{id.toString().padStart(3, "0")}</span>
        <span className="pokemon-name">{name}</span>
      </div>
    </div>
  );
}

export default PokemonCard;

