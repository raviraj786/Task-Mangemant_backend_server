const { models } = require("mongoose");

module.exports.sendResponse = (res, status, message, data) => {
  res.status(status).send({
    status: status,
    message: message,
    data: data,
  });
};

module.exports.sendErrorResponse = (res, status, error) => {
  let message = "internel server not working";

  switch (status) {
    case 400:
      message = "Bad Request: missing or invalid parameter";
      break;
    case 401:
      message = "Unauthorized: Access denied";
      break;
    case 403:
      message = "Forbidden: You don't have permission to access this resource";
      break;
    case 404:
      message = "Not Found: The requested resource was not found";
      break;
    case 409:
      message =
        "Conflict: The requested resource already exists or is in a conflicting state.";
      break;
    case 500:
      message = "Internal Server Error: Something went wrong on the server";
      break;

    default:
      break;
  }

  res.status(status).send({
    status: status,
    message: message,
    error: error,
  });
};
