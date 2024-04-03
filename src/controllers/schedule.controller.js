const ScheduleSchema = require("../models/schedule.model")
const UserSchema = require("../models/user.model")
const DesignerSchema = require("../models/designer.model")
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const schedule = {
    createSchedule: async (req, res) => {
        try {
            const idUser = req.dataToken.id;
            const designerInfo = await DesignerSchema.find({ designerId: idUser });
            const designerId = designerInfo[0]._id; // _id trong bảng Designer
            const workOnDate = await ScheduleSchema.find({ designerId, workOn: true });
            const workOnDates = workOnDate && workOnDate.map(schedule => schedule.timeWork);

            const busySchedules = await ScheduleSchema.find({ designerId, workOn: false });
            if (busySchedules.length === 0) {
                return res.status(200).json({
                    busyDates: [],
                    scheduleId: '',
                    workOnDates,
                    designerId
                });
            }
            const busyDates = busySchedules.map(schedule => schedule.timeWork);
            res.status(200).json({
                busyDates,
                scheduleId: '',
                workOnDates,
                designerId
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách các ngày bận của designer.' });
        }
    },
    getDesignerCalendar: async (req, res) => {
        try {
            const { designerId } = req.params; // _id cua bang designer
            const idUser = req.dataToken.id;
            const workOnDate = await ScheduleSchema.find({
                designerId,
                customerId: idUser,
                workOn: true
            });
            const workOnDates = workOnDate && workOnDate.map(schedule => schedule.timeWork);

            const busySchedules = await ScheduleSchema.find({ designerId, status: { $ne: "YES" } });

            const busyDates = busySchedules.length > 0 ? busySchedules.map(schedule => schedule.timeWork) : [];
            const existingSchedule = await ScheduleSchema.findOneAndUpdate(
                { designerId, customerId: idUser },
                { $setOnInsert: { designerId, customerId: idUser, timeWork: null, workOn: false } },
                { upsert: true, new: true }
            );
            const old = await ScheduleSchema.find({
                designerId,
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
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách các ngày bận của designer.' });
        }
    },
    register_schedule_on: async (req, res) => {
        const { timeWorkOn, description_off } = req.body;
        const idUser = req.dataToken.id;
        const scheduleInfo = await DesignerSchema.find({ designerId: idUser });
        if (timeWorkOn.length > 0) {
            for (const itemDateWorkOff of timeWorkOn) {
                const datasave = new ScheduleSchema({
                    timeWork: new Date(itemDateWorkOff).toISOString().slice(0, 10),
                    description_off: description_off,
                    designerId: scheduleInfo[0]._id
                });

                await datasave.save();
            }
        }

        return res.json({ message: "", data: "Tạo thành công" });
    },
    book_for_customer: async (req, res) => {
        const idUser = req.dataToken.id;
        const { timeSelect, id_schedule, description_book, timeWork, phoneNumber, email, place } = req.body;
        await ScheduleSchema.findOneAndUpdate({ _id: ObjectId(id_schedule) }, {
            $set: {
                timeSelect: timeSelect,
                customerId: idUser,
                status: "PENDDING",
                description_book: description_book,
                timeWork: new Date(timeWork).toISOString().slice(0, 10),
                phoneNumber,
                email,
                isSelectBook: true,
                place
            },
        }, { new: true })
        return res.json({ message: "", data: "Đặt lịch thành công" })
    },
    getScheduleInfoByDesigner: async (req, res) => {
        try {
            const idUser = req.dataToken.id;
            const { timeWork } = req.query;

            const scheduleInfo = await DesignerSchema.findOne({ designerId: idUser });

            if (!scheduleInfo) {
                return res.status(404).json({ message: "Designer not found" });
            }

            const dataRes = await ScheduleSchema.find({
                designerId: scheduleInfo._id,
                timeWork: timeWork,
                workOn: true
            });

            if (dataRes.length === 0) {
                return res.status(404).json({ message: "No schedule found" });
            }

            const userInfo = await UserSchema.findOne({ _id: dataRes[0].customerId });

            return res.json({
                message: "Schedule information retrieved successfully",
                data: {
                    schedule: dataRes[0],
                    user: userInfo
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    getScheduleInfoByCustomer: async (req, res) => {
        const idUser = req.dataToken.id;
        const { timeWork } = req.query;
        let dataRes = await ScheduleSchema.find({
            customerId: idUser,
            timeWork: timeWork,
            workOn: true
        });
        return res.json({ message: "Lấy thông tin đặt lịch thành công", data: dataRes })
    },

    getListScheduleByUser: async (req, res) => {
        try {
            const idUser = req.dataToken.id;

            // Lấy danh sách lịch đặt từ cơ sở dữ liệu cho người dùng hiện tại
            let scheduleList = await ScheduleSchema.find({
                customerId: idUser,
                workOn: true
            });

            scheduleList = await Promise.all(scheduleList.map(async (schedule) => {
                const designer = await DesignerSchema.findOne({ _id: schedule.designerId });
                let user = null;
                if (designer) {
                    user = await UserSchema.findOne({ _id: designer.designerId });
                }
                return {
                    scheduleInfo: schedule,
                    designerInfo: user
                };
            }));

            return res.json({ message: "Lấy thông tin đặt lịch thành công", data: scheduleList });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Đã xảy ra lỗi khi lấy thông tin đặt lịch" });
        }
    },

    getAllListSchedule: async (req, res) => {
        try {
            const query = {
                $and: [
                    { designerId: { $ne: null } },
                    { customerId: { $ne: null } },
                    { timeWork: { $ne: null } },
                ]
            };

            let schedules = await ScheduleSchema.find(query);

            schedules = await Promise.all(schedules.map(async (schedule) => {
                const designer = await DesignerSchema.findOne({ _id: schedule.designerId });
                let userDesigner = null;
                let userCustomer = null;
                if (designer) {
                    userDesigner = await UserSchema.findOne({ _id: designer.designerId });
                    userCustomer = await UserSchema.findOne({ _id: schedule.customerId });
                }
                return {
                    scheduleInfo: schedule,
                    designerInfo: userDesigner,
                    customerInfo: userCustomer
                };
            }));

            return res.json({ message: "Lấy thông tin đặt lịch thành công", data: schedules });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server Error' });
        }
    },

    searchListSchedule: async (req, res) => {
        try {
            const { time, designerName, customerName, startDate, endDate } = req.body;

            const baseQuery = {
                $and: [
                    { designerId: { $ne: null } },
                    { customerId: { $ne: null } },
                    { timeWork: { $ne: null } },
                ]
            };

            const query = {};

            if (time != 'All') query.timeSelect = time;
            if (startDate && endDate) {
                query['timeWork'] = {
                    $gte: startDate,
                    $lte: endDate,
                };
            }

            if (designerName) {
                const designer = await UserSchema.findOne({
                    fullName: { $regex: new RegExp(designerName, 'i') },
                    role: 'DESIGNER'
                });
                if (designer) {
                    let des = await DesignerSchema.find({ designerId: designer._id })
                    query['designerId'] = des[0]._id;
                }
            }

            if (customerName) {
                const customer = await UserSchema.findOne({
                    fullName: { $regex: new RegExp(customerName, 'i') },
                    role: 'CUSTOMER'
                });
                if (customer) {
                    query['customerId'] = customer._id;
                }
            }

            const finalQuery = { ...baseQuery, ...query };

            let schedules = await ScheduleSchema.find(finalQuery);

            schedules = await Promise.all(schedules.map(async (schedule) => {
                let designer = await DesignerSchema.findOne({ _id: schedule.designerId });
                let userDesigner = null;
                let userCustomer = null;
                if (designer) {
                    userDesigner = await UserSchema.findOne({ _id: designer.designerId });
                    userCustomer = await UserSchema.findOne({ _id: schedule.customerId });
                }
                return {
                    scheduleInfo: schedule,
                    designerInfo: userDesigner,
                    customerInfo: userCustomer
                };
            }));
            return res.json({ message: "Lấy thông tin đặt lịch thành công", data: schedules });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server Error' });
        }
    },
}

module.exports = schedule