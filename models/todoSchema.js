const mongoose = require('mongoose');

const todosListSchema = new mongoose.Schema({
    title: String,
    content: String,
    completed: String,
})

module.exports = mongoose.model('todolists', todosListSchema);
