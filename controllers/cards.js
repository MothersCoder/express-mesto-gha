const Card = require('../models/card');

const ERROR = require('./errors');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({
    name, link, owner, validateBeforeSave: true,
  })
    .then((card) => {
      res.status(200);
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        ERROR.uploadData.message = Object.values(err.errors).map((error) => error.message).join(', ');
        return res.status(ERROR.uploadData.code).send({ message: `${ERROR.uploadData.message}` });
      }
      return res.status(ERROR.server.code).send({ message: `${ERROR.server.message}` });
    });
};

const getCards = (req, res) => {
  Card.find({}, 'name link owner likes')
    .then((card) => {
      res.status(200);
      res.send({ data: card });
    })
    .catch(() => res.status(ERROR.server.code).send({ message: `${ERROR.server.message}` }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        return res.status(ERROR.getData.code).send({ message: `Card for delete ${ERROR.getData.message}` });
      }
      return res.status(200).send(card);
    })
    .catch(() => {
      if (Card.findByIdAndRemove(undefined)) {
        ERROR.uploadData.message = 'Используется несуществующий ID карточки';
        return res.status(ERROR.uploadData.code).send({ message: `${ERROR.uploadData.message}` });
      }
      return res.status(ERROR.server.code).send({ message: `${ERROR.server.message}` });
    });
};

const like = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((newData) => {
      if (newData === null) {
        return res.status(ERROR.getData.code).send({ message: `Card for your like ${ERROR.getData.message}` });
      }
      return res.send({ data: newData });
    })
    .catch(() => {
      if (Card.findByIdAndUpdate(undefined)) {
        ERROR.uploadData.message = 'Используется несуществующий ID карточки';
        return res.status(ERROR.uploadData.code).send({ message: `${ERROR.uploadData.message}` });
      }
      return res.status(ERROR.server.code).send({ message: `${ERROR.server.message}` });
    });
};

const dislike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((newData) => {
      if (newData === null) {
        return res.status(ERROR.getData.code).send({ message: `Card for your dislike ${ERROR.getData.message}` });
      }
      return res.send({ data: newData });
    })
    .catch(() => {
      if (Card.findByIdAndUpdate(undefined)) {
        ERROR.uploadData.message = 'Используется несуществующий ID карточки';
        return res.status(ERROR.uploadData.code).send({ message: `${ERROR.uploadData.message}` });
      }
      return res.status(ERROR.server.code).send({ message: `${ERROR.server.message}` });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  like,
  dislike,
};