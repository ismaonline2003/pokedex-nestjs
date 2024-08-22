import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {

  }

  async executeSeed() {

    await this.pokemonModel.deleteMany({});// delete * from pokemons;

    const data = await this.http.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=650");
    
    /*
    const insertPromisesArray = [];

    data.results.forEach(({ name, url}) => {
      const segments = url.split('/');
      const no:number = +segments[segments.length - 2];
      //const pokemon = this.pokemonModel.create({name, no})
      insertPromisesArray.push(
        this.pokemonModel.create({name, no})
      );
    });

    const newArray = await Promise.all( insertPromisesArray );
    */

    const pokemonsToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({ name, url}) => {
      const segments = url.split('/');

      const no:number = +segments[segments.length - 2];

      pokemonsToInsert.push({name, no});
    });

    await this.pokemonModel.insertMany(pokemonsToInsert);

    return 'Seed Executed';
  }
}
