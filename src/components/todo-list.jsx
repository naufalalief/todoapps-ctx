import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TbEdit, TbHttpDelete } from "react-icons/tb";
import { PiGithubLogoDuotone } from "react-icons/pi";
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
        .get(`https://653fe3f545bedb25bfc1689d.mockapi.io/Todos/${id}`)
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
      <div className="fixed bottom-5 right-5 z-10 lg:right-0 lg:top-0 px-4 py-2 font-mono bg-violet-200 rounded-full">
        <a
          href="https://github.com/naufalalief/todoapps-ctx"
          target="_blank"
        >
          <PiGithubLogoDuotone size={50} />
        </a>
      </div>
      <div className="container-fluid font-mono lg:w-[70vw] mx-auto">
        <div className="flex flex-col justify-center items-center mt-10 mb-4 mx-2 border lg:rounded-md lg:mx-96 ">
          <h1 className="mt-10 mb-4 font-bold text-2xl">Whatcha Gonna Do?</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row gap-2 my-4"
          >
            <input
              type="text"
              className="border rounded-md px-4 py-2"
              name="name"
              value={input.name}
              onChange={handleInput}
            />
            <button
              className="bg-sky-200 border rounded-md px-4 py-2"
              type="submit"
            >
              Add
            </button>
            {currentId !== -1 && (
              <button
                className="bg-red-200 border rounded-md px-4 py-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <nav className="flex justify-center items-center gap-10 my-4 border lg:rounded-md py-2 px-4 mx-2 lg:mx-96">
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
              activeFilter === "active" ? "bg-sky-200" : ""
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
                  <li
                    key={index}
                    className="flex justify-between items-center m-2 border border-black px-4 py-2"
                  >
                    <div key={index} className="flex gap-2">
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        value={res.id}
                        checked={res.status}
                        onChange={handleComplete}
                        className="w-5"
                      />
                      <span className={`${res.status ? "line-through" : ""}`}>
                        {res.name}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => handleDelete(res.id)}>
                        <TbHttpDelete size={30} />
                      </button>
                      <button onClick={() => handleEdit(res.id)}>
                        <TbEdit size={30} />
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
