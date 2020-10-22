

const uploads = async (req, res) => {
    res.status(200).json({message:"Image Uploaded",link:`${process.env.IMG_PATH}${req.file.filename}`});
}

module.exports = uploads