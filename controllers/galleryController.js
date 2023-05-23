import GalleryRepository from "../repositories/galleryRepository.js";
import Stream from "stream";
import fs from "fs";
import { OfflineCompiler } from 'mind-ar/src/image-target/offline-compiler.js';

import { writeFile } from 'fs/promises'
import { loadImage } from 'canvas';
import probe from 'node-ffprobe';
import ffprobeInstaller from '@ffprobe-installer/ffprobe'
import { error } from "console";

probe.FFPROBE_PATH = ffprobeInstaller.path

const imagePaths = ['examples/image-tracking/assets/card-example/card.png'];

export default class GalleryController {

  static addExhibition(req, res) {
    GalleryRepository.addExhibition(req.user.id, req.body)
      .then(result => {
        res.json(result)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }

  static getAllExhibitions(req, res) {
    GalleryRepository.getAllExhibitions()
      .then(result => {
        res.json(result)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }

  static getExhibitionById(req, res) {
    GalleryRepository.getExhibitionById(req.params.id)
      .then(result => {
        res.json(result)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }

  static getPictures(req, res) {
    GalleryRepository.getPictures(req.params.exhibitionId)
      .then(async pictures => {
        let videos = await Promise.all( pictures.map(x => GalleryRepository.getVideos(x.id)))
        videos.filter(x => x.length)
          .forEach(v => {
            const pic = pictures.find(x => x.id == v[0].pictureid);
            pic.videos = v;
          });
        res.json(pictures)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }

  static getPictureById(req, res) {
    GalleryRepository.getPictureById(req.params.id)
      .then(async picture => {
        let videos = await GalleryRepository.getVideos(picture.id)
        picture.videos = videos;
        res.json(picture)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }

  static addPicture(req, res) {
    loadImage(req.file.path)
      .then(img => {
        const heightRate = img.height/img.width;
        return GalleryRepository.addPicture({ ...req.body, image: req.file.path, height: heightRate })
      })
      .then(result => {
        res.json(result)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }

  static async deletePicture(req, res) {
    try {
      const videos = await GalleryRepository.getVideos(req.params.id);

      await Promise.all(videos.map(v => 
        GalleryRepository.deleteVideo(v.id)
          .then(() => fs.unlinkSync(v.path))
      ))

      const pic = await GalleryRepository.deletePicture(req.params.id);
      fs.unlinkSync(pic.image);
      res.json(pic)
    }
    catch(error) {
      console.error(error)
      res.sendStatus(500);
    }
  }

  static deleteVideo(req, res) {
    GalleryRepository.deleteVideo(req.params.id)
      .then(result => {
        fs.unlinkSync(result.path);
        res.json(result)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }

  static async deleteExhibition(req, res) {
    try {
      const pics = await GalleryRepository.getPictures(req.params.id);
      await Promise.all(pics.map(async pic => {
        const videos = await GalleryRepository.getVideos(pic.id);
        videos && await Promise.all(videos.map(v => GalleryRepository.deleteVideo(v.id)
          .then((video) => fs.unlinkSync(video.path))))

        await GalleryRepository.deletePicture(pic.id);
        fs.unlinkSync(pic.image);
      }))

      await GalleryRepository.deleteExhibition(req.params.id);
      fs.existsSync(`uploads/targets_${req.params.id}`) && fs.unlinkSync(`uploads/targets_${req.params.id}`)
      res.json();
    }
    catch(error) {
      console.error(error)
      res.sendStatus(500);
    }
  }

  static addArVideo(req, res) {
    GalleryRepository.addArVideo(req.body.pictureId, req.file.path)
      .then(result => {
          res.json(result)
        })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }

  static async generateTargets(req, res) {
    GalleryRepository.getPictures(req.params.exhibitionId)
      .then(async result => {
        const images = await Promise.all(result.map(picture => loadImage(picture.image)));
        const compiler = new OfflineCompiler();
        compiler.compileImageTargets(images, (m) => {
          res.write(Math.round(m) + '')
        })
          .then(async () => {
            const buffer = compiler.exportData();
            await writeFile(`uploads/targets_${req.params.exhibitionId}.mind`, buffer);
          })
          .catch((e) => {
            console.error(e)
          res.sendStatus(500);
          })
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }

  static createSurvey(req, res) {
    GalleryRepository.createSurvey(req.body)
      .then(result => {
        res.json(result)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }

  static getSurveysForExhibition(req, res) {
    GalleryRepository.getSurveysForExhibition(req.params.exhibitionId)
      .then(result => {
        res.json(result)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }
}