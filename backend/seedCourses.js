
require("dotenv").config();

const mongoose = require("mongoose");
const Course = require("./models/Course");
const User = require("./models/User");

const courses = [
  {
    title: "Lập trình Web cơ bản",
    category: "Lập trình Web",
    description:
      "Học HTML, CSS, JavaScript và cách xây dựng một website hoàn chỉnh từ cơ bản đến nâng cao.",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    price: 0,
  },
  {
    title: "Lập trình Java",
    category: "Lập trình",
    description:
      "Tìm hiểu ngôn ngữ Java, biến, vòng lặp, hàm, lập trình hướng đối tượng và xây dựng ứng dụng.",
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    price: 0,
  },
  {
    title: "Cơ sở dữ liệu SQL",
    category: "Cơ sở dữ liệu",
    description:
      "Học cách thiết kế cơ sở dữ liệu, tạo bảng, truy vấn SQL, JOIN và quản lý dữ liệu.",
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d",
    price: 0,
  },
  {
    title: "Lập trình Python",
    category: "Lập trình",
    description:
      "Làm quen với Python, kiểu dữ liệu, câu điều kiện, vòng lặp, hàm và các bài tập thực hành.",
    thumbnail:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935",
    price: 0,
  },
  {
    title: "Mạng máy tính",
    category: "Mạng máy tính",
    description:
      "Tìm hiểu mô hình OSI, TCP/IP, địa chỉ IP, Router, Switch và cấu hình mạng cơ bản.",
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    price: 0,
  },
  {
    title: "Phân tích thiết kế phần mềm",
    category: "Phân tích thiết kế",
    description:
      "Tìm hiểu quy trình phát triển phần mềm, UML, Use Case, Activity Diagram và thiết kế hệ thống.",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    price: 0,
  },
];

async function seedCourses() {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      process.env.MONGO_URL;

    if (!mongoUri) {
      throw new Error(
        "Không tìm thấy biến kết nối MongoDB trong file .env"
      );
    }

    await mongoose.connect(mongoUri);
    console.log("Đã kết nối MongoDB");

    const teacher = await User.findOne({
      role: { $in: ["teacher", "admin"] },
      isActive: { $ne: false },
    });

    if (!teacher) {
      throw new Error(
        "Chưa có tài khoản Teacher hoặc Admin. Hãy tạo tài khoản trước."
      );
    }

    for (const item of courses) {
      await Course.findOneAndUpdate(
        { title: item.title },
        {
          ...item,
          teacher: teacher._id,
          isPublished: true,
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log("Đã thêm/cập nhật:", item.title);
    }

    console.log("Hoàn thành thêm 6 khóa học mẫu!");
  } catch (error) {
    console.error("Lỗi seed khóa học:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCourses();
