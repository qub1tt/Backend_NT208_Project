"use strict";
const publisher = require("../models/publisher.model");
exports.getPublisher = async (req, res) => {
  try {
    const docs = await publisher.find({});
    res.status(200).json({ data: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
exports.getAll = async (req, res) => {
  try {
    const page = req.params.page;
    if (!page) {
      return res.status(400).json({ msg: "Page parameter is required" });
    }

    const count = await publisher.countDocuments({});
    const totalPage = Math.ceil(count / 9);

    if (page < 1 || page > totalPage) {
      return res.status(400).json({ msg: "Invalid page number" });
    }

    const docs = await publisher
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
    const result = await publisher.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ msg: "Publisher not found" });
    }
    res.status(200).json({ name: result.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.getIDBySearchText = async (searchText) => {
  try {
    const arr = await publisher.find(
      { name: new RegExp(searchText, "i") },
      { name: 0 }
    );
    return arr.map((i) => i.id);
  } catch (err) {
    console.error(err);
    return [];
  }
};
