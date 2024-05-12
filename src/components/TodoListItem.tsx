import { Signal, component$, $, useContext, useSignal } from "@builder.io/qwik";
import { TodoListStoreContext } from "./TodoList";

export default component$<ITodoItem>((props) => {
  const todoList = useContext(TodoListStoreContext);

  const onRemoveTodoItem = $((e: MouseEvent) => {
    const removedItemIndex = todoList.value.findIndex(
      (todoItem) => todoItem.id === props.id,
    );
    const leftArrayItems = todoList.value.slice(0, removedItemIndex);
    const restArrayItems = todoList.value.slice(removedItemIndex + 1);

    todoList.value = [...leftArrayItems, ...restArrayItems];
  });

  const onToggleCompleted = $((e: InputEvent) => {
    const currentListItemIdx = todoList.value.findIndex(
      (todoItem) => todoItem.id === props.id,
    );

    const currentListItem = todoList.value[currentListItemIdx]
    const newItem = {
      ...currentListItem,
      isCompleted: !currentListItem?.isCompleted,
    };

    todoList.value = [
        ...todoList.value.slice(0, currentListItemIdx),
        newItem,
        ...todoList.value.slice(currentListItemIdx + 1),
    ]

  });

  return (
    <>
      <li class="rounded-s-sm border-b-2 p-1" key={props.id}>
        <span class={props.isCompleted ? "line-through" : ""}>{props.text}</span>
        <input
          type="checkbox"
          checked={props.isCompleted}
          onChange$={onToggleCompleted}
        />
        <button
          id={props.id.toString()}
          type="button"
          onClick$={onRemoveTodoItem}
        >
          Удалить
        </button>
      </li>
    </>
  );
});
