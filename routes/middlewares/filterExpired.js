const isAfter = require('date-fns/isAfter');

const Vote = require('../../models/Vote');

const { SERVER_ERROR } = require('../../constants/errorMessage');

async function filterNotExpired(req, res, next) {
  const currentDate = new Date().toISOString();

  try {
    const allVotes = await Vote.find({})
      .populate('createUser', 'email');
    const votes = allVotes
      .filter(vote => isAfter(new Date(vote.expiredAt), new Date(currentDate)));

    res.locals.filtered = votes;
  } catch (err) {
    console.error(err);

    if (err instanceof mongoose.Error.ValidationError) {
      for (field in err.errors) {
        return next(500, err.errors[field].message);
      }
    }

    return next(createError(500, SERVER_ERROR));
  }

  next();
};

async function filterExpired(req, res, next) {
  const currentDate = new Date().toISOString();

  try {
    const allVotes = await Vote.find({})
      .populate('createUser', 'email');
    const votes = allVotes
      .filter(vote => isAfter(new Date(currentDate), new Date(vote.expiredAt)));

    res.locals.filtered = votes;
  } catch (err) {
    console.error(err);

    if (err instanceof mongoose.Error.ValidationError) {
      for (field in err.errors) {
        return next(500, err.errors[field].message);
      }
    }

    return next(createError(500, SERVER_ERROR));
  }

  next();
};

module.exports = {
  filterNotExpired,
  filterExpired,
};
