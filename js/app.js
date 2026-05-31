let services = JSON.parse(localStorage.getItem('laundry_services')) || [];
let customers = JSON.parse(localStorage.getItem('laundry_customers')) || [];
let orders = JSON.parse(localStorage.getItem('laundry_orders')) || [];

function saveDataToStorage() {
    localStorage.setItem('laundry_services', JSON.stringify(services));
    localStorage.setItem('laundry_customers', JSON.stringify(customers));
    localStorage.setItem('laundry_orders', JSON.stringify(orders));
}

document.addEventListener("DOMContentLoaded", function () {
    //Chạy bộ điều hướng Menu (SPA)
    initNavigation();

    //Vẽ dữ liệu lên các bảng và thống kê
    renderAllData();

    //Khởi tạo bộ đóng/mở Modal và Tìm kiếm
    initModalControls();
    initSearchFilters();
});

function initNavigation() {
    const menuItems = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll(".page-section");

    menuItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();

            // Làm nổi bật menu đang chọn
            menuItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");

            const targetId = this.getAttribute("data-target");

            // Ẩn tất cả các Section và hiển thị Section đích
            sections.forEach(sec => {
                sec.classList.remove("active");
                sec.style.display = "none";

                if (sec.id === targetId) {
                    sec.classList.add("active");
                    // Riêng trang Lab nếu em muốn dùng hiển thị đặc biệt có thể chỉnh ở đây
                    sec.style.display = "block";

                    // Hiệu ứng Fade In nhẹ
                    sec.style.opacity = "0";
                    setTimeout(() => { sec.style.opacity = "1"; sec.style.transition = "0.3s"; }, 10);
                }
            });
        });
    });

    // Điều hướng nhanh từ Dashboard
    document.querySelectorAll(".dashboard-card-click").forEach(card => {
        card.addEventListener("click", function () {
            const target = this.getAttribute("data-target");
            const menu = document.querySelector(`.menu-item[data-target="${target}"]`);
            if (menu) menu.click();
        });
    });
}

function renderAllData() {
    // 1. Cập nhật Dashboard
    const countOrders = document.getElementById("dash-orders-count");
    if(countOrders) countOrders.innerText = orders.filter(o => o.status === "Đang xử lý").length;

    const countCust = document.getElementById("dash-cust-count");
    if(countCust) countCust.innerText = customers.length;

    const countServ = document.getElementById("dash-serv-count");
    if(countServ) countServ.innerText = services.length;

    const totalRev = orders.reduce((sum, o) => sum + Number(o.price), 0);
    const revEl = document.getElementById("dash-total-revenue");
    if(revEl) revEl.innerText = totalRev.toLocaleString('vi-VN') + "đ";

    // 2. Render bảng Đơn hàng
    const orderBody = document.getElementById("order-table-body");
    if (orderBody) {
        orderBody.innerHTML = orders.length === 0
            ? `<tr><td colspan="6" style="text-align:center; padding:30px; color:#999;">Chưa có đơn hàng nào.</td></tr>`
            : orders.map((o, i) => `
                <tr>
                    <td><strong>${o.id}</strong></td>
                    <td>${o.name}</td>
                    <td>${o.service}</td>
                    <td>${Number(o.price).toLocaleString('vi-VN')}đ</td>
                    <td><span class="badge ${o.status === 'Đã hoàn thành' ? 'status-success' : 'status-warning'}">${o.status}</span></td>
                    <td>
                        <button class="action-btn btn-edit" onclick="editOrder(${i})"><i class="ri-edit-line"></i></button>
                        <button class="action-btn btn-delete" onclick="deleteOrder(${i})"><i class="ri-delete-bin-line"></i></button>
                    </td>
                </tr>`).join('');
    }

    // 3. Render bảng Khách hàng
    const custBody = document.getElementById("customer-table-body");
    if (custBody) {
        custBody.innerHTML = customers.length === 0
            ? `<tr><td colspan="5" style="text-align:center; padding:30px; color:#999;">Chưa có khách hàng.</td></tr>`
            : customers.map((c, i) => `
                <tr>
                    <td><strong>${c.id}</strong></td>
                    <td>${c.name}</td>
                    <td>${c.phone}</td>
                    <td>${c.address}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="editCustomer(${i})"><i class="ri-edit-line"></i></button>
                        <button class="action-btn btn-delete" onclick="deleteCustomer(${i})"><i class="ri-delete-bin-line"></i></button>
                    </td>
                </tr>`).join('');
    }

    // 4. Render bảng Dịch vụ
    const servBody = document.getElementById("services-table-body");
    if (servBody) {
        servBody.innerHTML = services.length === 0
            ? `<tr><td colspan="4" style="text-align:center; padding:30px; color:#999;">Chưa có dịch vụ.</td></tr>`
            : services.map((s, i) => `
                <tr>
                    <td><strong>${s.name}</strong></td>
                    <td>${Number(s.price).toLocaleString('vi-VN')}đ</td>
                    <td>/${s.unit}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="editService(${i})"><i class="ri-edit-line"></i></button>
                        <button class="action-btn btn-delete" onclick="deleteService(${i})"><i class="ri-delete-bin-line"></i></button>
                    </td>
                </tr>`).join('');
    }

    // Cập nhật Dropdown chọn dịch vụ trong Form đơn hàng
    const selectSrv = document.getElementById("form-order-service");
    if(selectSrv) {
        selectSrv.innerHTML = services.length === 0
            ? `<option value="">-- Cần thêm dịch vụ trước --</option>`
            : services.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
    }
}

