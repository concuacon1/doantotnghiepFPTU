const {
   createUser,
   getUserByIdSevice,
} = require("../../services/user/user.service");

const getUserController = (req, res) => {
   return res.status(200).json({
      user: "Dao Duc",
      phone_number: "0912634289",
      address: "Ha Noi",
      email: "ducdm@gmail.com",
      gender: "Male",
      role: "ADMIN"
   });
};

const createUserController = async (req, res) => {
   const { firstName, lastName, password, email, gender } = await req.body;
   console.log('==>', req.body);

   const userServiceResponse = await createUser({
      firstName,
      lastName,
      password,
      email,
      gender,
   });
   console.log(userServiceResponse);
   return res.status(201).json(userServiceResponse);
};

const getUserByIdController = async (req, res) => {
   const { id } = req.params;

   const getUserByIdResponse = await getUserByIdSevice({ userId: id });

   return res.status(200).json(getUserByIdResponse);
};

module.exports = {
   getUserController,
   createUserController,
   getUserByIdController,
};
