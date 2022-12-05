
const { gql } = require('apollo-server-express');
const TodoListsModel = require("./models/todoSchema");

const { default: mongoose } = require('mongoose');

exports.typeDefs = gql `
type Todo {
    id: ID
    title: String!
    content: String!
    completed: String!

}
type Query {
    getTodosList: [Todo]
    getTodo(id: ID!): Todo
}
type Mutation {
    updateTodo(id: ID! ,title: String!, content: String!, completed: String!): Todo
    addTodo(title: String, content: String!, completed: String!): Todo
    deleteTodo(id: ID!): Boolean!
} `


const db_url = 'mongodb+srv://pjdennis:Amstel12@cluster0.urucy.mongodb.net/?retryWrites=true&w=majority';


const connect = async () => {
    await mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true });
}


exports.resolvers = {
    Query: {

        getTodosList: async (parent, args) => {
            await connect();
            const result = TodoListsModel.find({}).then((res) => {
                if (res) {
                    return res;
                }
            })
            return result;

        },
        getTodo: async (parent, args) => {
            await connect();
            const result = TodoListsModel.findById(args.id).then((res) => {
                if (res) {
                    return res;
                }
            })
            return result;

        }
    },

    Mutation: {
        updateTodo: async (parent, args) => {
            await connect();
            const result = TodoListsModel.findByIdAndUpdate(args.id,
                {
                    title: args.title,
                    content: args.content,
                    completed: args.completed,

                }, {new: true}).then((res) => {
                    if (res) {
                        return res;
                    }
                })
            return result;
        },
        addTodo :  async (parent, args) => {
            await connect();
            let todo = new TodoListsModel({
                title: args.title,
                content: args.content,
                completed: args.completed,
            });
           const result = todo.save().then((res) => {
                return res;
            })
            return result;
        },
        deleteTodo:  async (parent, args) => {
            try {
                await connect();
                await TodoListsModel.findOneAndRemove({_id: args.id});
                return true;
            } catch (error) {
                console.log('Error while delete:',error);
                return false;
            }

        }
    }
}
