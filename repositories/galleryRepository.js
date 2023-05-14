import pool from "../db/pool.js";

export default class GalleryRepository {

  static async addExhibition(authorId, exhibitionData) {
    const exhibition = (await pool.query(
        `INSERT INTO exhibitions (name, description, address, dateFrom, dateTo, authorId) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [   
            exhibitionData.name,
            exhibitionData.description,
            exhibitionData.address,
            exhibitionData.dateFrom,
            exhibitionData.dateTo,
            authorId
        ]))
        .rows[0];

    return exhibition
  }

  static async getAllExhibitions() {
    const exhibition = (await pool.query('SELECT id, name, description, address, dateFrom, dateTo, authorId FROM exhibitions')).rows;
    return exhibition
  }

  static async getExhibitionById(id) {
    const exhibition = (await pool.query('SELECT id, name, description, address, dateFrom, dateTo, authorId FROM exhibitions WHERE id = $1', [id])).rows[0];
    return exhibition
  }

  static async getTargetFile(exhibitionId) {

    return (await pool.query("SELECT targetfile FROM exhibitions WHERE id = $1", [exhibitionId]))
      .rows[0]
      .targetfile;
  }

  static async getPictures(exhibitionId) {
    return (await pool.query("SELECT * FROM pictures WHERE exhibitionid = $1", [exhibitionId]))
      .rows
  }

  static async addPicture({name, description, image, height, authorid, exhibitionid}) {
    return (await pool.query(
        `INSERT INTO public.pictures(name, description, image, authorid, exhibitionid, height)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, 
        [name, description, image, authorid, exhibitionid, height]))
      .rows[0]
  }

  static async deletePicture(id) {
    return (await pool.query(
        `DELETE FROM public.pictures
          WHERE id = $1
          RETURNING *;`, 
        [id]))
      .rows[0]
  }

  static async addArVideo(pictureId, videoPath, height) {
    return (await pool.query(
        `UPDATE public.pictures
          SET video = $2,
          height = $3
          WHERE id = $1
          RETURNING *;`, 
        [pictureId, videoPath, height]))
      .rows[0]
  }
}