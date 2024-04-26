"use strict";
const address = require("../models/address.vn.model");
exports.getAllCity = async (req, res) => {
  try {
    const docs = await address.find({});
    let data = docs.map((doc) => ({ name: doc.city, code: doc.code }));
    res.status(200).json({ data: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllDistrict = async (req, res) => {
  try {
    const docs = await address.findOne({ code: req.params.code });

    if (!docs) {
      res.status(404).json({ msg: "City not found" });
      return;
    }

    if (!docs.district) {
      res.status(404).json({ msg: "District not found" });
      return;
    }

    let data = docs.district.map((district) => ({
      name: district.name,
      code: district.code,
    }));

    res.status(200).json({ data: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllWard = async (req, res) => {
  try {
    const docs = await address.findOne({ code: req.body.codecity });

    if (!docs) {
      res.status(404).json({ msg: "City not found" });
      return;
    }

    if (!docs.district) {
      res.status(404).json({ msg: "District not found" });
      return;
    }

    let district = docs.district.find(
      (district) => district.code === req.body.codedistrict
    );

    if (district) {
      res.status(200).json({ data: district.ward });
    } else {
      res.status(404).json({ msg: "District not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
