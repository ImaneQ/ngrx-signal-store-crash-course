import { Component, effect, inject, viewChild } from '@angular/core';
import { MatFormFieldModule, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleChange, MatButtonToggleGroup, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TodosFilter, TodosStore } from '../store/todos.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'todos-list',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule,
    MatInputModule,
    MatSuffix, MatLabel, MatButtonToggleModule, MatIconModule, MatProgressSpinnerModule, MatListModule],
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.scss'
})

export class TodosListComponent {
  /* Méthode appelée pour supprimer une tâche. id tâche + évènement de clic en paramètre
  event.stopPropagation() empêche évènement de se propager à d'autres éléments
  ensuite appelle méthode du store pour supprimer la tâche */
  async onDeleteTodo(id: string, event: MouseEvent) {

    event.stopPropagation();

    await this.store.deleteTodo(id);
  }
  /* Injecte service TodosStore dans le composant. */
  store = inject(TodosStore);

  /* Déclare une référence à un enfant du composant, qui est un ´MatButtonToggleGroup´, utilisé pour filtrer tâches */
  filter = viewChild.required(MatButtonToggleGroup);

  constructor() {
    /* Le constructeur utilise effect() pour créer un effet secondaire. chaque fois que ´this.store.filter()´ change, il met à jour la valeur du filtre dans l'UI */
    effect(() => {

      const filter = this.filter();

      filter.value = this.store.filter();
    })
  }

  /* Méthode appelée pour ajouter une nouvelle tâche, utilise le store pour ajouter tâche */
  async onAddTodo(title: string) {
    await this.store.addTodo(title);
  }

  /* Méthode appelée quand la tâche est cochée ou décochée met à jour l'état de la tâche dans le store */
  async onTodoToggled(id: string, completed: boolean) {
    await this.store.updateTodo(id, completed);
  }

  /* méthode appelée quand utilisateur change filtre , met à jour le filtre dans le store. */
  onFilterTodos(event: MatButtonToggleChange) {

    const filter = event.value as TodosFilter;

    this.store.updateFilter(filter);
  }
}
