import { component$, $, useContext } from "@builder.io/qwik";
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

    const currentListItem = todoList.value[currentListItemIdx];
    const newItem = {
      ...currentListItem,
      isCompleted: !currentListItem?.isCompleted,
    };

    todoList.value = [
      ...todoList.value.slice(0, currentListItemIdx),
      newItem,
      ...todoList.value.slice(currentListItemIdx + 1),
    ];
  });

  return (
    <>
      <li
        class="flex w-full justify-between rounded-s-sm border-b-2 p-1"
        key={props.id}
      >
        <span class={props.isCompleted ? "line-through" : ""}>
          {props.text}
        </span>
        <div class="actions flex items-center">
          <input
            class="mr-3 h-5 w-5"
            type="checkbox"
            checked={props.isCompleted}
            onChange$={onToggleCompleted}
          />
          <button
            class="rounded-md border  border-red-500 px-2 py-1 hover:bg-red-50"
            id={props.id.toString()}
            type="button"
            onClick$={onRemoveTodoItem}
          >
            ❌
          </button>
        </div>
      </li>
    </>
  );
});
