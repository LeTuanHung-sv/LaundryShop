// ==============================================================================
// --- KHỞI TẠO DỮ LIỆU ĐỘNG TỪ LOCALSTORAGE (NẾU CHƯA CÓ SẼ LẤY MẪU MẶC ĐỊNH) ---
// ==============================================================================

// 1. Mảng dữ liệu gói dịch vụ
let services = JSON.parse(localStorage.getItem('laundry_services')) || [
    { id: 'SRV-001', name: 'Giặt sấy lấy liền', price: 15000, unit: 'kg' },
    { id: 'SRV-002', name: 'Giặt khô là hơi', price: 35000, unit: 'chiếc' },
    { id: 'SRV-003', name: 'Giặt gấu bông lớn', price: 50000, unit: 'con' }
];

// 2. Mảng dữ liệu quản lý hồ sơ khách hàng
let customers = JSON.parse(localStorage.getItem('laundry_customers')) || [
    { id: 'KH-1001', name: 'Lê Tuấn Hưng', phone: '0901234567', address: 'Quận 8, TP.HCM' },
    { id: 'KH-1002', name: 'Lê Tuấn David', phone: '0912345678', address: 'Quận 1, TP.HCM' }
];

// 3. Mảng dữ liệu các đơn giặt ủi
let orders = JSON.parse(localStorage.getItem('laundry_orders')) || [
    { id: '#ORD-7222', name: 'Lê Tuấn David', service: 'Giặt sấy lấy liền', price: 45000, status: 'Đang xử lý' },
    { id: '#ORD-1003', name: 'Lê Tuấn Hưng', service: 'Giặt khô là hơi', price: 170000, status: 'Đã hoàn thành' }
];

// Hàm ghi nhớ đồng bộ mảng dữ liệu vào sâu trong bộ nhớ trình duyệt (LocalStorage)
function saveDataToStorage() {
    localStorage.setItem('laundry_services', JSON.stringify(services));
    localStorage.setItem('laundry_customers', JSON.stringify(customers));
    localStorage.setItem('laundry_orders', JSON.stringify(orders));
}

// ==============================================================================
// --- KHỞI CHẠY HỆ THỐNG VÀ XỬ LÝ CHUYỂN TRANG SPA ---
// ==============================================================================
document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll(".page-section");

    // Xử lý click chuyển tab mượt mà trên Sidebar Menu trái
    menuItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");

            const targetId = this.getAttribute("data-target");
            sections.forEach(sec => {
                sec.classList.remove("active");
                if (sec.id === targetId) {
                    sec.classList.add("active");
                }
            });
        });
    });

    // TÍNH NĂNG THÊM: Click trúng các Thẻ thống kê Dashboard tự động nhảy nhanh trang
    const dashboardCards = document.querySelectorAll(".dashboard-card-click");
    dashboardCards.forEach(card => {
        card.addEventListener("click", function () {
            const targetPageId = this.getAttribute("data-target");
            const matchingMenu = document.querySelector(`.menu-item[data-target="${targetPageId}"]`);
            if (matchingMenu) matchingMenu.click();
        });
    });

    // Kích hoạt nạp dữ liệu vẽ bảng lần đầu tiên
    renderAllData();
    initModalControls();
    initSearchFilters();
});

