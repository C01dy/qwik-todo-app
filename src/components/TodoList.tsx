import { type Signal, component$, useSignal, $ } from "@builder.io/qwik";
import { useContextProvider, createContextId } from "@builder.io/qwik";

import TodoListItem from "./TodoListItem";
import { TodoItemsFilter } from "../types/TodoList";

export const TodoListStoreContext =
  createContextId<Signal<ITodoItem[]>>("todo-list-context");

export default component$(() => {
  const todoList = useSignal<ITodoItem[]>([
    {
      id: 1,
      text: "Медитировать",
      isCompleted: false,
    },
    {
      id: 2,
      text: "Созерцать",
      isCompleted: true,
    },
    {
      id: 3,
      text: "Достичь просветления",
      isCompleted: false,
    },
  ]);
  const inputText = useSignal<string>("");
  const currentFilter = useSignal<TodoItemsFilter>(TodoItemsFilter.All);
  const filterTodoList = (todoList: ITodoItem[], filter: TodoItemsFilter) => {
    switch (filter) {
      case "all":
        return todoList;
      case "active":
        return todoList.filter((item) => !item.isCompleted);
      case "completed":
        return todoList.filter((item) => item.isCompleted);
      default:
        return todoList;
    }
  };

  useContextProvider(TodoListStoreContext, todoList);

  const onInputText = $((e: InputEvent) => {
    if (e.inputType === "deleteContentBackward") {
      inputText.value = inputText.value.slice(0, -1);
    } else {
      if (e.data) inputText.value = inputText.value + e.data;
    }
  });

  const onAddTodoItem = $((e: SubmitEvent) => {
    if (inputText.value) {
      const newTodoItem = {
        id: Date.now(),
        text: inputText.value,
        isCompleted: false,
      };
      todoList.value = [...todoList.value, newTodoItem];
      inputText.value = "";
    }
  });

  return (
    <>
      <div class="flex w-full flex-col items-center">
        <div class="flex w-96 justify-between filter">
          <button
            class="all"
            onClick$={() => {
              currentFilter.value = TodoItemsFilter.All;
            }}
          >
            All
          </button>
          <button
            class="active"
            onClick$={() => {
              currentFilter.value = TodoItemsFilter.Active;
            }}
          >
            Active
          </button>
          <button
            class="completed"
            onClick$={() => {
              currentFilter.value = TodoItemsFilter.Completed;
            }}
          >
            Completed
          </button>
        </div>
        <form
          class="m-5 flex w-96 items-center justify-center"
          preventdefault:submit
          onSubmit$={onAddTodoItem}
        >
          <input
            class="w-96 rounded-s-sm border-indigo-500 p-1 px-5 outline outline-4 outline-indigo-400 focus:border-indigo-800 focus:ring focus:ring-indigo-600 focus:ring-opacity-50"
            value={inputText.value}
            onInput$={onInputText}
            type="text"
            placeholder="Введите текст"
          />
          <button class="h-max rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-600 active:bg-indigo-700">
            Добавить
          </button>
        </form>
        <ul class="flex w-96 flex-col items-start font-medium">
          {filterTodoList(todoList.value, currentFilter.value).map(
            (todoItem, i) => (
              //   <li key={i}>{todoItem.text}</li>
              <TodoListItem key={i} {...todoItem} />
            ),
          )}
        </ul>
      </div>
    </>
  );
});
