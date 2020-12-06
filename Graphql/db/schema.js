const { gql } = require("apollo-server");

//ID IS UNIQUE IDENTIFIER
// (!) IS REQUIRED
const typeDefs = gql`
  type Project {
    name: String!
    id: ID!
  }

  type Token {
    token: String
  }

  type Task {
    id: ID!
    name: String!
    state: Boolean
    projectId: ID!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  input AuthInput {
    email: String!
    password: String!
  }

  input ProjectInput {
    name: String!
  }

  input ProjectIDInput {
    id: ID!
  }

  input TaskInput {
    name: String!
    projectId: ID!
  }

  type Query {
    getAllProyects: [Project]
    getAllTasks(input: ProjectIDInput): [Task]
  }

  type Mutation {
    createUser(input: UserInput): String
    autenticateUser(input: AuthInput): Token

    #Projects
    createProject(input: ProjectInput): Project
    updateProject(id: ID!, input: ProjectInput): Project
    removeProject(id: ID!): String

    #Tasks
    createTask(input: TaskInput): Task
    updateTask(id: ID!): Task
    removeTask(id: ID!): String
  }
`;

/**
 *- the mutations are a call input and manage this
 */
/**
 * -input enter a data and set the params required in the model
 * -the words input are a convention the end of inputName example (UserInput)
 *  and the params are the model properties
 * - the params for required the sintax is propertyName:type! (!) use this left the type
 */

module.exports = typeDefs;
