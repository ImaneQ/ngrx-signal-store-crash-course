import { Component, inject } from '@angular/core';
import { MatFormFieldModule, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TodosStore } from '../store/todos.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'todos-list',
  standalone: true,
  imports: [MatFormFieldModule,
    MatInputModule,
    MatSuffix, MatLabel, MatButtonToggleModule, MatIconModule, MatProgressSpinnerModule, MatListModule],
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.scss'
})
export class TodosListComponent {

  async onDeleteTodo(id: string, event: MouseEvent) {

    event.stopPropagation();

    await this.store.deleteTodo(id);
  }

  store = inject(TodosStore);

  async onAddTodo(title: string) {
    await this.store.addTodo(title);
  }


}
