
let listUserCustomer = [];
let listUserStaffAndAdmin = [];
let listRoomCustomer = [];

const SocketServer = (socket , io) => {
    socket.on('disconnect', () => {
        // Xóa người dùng khỏi danh sách khi họ ngắt kết nối
        listUserCustomer = listUserCustomer.filter(user => user.socketId !== socket.id);
        console.log("list_online_after_off", listUserCustomer);
    });

    socket.on('joinRoom', () => {
        const { id, role } = socket.dataUser;
        if (role === "CUSTOMER") {
            // Nếu là khách hàng, thêm vào danh sách người dùng trực tuyến
            const fineUserOnlineForIdUser = listUserCustomer.find(e => e.idUser === id);
            const fineUserOnlineForSocketId = listUserCustomer.find(e => e.socketId === socket.id);
            let roomId = `customer_${id}`;
            console.log(roomId)
            if (!fineUserOnlineForIdUser && !fineUserOnlineForSocketId) {
                listUserCustomer.push({ idUser: id, socketId: socket.id, role: role, roomId: roomId });
                console.log("list_online_customer", listUserCustomer);
                // Khi khách hàng trực tuyến, tất cả các nhân viên và quản trị viên cũng tham gia vào phòng của khách hàng
                socket.join("customer_66081195f494cd37084d30b5");
            }
        } else if (role === "ADMIN" || role === "STAFF") {
            // Nếu là quản trị viên hoặc nhân viên, thêm vào danh sách người dùng trực tuyến
            const fineUserOnlineForIdUserAdminAndStaff = listUserStaffAndAdmin.find(e => e.idUser === id);
            const fineUserOnlineForSocketIdAdminAndStaff = listUserStaffAndAdmin.find(e => e.socketId === socket.id);
            if (!fineUserOnlineForIdUserAdminAndStaff && !fineUserOnlineForSocketIdAdminAndStaff) {
                listUserStaffAndAdmin.push({ idUser: id, socketId: socket.id, role: role });
                console.log("list_online_admin", listUserStaffAndAdmin);
            }
        }
        socket.join("customer_66081195f494cd37084d30b5");
    });

    socket.on("message", (dataClient) => {
        const { roomName, message } = dataClient;
        console.log(`data_chat: ${roomName} ${message}`);
        // Gửi tin nhắn đến phòng
        io.to("customer_66081195f494cd37084d30b5").emit('message', message);
    });
};

module.exports = SocketServer;