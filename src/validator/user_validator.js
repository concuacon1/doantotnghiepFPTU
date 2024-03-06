const {enum_role} = require("../common/enum.database")
const minFullName = 5
const maxFullName = 100

const createUserValidatorSchema = {
    fullName: {
        notEmpty: {
            errorMessage: "Username không được để trống"
        },
        isLength: {
            options: {
                min: minFullName,
                max: maxFullName
            },
            errorMessage: `Họ và tên có tối thiểu ${minFullName} kí tự và tối đa ${maxFullName} kí tự`
        },
        isString: {
            errorMessage: "Họ và tên phải là chuỗi string"
        }
    },
    password: {
        notEmpty: {
            errorMessage: "Mật khẩu không được để trống"
        },
        isLength: {
            options: {
                min: minFullName,
                max: maxFullName
            },
            errorMessage: `Mật khẩu  có tối thiểu ${minFullName} kí tự và tối đa ${maxFullName} kí tự`
        },
        isString: {
            errorMessage: "Mật khẩu phải là chuỗi string"
        }
    },
    email: {
        notEmpty: {
            errorMessage: "email không được để trống"
        },
        isEmail: {
            errorMessage: "Không đúng định dạng email"
        },
        isString: {
            errorMessage: "Họ và tên phải là chuỗi string"
        }
    },
    role: {
        notEmpty: {
            errorMessage: "Quyền không được để trống"
        }, 
        isIn: {
            options: [enum_role],
            errorMessage: "Không đúng định dạng quyền"
        }
    },
    phoneNumber : {
        notEmpty: {
            errorMessage: "phoneNumber không được để trống"
        }, 
        matches: {
            options: /^(03|05|07|08|09)+([0-9]{8})$/, 
            errorMessage: "phoneNumber không hợp định dạng"
        }
    }
}


module.exports = {
    createUserValidatorSchema
}