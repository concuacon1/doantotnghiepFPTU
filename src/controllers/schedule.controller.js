const ScheduleSchema = require("../models/schedule.model")


const schedule = {
    register_schedule_on: async (req, res) => {
        const { timeWorkOn, timeWorkOff, description_off } = req.body;
        const idUser = req.dataToken.id;
        if (timeWorkOn.length > 0) {
            timeWorkOn.forEach(async itemDateWorkOff => { // Declare the function as async
                const datasave = new ScheduleSchema({
                    timeWork: new Date(itemDateWorkOff),
                    description_off: description_off,
                    designerId: idUser
                });

                await datasave.save(); // Use await here
            });
        }

        if (timeWorkOff.length > 0) {
            timeWorkOff.forEach(async itemDateWorkOn => { // Declare the function as async
                const datasave = new ScheduleSchema({
                    timeWork: new Date(itemDateWorkOn),
                    workOn: true,
                    designerId: idUser
                });

                await datasave.save(); // Use await here
            });
        }

        return res.json({ message: "", data: "Tạo thành công" })
    },
    book_for_customer: async (req, res) => {
        const idUser = req.dataToken.id;
        const { timeSelect, id_schedule, description_book } = req.body;
        await ScheduleSchema.findOneAndUpdate({ _id: ObjectId(id_schedule) }, {
            $set: {
                timeSelect: timeSelect,
                customerId: idUser,
                status: "PENDDING",
                description_book: description_book
            }
        })
        return res.json({ message: "", data: "Đặt lịch thành công" })
        //   isSelectBook
        // status
    }

}



module.exports = schedule