function initModalControls() {
    // Mở Modal
    const safeClick = (id, fn) => { const el = document.getElementById(id); if(el) el.onclick = fn; };

    safeClick("open-order-modal-btn", () => {
        document.getElementById("order-modal-title").innerText = "Thêm Đơn Mới";
        document.getElementById("order-form").reset();
        document.getElementById("form-order-id").value = "";
        document.getElementById("order-modal").classList.add("active");
    });

    safeClick("open-cust-modal-btn", () => {
        document.getElementById("cust-modal").classList.add("active");
        document.getElementById("cust-form").reset();
        document.getElementById("form-cust-id").value = "";
    });

    safeClick("open-serv-modal-btn", () => {
        document.getElementById("serv-modal").classList.add("active");
        document.getElementById("serv-form").reset();
        document.getElementById("form-serv-id").value = "";
    });

    // Đóng Modal
    document.querySelectorAll(".close-modal-btn").forEach(btn => {
        btn.onclick = () => document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
    });

    // Xử lý Submit Order
    const orderForm = document.getElementById("order-form");
    if(orderForm) {
        orderForm.onsubmit = (e) => {
            e.preventDefault();
            const id = document.getElementById("form-order-id").value;
            const data = {
                name: document.getElementById("form-order-name").value,
                service: document.getElementById("form-order-service").value,
                price: document.getElementById("form-order-price").value,
                status: document.getElementById("form-order-status").value
            };

            if(id !== "") {
                orders[id] = { ...orders[id], ...data };
            } else {
                orders.push({ id: "#ORD-" + Math.floor(1000+Math.random()*9000), ...data });
            }
            saveDataToStorage(); renderAllData();
            document.getElementById("order-modal").classList.remove("active");
        };
    }

    // Xử lý Submit Customer
    const custForm = document.getElementById("cust-form");
    if(custForm) {
        custForm.onsubmit = (e) => {
            e.preventDefault();
            const id = document.getElementById("form-cust-id").value;
            const data = {
                name: document.getElementById("form-cust-name").value,
                phone: document.getElementById("form-cust-phone").value,
                address: document.getElementById("form-cust-address").value
            };
            if(id !== "") { customers[id] = {...customers[id], ...data}; }
            else { customers.push({ id: "KH-" + Math.floor(1000+Math.random()*9000), ...data }); }
            saveDataToStorage(); renderAllData();
            document.getElementById("cust-modal").classList.remove("active");
        };
    }

    // Xử lý Submit Service
    const servForm = document.getElementById("serv-form");
    if(servForm) {
        servForm.onsubmit = (e) => {
            e.preventDefault();
            const id = document.getElementById("form-serv-id").value;
            const data = {
                name: document.getElementById("form-serv-name").value,
                price: document.getElementById("form-serv-price").value,
                unit: document.getElementById("form-serv-unit").value
            };
            if(id !== "") { services[id] = {...services[id], ...data}; }
            else { services.push(data); }
            saveDataToStorage(); renderAllData();
            document.getElementById("serv-modal").classList.remove("active");
        };
    }
}

window.editOrder = (i) => {
    document.getElementById("order-modal-title").innerText = "Sửa Đơn Hàng";
    document.getElementById("form-order-id").value = i;
    document.getElementById("form-order-name").value = orders[i].name;
    document.getElementById("form-order-service").value = orders[i].service;
    document.getElementById("form-order-price").value = orders[i].price;
    document.getElementById("form-order-status").value = orders[i].status;
    document.getElementById("order-modal").classList.add("active");
};

window.deleteOrder = (i) => { if(confirm("Xóa đơn này?")) { orders.splice(i, 1); saveDataToStorage(); renderAllData(); } };

window.editCustomer = (i) => {
    document.getElementById("form-cust-id").value = i;
    document.getElementById("form-cust-name").value = customers[i].name;
    document.getElementById("form-cust-phone").value = customers[i].phone;
    document.getElementById("form-cust-address").value = customers[i].address;
    document.getElementById("cust-modal").classList.add("active");
};

window.deleteCustomer = (i) => { if(confirm("Xóa khách này?")) { customers.splice(i, 1); saveDataToStorage(); renderAllData(); } };

window.editService = (i) => {
    document.getElementById("form-serv-id").value = i;
    document.getElementById("form-serv-name").value = services[i].name;
    document.getElementById("form-serv-price").value = services[i].price;
    document.getElementById("form-serv-unit").value = services[i].unit;
    document.getElementById("serv-modal").classList.add("active");
};

window.deleteService = (i) => { if(confirm("Xóa dịch vụ?")) { services.splice(i, 1); saveDataToStorage(); renderAllData(); } };

function initSearchFilters() {
    const setupSearch = (inputId, tableId, colIdx) => {
        const input = document.getElementById(inputId);
        if(input) {
            input.oninput = function() {
                const val = this.value.toLowerCase();
                document.querySelectorAll(`#${tableId} tr`).forEach(row => {
                    const txt = row.cells[colIdx]?.innerText.toLowerCase() || "";
                    row.style.display = txt.includes(val) ? "" : "none";
                });
            };
        }
    };
    setupSearch("order-search-input", "order-table-body", 1);
    setupSearch("cust-search-input", "customer-table-body", 1);
}