// ==============================================================================
// --- HÀM VẼ GIAO DIỆN (RENDER DATA TO TABLES) ---
// ==============================================================================
function renderAllData() {
    // 1. Đếm số lượng cập nhật lên các thẻ Thống kê ở Trang chủ
    document.getElementById("dash-orders-count").innerText = orders.filter(o => o.status === "Đang xử lý").length;
    document.getElementById("dash-cust-count").innerText = customers.length;
    document.getElementById("dash-serv-count").innerText = services.length;
    
    // Tính tổng tiền doanh thu tích lũy động
    const totalRev = orders.reduce((sum, o) => sum + Number(o.price), 0);
    document.getElementById("dash-total-revenue").innerText = totalRev.toLocaleString('vi-VN') + "đ";

    // 2. Đổ dữ liệu đơn hàng vừa tiếp nhận ra bảng phụ ở Dashboard
    const recentOrdersTbody = document.getElementById("recent-orders-tbody");
    recentOrdersTbody.innerHTML = "";
    orders.slice(-4).reverse().forEach(order => {
        const statusClass = order.status === "Đã hoàn thành" ? "status-success" : "status-warning";
        recentOrdersTbody.innerHTML += `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.name}</td>
                <td>${order.service}</td>
                <td><span class="badge ${statusClass}">${order.status}</span></td>
            </tr>
        `;
    });

    // 3. Đổ dữ liệu tiến độ tỷ trọng dịch vụ ăn khách giả lập
    const progressList = document.getElementById("services-progress-list");
    progressList.innerHTML = "";
    services.slice(0, 3).forEach((srv, i) => {
        const fakePct = [70, 45, 20][i] || 15;
        progressList.innerHTML += `
            <div style="margin-bottom: 12px;">
                <div style="display:flex; justify-content:space-between; font-size:11pt; margin-bottom:4px;">
                    <span>${srv.name}</span>
                    <strong>${fakePct}%</strong>
                </div>
                <div style="background:#eef2f5; height:6px; border-radius:4px; overflow:hidden;">
                    <div style="background:var(--primary-color, #4361ee); width:${fakePct}%; height:100%;"></div>
                </div>
            </div>
        `;
    });

    // 4. Render bảng dữ liệu chính cho trang: Đơn giặt ủi
    const orderTableBody = document.getElementById("order-table-body");
    orderTableBody.innerHTML = "";
    orders.forEach((order, index) => {
        const statusClass = order.status === "Đã hoàn thành" ? "status-success" : "status-warning";
        orderTableBody.innerHTML += `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.name}</td>
                <td>${order.service}</td>
                <td>${Number(order.price).toLocaleString('vi-VN')}đ</td>
                <td><span class="badge ${statusClass}">${order.status}</span></td>
                <td>
                    <button class="action-btn btn-edit" onclick="editOrder(${index})"><i class="ri-edit-line"></i> Sửa</button>
                    <button class="action-btn btn-delete" onclick="deleteOrder(${index})"><i class="ri-delete-bin-line"></i> Xóa</button>
                </td>
            </tr>
        `;
    });

    // 5. Render bảng dữ liệu chính cho trang: Khách hàng
    const customerTableBody = document.getElementById("customer-table-body");
    customerTableBody.innerHTML = "";
    customers.forEach((cust, index) => {
        customerTableBody.innerHTML += `
            <tr>
                <td><strong>${cust.id}</strong></td>
                <td>${cust.name}</td>
                <td>${cust.phone}</td>
                <td>${cust.address}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editCustomer(${index})"><i class="ri-edit-line"></i> Sửa</button>
                    <button class="action-btn btn-delete" onclick="deleteCustomer(${index})"><i class="ri-delete-bin-line"></i> Xóa</button>
                </td>
            </tr>
        `;
    });

    // 6. Render bảng dữ liệu chính cho trang: Gói dịch vụ
    const servicesTableBody = document.getElementById("services-table-body");
    servicesTableBody.innerHTML = "";
    services.forEach((srv, index) => {
        servicesTableBody.innerHTML += `
            <tr>
                <td><strong>${srv.name}</strong></td>
                <td>${Number(srv.price).toLocaleString('vi-VN')}đ</td>
                <td>/${srv.unit}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editService(${index})"><i class="ri-edit-line"></i> Sửa</button>
                    <button class="action-btn btn-delete" onclick="deleteService(${index})"><i class="ri-delete-bin-line"></i> Xóa</button>
                </td>
            </tr>
        `;
    });

    // ĐỒNG BỘ: Tự động cập nhật menu thả xuống (Dropdown Select) trong Modal thêm Đơn hàng
    const selectService = document.getElementById("form-order-service");
    if(selectService) {
        selectService.innerHTML = "";
        services.forEach(srv => {
            selectService.innerHTML += `<option value="${srv.name}">${srv.name} (${srv.price}đ/${srv.unit})</option>`;
        });
    }
}

