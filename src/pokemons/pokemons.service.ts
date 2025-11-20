import { Injectable } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PokemonsResponse } from './interfaces/pokemons-response';
import { PokemonAPIResponse } from './interfaces/pokemon-response';

@Injectable()
export class PokemonsService {
  paginatedPokemonsCache = new Map<string, Pokemon[]>();

  create(createPokemonDto: CreatePokemonDto) {
    return 'This action adds a new pokemon';
  }

  async findAll(paginationDto: PaginationDto): Promise<Pokemon[]> {
    const { page = 1, limit = 10 } = paginationDto;
    const offset = (page - 1) * limit;

    const cacheKey = `${page}-${limit}`;

    if (this.paginatedPokemonsCache.has(cacheKey)) {
      return this.paginatedPokemonsCache.get(cacheKey);
    }

    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    const res = await fetch(url);

    const data = (await res.json()) as PokemonsResponse;

    const pokemonPromises = data.results.map((poke) => {
      const id = poke.url.split('').at(-2);

      const pokemonPromise = this.getPokemonInformation(id);

      return pokemonPromise;
    });

    const pokemons = await Promise.all(pokemonPromises);

    this.paginatedPokemonsCache.set(cacheKey, pokemons);

    return pokemons;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }

  async getPokemonInformation(id: string): Promise<Pokemon> {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    const res = await fetch(url);

    const data = (await res.json()) as PokemonAPIResponse;

    return {
      id: data.id,
      name: data.name,
      type: data.types[0].type.name,
      hp: data.stats[0].base_stat,
      sprites: [data.sprites.front_default, data.sprites.back_default],
    };
  }
}
