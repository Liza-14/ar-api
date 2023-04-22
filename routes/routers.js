import express from 'express';
import auth from '../middlewares/auth.js';
import UserController from '../controllers/userController.js';
import GalleryController from '../controllers/galleryController.js';

const router = express.Router();

const log = (req , res, next) => {
  console.log("\x1b[33m", req.method, req.url, "\x1b[0m");
  next();
}

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.raw({limit: '20mb'}));
router.use(log);

router.get('/api/users', auth.verify, UserController.getAll);
router.post('/api/reg', UserController.regUser);
router.post('/api/login', UserController.loginUser);
router.delete('/api/user/:id', auth.verify, UserController.deleteUser);

router.post('/api/exhibition', auth.verify, GalleryController.addExhibition);
router.post('/api/targetfile/:exhibitionId', auth.verify, GalleryController.attachTargetFile);
router.get('/api/exhibitions', GalleryController.getAllExhibitions)
router.get('/api/targetfile/:exhibitionId', GalleryController.getTargetFile)

export default router