// ==============================================================================
// --- ĐIỀU KHIỂN ĐÓNG MỞ MODAL & SỰ KIỆN SUBMIT LƯU DỮ LIỆU ĐỘNG ---
// ==============================================================================
function initModalControls() {
    // Nút mở modal Đơn hàng
    document.getElementById("open-order-modal-btn").addEventListener("click", () => {
        document.getElementById("order-modal-title").innerText = "Thêm Đơn Giặt Ủi Mới";
        document.getElementById("order-form").reset();
        document.getElementById("form-order-id").value = "";
        document.getElementById("order-modal").classList.add("active");
    });

    // Nút mở modal Khách hàng
    document.getElementById("open-cust-modal-btn").addEventListener("click", () => {
        document.getElementById("cust-modal-title").innerText = "Đăng ký khách hàng mới";
        document.getElementById("cust-form").reset();
        document.getElementById("form-cust-id").value = "";
        document.getElementById("cust-modal").classList.add("active");
    });

    // Nút mở modal Dịch vụ
    document.getElementById("open-serv-modal-btn").addEventListener("click", () => {
        document.getElementById("serv-modal-title").innerText = "Thêm Gói Dịch Vụ Mới";
        document.getElementById("serv-form").reset();
        document.getElementById("form-serv-id").value = "";
        document.getElementById("serv-modal").classList.add("active");
    });

    // Đóng nhanh bất kỳ modal nào khi click nút Hủy bỏ
    document.querySelectorAll(".close-modal-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
        });
    });

    // --- FORM SUBMIT: XỬ LÝ LƯU (THÊM HOẶC SỬA) ĐƠN HÀNG ---
    document.getElementById("order-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const editId = document.getElementById("form-order-id").value;
        const name = document.getElementById("form-order-name").value;
        const service = document.getElementById("form-order-service").value;
        const price = document.getElementById("form-order-price").value;
        const status = document.getElementById("form-order-status").value;

        if (editId !== "") {
            // Đang ở chế độ Sửa
            const idx = Number(editId);
            orders[idx].name = name;
            orders[idx].service = service;
            orders[idx].price = Number(price);
            orders[idx].status = status;
        } else {
            // Đang ở chế độ Thêm mới -> Tự động sinh mã Đơn hàng ngẫu nhiên ngầu đét
            const randId = "#ORD-" + Math.floor(1000 + Math.random() * 9000);
            orders.push({ id: randId, name, service, price: Number(price), status });
        }
        
        saveDataToStorage(); // CẬP NHẬT GHI NHỚ VÀO TRÌNH DUYỆT
        renderAllData();     // Làm mới bảng ngay tắp lự
        document.getElementById("order-modal").classList.remove("active");
    });

    // --- FORM SUBMIT: XỬ LÝ LƯU KHÁCH HÀNG ---
    document.getElementById("cust-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const editId = document.getElementById("form-cust-id").value;
        const name = document.getElementById("form-cust-name").value;
        const phone = document.getElementById("form-cust-phone").value;
        const address = document.getElementById("form-cust-address").value;

        if (editId !== "") {
            const idx = Number(editId);
            customers[idx].name = name;
            customers[idx].phone = phone;
            customers[idx].address = address;
        } else {
            const randId = "KH-" + Math.floor(1000 + Math.random() * 9000);
            customers.push({ id: randId, name, phone, address });
        }
        
        saveDataToStorage();
        renderAllData();
        document.getElementById("cust-modal").classList.remove("active");
    });

    // --- FORM SUBMIT: XỬ LÝ LƯU GÓI DỊCH VỤ ---
    document.getElementById("serv-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const editId = document.getElementById("form-serv-id").value;
        const name = document.getElementById("form-serv-name").value;
        const price = document.getElementById("form-serv-price").value;
        const unit = document.getElementById("form-serv-unit").value;

        if (editId !== "") {
            const idx = Number(editId);
            services[idx].name = name;
            services[idx].price = Number(price);
            services[idx].unit = unit;
        } else {
            const randId = "SRV-" + Math.floor(100 + Math.random() * 900);
            services.push({ id: randId, name, price: Number(price), unit });
        }
        
        saveDataToStorage();
        renderAllData();
        document.getElementById("serv-modal").classList.remove("active");
    });
}

