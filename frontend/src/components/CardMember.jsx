import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { pathImgFromIndex } from "../utils/constants";
import Avatar from "@mui/material/Avatar";

export default function CardMember({ student }) {
    if (!student) return null;  // Kiểm tra nếu student không tồn tại

    const { name, des, id, dept, img } = student; // Destructuring props student

    return (
        <Card className="card-member" sx={{ maxWidth: 345 }}>
            <CardActionArea>
                <Avatar
                    alt={name || "Student"} // Đảm bảo alt luôn có giá trị hợp lý
                    src={img ? pathImgFromIndex + img : "/default-avatar.jpg"} // Đảm bảo hình ảnh có fallback
                    sx={{ width: 100, height: 100 }}
                />
                <CardContent className="content">
                    <Typography
                        gutterBottom
                        className="name"
                        variant="h5"
                        component="div"
                    >
                        {name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" className="des">
                        {des}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" className="id">
                        {id}
                    </Typography>

                    <Typography variant="h5" color="text.secondary" className="dept">
                        Khoa {dept}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
