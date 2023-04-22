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
    console.log(exhibition)
    return exhibition
  }

  static async addTargetFile(exhibitionId, binnaryString) {
    console.log(Buffer.from(binnaryString));
    await pool.query("UPDATE exhibitions SET targetFile = $1 WHERE id = $2", [ Buffer.from(binnaryString),  exhibitionId]);
  }

  static async getTargetFile(exhibitionId) {

    return (await pool.query("SELECT targetfile FROM exhibitions WHERE id = $1", [exhibitionId]))
      .rows[0]
      .targetfile;
  }
}