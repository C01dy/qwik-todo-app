import { type Signal, component$, useSignal, $ } from "@builder.io/qwik";
import {
  useContext,
  useContextProvider,
  createContextId,
} from "@builder.io/qwik";

import TodoListItem from "./TodoListItem";

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
      <form
        class="m-5 flex items-center"
        preventdefault:submit
        onSubmit$={onAddTodoItem}
      >
        <input
          class="p-1 rounded-s-sm border-indigo-500 px-5 outline outline-4 outline-indigo-400 focus:border-indigo-800 focus:ring focus:ring-indigo-600 focus:ring-opacity-50"
          value={inputText.value}
          onInput$={onInputText}
          type="text"
          placeholder="Введите текст"
        />
        <button class="h-max rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-600 active:bg-indigo-700">
          Добавить
        </button>
      </form>
      <ul class="flex flex-col w-max items-center">
        {todoList.value.map((todoItem, i) => (
          //   <li key={i}>{todoItem.text}</li>
          <TodoListItem key={i} {...todoItem} />
        ))}
      </ul>
    </>
  );
});