// ==============================================================================
// --- ĐỘNG LỰC HỌC KHỐI SỬA / XÓA DỮ LIỆU ĐỘNG (BẢO TOÀN TRẠNG THÁI) ---
// ==============================================================================
function editOrder(index) {
    document.getElementById("order-modal-title").innerText = "Chỉnh Sửa Đơn Hàng";
    document.getElementById("form-order-id").value = index;
    document.getElementById("form-order-name").value = orders[index].name;
    document.getElementById("form-order-service").value = orders[index].service;
    document.getElementById("form-order-price").value = orders[index].price;
    document.getElementById("form-order-status").value = orders[index].status;
    document.getElementById("order-modal").classList.add("active");
}

function deleteOrder(index) {
    if (confirm("Hệ thống: Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này?")) {
        orders.splice(index, 1);
        saveDataToStorage(); // Đồng bộ xóa khỏi LocalStorage
        renderAllData();     // Vẽ lại bảng sạch dữ liệu
    }
}

function editCustomer(index) {
    document.getElementById("cust-modal-title").innerText = "Cập Nhật Hồ Sơ Khách Hàng";
    document.getElementById("form-cust-id").value = index;
    document.getElementById("form-cust-name").value = customers[index].name;
    document.getElementById("form-cust-phone").value = customers[index].phone;
    document.getElementById("form-cust-address").value = customers[index].address;
    document.getElementById("cust-modal").classList.add("active");
}

function deleteCustomer(index) {
    if (confirm("Hệ thống: Xác nhận xóa thông tin khách hàng này?")) {
        customers.splice(index, 1);
        saveDataToStorage();
        renderAllData();
    }
}

// Tương tự cho sửa xóa dịch vụ gói
function editService(index) {
    document.getElementById("serv-modal-title").innerText = "Sửa Thông Tin Gói Dịch Vụ";
    document.getElementById("form-serv-id").value = index;
    document.getElementById("form-serv-name").value = services[index].name;
    document.getElementById("form-serv-price").value = services[index].price;
    document.getElementById("form-serv-unit").value = services[index].unit;
    document.getElementById("serv-modal").classList.add("active");
}

function deleteService(index) {
    if (confirm("Hệ thống: Xác nhận xóa gói dịch vụ này khỏi danh mục bảng giá công khai?")) {
        services.splice(index, 1);
        saveDataToStorage();
        renderAllData();
    }
}

// ==============================================================================
// --- CHỨC NĂNG TÌM KIẾM BỘ LỌC CHẠY LIVE SIÊU TỐC ---
// ==============================================================================
function initSearchFilters() {
    // Tìm kiếm Live Đơn hàng theo Tên khách hàng khách đặt
    document.getElementById("order-search-input").addEventListener("input", function() {
        const keyword = this.value.toLowerCase().trim();
        const rows = document.querySelectorAll("#order-table-body tr");
        rows.forEach(row => {
            const name = row.cells[1].innerText.toLowerCase();
            row.style.display = name.includes(keyword) ? "" : "none";
        });
    });

    // Tìm kiếm Live Khách hàng song song cả Tên và Số điện thoại cùng lúc
    document.getElementById("cust-search-input").addEventListener("input", function() {
        const keyword = this.value.toLowerCase().trim();
        const rows = document.querySelectorAll("#customer-table-body tr");
        rows.forEach(row => {
            const name = row.cells[1].innerText.toLowerCase();
            const phone = row.cells[2].innerText.toLowerCase();
            row.style.display = (name.includes(keyword) || phone.includes(keyword)) ? "" : "none";
        });
    });
}