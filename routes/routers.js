import express from 'express';
import auth from '../middlewares/auth.js';
import UserController from '../controllers/userController.js';
import GalleryController from '../controllers/galleryController.js';
import multer from 'multer';

var storage = multer.diskStorage(
  {
    destination: './uploads/',
    filename: function (req, file, cb) {
      //req.body is empty...
      //How could I get the new_file_name property sent from client here?

      const splited = file.originalname.split('.');
      const ext = splited[splited.length - 1];
      if (ext === 'mp4') {
        const name = `video_${Date.now()}.${ext}`
        cb(null, name);
      }
      else {
        const name = `picture_${Date.now()}.${ext}`
        cb(null, name);
      }
    }
  }
);

var upload = multer({ storage: storage });
const router = express.Router();

const log = (req, res, next) => {
  console.log("\x1b[33m", req.method, req.url, "\x1b[0m");
  next();
}

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.raw({ limit: '20mb' }));
router.use('/uploads', express.static('uploads'))
router.use(log);

router.get('/api/users', auth.verify, UserController.getAll);
router.post('/api/reg', UserController.regUser);
router.post('/api/login', UserController.loginUser);
router.get('/api/user/:id', auth.verify, UserController.getUser);
router.delete('/api/user/:id', auth.verify, UserController.deleteUser);

router.post('/api/exhibition', auth.verify, GalleryController.addExhibition);
router.get('/api/exhibitions', GalleryController.getAllExhibitions)
router.get('/api/exhibition/:id', GalleryController.getExhibitionById)
router.get('/api/pictures/:exhibitionId', GalleryController.getPictures)
router.post('/api/picture', upload.single('imagefile'), GalleryController.addPicture)
router.delete('/api/picture/:id', GalleryController.deletePicture)
router.post('/api/video', upload.single('videofile'), GalleryController.addArVideo)
router.post('/api/generate/:exhibitionId', GalleryController.generateTargets)

export default router