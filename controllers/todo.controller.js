import Todo from '../models/todo.model.js'

export const createTodo = async (req, res) => {
    try {
      const { title, category, description } = req.body;
      if (!title || !category) 
        return res.status(400).json({ message: 'Title and category are required' });
      
      if (!['personal', 'home', 'business'].includes(category)) 
        return res.status(400).json({ message: 'Invalid category' });
  
      if (description && description.split(' ').length > 200) 
        return res.status(400).json({ message: 'Description should not exceed 200 words' });
      
      const newTodo = new Todo({
        user: req.user.id,
        title,
        category,
        description
      });
  
      const savedTodo = await newTodo.save();
      // console.log("createTodo : "+savedTodo.user)
      res.json(savedTodo);
    } 
    catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// export const getAllTodos = async (req, res) => {
//   try {
//     const todos = await Todo.find({ user: req.user.id }).sort({ isCompleted: 1, createdAt: -1 });
//     res.json(todos);
//   } 
//   catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// }

export const getAllTodos = async (req, res) => {
  try {
    const { isChecked } = req.query;
    let filter = { user: req.user.id };
    if (isChecked === 'true') {
      filter.isCompleted = true;
    }
    const todos = await Todo.find(filter).sort({ isCompleted: 1, createdAt: -1 });
    res.json(todos);
  } 
  catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


export const updateTodo =  async (req, res) => {
  try {
    const { title, category, description, isCompleted } = req.body;
    
    const todoFields = {};
    if (title) todoFields.title = title;
    if (category) todoFields.category = category;
    if (description !== undefined) todoFields.description = description;
    if (isCompleted !== undefined) todoFields.isCompleted = isCompleted;
    todoFields.updatedAt = Date.now();

    let todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).json({ msg: 'Todo not found' });

    if (todo.user.toString() !== req.user.id) 
      return res.status(401).json({ msg: 'Not authorized' });
    
    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: todoFields },
      { new: true }
    );

    res.json(todo);
  } 
  catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const deletedTodo = await Todo.findByIdAndDelete(todoId);
    if (!deletedTodo) 
      return res.status(404).json({ message: 'Todo not found' });

    res.status(200).json({ message: 'Todo deleted successfully' });
  } 
  catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const getAllTodosByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(category)
    if (!['personal', 'home', 'business'].includes(category)) 
      return res.status(400).json({ message: 'Invalid category' });
    
    const todos = await Todo.find({ 
      user: req.user.id,
      category: category
    }).sort({ createdAt: -1 });

    res.json(todos);
  } 
  catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}