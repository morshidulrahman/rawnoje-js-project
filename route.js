const { bookHandler } = require("./route/handeler/bookhandeler");
const { reviewHandeler } = require("./route/handeler/reviewhandeler");
const { Testhandeler } = require("./route/handeler/TestHandeler");

const route = {
  test: Testhandeler,
  book: bookHandler,
  review: reviewHandeler,
};

module.exports = route;
