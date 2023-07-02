const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden-err');
const BadRequest = require('../errors/bad-request-err');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при создании карточки'));
        return;
      }
      next(err);
    });
};

const getCards = (req, res, next) => {
  Card.find({}, 'name link owner likes')
    .then((card) => {
      res.status(200);
      res.send({ data: card });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('Запрашиваема карточка не найдена'))
    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        Card.deleteOne(card)
          .then((userCard) => res.status(200).send(userCard));
      } else {
        throw new Forbidden('Нельзя удалить карточку, которую создали не вы');
      }
    })
    .catch(next);
};

const like = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка, которую вы хотите лайкнуть не найдена'))
    .then((newData) => res.send({ data: newData }))
    .catch(next);
};

const dislike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка, которую вы хотите возненавидеть не найдена :)'))
    .then((newData) => res.send({ data: newData }))
    .catch(next);
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  like,
  dislike,
};
