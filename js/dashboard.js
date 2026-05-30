document.addEventListener("DOMContentLoaded", function() {
    // Fake dữ liệu tổng quan
    const recentOrders = [
        { id: "ORD-9921", name: "Trần Hùng", service: "Giặt sấy lấy liền", status: "Đang xử lý" },
        { id: "ORD-9920", name: "Lê Minh", service: "Giặt hấp gấu bông", status: "Đã hoàn thành" },
        { id: "ORD-9919", name: "Nguyễn Thảo", service: "Giặt khô là hơi", status: "Đang xử lý" }
    ];

    const servicePopularity = [
        { name: "Giặt sấy lấy liền", percentage: 65, color: "#3b82f6" },
        { name: "Giặt khô là hơi", percentage: 25, color: "#a855f7" },
        { name: "Giặt hấp gấu bông", percentage: 10, color: "#f97316" }
    ];

    // Đổ dữ liệu bảng
    const tbody = document.getElementById("recent-orders-tbody");
    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td class="text-bold">#${order.id}</td>
            <td><span class="c-name">${order.name}</span></td>
            <td><span class="service-tag">${order.service}</span></td>
            <td><span class="status-badge ${order.status === 'Đã hoàn thành' ? 'status-success' : 'status-pending'}">${order.status}</span></td>
        </tr>
    `).join('');

    // Đổ dữ liệu tiến độ dịch vụ
    const progressList = document.getElementById("services-progress-list");
    progressList.innerHTML = servicePopularity.map(item => `
        <div class="progress-bar-wrapper">
            <div class="progress-info"><span>${item.name}</span><strong>${item.percentage}%</strong></div>
            <div class="progress-track"><div class="progress-fill" style="width: ${item.percentage}%; background-color: ${item.color}"></div></div>
        </div>
    `).join('');
});