import { HttpClient, httpResource } from '@angular/common/http';
import {
  inject,
  Injectable,
  resource,
  ResourceRef,
  signal,
  WritableSignal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

interface PokeResult {
  count: number;
  next: string;
  previous: string;
  results: {
    name: string;
    url: string;
  }[];
}

interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ResourceTestService {
  readonly #http = inject(HttpClient);
  readonly #pokeUrl = 'https://pokeapi.co/api/v2/pokemon';

  getPokemons(): ResourceRef<PokeResult | undefined> {
    let pokeResource: ResourceRef<PokeResult | undefined>;

    pokeResource = resource({
      loader: () =>
        fetch(this.#pokeUrl).then((res) => res.json() as Promise<PokeResult>),
    });

    pokeResource = rxResource({
      loader: () => this.#http.get<PokeResult>(this.#pokeUrl),
    });

    pokeResource = httpResource<PokeResult>(() => ({
      url: this.#pokeUrl,
      method: 'GET',
    }));

    return pokeResource;
  }

  getPokemonByUrl(
    selectedUrlSignal: WritableSignal<string>,
  ): ResourceRef<Pokemon | undefined> {
    let pokeResource: ResourceRef<Pokemon | undefined>;

    pokeResource = rxResource({
      request: () => selectedUrlSignal(),
      loader: ({ request: pokeUrl }) => this.#http.get<Pokemon>(pokeUrl),
    });

    return pokeResource;
  }
}
