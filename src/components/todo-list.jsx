import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TbHttpDelete, TbEdit } from "react-icons/tb";
export default function TodoList() {
  const { states, eventHandlers } = useContext(GlobalContext);
  const { id } = useParams();
  const {
    todos,
    input,
    setInput,
    total,
    setTotal,
    activeFilter,
    currentId,
    setCurrentId,
  } = states;
  const {
    handleInput,
    handleSubmit,
    handleCancel,
    handleDelete,
    handleEdit,
    handleComplete,
    handleFilter,
  } = eventHandlers;

  useEffect(() => {
    if (id !== undefined) {
      axios
        .get(`https://6538d282a543859d1bb1fc0c.mockapi.io/api/v1/todo/${id}`)
        .then((response) => {
          let data = response.data;
          setInput({ name: data.name });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setInput({ name: "" });
    }
  }, [setInput, id]);

  return (
    <>
      <div className="container-fluid">
        <div className="flex flex-col justify-center items-center mt-10 mb-4 border lg:rounded-md lg:mx-96">
          <h1 className="mb-4">Whatcha Gonna Do?</h1>
          <form onSubmit={handleSubmit} className="flex gap-2 my-4">
            <input
              type="text"
              className="border rounded-md px-4 py-2"
              name="name"
              value={input.name}
              onChange={handleInput}
            />
            <button
              className="bg-blue-200 border rounded-md px-4 py-2"
              type="submit"
            >
              Add
            </button>
            {currentId !== -1 && (
              <button
                className="bg-blue-200 border rounded-md px-4 py-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <nav className="flex justify-center items-center gap-10 my-4 border lg:rounded-md py-2 px-4 m-2 lg:mx-96">
          <button
            onClick={handleFilter}
            value={"all"}
            className={`px-4 py-2 rounded-md ${
              activeFilter === "all" ? "bg-blue-200" : ""
            }`}
          >
            All
          </button>

          <button
            onClick={handleFilter}
            value={"completed"}
            className={`px-4 py-2 rounded-md ${
              activeFilter === "completed" ? "bg-blue-200" : ""
            }`}
          >
            Completed
          </button>

          <button
            onClick={handleFilter}
            value={"active"}
            className={`px-4 py-2 rounded-md ${
              activeFilter === "active" ? "bg-blue-200" : ""
            }`}
          >
            Active
          </button>
        </nav>

        <div className="border lg:rounded-md bg-blue-200 mt-4 mb-10  lg:mx-96">
          <ul className="grid grid-cols-1 px-4 py-2 m-2">
            {todos !== null &&
              todos.map((res, index) => {
                return (
                  <li key={index} className="flex justify-between items-center m-2">
                    <div key={index}>
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        value={res.id}
                        checked={res.status}
                        onChange={handleComplete}
                        className="w-4"
                      />
                      <span className={`${res.status ? "line-through" : ""}`}>
                        {res.name}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <button value={res.id} onClick={handleDelete}>
                        <TbHttpDelete size={30}/>
                      </button>
                      <button value={res.id} onClick={handleEdit}>
                        <TbEdit size={30}/>
                      </button>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
      <div className="fixed bg-sky-300 w-full bottom-0 left-0 p-2">
        <p>Total: {total}</p>
      </div>
    </>
  );
}
