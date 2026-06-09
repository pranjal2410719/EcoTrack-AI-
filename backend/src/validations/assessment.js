const { body, validationResult } = require("express-validator");

const assessmentFields = [
  body("transport").isNumeric().withMessage("transport must be a number"),
  body("electricity").isNumeric().withMessage("electricity must be a number"),
  body("diet")
    .isIn(["non-veg", "vegetarian", "vegan"])
    .withMessage("diet must be non-veg, vegetarian, or vegan"),
  body("flights").isInt({ min: 0 }).withMessage("flights must be a non-negative integer"),
  body("shopping").isInt({ min: 0 }).withMessage("shopping must be a non-negative integer"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array().map((e) => e.msg).join(", "),
      });
    }
    next();
  },
];

const validateAssessment = assessmentFields;
const validateCalculate = assessmentFields; // Same fields for calculate endpoint

const validateAnalyze = [
  body("assessmentId").notEmpty().withMessage("assessmentId is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array().map((e) => e.msg).join(", "),
      });
    }
    next();
  },
];

module.exports = { validateAssessment, validateCalculate, validateAnalyze };
