const mongoose = require("mongoose")

const MetaDataNft = mongoose.model('MetaDataNft', new mongoose.Schema({ tokenId: Number, metadata: Object}), 'metadatanfts');

module.exports = {
    MetaDataNft
};