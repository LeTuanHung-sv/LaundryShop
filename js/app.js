// ==========================================
// 1. CẤU HÌNH & DỮ LIỆU TOÀN CỤC (GLOBAL)
// ==========================================
let services = JSON.parse(localStorage.getItem('laundry_services')) || [];
let customers = JSON.parse(localStorage.getItem('laundry_customers')) || [];
let orders = JSON.parse(localStorage.getItem('laundry_orders')) || [];
let inventory = JSON.parse(localStorage.getItem('laundry_inventory')) || [];

// Thêm dữ liệu cấu hình hệ thống động (MỚI THÊM)
let shopSettings = JSON.parse(localStorage.getItem('laundry_settings')) || {
    name: "Laundry Shop - Tuấn Hưng",
    address: "Phường 4, Quận 8, TP. Hồ Chí Minh",
    phone: "0901 234 567",
    theme: "light"
};

const safeClick = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.onclick = fn;
};

function saveDataToStorage() {
    localStorage.setItem('laundry_services', JSON.stringify(services));
    localStorage.setItem('laundry_customers', JSON.stringify(customers));
    localStorage.setItem('laundry_orders', JSON.stringify(orders));
    localStorage.setItem('laundry_inventory', JSON.stringify(inventory));
    localStorage.setItem('laundry_settings', JSON.stringify(shopSettings)); // Lưu cấu hình
}

// ==========================================
// 2. KHỞI TẠO KHI TRANG TẢI XONG
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    initNavigation();
    applyShopSettings(); // Đổ tên tiệm lên giao diện ngay khi mở web
    renderAllData();
    initModalControls();
    initSearchFilters();
});

// ==========================================
// 3. CÁC HÀM XỬ LÝ CHỨC NĂNG
// ==========================================

// Hàm áp dụng cấu hình cửa hàng lên các vị trí hiển thị text trên màn hình (MỚI THÊM)
function applyShopSettings() {
    // Cập nhật tên tiệm ở góc trên cùng bên phải và sidebar trái nếu có thẻ ID tương ứng
    const brandName = document.getElementById("brand-shop-name");
    const headerName = document.getElementById("header-shop-name");

    if (brandName) brandName.innerText = shopSettings.name.replace("Laundry Shop - ", "");
    if (headerName) headerName.innerText = shopSettings.name;

    // Đổ ngược dữ liệu từ LocalStorage vào các ô Input của Form cài đặt cấu hình
    const inputName = document.getElementById("cfg-shop-name");
    const inputAddress = document.getElementById("cfg-shop-address");
    const inputPhone = document.getElementById("cfg-shop-phone");
    const selectTheme = document.getElementById("cfg-shop-theme");

    if (inputName) inputName.value = shopSettings.name;
    if (inputAddress) inputAddress.value = shopSettings.address;
    if (inputPhone) inputPhone.value = shopSettings.phone;
    if (selectTheme) selectTheme.value = shopSettings.theme;
}

function initNavigation() {
    const menuItems = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll(".page-section");

    menuItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");

            const targetId = this.getAttribute("data-target");
            sections.forEach(sec => {
                sec.classList.remove("active");
                sec.style.display = "none";
                if (sec.id === targetId) {
                    sec.classList.add("active");
                    sec.style.display = "block";
                }
            });

            // Khi người dùng bấm chuyển sang tab báo cáo hoặc cài đặt, chạy lại render cập nhật dữ liệu
            if (targetId === "reports-page") {
                renderAllData();
            } else if (targetId === "settings-page") {
                applyShopSettings(); // Làm mới form cấu hình
            }
        });
    });

    document.querySelectorAll(".dashboard-card-click").forEach(card => {
        card.addEventListener("click", function () {
            const target = this.getAttribute("data-target");
            const menu = document.querySelector(`.menu-item[data-target="${target}"]`);
            if (menu) menu.click();
        });
    });

    document.querySelector(".menu-item.active")?.click();
}

