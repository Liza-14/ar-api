import GalleryRepository from "../repositories/galleryRepository.js";

export default class GalleryController {

  static addExhibition(req, res) {
    console.log(req.user.id)
    GalleryRepository.addExhibition(req.user.id, req.body)
      .then(result => {
        res.json(result)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }

  static attachTargetFile(req, res) {
    console.log(req.body)
    GalleryRepository.addTargetFile(req.params.exhibitionId, req.body)
      .then(result => {
        res.json(result)
      })
      .catch(error => {
        console.error(error)
        res.sendStatus(500);
      })
  }
}