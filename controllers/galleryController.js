import GalleryRepository from "../repositories/galleryRepository.js";
import Stream from "stream";

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

  static attachTargetFile(req, res) {
    GalleryRepository.addTargetFile(req.params.exhibitionId, req.body)
      .then(result => {
        res.json(result)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }

  static getTargetFile(req, res) {
    GalleryRepository.getTargetFile(req.params.exhibitionId)
      .then(result => {
        var fileContents = Buffer.from(result);
  
        var readStream = new Stream.PassThrough();
        readStream.end(fileContents);
      
        res.set('Content-disposition', 'attachment; filename=' + 'targets.mind');
        res.set('Content-Type', 'text/plain');
      
        readStream.pipe(res);
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }
}