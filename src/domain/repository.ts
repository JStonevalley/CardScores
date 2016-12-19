interface Repository<D, ID>{
  save(game: D): void
  fetch(id: ID): D
}