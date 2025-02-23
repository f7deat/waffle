import axios from "axios";

export async function apiPokemonList(params: { limit: number, offset: number }) {
  return axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${params.limit}&offset=${params.offset}`);
}