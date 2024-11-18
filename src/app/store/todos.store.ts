import { TodosService } from './../services/todos.service';
import { Todo } from "../model/todo.model";
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';

/* Définition des types de filtres possibles pour les todos */
export type TodosFilter =
  "all" | "pending" | "completed";

/* Définition de la structure de l'état du store */
type TodosState = {
  todos: Todo[];
  loading: boolean;
  filter: TodosFilter;
}

/* Définition de l'état initial du store */
const initialState: TodosState = {
  todos: [],
  loading: false,
  filter: "all"
}

/* Création du store de todos */
export const TodosStore = signalStore(

  /* Configuration du store pour qu'il soit disponible dans toute l'application */
  { providedIn: 'root' },

  /* Utilisation de WithState pour définir l'état initial du store */
  withState(initialState),

  /* Utilisation de WithMethods pour ajouter des méthodes au store pour modifier
  l'état du store encapsule la logique de mise à jour de l'état*/
  withMethods((store) => {

    /* Injection du service TodosService */
    const todosService = inject(TodosService);

    return {

      /* Méthode asynchrone pour charger tous les todos */
      async loadAll() {

        /* Mise à jour de l'état pour indiquer le chargement en cours */
        patchState(store, { loading: true });

        /* Récupération des todos depuis le service  */
        const todos = await todosService.getTodos();

        /* Mise à jour de l'état avec les todos chargés et fin du chargement */
        patchState(store, { todos, loading: false })
      },

      async addTodo(title: string) {

        const todo = await todosService.addTodo({ title, completed: false });

        patchState(store, (state) => ({
          todos: [...state.todos, todo]
        }))
      },

      async deleteTodo(id: string) {

        await todosService.deleteTodo(id);

        patchState(store, (state => ({
          todos: state.todos.filter((todo: { id: string; }) => todo.id !== id)
        })))
      },

      async updateTodo(id: string, completed: boolean) {

        /* Appelle une méthode asynchrone du service pour mettre à jour le todo */
        await todosService.updateTodo(id, completed);

        /* utilise patchState() pour mettre à jour l'état du store */
        patchState(store, (state) => ({

          /* Crée un nouvel objet avec la propriété 'todos'  mise à jour*/
          todos: state.todos.map(todo =>

            /* Pour chaque todo, vérifie si son id correspond à celui passé en paramètre */
            /* opérateur ternaire 'condition ? valeurSiVrai : valeurSiFaux' */
            todo.id === id ? { ...todo, completed } : todo)
          /* les trois petits points ... correspondent à un opérateur de propagation => permet de copier toutes les propriétés d'un objet dans un nouvel objet */
        }))
      },

      updateFilter(filter: TodosFilter) {
        patchState(store, { filter });
      }
    };


  }),
  /* withComputed() méthode utilisée pour définir des propriétés calculées(computed properties)
   basées sur l'état actuel du store.
  Ce sont des valeurs dérivées qui se mettent à jour automatiquement lorsque l'état change */
  withComputed((state) => ({

    /* propriété calculée ici filteredTodos => filtre les todos en fonction de l'état actuel du filtre,
     sera recalculé automatiquement jusqu'à ce que state.todos() ou state.filter() changera*/
    filteredTodos: computed(() => {

      const todos = state.todos();

      switch (state.filter()) {
        case "all":
          return todos;
        case "pending":
          return todos.filter(todo => !todo.completed)
        case "completed":
          return todos.filter(todo => todo.completed)
      }
    })
  }))
);
