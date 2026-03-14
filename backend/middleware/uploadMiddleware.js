const multer = require('multer');
const path = require('path');

// 1. Súwret qay jerde hám qanday at penen saqlanadı?
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/'); // uploads papkasına saqlaw
    },
    filename(req, file, cb) {
        // Fayl atın unikal qılıw: image-milisekud.jpg
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// 2. Tek súwretlerdi qabıllaw (jpg, png, jpeg)
const checkFileType = (file, cb) => {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Qátelik: Tek súwretler (Images) júkleniwi múmkin!');
    }
};

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;