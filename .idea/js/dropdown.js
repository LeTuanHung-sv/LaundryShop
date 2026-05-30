// File này xử lý riêng biệt cho Avatar, Chuông thông báo và Tự động load dữ liệu trang chủ
document.addEventListener("DOMContentLoaded", function () {

    // 1. TỰ ĐỘNG HIỂN THỊ DỮ LIỆU NGAY KHI VỪA MỞ TRANG (F5)
    if (typeof renderAllData === "function") {
        renderAllData();
    }

    // 2. BỘ ĐIỀU KHIỂN CLICK AVATAR VÀ CHUÔNG THÔNG BÁO
    const notiBtn = document.getElementById("noti-btn");
    const notiPanel = document.getElementById("noti-panel");
    const avatarBtn = document.getElementById("avatar-btn");
    const profilePanel = document.getElementById("profile-panel");

    if (notiBtn && notiPanel) {
        notiBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            if (profilePanel) profilePanel.classList.remove("show"); // Ẩn panel avatar nếu đang mở
            notiPanel.classList.toggle("show");
        });
    }

    if (avatarBtn && profilePanel) {
        avatarBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            if (notiPanel) notiPanel.classList.remove("show"); // Ẩn panel thông báo nếu đang mở
            profilePanel.classList.toggle("show");
        });
    }

    // Tự động đóng menu thả xuống nếu click chuột ra ngoài vùng trống bất kỳ
    document.addEventListener("click", function (event) {
        if (notiPanel && !notiBtn.contains(event.target) && !notiPanel.contains(event.target)) {
            notiPanel.classList.remove("show");
        }
        if (profilePanel && !avatarBtn.contains(event.target) && !profilePanel.contains(event.target)) {
            profilePanel.classList.remove("show");
        }
    });
});