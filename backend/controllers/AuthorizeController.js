const jwt = require('jsonwebtoken');
const User = require('../models/User');
const argon2 = require('argon2');
const path = require('path');

const generateToken = (payload) => {
    const { id, username } = payload;
    const accessToken = jwt.sign({ id, username },
        process.env.ACCESS_TOKEN_SECRET
    );
    return accessToken;
};

const checkEmail = (email) => {
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return true;
    }
    return false;
}

const checkPhoneNumber = (phoneNumber) => {
    if(/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phoneNumber)) {
        return true;
    }
    return false;
}

const getDefaultAvatarUrl = (fullName) => {
    const splited = fullName.split(' ');
    const character = splited[splited.length - 1].toUpperCase();

    const avatarUrl = `http://res.cloudinary.com/dqukpnbqr/image/upload/v1/avatar/not_avatar/${character}.png`;
    return avatarUrl;
};

class AuthorizeController {
    signup = async (req, res) => {
        const { username, password: rawPassword, email, phoneNumber, fullName } = req.body;
    
        try {
            // Validate email
            if (!checkEmail(email)) {
                throw new Error("not an email");
            }
    
            // Validate phone number
            if (!checkPhoneNumber(phoneNumber)) {
                throw new Error("not a phone number");
            }
    
            // Kiểm tra xem username đã tồn tại chưa
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                throw new Error("Username is already taken !");
            }
    
            // Hash mật khẩu
            const password = await argon2.hash(rawPassword);
    
            // Lấy avatar mặc định từ tên người dùng
            const avatarUrl = getDefaultAvatarUrl(fullName); 
            const ifHasAvatar = false;
    
            // Tạo người dùng mới
            const newUser = new User({
                username,
                password,
                fullName,
                email,
                phoneNumber,
                avatarUrl,
                ifHasAvatar
            });
    
            await newUser.save();
    
            return res.status(200).json({
                success: true,
                message: "Người dùng đã được tạo !"
            });
    
        } catch (err) {
            // Bắt lỗi cụ thể
            if (err.message === "Username is already taken !") {
                return res.status(400).json({
                    success: false,
                    message: "Tên tài khoản đã tồn tại !"
                });
            } else if (err.message === 'not an email') {
                return res.status(400).json({
                    success: false,
                    message: "Email sai định dạng !"
                });
            } else if (err.message === 'not a phone number') {
                return res.status(400).json({
                    success: false,
                    message: "Số điện thoại sai định dạng !"
                });
            } else {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Lỗi máy chủ khi tạo tài khoản !"
                });
            }
        }
    };    

    login = async(req, res) => {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username }, 'username password');

            if(!user) {
                throw new Error("User doesn't exist");
            }

            const passwordValid = await argon2.verify(user.password, password);
            if(!passwordValid) {
                throw new Error("Wrong password");
            }

            const token = generateToken(user);
            user.password = undefined;
            user.username = undefined;

            res.status(200).json({ success: true, token, user });
        }
        catch (err) {
            console.log(err);

            if(err.message === "Wrong password") {
                res.status(400).json({ success: false, message: 'Sai mật khẩu !' });
            }
            else if(err.message === "User doesn't exist") {
                res.status(400).json({ success: false, message: 'Người dùng này không tồn tại !' });
            }
            else {
                res.status(400).json({ success: false, message: 'Lỗi khi đăng nhập !' });
            }
        }
    };
}

module.exports = new AuthorizeController();