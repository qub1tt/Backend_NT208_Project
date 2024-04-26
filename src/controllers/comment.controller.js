"use strict";
const _comment = require("../models/comment.model");
const book = require("../models/book.model");

exports.mycomment = async (req, res) => {
  try {
    const { id_user, id_book, name, comment } = req.body;

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
    const { id_book, page } = req.body;

    // Check if required fields are present
    if (!id_book || !page) {
      return res.status(422).json({ msg: "Invalid data" });
    }

    // Count total comments for the book
    const count = await _comment.countDocuments({ id_book: id_book });

    // Calculate total number of pages
    const totalPage = Math.ceil(count / 9);

    // Validate page number
    if (parseInt(page) < 1 || parseInt(page) > totalPage) {
      return res.status(422).json({ msg: "Invalid page number" });
    }

    // Retrieve comments for the book
    const comments = await _comment
      .find({ id_book: id_book })
      .skip(9 * (parseInt(page) - 1))
      .limit(9)
      .sort({ date: 1 });

    res.status(200).json({ data: comments, totalPage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
