const express = require('express');
const axios = require('axios'); // Added for async/await tasks
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

// Task 10: Get the book list available in the shop (Async version)
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

// Task 11: Get book details based on ISBN (Async version)
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.send(response.data);
  } catch (err) {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 12: Get book details based on author (Async version)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Task 13: Get all books based on title (Async version)
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books by title" });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
