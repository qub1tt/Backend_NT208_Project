"use strict";
const author = require("../models/author.model");

exports.getIDBySearchText = async (searchText) => {
  try {
    const arr = await author.find(
      { name: new RegExp(searchText, "i") },
      { name: 0 }
    );
    return arr.map((i) => i.id);
  } catch (err) {
    console.error(err);
    return [];
  }
};

exports.getAll = async (req, res) => {
  try {
    if (typeof req.params.page === "undefined") {
      return res.status(400).json({ msg: "Page parameter is required" });
    }

    const count = await author.countDocuments({});
    const totalPage = Math.ceil(count / 9);

    const page = parseInt(req.params.page);
    if (page < 1 || page > totalPage) {
      return res.status(400).json({ msg: "Invalid page number" });
    }

    const docs = await author
      .find({})
      .skip(9 * (page - 1))
      .limit(9);

    res.status(200).json({ data: docs, totalPage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.getNameByID = async (req, res) => {
  try {
    if (req.params.id === "undefined") {
      return res.status(422).json({ msg: "Invalid data" });
    }

    const result = await author.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ msg: "Author not found" });
    }

    res.status(200).json({ name: result.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.getAuthor = async (req, res) => {
  try {
    const docs = await author.find({});
    res.status(200).json({ data: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
