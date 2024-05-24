"use strict";
const _comment = require("../models/comment.model");
const book = require("../models/book.model");

exports.mycomment = async (req, res) => {
  const { id_user, id_book, name, comment } = req.body;
  try {
    // Check if required fields are present
    if (!id_user || !id_book || !name || !comment) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Check if book with given id exists
    const existingBook = await book.findById(id_book);
    if (!existingBook) {
      return res.status(422).json({ msg: "Invalid book ID" });
    }

    // Create new comment
    const newComment = new _comment({
      id_user: id_user,
      id_book: id_book,
      name: name,
      comment: comment,
    });

    // Save new comment to database
    await newComment.save();

    res.status(201).json({ msg: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.getCommentByIDBook = async (req, res) => {
  try {
    const { id_book } = req.body;

    // Check if required fields are present
    if (!id_book) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Retrieve all comments for the book
    const comments = await _comment
      .find({ id_book: id_book })
      .sort({ date: 1 });

    res.status(200).json({ data: comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
