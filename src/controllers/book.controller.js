"use strict";
const book = require("../models/book.model");
const publisherController = require("../controllers/publisher.controller");
const authorController = require("../controllers/author.controller");
const categoryController = require("../controllers/category.controller");

exports.getBook = async (req, res) => {
  try {
    const docs = await book.find({});
    res.status(200).json({ data: docs });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

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
  let page = req.body.page || 1; // Trang mặc định là 1 nếu không được cung cấp

  try {
    const bookData = await book
      .find({})
      .skip(9 * (page - 1))
      .limit(9)
      .exec();

    const bookCount = await book.countDocuments();
    const totalPage = Math.ceil(bookCount / 9);

    res.status(200).json({ data: bookData, totalPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
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
      _nsx: id,
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
    const encodedID = atob(req.params.id);
    let result = await book.findById(encodedID);
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

