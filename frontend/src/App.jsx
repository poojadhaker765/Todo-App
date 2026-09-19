import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const [editingId, setEditingId] = useState(null);

  // EC2 Backend URL
  const API_URL = "Todo-ALB-410844410.ap-south-1.elb.amazonaws.com";

  // Get all todos
  const getTodos = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/todos`
      );

      setTodos(response.data);
    } catch (error) {
      console.log("Error getting todos:", error);
    }
  };

  // Add Todo
  const addTodo = async () => {
    if (title.trim() === "") {
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/todos`,
        {
          title: title
        }
      );

      setTodos([...todos, response.data]);
      setTitle("");
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  // Delete Todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/todos/${id}`
      );

      setTodos(
        todos.filter((todo) => todo._id !== id)
      );
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  // Start editing
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setTitle(todo.title);
  };

  // Update Todo
  const updateTodo = async () => {
    if (title.trim() === "") {
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/todos/${editingId}`,
        {
          title: title
        }
      );

      setTodos(
        todos.map((todo) =>
          todo._id === editingId
            ? response.data
            : todo
        )
      );

      setTitle("");
      setEditingId(null);
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  // Get todos when page loads
  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="app">

      <div className="todo-container">

        <h1>My Todo App</h1>

        <p className="subtitle">
          Manage your daily tasks
        </p>

        <div className="input-section">

          <input
            type="text"
            placeholder="Enter your todo..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {editingId ? (
            <button
              className="update-btn"
              onClick={updateTodo}
            >
              Update Todo
            </button>
          ) : (
            <button
              className="add-btn"
              onClick={addTodo}
            >
              Add Todo
            </button>
          )}

        </div>

        <div className="todo-header">
          <h2>My Todos</h2>

          <span className="todo-count">
            {todos.length} Tasks
          </span>
        </div>

        <ul className="todo-list">

          {todos.length === 0 ? (
            <li className="empty-message">
              No todos yet. Add your first task!
            </li>
          ) : (
            todos.map((todo) => (
              <li
                className="todo-item"
                key={todo._id}
              >

                <span className="todo-title">
                  {todo.title}
                </span>

                <div className="buttons">

                  <button
                    className="edit-btn"
                    onClick={() => startEdit(todo)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTodo(todo._id)}
                  >
                    Delete
                  </button>

                </div>

              </li>
            ))
          )}

        </ul>

      </div>

    </div>
  );
}

export default App;