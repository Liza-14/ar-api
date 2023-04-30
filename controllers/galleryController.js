import GalleryRepository from "../repositories/galleryRepository.js";
import Stream from "stream";
import fs from "fs";
import { OfflineCompiler } from 'mind-ar/src/image-target/offline-compiler.js';

import { writeFile } from 'fs/promises'
import { loadImage } from 'canvas';

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
      .then(result => {
        res.json(result)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }

  static addPicture(req, res) {
    
    GalleryRepository.addPicture({ ...req.body, image: req.file.path, height: 1 })
      .then(result => {
        res.json(result)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }

  static deletePicture(req, res) {
    GalleryRepository.deletePicture(req.params.id)
      .then(result => {
        fs.unlinkSync(result.image);
        result.video && fs.unlinkSync(result.video);
        res.json(result)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }

  static addArVideo(req, res) {
    console.log(req.body)
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
        console.log(req.params.exhibitionId);
        console.log(images);
        const compiler = new OfflineCompiler();
        await compiler.compileImageTargets(images, console.log);

        const buffer = compiler.exportData();
        await writeFile(`uploads/targets_${req.params.exhibitionId}.mind`, buffer);
        res.json(result)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }
}