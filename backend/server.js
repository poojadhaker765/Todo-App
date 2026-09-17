require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const Todo = require("./models/Todo");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
(async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error("Database startup failed:", error.message);
        process.exit(1);
    }
})();

// Home route
app.get("/", (req, res) => {
    res.send("My Todo Backend is Running");
});

// GET all todos
app.get("/api/todos", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        console.log("GET error:", error.message);

        res.status(500).json({
            message: "Failed to get todos"
        });
    }
});

// POST - Add Todo
app.post("/api/todos", async (req, res) => {
    try {
        const todo = new Todo({
            title: req.body.title
        });

        const savedTodo = await todo.save();

        res.status(201).json(savedTodo);
    } catch (error) {
        console.log("POST error:", error.message);

        res.status(500).json({
            message: "Failed to add todo"
        });
    }
});

// DELETE - Delete Todo
app.delete("/api/todos/:id", async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);

        res.json({
            message: "Todo deleted successfully"
        });
    } catch (error) {
        console.log("DELETE error:", error.message);

        res.status(500).json({
            message: "Failed to delete todo"
        });
    }
});

// PUT - Update Todo
app.put("/api/todos/:id", async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedTodo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.json(updatedTodo);
    } catch (error) {
        console.log("PUT error:", error.message);

        res.status(500).json({
            message: "Failed to update todo",
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});