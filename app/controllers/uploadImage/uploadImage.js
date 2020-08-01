

const uploads = async (req, res) => {
    let PATH = "E:\\sportApp\\latest\\fantasyNode\\uploads\\"
    res.status(200).json({message:"Image Uploaded",link:`${PATH}${req.file.filename}`});
}

module.exports = uploads