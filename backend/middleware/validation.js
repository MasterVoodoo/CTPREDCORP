const validateBuilding = (req, res, next) => {
  const { name, address, description } = req.body;

  if (!name || !address) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Name and address are required',
    });
  }

  if (name.length < 3) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Name must be at least 3 characters long',
    });
  }

  next();
};

const validateUnit = (req, res, next) => {
  const { building_id, floor, unit_number, size, price_per_sqm } = req.body;

  if (!building_id || floor === undefined || !unit_number) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Building ID, floor, and unit number are required',
    });
  }

  if (size && size <= 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Size must be greater than 0',
    });
  }

  if (price_per_sqm && price_per_sqm <= 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Price per sqm must be greater than 0',
    });
  }

  next();
};

const validateAppointment = (req, res, next) => {
  const { name, email, phone, preferred_date, preferred_time } = req.body;

  if (!name || !email || !phone || !preferred_date || !preferred_time) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Name, email, phone, preferred date, and preferred time are required',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid email format',
    });
  }

  next();
};

module.exports = {
  validateBuilding,
  validateUnit,
  validateAppointment,
};
