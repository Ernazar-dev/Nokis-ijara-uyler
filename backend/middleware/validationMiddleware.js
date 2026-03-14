const Joi = require("joi");

const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const validateHouse = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(5).required(),
    price: Joi.number().min(0).required(),
    address: Joi.string().required(),
    phone: Joi.string().required(), // Regex qo'shsa ham bo'ladi
    description: Joi.string().allow(""),
    rooms: Joi.number().integer().min(1).max(20).required(),
    amenities: Joi.string().allow(""), // Frontenddan string keladi
    lat: Joi.string().required(),
    lng: Joi.string().required(),
  });

  // FormData ichidagi req.body matn bo'lib kelishi mumkin, shuning uchun validate qilishdan oldin turni tekshirish kerak
  const { error } = schema.validate(req.body, { allowUnknown: true }); // allowUnknown: rasmlar alohida keladi
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { validateRegister, validateHouse };