function renderAllData() {
    // THỐNG KÊ DASHBOARD
    const countOrders = document.getElementById("dash-orders-count");
    if(countOrders) countOrders.innerText = orders.filter(o => o.status === "Đang xử lý").length;

    const countCust = document.getElementById("dash-cust-count");
    if(countCust) countCust.innerText = customers.length;

    const countServ = document.getElementById("dash-serv-count");
    if(countServ) countServ.innerText = services.length;

    const totalRev = orders.reduce((sum, o) => sum + Number(o.price || 0), 0);
    const revEl = document.getElementById("dash-total-revenue");
    if(revEl) revEl.innerText = totalRev.toLocaleString('vi-VN') + "đ";

    // RENDER BẢNG ĐƠN HÀNG
    const orderBody = document.getElementById("order-table-body");
    if (orderBody) {
        orderBody.innerHTML = orders.length === 0
            ? `<tr><td colspan="6" style="text-align:center; padding:30px; color:#999;">Chưa có đơn hàng nào.</td></tr>`
            : orders.map((o, i) => `
                <tr>
                    <td><strong>${o.id}</strong></td>
                    <td>${o.name}</td>
                    <td>${o.service}</td>
                    <td>${Number(o.price || 0).toLocaleString('vi-VN')}đ</td>
                    <td><span class="badge ${o.status === 'Đã hoàn thành' ? 'status-success' : 'status-warning'}">${o.status}</span></td>
                    <td>
                        <button class="action-btn btn-edit" onclick="editOrder(${i})"><i class="ri-edit-line"></i></button>
                        <button class="action-btn btn-delete" onclick="deleteOrder(${i})"><i class="ri-delete-bin-line"></i></button>
                    </td>
                </tr>`).join('');
    }

    // RENDER BẢNG KHÁCH HÀNG
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

    // RENDER BẢNG DỊCH VỤ
    const servBody = document.getElementById("services-table-body");
    if (servBody) {
        servBody.innerHTML = services.length === 0
            ? `<tr><td colspan="4" style="text-align:center; padding:30px; color:#999;">Chưa có dịch vụ.</td></tr>`
            : services.map((s, i) => `
                <tr>
                    <td><strong>${s.name}</strong></td>
                    <td>${Number(s.price || 0).toLocaleString('vi-VN')}đ</td>
                    <td>/${s.unit}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="editService(${i})"><i class="ri-edit-line"></i></button>
                        <button class="action-btn btn-delete" onclick="deleteService(${i})"><i class="ri-delete-bin-line"></i></button>
                    </td>
                </tr>`).join('');
    }

    // RENDER BẢNG KHO VẬT TƯ ĐỘNG
    const invBody = document.getElementById("inventory-table-body");
    if (invBody) {
        invBody.innerHTML = inventory.length === 0
            ? `<tr><td colspan="6" style="text-align:center; padding:30px; color:#999;">Kho trống. Bấm nút phía trên để nhập vật tư vật liệu!</td></tr>`
            : inventory.map((item, i) => {
                let customStyle = "";
                if (item.status === "Sắp hết") {
                    customStyle = 'style="background: #f39c12; color: white;"';
                } else if (item.status === "Cảnh báo hết") {
                    customStyle = 'style="background: #e74c3c; color: white;"';
                }

                return `
                <tr>
                    <td><strong>${item.id}</strong></td>
                    <td>${item.name}</td>
                    <td>${item.type}</td>
                    <td><strong>${item.qty}</strong></td>
                    <td><span class="badge status-success" ${customStyle}>${item.status}</span></td>
                    <td>
                        <button class="action-btn btn-edit" onclick="editInventory(${i})"><i class="ri-edit-line"></i></button>
                        <button class="action-btn btn-delete" onclick="deleteInventory(${i})"><i class="ri-delete-bin-line"></i></button>
                    </td>
                </tr>`;
            }).join('');
    }

    // UPDATE DROPDOWN FORM ĐƠN HÀNG
    const selectSrv = document.getElementById("form-order-service");
    if(selectSrv) {
        selectSrv.innerHTML = services.length === 0
            ? `<option value="">-- Cần thêm dịch vụ trước --</option>`
            : services.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
    }

    // TRANG CHỦ DASHBOARD
    const dashOrderBody = document.getElementById("dashboard-order-body");
    if (dashOrderBody) {
        const recentOrders = [...orders].reverse().slice(0, 5);
        dashOrderBody.innerHTML = recentOrders.length === 0
            ? `<tr><td colspan="4" style="text-align:center; padding:20px; color:#999; font-size:13px;">Chưa tiếp nhận đơn nào.</td></tr>`
            : recentOrders.map(o => `
                <tr>
                    <td><strong>${o.id}</strong></td>
                    <td>${o.name}</td>
                    <td><span class="service-tag">${o.service}</span></td>
                    <td><span class="status-badge ${o.status === 'Đã hoàn thành' ? 'status-success' : 'status-pending'}">${o.status}</span></td>
                </tr>`).join('');
    }

    const dashServicesChart = document.getElementById("dashboard-services-chart");
    if (dashServicesChart) {
        if (orders.length === 0) {
            dashServicesChart.innerHTML = `<p style="color:#999; text-align:center; font-size:13px; padding:20px;">Chưa có dữ liệu thống kê dịch vụ.</p>`;
        } else {
            const serviceCounts = {};
            orders.forEach(o => { if (o.service) serviceCounts[o.service] = (serviceCounts[o.service] || 0) + 1; });
            const sortedServices = Object.keys(serviceCounts).map(name => ({
                name: name, count: serviceCounts[name], percentage: Math.round((serviceCounts[name] / orders.length) * 100)
            })).sort((a, b) => b.count - a.count);

            dashServicesChart.innerHTML = sortedServices.map(s => `
                <div class="progress-bar-wrapper">
                    <div class="progress-info"><span>${s.name} (${s.count} đơn)</span><span style="color: var(--primary-color); font-weight:700;">${s.percentage}%</span></div>
                    <div class="progress-track"><div class="progress-fill" style="width: ${s.percentage}%;"></div></div>
                </div>`).join('');
        }
    }

    // THỐNG KÊ TRANG BÁO CÁO KẾT QUẢ KINH DOANH ĐỘNG
    const repMonthRev = document.getElementById("report-month-revenue");
    const repTotalOrders = document.getElementById("report-total-orders");
    const repSuccessRate = document.getElementById("report-success-rate");

    if (repMonthRev && repTotalOrders && repSuccessRate) {
        repMonthRev.innerText = totalRev.toLocaleString('vi-VN') + "đ";
        repTotalOrders.innerText = orders.length + " Đơn";

        if (orders.length === 0) {
            repSuccessRate.innerText = "0%";
        } else {
            const completedCount = orders.filter(o => o.status === "Đã hoàn thành").length;
            const rate = Math.round((completedCount / orders.length) * 100);
            repSuccessRate.innerText = rate + "%";
        }
    }

    // Biểu đồ tuần
    const chartContainer = document.getElementById("weekly-chart-container");
    if (chartContainer) {
        const weeklyData = [
            { label: "Thứ 2", dayIndex: 1, revenue: 0 },
            { label: "Thứ 3", dayIndex: 2, revenue: 0 },
            { label: "Thứ 4", dayIndex: 3, revenue: 0 },
            { label: "Thứ 5", dayIndex: 4, revenue: 0 },
            { label: "Thứ 6", dayIndex: 5, revenue: 0 },
            { label: "Thứ 7", dayIndex: 6, revenue: 0 },
            { label: "Chủ Nhật", dayIndex: 0, revenue: 0 }
        ];

        orders.forEach(order => {
            let orderDay = order.createdAt ? new Date(order.createdAt).getDay() : new Date().getDay();
            const matchDay = weeklyData.find(d => d.dayIndex === orderDay);
            if (matchDay) matchDay.revenue += Number(order.price || 0);
        });

        const maxRevenue = Math.max(...weeklyData.map(d => d.revenue), 0);

        chartContainer.innerHTML = weeklyData.map(d => {
            let columnHeight = 20;
            if (maxRevenue > 0) {
                columnHeight = Math.round((d.revenue / maxRevenue) * 160) + 10;
            }

            let displayPrice = "0đ";
            if (d.revenue >= 1000000) displayPrice = (d.revenue / 1000000).toFixed(1) + "M";
            else if (d.revenue > 0) displayPrice = Math.round(d.revenue / 1000) + "k";

            const isToday = new Date().getDay() === d.dayIndex;
            let barColor = "#bdc3c7";
            if (d.revenue > 0) {
                barColor = isToday ? "#e67e22" : "#4361ee";
            }

            return `
                <div class="chart-bar-item">
                    <div class="chart-bar-pillar" style="background: ${barColor}; height: ${columnHeight}px;">
                        ${displayPrice}
                    </div>
                    <span class="chart-bar-label" style="${isToday ? 'color: #e67e22; font-weight: 700;' : ''}">
                        ${d.label}
                    </span>
                </div>`;
        }).join('');
    }
}

