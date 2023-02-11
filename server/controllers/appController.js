const MetaDataNft = require("../models/models1")

const getTokenData = async (req, res) => {
    try {
        const cid = req.path
        const metaData = await MetaDataNft.findOne({"tokenId": 1111})
        res.status(200).json(metaData)
    } catch(error) {
        res.status(404).json({message: error.message})
    }
}

module.exports = {
    getTokenData,
};