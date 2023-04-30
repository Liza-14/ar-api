import UserRepository from '../repositories/userRepository.js'
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

function generateToken(payload) {
  const secretWord = "secretkey";
  return jwt.sign({ data: payload }, secretWord, { expiresIn: '24h' });
};

export default class UserController {
  
  static getAll(req, res) {
    UserRepository.getAll()
      .then(users => {
        res.json(users)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  };

  static regUser(req, res) {
    bcrypt.hash(req.body.password, 10, (error, hash) => {
      if (error) res.status(500).send(error)
      else {
        UserRepository.regUser({ ...req.body, password: hash })
          .then(user => {
            res.status(200).json({ user, token: generateToken(user.id) })
          })
          .catch(err => {
            res.status(500).json(err.detail)
            console.log(err)
          })
      }
    })
  }

  static loginUser(req, res) {
    UserRepository.getUserByEmail(req.body.email)
      .then(user => {
        if (!user) res.status(404).json({ error: 'No user with that email found' })
        else {
          bcrypt.compare(req.body.password, user.password, (error, match) => {
            if (error) {
              res.status(500).json(error)
            }
            else if (match) {
              user.password = undefined;
              res.status(200).json({ user, token: generateToken(user.id) })
            }
            else res.status(403).json({ error: 'Password do not match' })
          })
        }
      })
      .catch(error => {
        console.log("catch")
        console.log(error)
        res.status(500).json(error)
      })
  }

  static deleteUser(req, res) {
    UserRepository.deleteUserById(req.params.id)
      .then(() => {
        res.sendStatus(204)
      })
      .catch(err => {
        res.status(500).json(err.detail)
        console.log(err)
      })
  }

  static getUser(req, res) {
    res.json(req.user)
  }
}