function initModalControls() {
    // --- MỞ MODALS ---
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

    safeClick("open-inv-modal-btn", () => {
        document.getElementById("inv-modal-title").innerText = "Nhập Kho Vật Tư Mới";
        document.getElementById("inv-form").reset();
        document.getElementById("form-inv-id").value = "";
        document.getElementById("inv-modal").classList.add("active");
    });

    // --- ĐÓNG MODALS ---
    document.querySelectorAll(".close-modal-btn").forEach(btn => {
        btn.onclick = () => document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
    });

    // --- SUBMIT FORMS ---
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
                orders.push({
                    id: "#ORD-" + Math.floor(1000 + Math.random() * 9000),
                    ...data,
                    createdAt: new Date().toISOString()
                });
            }
            saveDataToStorage(); renderAllData();
            document.getElementById("order-modal").classList.remove("active");
        };
    }

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
            if(id !== "") customers[id] = {...customers[id], ...data};
            else customers.push({ id: "KH-" + Math.floor(1000 + Math.random() * 9000), ...data });
            saveDataToStorage(); renderAllData();
            document.getElementById("cust-modal").classList.remove("active");
        };
    }

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
            if(id !== "") services[id] = {...services[id], ...data};
            else services.push(data);
            saveDataToStorage(); renderAllData();
            document.getElementById("serv-modal").classList.remove("active");
        };
    }

    const invForm = document.getElementById("inv-form");
    if(invForm) {
        invForm.onsubmit = (e) => {
            e.preventDefault();
            const id = document.getElementById("form-inv-id").value;
            const data = {
                name: document.getElementById("form-inv-name").value,
                type: document.getElementById("form-inv-type").value,
                qty: document.getElementById("form-inv-qty").value,
                status: document.getElementById("form-inv-status").value
            };

            if(id !== "") {
                inventory[id] = { ...inventory[id], ...data };
            } else {
                inventory.push({ id: "#VT-" + Math.floor(1000 + Math.random() * 9000), ...data });
            }
            saveDataToStorage(); renderAllData();
            document.getElementById("inv-modal").classList.remove("active");
        };
    }

    // --- XỬ LÝ FORM SUBMIT CÀI ĐẶT CẤU HÌNH HỆ THỐNG (MỚI THÊM) ---
    const settingsForm = document.getElementById("settings-form");
    if (settingsForm) {
        settingsForm.onsubmit = (e) => {
            e.preventDefault();

            // Đọc dữ liệu mới từ các ô nhập liệu
            shopSettings = {
                name: document.getElementById("cfg-shop-name").value,
                address: document.getElementById("cfg-shop-address").value,
                phone: document.getElementById("cfg-shop-phone").value,
                theme: document.getElementById("cfg-shop-theme").value
            };

            // Lưu vào Storage và đồng bộ chữ hiển thị trên app ngay lập tức
            saveDataToStorage();
            applyShopSettings();

            alert("🎉 Đã lưu cấu hình hệ thống thành công!");
        };
    }
}

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
    setupSearch("inv-search-input", "inventory-table-body", 1);
}

// ==========================================
// 4. CÁC HÀM SỬA / XÓA (WINDOW SCOPE)
// ==========================================
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

window.editInventory = (i) => {
    document.getElementById("inv-modal-title").innerText = "Cập Nhật Vật Tư Kho";
    document.getElementById("form-inv-id").value = i;
    document.getElementById("form-inv-name").value = inventory[i].name;
    document.getElementById("form-inv-type").value = inventory[i].type;
    document.getElementById("form-inv-qty").value = inventory[i].qty;
    document.getElementById("form-inv-status").value = inventory[i].status;
    document.getElementById("inv-modal").classList.add("active");
};
window.deleteInventory = (i) => { if(confirm("Xóa vật tư này khỏi hệ thống kho?")) { inventory.splice(i, 1); saveDataToStorage(); renderAllData(); } };