import { BrowserRouter, Route, Routes } from "react-router-dom";
import TodoList from "./components/todo-list";
import { GlobalProvider } from "./context/GlobalContext";
import "./index.css";
function App() {
  return (
    <>
      <BrowserRouter>
        <GlobalProvider>
          <Routes>
            <Route path="/" element={<TodoList />} />
            <Route path="/:id" element={<TodoList />} />
          </Routes>
        </GlobalProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
