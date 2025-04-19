import { TitleCasePipe } from '@angular/common';
import {
  Component,
  effect,
  inject,
  ResourceStatus,
  signal,
} from '@angular/core';
import { ResourceTestService } from './core/resource-test.service';

@Component({
  selector: 'pkr-root',
  imports: [TitleCasePipe],
  template: `
    <section style="display: flex;">
      <div style="flex: 1;">
        <ul>
          @for (pokemon of pokemonsResource.value()?.results; track pokemon) {
            <li>
              <button (click)="selectedUrlSignal.set(pokemon.url)">
                {{ pokemon.name | titlecase }}
              </button>
            </li>
          }
        </ul>
      </div>
      <div style="flex: 1;">
        @if (selectedResource.isLoading()) {
          <p>Loading...</p>
        }
        @if (selectedResource.value(); as pokemon) {
          <img [alt]="pokemon.name" [src]="pokemon.sprites.front_default" />
          <h3>{{ pokemon.name | titlecase }}</h3>
        }
      </div>
    </section>
  `,
})
export class AppComponent {
  pokemonsResource = inject(ResourceTestService).getPokemons();
  selectedUrlSignal = signal<string>('');
  selectedResource = inject(ResourceTestService).getPokemonByUrl(
    this.selectedUrlSignal,
  );

  constructor() {
    effect(() => {
      console.log('Pokemons:', ResourceStatus[this.pokemonsResource.status()]);
      console.log('Pokemons:', this.pokemonsResource.value());
    });
  }
}
