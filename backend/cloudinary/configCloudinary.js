const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dqukpnbqr',
    api_key: '172865392199424',
    api_secret: '4IoPqTIMkXaf6IcRebba0F8KyRc',
});

module.exports = { cloudinary };