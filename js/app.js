document.addEventListener("DOMContentLoaded", function () {
    // ==============================================================================
    // --- KHO DỮ LIỆU GỐC CỦA HỆ THỐNG ---
    // ==============================================================================
    let mockServices = [
        { id: "S1", name: "Giặt sấy lấy liền", price: 30000, unit: "kg" },
        { id: "S2", name: "Giặt khô là hơi", price: 90000, unit: "bộ" },
        { id: "S3", name: "Giặt hấp gấu bông", price: 50000, unit: "con" }
    ];

    let mockCustomers = [
        { id: "KH-101", name: "Nguyễn Văn A", phone: "0901234567", address: "123 Nguyễn Trãi, Quận 5" },
        { id: "KH-102", name: "Trần Thị B", phone: "0987654321", address: "456 Lê Lợi, Quận 1" },
        { id: "KH-103", name: "Lê Tuấn Hùng", phone: "0911223344", address: "789 Cách Mạng Tháng 8" }
    ];

    let mockOrders = [
        { id: "ORD-1001", name: "Nguyễn Văn A", service: "Giặt sấy lấy liền", price: 120000, status: "Đang xử lý" },
        { id: "ORD-1002", name: "Trần Thị B", service: "Giặt hấp gấu bông", price: 50000, status: "Đã hoàn thành" },
        { id: "ORD-1003", name: "Lê Tuấn Hùng", service: "Giặt khô là hơi", price: 180000, status: "Đã hoàn thành" }
    ];

    // ==============================================================================
    // --- CHỨC NĂNG 1: CLICK MENU ĐỔI GIAO DIỆN (SPA TAB SWITCHING) ---
    // ==============================================================================
    const menuItems = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll(".page-section");

    menuItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();

            // Bỏ active ở các menu cũ, active menu vừa bấm
            menuItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");

            // Ẩn toàn bộ các trang, hiển thị đúng trang có ID tương ứng
            const targetPageId = this.getAttribute("data-target");
            sections.forEach(sec => sec.classList.remove("active"));

            const targetElement = document.getElementById(targetPageId);
            if (targetElement) {
                targetElement.classList.add("active");
            }

            // Tự động làm mới bảng dữ liệu khi chuyển tab
            renderAllData();
        });
    });

    // ==============================================================================
    // --- CHỨC NĂNG 2: ĐỔ DỮ LIỆU RA CÁC TRANG ---
    // ==============================================================================
    function renderAllData() {
        renderDashboard();
        renderOrders(mockOrders);
        renderCustomers(mockCustomers);
        renderServices();
        updateServiceSelectOptions();
    }

    // Trang chủ Dashboard
    function renderDashboard() {
        const dashOrders = document.getElementById("dash-orders-count");
        const dashCust = document.getElementById("dash-cust-count");
        const dashServ = document.getElementById("dash-serv-count");
        const dashRevenue = document.getElementById("dash-total-revenue");
        const recentTbody = document.getElementById("recent-orders-tbody");
        const progressList = document.getElementById("services-progress-list");

        if (dashOrders) dashOrders.textContent = mockOrders.length;
        if (dashCust) dashCust.textContent = mockCustomers.length;
        if (dashServ) dashServ.textContent = mockServices.length;

        let revenue = mockOrders.reduce((sum, o) => sum + o.price, 0);
        if (dashRevenue) dashRevenue.textContent = revenue.toLocaleString('vi-VN') + "đ";

        // Đổ bảng đơn hàng mới ở trang chủ
        if (recentTbody) {
            recentTbody.innerHTML = mockOrders.slice(0, 3).map(o => `
                <tr>
                    <td class="text-bold">#${o.id}</td>
                    <td><span class="c-name">${o.name}</span></td>
                    <td><span class="service-tag">${o.service}</span></td>
                    <td><span class="status-badge ${o.status === 'Đã hoàn thành' ? 'status-success' : 'status-pending'}">${o.status}</span></td>
                </tr>
            `).join('');
        }

        // Thanh tiến độ tượng trưng
        if (progressList) {
            progressList.innerHTML = `
                <div class="progress-bar-wrapper">
                    <div class="progress-info"><span>Giặt sấy lấy liền</span><strong>65%</strong></div>
                    <div class="progress-track"><div class="progress-fill" style="width: 65%;"></div></div>
                </div>
                <div class="progress-bar-wrapper">
                    <div class="progress-info"><span>Khác</span><strong>35%</strong></div>
                    <div class="progress-track"><div class="progress-fill" style="width: 35%; background: orange;"></div></div>
                </div>
            `;
        }
    }

    // Quản lý Đơn hàng
    function renderOrders(data) {
        const tbody = document.getElementById("order-table-body");
        if (!tbody) return;

        tbody.innerHTML = data.map(o => `
            <tr>
                <td class="text-bold">#${o.id}</td>
                <td><span class="c-name">${o.name}</span></td>
                <td><span class="service-tag">${o.service}</span></td>
                <td class="text-bold text-price">${o.price.toLocaleString('vi-VN')} đ</td>
                <td><span class="status-badge ${o.status === 'Đã hoàn thành' ? 'status-success' : 'status-pending'}">${o.status}</span></td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-action btn-edit edit-order-btn" data-id="${o.id}"><i class="ri-edit-line"></i></button>
                        <button class="btn-action btn-delete delete-order-btn" data-id="${o.id}"><i class="ri-delete-bin-line"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
        bindOrderEvents();
    }

    // Quản lý Khách hàng
    function renderCustomers(data) {
        const tbody = document.getElementById("customer-table-body");
        if (!tbody) return;

        tbody.innerHTML = data.map(c => `
            <tr>
                <td class="text-bold">${c.id}</td>
                <td><span class="c-name">${c.name}</span></td>
                <td>${c.phone}</td>
                <td class="text-muted">${c.address}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-action btn-edit edit-cust-btn" data-id="${c.id}"><i class="ri-edit-line"></i></button>
                        <button class="btn-action btn-delete delete-cust-btn" data-id="${c.id}"><i class="ri-delete-bin-line"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
        bindCustEvents();
    }

    // Quản lý Danh mục Dịch vụ
    function renderServices() {
        const tbody = document.getElementById("services-table-body");
        if (!tbody) return;

        tbody.innerHTML = mockServices.map(s => `
            <tr>
                <td class="text-bold">${s.name}</td>
                <td class="text-price text-bold">${s.price.toLocaleString('vi-VN')} đ</td>
                <td><span class="service-tag">${s.unit}</span></td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-action btn-edit edit-serv-btn" data-id="${s.id}"><i class="ri-edit-line"></i></button>
                        <button class="btn-action btn-delete delete-serv-btn" data-id="${s.id}"><i class="ri-delete-bin-line"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
        bindServEvents();
    }

    // Cập nhật thẻ Select dịch vụ trong form Đơn hàng
    function updateServiceSelectOptions() {
        const select = document.getElementById("form-order-service");
        if (select) {
            select.innerHTML = mockServices.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
        }
    }

    // ==============================================================================
    // --- CHỨC NĂNG 3: ĐÓNG MỞ CÁC MODAL ---
    // ==============================================================================
    function setupModal(openBtnId, modalId, titleId, titleText, formId, hiddenInputId) {
        const openBtn = document.getElementById(openBtnId);
        const modal = document.getElementById(modalId);
        const title = document.getElementById(titleId);
        const form = document.getElementById(formId);

        if (openBtn && modal) {
            openBtn.addEventListener("click", () => {
                if (title) title.textContent = titleText;
                if (form) form.reset();
                if (hiddenInputId) {
                    const hiddenInput = document.getElementById(hiddenInputId);
                    if (hiddenInput) hiddenInput.value = "";
                }
                modal.classList.add("open");
            });
        }
    }

    setupModal("open-order-modal-btn", "order-modal", "order-modal-title", "Thêm Đơn Giặt Ủi Mới", "order-form", "form-order-id");
    setupModal("open-cust-modal-btn", "cust-modal", "cust-modal-title", "Đăng Ký Khách Hàng Mới", "cust-form", "form-cust-id");
    setupModal("open-serv-modal-btn", "serv-modal", "serv-modal-title", "Thêm Gói Dịch Vụ Mới", "serv-form", "form-serv-id");

    document.querySelectorAll(".close-modal-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".modal").forEach(m => m.classList.remove("open"));
        });
    });

    // ==============================================================================
    // --- CHỨC NĂNG 4: THÊM / SỬA / XÓA (CRUD) ---
    // ==============================================================================

    // Xử lý Form Đơn Hàng
    const orderForm = document.getElementById("order-form");
    if (orderForm) {
        orderForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const id = document.getElementById("form-order-id").value;
            const name = document.getElementById("form-order-name").value;
            const service = document.getElementById("form-order-service").value;
            const price = parseInt(document.getElementById("form-order-price").value) || 0;
            const status = document.getElementById("form-order-status").value;

            if (id) {
                let idx = mockOrders.findIndex(o => o.id === id);
                if (idx !== -1) mockOrders[idx] = { id, name, service, price, status };
            } else {
                mockOrders.unshift({ id: "ORD-" + Math.floor(1000 + Math.random() * 9000), name, service, price, status });
            }
            document.getElementById("order-modal").classList.remove("open");
            renderAllData();
        });
    }

    function bindOrderEvents() {
        document.querySelectorAll(".delete-order-btn").forEach(b => b.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            if (confirm("Xóa đơn hàng này?")) { mockOrders = mockOrders.filter(o => o.id !== id); renderAllData(); }
        }));
        document.querySelectorAll(".edit-order-btn").forEach(b => b.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            const o = mockOrders.find(item => item.id === id);
            if (o) {
                document.getElementById("order-modal-title").textContent = "Sửa Đơn Hàng";
                document.getElementById("form-order-id").value = o.id;
                document.getElementById("form-order-name").value = o.name;
                document.getElementById("form-order-service").value = o.service;
                document.getElementById("form-order-price").value = o.price;
                document.getElementById("form-order-status").value = o.status;
                document.getElementById("order-modal").classList.add("open");
            }
        }));
    }

    // Xử lý Form Khách Hàng
    const custForm = document.getElementById("cust-form");
    if (custForm) {
        custForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const id = document.getElementById("form-cust-id").value;
            const name = document.getElementById("form-cust-name").value;
            const phone = document.getElementById("form-cust-phone").value;
            const address = document.getElementById("form-cust-address").value;

            if (id) {
                let idx = mockCustomers.findIndex(c => c.id === id);
                if (idx !== -1) mockCustomers[idx] = { id, name, phone, address };
            } else {
                mockCustomers.push({ id: "KH-" + (mockCustomers.length + 101), name, phone, address });
            }
            document.getElementById("cust-modal").classList.remove("open");
            renderAllData();
        });
    }

    function bindCustEvents() {
        document.querySelectorAll(".delete-cust-btn").forEach(b => b.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            if (confirm("Xóa hồ sơ khách hàng?")) { mockCustomers = mockCustomers.filter(c => c.id !== id); renderAllData(); }
        }));
        document.querySelectorAll(".edit-cust-btn").forEach(b => b.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            const c = mockCustomers.find(item => item.id === id);
            if (c) {
                document.getElementById("cust-modal-title").textContent = "Sửa Thông Tin Khách Hàng";
                document.getElementById("form-cust-id").value = c.id;
                document.getElementById("form-cust-name").value = c.name;
                document.getElementById("form-cust-phone").value = c.phone;
                document.getElementById("form-cust-address").value = c.address;
                document.getElementById("cust-modal").classList.add("open");
            }
        }));
    }

    // Xử lý Form Dịch Vụ
    const servForm = document.getElementById("serv-form");
    if (servForm) {
        servForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const id = document.getElementById("form-serv-id").value;
            const name = document.getElementById("form-serv-name").value;
            const price = parseInt(document.getElementById("form-serv-price").value) || 0;
            const unit = document.getElementById("form-serv-unit").value;

            if (id) {
                let idx = mockServices.findIndex(s => s.id === id);
                if (idx !== -1) mockServices[idx] = { id, name, price, unit };
            } else {
                mockServices.push({ id: "S" + (mockServices.length + 1), name, price, unit });
            }
            document.getElementById("serv-modal").classList.remove("open");
            renderAllData();
        });
    }

    function bindServEvents() {
        document.querySelectorAll(".delete-serv-btn").forEach(b => b.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            if (confirm("Xóa dịch vụ này?")) { mockServices = mockServices.filter(s => s.id !== id); renderAllData(); }
        }));
        document.querySelectorAll(".edit-serv-btn").forEach(b => b.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            const s = mockServices.find(item => item.id === id);
            if (s) {
                document.getElementById("serv-modal-title").textContent = "Sửa Gói Dịch Vụ";
                document.getElementById("form-serv-id").value = s.id;
                document.getElementById("form-serv-name").value = s.name;
                document.getElementById("form-serv-price").value = s.price;
                document.getElementById("form-serv-unit").value = s.unit;
                document.getElementById("serv-modal").classList.add("open");
            }
        }));
    }

    // ==============================================================================
    // --- TÌM KIẾM NHANH ---
    // ==============================================================================
    const orderSearch = document.getElementById("order-search-input");
    if (orderSearch) {
        orderSearch.addEventListener("input", function(e) {
            const kw = e.target.value.toLowerCase().trim();
            renderOrders(mockOrders.filter(o => o.name.toLowerCase().includes(kw)));
        });
    }

    const custSearch = document.getElementById("cust-search-input");
    if (custSearch) {
        custSearch.addEventListener("input", function(e) {
            const kw = e.target.value.toLowerCase().trim();
            renderCustomers(mockCustomers.filter(c => c.name.toLowerCase().includes(kw) || c.phone.includes(kw)));
        });
    }

    // ==============================================================================
    // --- CHỨC NĂNG 5: ĐÓNG MỞ DROPDOWN (AVATAR & CHUÔNG THÔNG BÁO) ---
    // ==============================================================================
    const notiBtn = document.getElementById("noti-btn");
    const notiPanel = document.getElementById("noti-panel");
    const avatarBtn = document.getElementById("avatar-btn");
    const profilePanel = document.getElementById("profile-panel");

    if (notiBtn && notiPanel) {
        notiBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            if (profilePanel) profilePanel.classList.remove("show");
            notiPanel.classList.toggle("show");
        });
    }

    if (avatarBtn && profilePanel) {
        avatarBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            if (notiPanel) notiPanel.classList.remove("show");
            profilePanel.classList.toggle("show");
        });
    }

    document.addEventListener("click", function (e) {
        if (notiPanel && notiBtn && !notiBtn.contains(e.target) && !notiPanel.contains(e.target)) {
            notiPanel.classList.remove("show");
        }
        if (profilePanel && avatarBtn && !avatarBtn.contains(e.target) && !profilePanel.contains(e.target)) {
            profilePanel.classList.remove("show");
        }
    });

    // ==============================================================================
        // --- CHỨC NĂNG NÂNG CẤP: CLICK CARD DASHBOARD CHUYỂN TAB MENU TƯƠNG ỨNG ---
        // ==============================================================================
        const dashboardCards = document.querySelectorAll(".dashboard-card-click");

        dashboardCards.forEach(card => {
            card.addEventListener("click", function () {
                // Lấy ID trang đích từ thuộc tính data-target của card vừa click (orders-page hoặc customers-page)
                const targetPageId = this.getAttribute("data-target");

                // Tìm nút Menu bên trái có thuộc tính data-target trùng khớp hoàn toàn
                const matchingMenuItem = document.querySelector(`.menu-item[data-target="${targetPageId}"]`);

                if (matchingMenuItem) {
                    // Kích hoạt giả lập cú click chuột vào nút menu đó
                    matchingMenuItem.click();
                }
            });
        });

    // ==============================================================================
    // --- KHỞI CHẠY ĐỒNG BỘ DỮ LIỆU ĐẦU TIÊN KHI MỞ TRANG WEB (F5) ---
    // ==============================================================================
    renderAllData();
});