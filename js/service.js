document.addEventListener("DOMContentLoaded", function () {
    let services = [
        { id: "S1", name: "Giặt sấy lấy liền", price: 30000, unit: "kg" },
        { id: "S2", name: "Giặt khô là hơi", price: 90000, unit: "bộ" },
        { id: "S3", name: "Giặt hấp gấu bông", price: 50000, unit: "con" }
    ];

    const tbody = document.getElementById("services-table-body");
    const modal = document.getElementById("serv-modal");
    const form = document.getElementById("serv-form");

    function render() {
        tbody.innerHTML = services.map(s => `
            <tr>
                <td class="text-bold">${s.name}</td>
                <td class="text-price text-bold">${s.price.toLocaleString('vi-VN')} đ</td>
                <td><span class="service-tag">${s.unit}</span></td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-action btn-edit" data-id="${s.id}"><i class="ri-edit-line"></i></button>
                        <button class="btn-action btn-delete" data-id="${s.id}"><i class="ri-delete-bin-line"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
        bind();
    }

    document.getElementById("open-serv-btn").addEventListener("click", () => {
        document.getElementById("serv-modal-title").textContent = "Thêm Dịch Vụ";
        form.reset(); document.getElementById("serv-id").value = "";
        modal.classList.add("open");
    });
    document.getElementById("close-serv-btn").addEventListener("click", () => modal.classList.remove("open"));

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const id = document.getElementById("serv-id").value;
        const name = document.getElementById("serv-name").value;
        const price = parseInt(document.getElementById("serv-price").value);
        const unit = document.getElementById("serv-unit").value;

        if (id) {
            let idx = services.findIndex(s => s.id === id);
            if (idx !== -1) services[idx] = { id, name, price, unit };
        } else {
            services.push({ id: "S" + (services.length + 1), name, price, unit });
        }
        modal.classList.remove("open"); render();
    });

    function bind() {
        document.querySelectorAll(".btn-delete").forEach(b => b.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            if(confirm("Xóa gói dịch vụ này?")) { services = services.filter(s => s.id !== id); render(); }
        }));
        document.querySelectorAll(".btn-edit").forEach(b => b.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            const s = services.find(item => item.id === id);
            if(s) {
                document.getElementById("serv-modal-title").textContent = "Chỉnh Sửa Dịch Vụ";
                document.getElementById("serv-id").value = s.id;
                document.getElementById("serv-name").value = s.name;
                document.getElementById("serv-price").value = s.price;
                document.getElementById("serv-unit").value = s.unit;
                modal.classList.add("open");
            }
        }));
    }
    render();
});