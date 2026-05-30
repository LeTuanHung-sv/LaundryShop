document.addEventListener("DOMContentLoaded", function () {
    let customers = [
        { id: "CUST-01", name: "Nguyễn Văn A", phone: "0901234567", address: "123 Nguyễn Trãi, Quận 5" },
        { id: "CUST-02", name: "Trần Thị B", phone: "0987654321", address: "456 Lê Lợi, Quận 1" }
    ];

    const tbody = document.getElementById("customer-table-body");
    const modal = document.getElementById("cust-modal");
    const form = document.getElementById("cust-form");

    function render() {
        tbody.innerHTML = customers.map(c => `
            <tr>
                <td class="text-bold">${c.id}</td>
                <td><span class="c-name">${c.name}</span></td>
                <td>${c.phone}</td>
                <td class="text-muted">${c.address}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-action btn-edit" data-id="${c.id}"><i class="ri-edit-line"></i></button>
                        <button class="btn-action btn-delete" data-id="${c.id}"><i class="ri-delete-bin-line"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
        bind();
    }

    document.getElementById("open-cust-btn").addEventListener("click", () => {
        document.getElementById("cust-modal-title").textContent = "Đăng Ký Khách Hàng";
        form.reset(); document.getElementById("cust-id").value = "";
        modal.classList.add("open");
    });
    document.getElementById("close-cust-btn").addEventListener("click", () => modal.classList.remove("open"));

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const id = document.getElementById("cust-id").value;
        const name = document.getElementById("cust-name").value;
        const phone = document.getElementById("cust-phone").value;
        const address = document.getElementById("cust-address").value;

        if (id) {
            let idx = customers.findIndex(c => c.id === id);
            if (idx !== -1) customers[idx] = { id, name, phone, address };
        } else {
            customers.push({ id: "CUST-" + (customers.length + 1), name, phone, address });
        }
        modal.classList.remove("open"); render();
    });

    function bind() {
        document.querySelectorAll(".btn-delete").forEach(b => b.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            if(confirm("Xóa hồ sơ khách hàng này?")) { customers = customers.filter(c => c.id !== id); render(); }
        }));
        document.querySelectorAll(".btn-edit").forEach(b => b.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            const c = customers.find(item => item.id === id);
            if(c) {
                document.getElementById("cust-modal-title").textContent = "Sửa Hồ Sơ Khách Hàng";
                document.getElementById("cust-id").value = c.id;
                document.getElementById("cust-name").value = c.name;
                document.getElementById("cust-phone").value = c.phone;
                document.getElementById("cust-address").value = c.address;
                modal.classList.add("open");
            }
        }));
    }
    render();
});