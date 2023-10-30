import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const GlobalContext = createContext();

export const GlobalProvider = (props) => {
  let navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [currentId, setCurrentId] = useState(-1);
  const [fetchStatus, setFetchStatus] = useState(true);
  const [input, setInput] = useState({ name: "" });
  const [total, setTotal] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (fetchStatus === true) {
      axios
        .get("https://653fe3f545bedb25bfc1689d.mockapi.io/Todos")
        .then((response) => {
          setTodos(response.data);
          setTotal(response.data.length);
          console.log(response.data.length);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setFetchStatus(false);
  }, [fetchStatus, setFetchStatus]);

  const handleInput = (event) => {
    let value = event.target.value;

    setInput({ ...input, name: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let { name } = input;

    if (name.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todo name cannot be empty!",
      });
      return;
    }

    if (currentId === -1) {
      axios
        .post("https://653fe3f545bedb25bfc1689d.mockapi.io/Todos", {
          name,
        })
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Todo successfully added!",
          });
          setTodos([...todos, response.data]);
          setFetchStatus(true);
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .put(
          `https://653fe3f545bedb25bfc1689d.mockapi.io/Todos/${currentId}`,
          {
            name,
          }
        )
        .then((response) => {
          setFetchStatus(true);
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setCurrentId(-1);
    setInput({ name: "" });
    console.log(input);
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Edit Cancelled!",
      icon: "info",
      showConfirmButton: true,
    });
    setCurrentId(-1);
    navigate("/");
    setInput({ name: "" });
  };

  const handleDelete = (id) => {
    console.log(id);

    if (currentId === id) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You are editing this todo!",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `https://653fe3f545bedb25bfc1689d.mockapi.io/Todos/${id}`
          )
          .then((response) => {
            setFetchStatus(true);
          })
          .catch((error) => {
            console.log(error);
          });
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      } else {
        Swal.fire("Cancelled!", "Your file is safe!", "error");
      }
    });
  };

  const handleEdit = (id) => {
    setCurrentId(id);
    navigate(`/${id}`);
  };

  const getCompletedTodos = () => {
    axios
      .get(
        "https://653fe3f545bedb25bfc1689d.mockapi.io/Todos?status=true"
      )
      .then((response) => {
        setTodos(response.data);
        setTotal(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getActiveTodos = () => {
    axios
      .get(
        "https://653fe3f545bedb25bfc1689d.mockapi.io/Todos?status=false"
      )
      .then((response) => {
        setTodos(response.data);
        setTotal(response.data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    setTotal(total - 1);
  };

  const handleComplete = (event) => {
    const id = parseInt(event.target.value);
    const status = event.target.checked;

    axios
      .put(`https://653fe3f545bedb25bfc1689d.mockapi.io/Todos/${id}`, {
        status: status,
      })
      .then((response) => {
        setFetchStatus(true);
        if (activeFilter === "all") {
          setFetchStatus(true);
        } else if (activeFilter === "completed") {
          getCompletedTodos();
        } else {
          getActiveTodos();
          if (status === true) {
            removeTodo(id);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // menampilkan data kosong ketika data pada filter sudah habis atau kosong
    if (
      activeFilter === "active" &&
      todos.filter((todo) => todo.status === false).length === 1
    ) {
      setTodos([]);
      setTotal(0);
    } else {
      setTodos([]);
      setTotal(0);
    }
  };

  const handleFilter = (f) => {
    let filter = f.target.value.toLowerCase();

    setActiveFilter(filter);

    if (filter === "all") {
      setFetchStatus(true);
    } else if (filter === "completed") {
      getCompletedTodos();
    } else {
      getActiveTodos();
      if (activeFilter === "active") {
        setTodos(todos.filter((todo) => todo.status === false));
        setTotal(todos.filter((todo) => todo.status === false).length);
      }
    }
  };

  let states = {
    todos,
    input,
    currentId,
    fetchStatus,
    total,
    activeFilter,
    setInput,
    setTodos,
    setCurrentId,
    setFetchStatus,
    setTotal,
    setActiveFilter,
  };

  let eventHandlers = {
    handleInput,
    handleSubmit,
    handleCancel,
    handleDelete,
    handleEdit,
    handleComplete,
    handleFilter,
  };

  return (
    <GlobalContext.Provider value={{ states, eventHandlers }}>
      {props.children}
    </GlobalContext.Provider>
  );
};
