import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/userRepository.js';

const tokenSecret = "secretkey"
const exports = {}

exports.verify = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) res.sendStatus(401)
  else {
    jwt.verify(token.split(" ")[1], tokenSecret, (error, value) => {
      if (error) {
        res.sendStatus(401);
        return;
      }
      UserRepository.getUserById(value.data)
        .then(user => {
          req.user = user;
          next();
        })
        .catch(err => res.status(401));
    })
  }
}
export default exports