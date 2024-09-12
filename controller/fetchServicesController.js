const Franchise = require("../db/models/franchise");
const panCardUsers = require("../db/models/pancard");

const getPancardDetails = async (req, res) => {
  try {
    const user = req.user;
    const { sort, page, pageLimit, pantype, isDuplicateOrChange } = req.query;

    console.log("req.query", req.query);

    if (!page || !pageLimit) {
      return res
        .status(400)
        .json({ error: "page and pageLimit query parameters are required" });
    }

    const pageNumber = parseInt(page, 10);
    const pageLimitNumber = parseInt(pageLimit, 10);

    const limit = pageLimitNumber;
    const offset = (pageNumber - 1) * limit;

    let where = {}

    if(pantype === "duplicateOrChangePancard") {
        where = { panType: pantype};   
        if(isDuplicateOrChange){
          where = { panType: pantype, isDuplicateOrChangePan: isDuplicateOrChange };
        } 
    } 
    else if(pantype){
      where = { panType : pantype}
     }

    const franchise = await Franchise.findOne({
      where: { email: user.email },
    });

    if (!franchise) {
      return res.status(404).json({ message: "Franchise not found" });
    }

    const PancardUser = panCardUsers();

    const data = await PancardUser.findAndCountAll({
      where: where,
      limit,
      offset,
      order: sort ? [[sort, "ASC"]] : undefined,
    });
    if (data.rows.length === 0) {
      return res.status(404).json({ message: "Page not found" });
    }

    return res.status(200).json({
      data: data.rows,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / limit),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching pancard details:", error);
    res.status(500).json({ error: "Failed to fetch pancard details" });
  }
};

module.exports = { getPancardDetails };
