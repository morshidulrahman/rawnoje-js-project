const { createRandomString, parseJson } = require("../../helpers/utils");
const data = require("../../lib/data");

const handler = {};

handler.bookHandler = (request, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.includes(request.method)) {
    handler.book[request.method](request, callback);
  } else {
    callback(405, { message: "Method not allowed" });
  }
};

handler.book = {};

handler.book.post = (request, callback) => {
  const bookName =
    typeof request.body?.bookName === "string" &&
    request.body.bookName.trim().length > 0
      ? request.body.bookName.trim()
      : false;

  const bookDesc =
    typeof request.body?.bookDesc === "string" &&
    request.body.bookDesc.trim().length > 0
      ? request.body.bookDesc.trim()
      : false;

  const author =
    typeof request.body?.author === "string" &&
    request.body.author.trim().length > 0
      ? request.body.author.trim()
      : false;

  if (bookDesc && bookName && author) {
    const bookId = createRandomString(20);

    const bookObject = {
      bookId,
      bookName,
      bookDesc,
      author,
    };

    data.read("books", bookId, (err) => {
      if (err) {
        // If book ID does not exist, create a new book
        data.create("books", bookId, bookObject, (err) => {
          if (!err) {
            callback(200, {
              message: "Book created successfully",
              bookData: bookObject,
            });
          } else {
            callback(500, { error: "Could not create the book" });
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

handler.book.get = (request, callback) => {
  const bookId =
    typeof request.parseQuery.bookid === "string"
      ? request.parseQuery.bookid
      : false;

  if (bookId) {
    data.read("books", bookId, (err, u) => {
      const bookData = { ...parseJson(u) };

      if (!err && bookData) {
        callback(200, {
          message: "Book retrieved successfully",
          data: bookData,
        });
      } else {
        callback(404, {
          message: "Book not found",
        });
      }
    });
  } else {
    callback(404, {
      message: "Something went wrong",
    });
  }
};

handler.book.put = (requestProperties, callback) => {
  const bookId =
    typeof requestProperties.parseQuery.bookid === "string"
      ? requestProperties.parseQuery.bookid
      : false;

  const bookName =
    typeof requestProperties.body?.bookName === "string" &&
    requestProperties.body.bookName.trim().length > 0
      ? requestProperties.body.bookName.trim()
      : false;

  const bookDesc =
    typeof requestProperties.body?.bookDesc === "string" &&
    requestProperties.body.bookDesc.trim().length > 0
      ? requestProperties.body.bookDesc.trim()
      : false;

  if (bookId) {
    data.read("books", bookId, (err1, bookData) => {
      const bookObject = { ...parseJson(bookData) };

      if (!err1) {
        if (bookName) {
          bookObject.bookName = bookName;
        }

        if (bookDesc) {
          bookObject.bookDesc = bookDesc;
        }

        data.update("books", bookId, bookObject, (err2) => {
          if (!err2) {
            callback(200, {
              message: "Book updated successfully",
              updatedData: bookObject,
            });
          } else {
            callback(500, {
              error: "There was a server side error!",
            });
          }
        });
      } else {
        callback(404, {
          message: "Book not found",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request",
    });
  }
};

handler.book.delete = (requestProperties, callback) => {
  const bookId =
    typeof requestProperties.parseQuery.bookid === "string"
      ? requestProperties.parseQuery.bookid
      : false;

  if (bookId) {
    data.read("books", bookId, (err1, bookData) => {
      if (!err1 && bookData) {
        data.delete("books", bookId, (err2) => {
          if (!err2) {
            callback(200, {
              message: "Book was successfully deleted!",
            });
          } else {
            callback(500, {
              error: "can not delete book",
            });
          }
        });
      } else {
        callback(500, {
          error: "cannot Find the book",
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
