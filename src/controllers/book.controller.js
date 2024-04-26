"use strict";
const book = require("../models/book.model");
const publisherController = require("../controllers/publisher.controller");
const authorController = require("../controllers/author.controller");
const categoryController = require("../controllers/category.controller");

exports.getTotalPage = async (req, res) => {
  try {
    const docs = await book.find({});
    const totalPage = Math.ceil(docs.length / 9);
    res.status(200).json({ data: totalPage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllBook = async (req, res) => {
  if (typeof req.body.page === "undefined") {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  //Khoang gia
  let range = null;
  let objRange = null;
  if (typeof req.body.range !== "undefined") {
    range = req.body.range;
    //objRange = JSON.parse(range);
    objRange = range;
  }
  //Search Text
  let searchText = "";
  if (typeof req.body.searchtext !== "undefined") {
    searchText = req.body.searchtext;
  }
  let searchPublisher = null;
  try {
    searchPublisher = await publisherController.getIDBySearchText(searchText);
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  let searchAuthor = null;
  try {
    searchAuthor = await authorController.getIDBySearchText(searchText);
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  let searchCategory = null;
  try {
    searchCategory = await categoryController.getIDBySearchText(searchText);
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  //Sap xep
  let sortType = "release_date";
  let sortOrder = "-1";
  if (typeof req.body.sorttype !== "undefined") {
    sortType = req.body.sorttype;
  }
  if (typeof req.body.sortorder !== "undefined") {
    sortOrder = req.body.sortorder;
  }
  if (
    sortType !== "price" &&
    sortType !== "release_date" &&
    sortType !== "view_counts" &&
    sortType !== "sales"
  ) {
    res.status(422).json({ msg: "Invalid sort type" });
    return;
  }
  if (sortOrder !== "1" && sortOrder !== "-1") {
    res.status(422).json({ msg: "Invalid sort order" });
    return;
  }
  //Trang va tong so trang
  let bookCount = null;
  try {
    if (range !== null) {
      bookCount = await book.countDocuments({
        $or: [
          { name: new RegExp(searchText, "i") },
          { id_nsx: { $in: searchPublisher } },
          { id_author: { $in: searchAuthor } },
          { id_category: { $in: searchCategory } },
        ],
        price: { $gte: objRange.low, $lte: objRange.high },
      });
    } else {
      bookCount = await book.countDocuments({
        $or: [
          { name: new RegExp(searchText, "i") },
          { id_nsx: { $in: searchPublisher } },
          { id_author: { $in: searchAuthor } },
          { id_category: { $in: searchCategory } },
        ],
      });
    }
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  let totalPage = Math.ceil(bookCount / 9);
  let { page } = req.body;
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res.status(200).json({ data: [], msg: "Invalid page", totalPage });
    return;
  }
  //De sort
  let sortQuery = {};
  sortQuery[sortType] = sortOrder;
  //Lay du lieu
  let query = {
    $or: [
      { name: new RegExp(searchText, "i") },
      { id_nsx: { $in: searchPublisher } },
      { id_author: { $in: searchAuthor } },
      { id_category: { $in: searchCategory } },
    ],
  };
  if (range !== null) {
    query.price = { $gte: objRange.low, $lte: objRange.high };
  }
  try {
    const docs = await book
      .find(query)
      .skip(9 * (parseInt(page) - 1))
      .limit(9)
      .sort(sortQuery);
    res.status(200).json({ data: docs, totalPage });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

exports.getBookByPublisher = async (req, res) => {
  if (
    typeof req.body.page === "undefined" ||
    typeof req.body.id === "undefined"
  ) {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let { id, page } = req.body;
  //Khoang gia
  let range = null;
  let objRange = null;
  if (typeof req.body.range !== "undefined") {
    range = req.body.range;
    //objRange = JSON.parse(range);
    objRange = range;
  }
  //Search Text
  let searchText = "";
  if (typeof req.body.searchtext !== "undefined") {
    searchText = req.body.searchtext;
  }
  //Sap xep
  let sortType = "release_date";
  let sortOrder = "-1";
  if (typeof req.body.sorttype !== "undefined") {
    sortType = req.body.sorttype;
  }
  if (typeof req.body.sortorder !== "undefined") {
    sortOrder = req.body.sortorder;
  }
  if (
    sortType !== "price" &&
    sortType !== "release_date" &&
    sortType !== "view_counts" &&
    sortType !== "sales"
  ) {
    res.status(422).json({ msg: "Invalid sort type" });
    return;
  }
  if (sortOrder !== "1" && sortOrder !== "-1") {
    res.status(422).json({ msg: "Invalid sort order" });
    return;
  }
  //Trang va tong so trang
  let bookCount = null;
  try {
    let query = {
      name: new RegExp(searchText, "i"),
      id_nsx: id,
    };
    if (range !== null) {
      query.price = { $gte: objRange.low, $lte: objRange.high };
    }
    bookCount = await book.countDocuments(query);
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  let totalPage = Math.ceil(bookCount / 9);
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res.status(200).json({ data: [], msg: "Invalid page", totalPage });
    return;
  }
  //De sort
  let sortQuery = {};
  sortQuery[sortType] = sortOrder;
  //Lay du lieu
  try {
    let query = {
      name: new RegExp(searchText, "i"),
      id_nsx: id,
    };
    if (range !== null) {
      query.price = { $gte: objRange.low, $lte: objRange.high };
    }
    const docs = await book
      .find(query)
      .skip(9 * (parseInt(page) - 1))
      .limit(9)
      .sort(sortQuery);
    res.status(200).json({ data: docs, totalPage });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

exports.getBookByCategory = async (req, res) => {
  if (
    typeof req.body.id === "undefined" ||
    typeof req.body.page === "undefined"
  ) {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let { id, page } = req.body;
  //Khoang gia
  let range = null;
  let objRange = null;
  console.log(req.body.range);
  if (typeof req.body.range !== "undefined") {
    range = req.body.range;
    objRange = range;
  }
  //Kiem tra text
  let searchText = "";
  if (typeof req.body.searchtext !== "undefined") {
    searchText = req.body.searchtext;
  }
  //Sap xep
  let sortType = "release_date";
  let sortOrder = "-1";
  if (typeof req.body.sorttype !== "undefined") {
    sortType = req.body.sorttype;
  }
  if (typeof req.body.sortorder !== "undefined") {
    sortOrder = req.body.sortorder;
  }
  if (
    sortType !== "price" &&
    sortType !== "release_date" &&
    sortType !== "view_counts" &&
    sortType !== "sales"
  ) {
    res.status(422).json({ msg: "Invalid sort type" });
    return;
  }
  if (sortOrder !== "1" && sortOrder !== "-1") {
    res.status(422).json({ msg: "Invalid sort order" });
    return;
  }
  //Tinh tong so trang
  let bookCount, bookFind;
  try {
    let query = {
      id_category: id,
      name: new RegExp(searchText, "i"),
    };
    if (range !== null) {
      query.price = { $gte: objRange.low, $lte: objRange.high };
    }
    bookFind = await book.find(query);
    bookCount = bookFind.length;
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  let totalPage = Math.ceil(bookCount / 9);
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res
      .status(200)
      .json({ data: [], msg: "Invalid page", totalPage: totalPage });
    return;
  }
  //De sort
  let sortQuery = {};
  sortQuery[sortType] = sortOrder;
  //Lay du lieu
  try {
    let query = {
      id_category: id,
      name: new RegExp(searchText, "i"),
    };
    if (range !== null) {
      query.price = { $gte: objRange.low, $lte: objRange.high };
    }
    const docs = await book
      .find(query)
      .limit(9)
      .skip(9 * (page - 1))
      .sort(sortQuery);
    res.status(200).json({ data: docs, totalPage: totalPage });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

exports.getBookByAuthor = async (req, res) => {
  if (
    typeof req.body.id === "undefined" ||
    typeof req.body.page === "undefined"
  ) {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  let { id, page } = req.body;
  //Khoang gia
  let range = null;
  let objRange = null;
  if (typeof req.body.range !== "undefined") {
    range = req.body.range;
    objRange = range;
  }
  //Kiem tra text
  let searchText = "";
  if (typeof req.body.searchtext !== "undefined") {
    searchText = req.body.searchtext;
  }
  //Sap xep
  let sortType = "release_date";
  let sortOrder = "-1";
  if (typeof req.body.sorttype !== "undefined") {
    sortType = req.body.sorttype;
  }
  if (typeof req.body.sortorder !== "undefined") {
    sortOrder = req.body.sortorder;
  }
  if (
    sortType !== "price" &&
    sortType !== "release_date" &&
    sortType !== "view_counts" &&
    sortType !== "sales"
  ) {
    res.status(422).json({ msg: "Invalid sort type" });
    return;
  }
  if (sortOrder !== "1" && sortOrder !== "-1") {
    res.status(422).json({ msg: "Invalid sort order" });
    return;
  }
  //De sort
  let sortQuery = {};
  sortQuery[sortType] = sortOrder;
  //Tinh tong so trang
  let bookCount, bookFind;
  try {
    let query = {
      id_author: id,
      name: new RegExp(searchText, "i"),
    };
    if (range !== null) {
      query.price = { $gte: objRange.low, $lte: objRange.high };
    }
    bookFind = await book.find(query);
    bookCount = bookFind.length;
  } catch (err) {
    res.status(500).json({ msg: err });
    return;
  }
  let totalPage = Math.ceil(bookCount / 9);
  if (parseInt(page) < 1 || parseInt(page) > totalPage) {
    res
      .status(200)
      .json({ data: [], msg: "Invalid page", totalPage: totalPage });
    return;
  }
  //Lay du lieu
  try {
    let query = {
      id_author: id,
      name: new RegExp(searchText, "i"),
    };
    if (range !== null) {
      query.price = { $gte: objRange.low, $lte: objRange.high };
    }
    const docs = await book
      .find(query)
      .limit(9)
      .skip(9 * (page - 1))
      .sort(sortQuery);
    res.status(200).json({ data: docs, totalPage: totalPage });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

exports.getBookByID = async (req, res) => {
  if (req.params.id === "undefined") {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  try {
    let result = await book.findById(req.params.id);
    if (!result) {
      res.status(404).json({ msg: "Not found" });
      return;
    }
    result.view_counts += 1;
    await result.save();
    res.status(200).json({ data: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

exports.getRelatedBook = async (req, res) => {
  if (typeof req.params.bookId === "undefined") {
    res.status(422).json({ msg: "Invalid data" });
    return;
  }
  const { bookId } = req.params;
  let bookObj = null;
  try {
    bookObj = await book.findById(bookId);
    if (!bookObj) {
      res.status(404).json({ msg: "Book not found" });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
    return;
  }

  try {
    const relatedBooks = await book
      .find({
        $or: [
          {
            $and: [
              { id_category: bookObj.id_category },
              { _id: { $nin: [bookId] } },
            ],
          },
          {
            $and: [
              { id_author: bookObj.id_author },
              { _id: { $nin: [bookId] } },
            ],
          },
        ],
      })
      .limit(5)
      .sort({ release_date: -1 });

    res.status(200).json({ data: relatedBooks });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};
