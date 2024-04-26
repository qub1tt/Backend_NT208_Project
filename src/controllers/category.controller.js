"use strict";
const category = require("../models/category.model");
exports.getCategory = async (req, res) => {
  try {
    const docs = await category.find({});
    res.status(200).json({ data: docs });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

exports.getAll = async (req, res) => {
  try {
    if (typeof req.params.page === "undefined") {
      res.status(402).json({ msg: "Data invalid" });
      return;
    }
    const count = await category.countDocuments({});
    const totalPage = parseInt((count - 1) / 9 + 1);
    const { page } = req.params;
    if (parseInt(page) < 1 || parseInt(page) > totalPage) {
      res.status(200).json({ data: [], msg: "Invalid page", totalPage });
      return;
    }
    const docs = await category
      .find({})
      .skip(9 * (parseInt(page) - 1))
      .limit(9);
    res.status(200).json({ data: docs, totalPage });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

exports.getNameByID = async (req, res) => {
  try {
    if (req.params.id === "undefined") {
      res.status(422).json({ msg: "Invalid data" });
      return;
    }
    const result = await category.findById(req.params.id);
    if (!result) {
      res.status(404).json({ msg: "not found" });
      return;
    }
    res.status(200).json({ name: result.name });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
  }
};

exports.getIDBySearchText = async (searchText) => {
  try {
    const arr = await category.find(
      { name: new RegExp(searchText, "i") },
      { name: 0 }
    );
    return arr.map((i) => i.id);
  } catch (err) {
    console.log(err);
    return []; // or handle the error in a different way
  }
};
