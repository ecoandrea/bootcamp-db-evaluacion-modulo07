import { NotFoundError } from "../errors/typeErrors.js";
import { Bootcamp } from "../models/Bootcamp.model.js";
import { User } from "../models/User.model.js";

export const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      message: "Bootcamp creado con éxito",
      status: 201,
      data: bootcamp,
    });
  } catch (error) {
    next(error);
  }
};

export const addUser = async (req, res, next) => {
  try {
    const { bootcampId, userId } = req.body; 
    const bootcamp = await Bootcamp.findByPk(bootcampId, {
      attributes: ["id", "title"],
    }); 
    const user = await User.findByPk(userId, {
      attributes: ["id", "firstName", "lastName"],
    }); 

    if (!bootcamp || !user) {
      throw new NotFoundError("Bootcamp o Usuario no encontrado");
    }

    // Asociar el usuario al bootcamp
    await bootcamp.addUser(user);

    res.status(200).json({
      message: "Usuario agregado al Bootcamp con éxito",
      status: 200,
      data: { bootcamp, user },
    });
  } catch (error) {
    next(error);
  }
};

export const findById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bootcamp = await Bootcamp.findByPk(id);

    res.status(200).json({
      message: "Bootcamp encontrado con éxito",
      status: 200,
      data: bootcamp,
    });
  } catch (error) {
    next(error);
  }
};


export const findAll = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.findAll({
      attributes: ["id", "title"], 
      include: {
        model: User, 
        as: "users", 
        attributes: ["id", "firstName", "lastName"], 
        through: {
          attributes: [], 
        },
      },
  
    });

    if (bootcamps.length === 0) {
      throw new NotFoundError("No se ha encotrado los datos");
    }

    res.status(200).json({
      message: "Usuarios obtenidos con éxito",
      status: 200,
      data: bootcamps,
    });
  } catch (error) {
    next(error);
  }
};

//Additional controllers to complete the CRUD

export const updateBootcamp = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bootcamp = await Bootcamp.update(req.body, {
      where: { id },
      returning: true,
    });

    res.status(200).json({
      message: "Bootcamp actualizado con éxito",
      status: 200,
      data: bootcamp,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBootcampById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Bootcamp.destroy({ where: { id } });

    res.status(200).json({
      message: "Bootcamp eliminado con éxito",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};
