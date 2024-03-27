const ScheduleSchema = require("../models/schedule.model")
const DesignerSchema = require("../models/designer.model")
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const schedule = {
    getDesignerCalendar: async (req, res) => {
        try {
            const { designerId } = req.params; // _id cua bang designer
            const designerInfo = await DesignerSchema.find({ _id: designerId });
            const idUser = req.dataToken.id;
            const workOnDate = await ScheduleSchema.find({ designerId, workOn: true });
            const workOnDates = workOnDate && workOnDate.map(schedule => new Date(schedule.timeWork).toISOString().slice(0, 10));

            // designer xem lịch của chính mình
            if (designerInfo.length > 0 && designerInfo[0].designerId == idUser) {
                const busySchedules = await ScheduleSchema.find({ designerId: designerInfo[0].designerId, workOn: false });
                console.log("busySchedules == ", busySchedules);
                if (busySchedules.length === 0) {
                    return res.status(200).json({
                        busyDates: [],
                        scheduleId: '',
                        workOnDates,
                        designerId
                    });
                }
                const busyDates = busySchedules.map(schedule => new Date(schedule.timeWork).toISOString().slice(0, 10));
                res.status(200).json({
                    busyDates,
                    scheduleId: '',
                    workOnDates,
                    designerId
                });
            } else {
                const busySchedules = await ScheduleSchema.find({ designerId: designerInfo[0].designerId, status: { $ne: "YES" } });

                const busyDates = busySchedules.length > 0 ? busySchedules.map(schedule => new Date(schedule.timeWork).toISOString().slice(0, 10)) : [];
                const existingSchedule = await ScheduleSchema.findOneAndUpdate(
                    { designerId: designerInfo[0].designerId, customerId: idUser },
                    { $setOnInsert: { designerId: designerInfo[0].designerId, customerId: idUser, timeWork: null, workOn: false } },
                    { upsert: true, new: true }
                );
                const old = await ScheduleSchema.find({
                    designerId: designerInfo[0].designerId,
                    customerId: idUser,
                    isSelectBook: true
                });

                return res.status(200).json({
                    busyDates: busyDates,
                    scheduleId: existingSchedule._id,
                    workOnDates,
                    designerId,
                    isSelectBook: old.length > 0
                });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách các ngày bận của designer.' });
        }
    },
    register_schedule_on: async (req, res) => {
        const { timeWorkOn, description_off } = req.body;
        const idUser = req.dataToken.id;
        if (timeWorkOn.length > 0) {
            timeWorkOn.forEach(async itemDateWorkOff => { // Declare the function as async
                const datasave = new ScheduleSchema({
                    timeWork: itemDateWorkOff,
                    description_off: description_off,
                    designerId: idUser
                });

                await datasave.save(); // Use await here
            });
        }

        return res.json({ message: "", data: "Tạo thành công" })
    },
    book_for_customer: async (req, res) => {
        const idUser = req.dataToken.id;
        const { timeSelect, id_schedule, description_book, timeWork, phoneNumber, email } = req.body;
        await ScheduleSchema.findOneAndUpdate({ _id: ObjectId(id_schedule) }, {
            $set: {
                timeSelect: timeSelect,
                customerId: idUser,
                status: "PENDDING",
                description_book: description_book,
                timeWork,
                phoneNumber,
                email,
                isSelectBook: true
            },
        }, { new: true })
        return res.json({ message: "", data: "Đặt lịch thành công" })
    }

}



module.exports = schedule