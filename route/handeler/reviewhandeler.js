const { createRandomString, parseJson } = require("../../helpers/utils");
const data = require("../../lib/data");

const handler = {};

handler.reviewHandeler = (request, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.includes(request.method)) {
    handler.review[request.method](request, callback);
  } else {
    callback(405, { message: "Method not allowed" });
  }
};

handler.review = {};

handler.review.post = (request, callback) => {
  const bookRating =
    typeof request.body?.bookRating == "number" &&
    request.body.bookRating >= 0 &&
    request.body.bookRating <= 5
      ? request.body.bookRating
      : false;

  const BookComments =
    typeof request.body?.BookComments === "string" &&
    request.body.BookComments.trim().length > 0
      ? request.body.BookComments.trim()
      : false;

  const bookId =
    typeof request.body.bookId === "string" &&
    request.body.bookId.trim().length == 20
      ? request.body.bookId
      : false;

  if (!bookRating) {
    callback(400, { error: "bookRating  must be 5 or down" });
    return;
  }

  if (bookRating && BookComments && bookId) {
    const reviewData = {
      bookRating,
      BookComments,
      bookId,
    };

    data.read("reviews", bookId, (err) => {
      if (err) {
        data.create("reviews", bookId, reviewData, (err) => {
          if (!err) {
            callback(200, {
              message: "Review done successfully",
              data: reviewData,
            });
          } else {
            callback(500, { error: "Could not  review" });
          }
        });
      } else {
        callback(400, { message: "A book with the same ID already exists" });
      }
    });
  } else {
    callback(400, { error: "Missing required fields" });
  }
};

handler.review.get = (request, callback) => {
  const bookId =
    typeof request.parseQuery.bookid === "string"
      ? request.parseQuery.bookid
      : false;

  if (bookId) {
    data.read("reviews", bookId, (err, u) => {
      const reviewData = { ...parseJson(u) };

      if (!err && reviewData) {
        callback(200, {
          message: "reviews retrieved successfully",
          data: reviewData,
        });
      } else {
        callback(404, {
          message: "reviews not found",
        });
      }
    });
  } else {
    callback(404, {
      message: "Something went wrong",
    });
  }
};

handler.review.put = (requestProperties, callback) => {
  const bookId =
    typeof requestProperties.parseQuery.bookid === "string"
      ? requestProperties.parseQuery.bookid
      : false;

  const bookRating =
    typeof requestProperties.body?.bookRating == "number" &&
    requestProperties.body.bookRating >= 0 &&
    requestProperties.body.bookRating <= 5
      ? requestProperties.body.bookRating
      : false;

  const BookComments =
    typeof requestProperties.body?.BookComments === "string" &&
    requestProperties.body.BookComments.trim().length > 0
      ? requestProperties.body.BookComments.trim()
      : false;

  if (bookId) {
    data.read("reviews", bookId, (err1, reviewdata) => {
      const reviewObject = { ...parseJson(reviewdata) };

      if (!err1) {
        if (BookComments) {
          reviewObject.BookComments = BookComments;
        }

        if (!bookRating) {
          callback(400, {
            error: "bookRating  must be 5 or down",
          });
          return;
        }

        if (bookRating) {
          reviewObject.bookRating = bookRating;
        }

        data.update("reviews", bookId, reviewObject, (err2) => {
          if (!err2) {
            callback(200, {
              message: "Review updated successfully",
              data: reviewObject,
            });
          } else {
            callback(500, {
              error: "There was a server side error!",
            });
          }
        });
      } else {
        callback(404, {
          message: "Review not found",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request",
    });
  }
};

handler.review.delete = (requestProperties, callback) => {
  const bookId =
    typeof requestProperties.parseQuery.bookid === "string"
      ? requestProperties.parseQuery.bookid
      : false;

  if (bookId) {
    data.read("reviews", bookId, (err1, bookData) => {
      if (!err1 && bookData) {
        data.delete("reviews", bookId, (err2) => {
          if (!err2) {
            callback(200, {
              message: "Reviews was successfully deleted!",
            });
          } else {
            callback(500, {
              error: "can not delete Reviews",
            });
          }
        });
      } else {
        callback(500, {
          error: "cannot Find the Reviews",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request!",
    });
  }
};

module.exports = handler;
