const checkDateFormat = date => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  const month = parseInt(date.substring(5, 7));
  if (month < 1 || month > 12) {
    return false;
  }

  const day = parseInt(date.substring(8, 10));
  if (day < 1 || day > 31) {
    return false;
  }

  return dateRegex.test(date);
};

module.exports = checkDateFormat;
