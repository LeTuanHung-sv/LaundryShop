document.addEventListener("DOMContentLoaded", function () {
    let mockOrders = [
        { id: "ORD-1001", name: "Nguyễn Văn A", service: "Giặt sấy lấy liền", price: 120000, status: "Đang xử lý", date: "30/05/2026 14:30" },
        { id: "ORD-1002", name: "Trần Thị B", service: "Giặt hấp gấu bông", price: 85000, status: "Đã hoàn thành", date: "30/05/2026 11:15" }
    ];

    const tableBody = document.getElementById("order-table-body");
    const modal = document.getElementById("order-modal");
    const orderForm = document.getElementById("order-form");

    function renderTable(data) {
        tableBody.innerHTML = data.map(order => `
            <tr>
                <td class="text-bold">#${order.id}</td>
                <td><span class="c-name">${order.name}</span></td>
                <td><span class="service-tag">${order.service}</span></td>
                <td class="text-bold">${order.price.toLocaleString('vi-VN')} đ</td>
                <td><span class="status-badge ${order.status === 'Đã hoàn thành' ? 'status-success' : 'status-pending'}">${order.status}</span></td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-action btn-edit" data-id="${order.id}"><i class="ri-edit-line"></i></button>
                        <button class="btn-action btn-delete" data-id="${order.id}"><i class="ri-delete-bin-line"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
        updateStats();
        bindEvents();
    }

    function updateStats() {
        document.getElementById("stat-total").textContent = mockOrders.length;
        document.getElementById("stat-success").textContent = mockOrders.filter(o => o.status === "Đã hoàn thành").length;
        document.getElementById("stat-pending").textContent = mockOrders.filter(o => o.status === "Đang xử lý").length;
        document.getElementById("stat-revenue").textContent = mockOrders.reduce((sum, o) => sum + o.price, 0).toLocaleString('vi-VN') + "đ";
    }

    document.getElementById("search-input").addEventListener("input", function(e) {
        const kw = e.target.value.toLowerCase();
        renderTable(mockOrders.filter(o => o.name.toLowerCase().includes(kw)));
    });

    document.getElementById("open-modal-btn").addEventListener("click", () => {
        document.getElementById("modal-title").textContent = "Thêm Đơn Hàng Mới";
        orderForm.reset(); document.getElementById("form-id").value = "";
        modal.classList.add("open");
    });
    document.getElementById("close-modal-btn").addEventListener("click", () => modal.classList.remove("open"));

    orderForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const id = document.getElementById("form-id").value;
        const name = document.getElementById("form-name").value;
        const service = document.getElementById("form-service").value;
        const price = parseInt(document.getElementById("form-price").value);
        const status = document.getElementById("form-status").value;

        if(id) {
            let idx = mockOrders.findIndex(o => o.id === id);
            if(idx !== -1) mockOrders[idx] = {...mockOrders[idx], name, service, price, status};
        } else {
            mockOrders.unshift({id: "ORD-"+Math.floor(1000+Math.random()*9000), name, service, price, status, date: "Hôm nay"});
        }
        modal.classList.remove("open"); renderTable(mockOrders);
    });

    function bindEvents() {
        document.querySelectorAll(".btn-delete").forEach(b => b.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            if(confirm("Xóa đơn hàng này?")) { mockOrders = mockOrders.filter(o => o.id !== id); renderTable(mockOrders); }
        }));
        document.querySelectorAll(".btn-edit").forEach(b => b.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            const o = mockOrders.find(item => item.id === id);
            if(o) {
                document.getElementById("modal-title").textContent = "Sửa Đơn Hàng";
                document.getElementById("form-id").value = o.id;
                document.getElementById("form-name").value = o.name;
                document.getElementById("form-service").value = o.service;
                document.getElementById("form-price").value = o.price;
                document.getElementById("form-status").value = o.status;
                modal.classList.add("open");
            }
        }));
    }

    renderTable(mockOrders);
});