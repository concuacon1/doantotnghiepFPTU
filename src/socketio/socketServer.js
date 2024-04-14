
let listUserStaffOnline = [];
// array = { id  : string and socketIds  : array }
let listUserAdminOnline = [];

let listUserCustomerOnline = [];


let checkVtStaff = -1;
let checkVtAdmin = -1;

const SocketServer = (socket, io) => {
    socket.on('disconnect', () => {

        // const idSocketClose = socket.id;
        // let findIdSocket
        // for
    });


    socket.on('online_user', (dataClient) => {
        const { idUser, roleUser } = dataClient;
        const idSocket = socket.id;
        let checkList = [];
        if (roleUser == "ADMIN") {
            checkList = listUserAdminOnline;
        } else if (roleUser == "STAFF") {
            checkList = listUserStaffOnline;
        } else if (roleUser == "CUSTOMER") {
            checkList = listUserCustomerOnline;
        }
        if (roleUser == "ADMIN") {
            const findIndex = checkList.indexOf(item => item.id === idUser)
            if (findIndex == -1) {
                checkList.push({
                    id: idUser,
                    socketIds: [idSocket]
                })
            } else {
                checkList[findIndex].socketIds.push(idSocket)
            }
        }
    });


    socket.on('create_room', (dataClient) => {
        const { idUser } = { dataClient };
        const dataCustomer = listUserCustomerOnline.filter(item => item.id == idUser);
        let listSocket = dataCustomer.socketIds;
        const randomRoomAddPerMisionUser = Math.floor(Math.random() * 2) + 1;
        let randomIndex = -1;
        // when =1 add staff chat (else reselve)
        if (randomRoomAddPerMisionUser == 1) {
            if (listUserStaffOnline.length > 0) {
                randomIndex = Math.floor(Math.random() * listUserStaffOnline.length);
            } else if (listUserAdminOnline.length > 0) {
                randomIndex = Math.floor(Math.random() * listUserAdminOnline.length);
            }
            for (let y = 0; y < listSocket.length; y++) {
                io.to(listSocket[y]).emit('id_chat', dataClient);
            }
        } else {
            if (listUserAdminOnline.length > 0) {
                randomIndex = Math.floor(Math.random() * listUserAdminOnline.length);
            } else if (listUserStaffOnline.length > 0) {
                randomIndex = Math.floor(Math.random() * listUserStaffOnline.length);
            }
            for (let y = 0; y < listSocket.length; y++) {
                io.to(listSocket[y]).emit('id_chat', dataClient);
            }
        }
    });

    // // support user online multi smart and pc
    // socket.on('join_room_online_user', (dataClient) => {
    //     const { id, role } = dataClient;
    //     socket.join(`${role}_${id}`);
    //     const dataPush = {
    //         id: 
    //     }
    //     if (!listUserStaffOnline.includes(id) && role === "STAFF") {
    //         listUserStaffOnline.push(id)
    //     }
    //     if (!listUserAdminOnline.includes(id) && role === "ADMIN") {
    //         listUserAdminOnline.push(id)
    //     }
    // })

    // // join room user and staff or admin
    // socket.on('join_room_after_chat', (dataClient) => {
    //     const { id, role } = dataClient;
    //     const message = `${role}_${id}`
    //     const randomRoomAddPerMisionUser = Math.floor(Math.random() * 2) + 1;
    //     // when =1 add staff chat (else reselve)
    //     if (randomRoomAddPerMisionUser == 1) {
    //         const randomIndex = Math.floor(Math.random() * listUserStaffOnline.length);
    //         io.to(`STAFF_${listUserStaffOnline[randomIndex]}`).emit('create_join_chat', message);
    //     } else {
    //         const randomIndex = Math.floor(Math.random() * listUserAdminOnline.length);
    //         io.to(`ADMIN_${listUserAdminOnline[randomIndex]}`).emit('create_join_chat', message);
    //     }
    // })

    // socket.on('join_room_chat', (dataClient) => {
    //     const { message } = dataClient;
    //     io.to(room).sockets.socket(socketId);
    //     socket.join(message);
    // })




    socket.on("message", (dataClient) => {
        const { id_from, roleUserFrom, id_to, roleUserTo } = dataClient;
        let checkListFrom = [];
        let checkListTo = [];
        if (roleUserFrom == "ADMIN") {
            checkListFrom = listUserAdminOnline;
        } else if (roleUserFrom == "STAFF") {
            checkListFrom = listUserStaffOnline;
        } else if (roleUserFrom == "CUSTOMER") {
            checkListFrom = listUserCustomerOnline;
        }

        if (roleUserTo == "ADMIN") {
            checkListTo = listUserAdminOnline;
        } else if (roleUserTo == "STAFF") {
            checkListTo = listUserStaffOnline;
        } else if (roleUserTo == "CUSTOMER") {
            checkListTo = listUserCustomerOnline;
        }

        const dataTo = checkListTo.find(item => item.id == id_to);
        const dataFrom = checkListFrom.find(item => item.id == id_from);
        for (let i = 0; i < dataTo.length; i++) {
            io.to(dataTo.socketIds[i]).emit('message', dataClient);
        }

        for (let y = 0; y < dataFrom.length; y++) {
            io.to(dataFrom.socketIds[y]).emit('message', dataClient);
        }

    });

};

module.exports = SocketServer;