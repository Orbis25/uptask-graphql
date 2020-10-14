const User = require("../models/Users");
const Project = require("../models/Projects");
const Task = require("../models/Tasks");

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * imports a env variables
 */
require("dotenv").config({
  path: "variables.env",
});

/**
 * build a token
 * @param {*} user User model
 * @param {*} secretKey secret_key
 * @param {*} expiresIn expirationTime
 */
const buildToken = (user, secretKey, expiresIn) => {
  const { id, email } = user;

  return jwt.sign({ id, email }, secretKey, { expiresIn });
};

/**
 * Resolvers are functions
 */

const resolvers = {
  Query: {
    getAllProyects: async (_, {}, ctx) => {
      return await Project.find({ createdBy: ctx.id });
    },
  },
  Mutation: {
    /**
     * @param _ are not common used but have relevant information
     * @param {input} input the data pased or the input
     * @param ctx contain the context of the types, mutation etc. and is used to check if user are logged and more is very inportant.
     */
    createUser: async (_, { input }, ctx) => {
      const { email, password } = input;

      /**
       * User model have a method to call, save and more the db,
       * -findOne find the user by email in the db
       */
      const userExist = await User.findOne({ email });
      if (userExist) {
        //if exist send this message to log
        throw new Error("El usuario existe");
      }

      try {
        //hash password
        const salt = await bcryptjs.genSalt(10); //generate randon string
        input.password = await bcryptjs.hash(password, salt);

        console.log(input);
        //create a new instace of user with in the constructor the input data
        const newUser = new User(input);
        await newUser.save();
        return "Usuario creado correctamente";
      } catch (error) {
        console.log(error);
      }
    },
    autenticateUser: async (_, { input }, ctx) => {
      const { email, password } = input;

      //exist user
      const userExist = await User.findOne({ email });
      if (!userExist) {
        //if exist send this message to log
        throw new Error("El usuario no existe");
      }

      // password is valid
      const result = await bcryptjs.compare(password, userExist.password);
      if (!result) {
        throw new Error("Password Incorrecto");
      }
      return { token: buildToken(userExist, process.env.SECRET_KEY, "2hr") };
    },

    //Projects
    createProject: async (_, { input }, ctx) => {
      const { name } = input;

      if (ctx === null) throw new Error("Token requerido");
      if (!name.length) throw new Error("el nombre esta vacio");

      try {
        const newProjet = new Project({ name, createdBy: ctx.id });
        await newProjet.save();
        return newProjet;
      } catch (error) {
        throw new Error("el nombre esta vacio");
      }
    },
    updateProject: async (_, { id, input }, ctx) => {
      let project = await Project.findById(id);

      if (!project) throw new Error("proyecto no encontrado");
      if (project.createdBy.toString() !== ctx.id)
        throw new Error("No tienes las credenciales para entrar");
      try {
        project = await Project.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
        return project;
      } catch (error) {
        throw new Error(error);
      }
    },
    removeProject: async (_, { id }, ctx) => {
      let project = await Project.findById(id);

      if (!project) throw new Error("proyecto no encontrado");
      if (project.createdBy.toString() !== ctx.id)
        throw new Error("No tienes las credenciales para eliminarlo");
      try {
        project = await Project.findByIdAndDelete({ _id: id });
        return "Proyecto Eliminado";
      } catch (error) {
        throw new Error(error);
      }
    },

    /**
     * Tasks
     */

    createTask: async (_, { input }, ctx) => {
      if (ctx === null) throw new Error("Error usuario o token invalido");

      const projectResult = await Project.findById(input.projectId);
      if (projectResult === null) throw new Error("El Projecto no existe");
      try {
        input.createdBy = ctx.id;
        const result = new Task(input);
        await result.save();
        return result;
      } catch (error) {
        throw new Error(error);
      }
    },
    updateTask: async (_, { id, input }, ctx) => {
      if (ctx === null) throw new Error("Error usuario o token invalido");

      let task = await Task.findById(id);
      if (task === null) throw new Error("Tarea no encontrada");
      if (task.createdBy.toString() !== ctx.id)
        throw new Error("El usuario no tiene permiso");

      if (!!input.projectId) {
        const projectResult = await Project.findById(input.projectId);
        if (projectResult === null) throw new Error("El Projecto no existe");
      }

      try {
        const result = await Task.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
        return result;
      } catch (error) {
        throw new Error(error);
      }
    },
    removeTask: async (_, { id }, ctx) => {
      let task = await Task.findById(id);

      if (!task) throw new Error("tarea no encontrada");
      if (task.createdBy.toString() !== ctx.id)
        throw new Error("No tienes las credenciales para eliminarla");
      try {
        task = await Task.findByIdAndDelete({ _id: id });
        return "Tarea Eliminada";
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

module.exports = resolvers;
