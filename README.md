# 🚀 Abhacken - Learning Backbone.js Todo App

> A step-by-step journey into Backbone.js by building a simple todo application

## 📖 What is this?

This is a **learning project** where we build a todo app using **Backbone.js** from scratch. Think of it like building with LEGO blocks - each piece has a specific job, and when we put them together, we get a working application!

## 🎯 What you'll learn

- How Backbone.js works (Models, Collections, Views)
- How to organize JavaScript code properly
- How different parts of an app talk to each other
- The difference between data (what we store) and presentation (what we show)

---

## 🏗️ Project Structure

```
Abhacken/
├── index.html      # The HTML structure
├── app.js          # All our JavaScript logic
├── index.css       # Styling (not covered in this guide)
└── README.md       # This file!
```

---

## 🧱 Step-by-Step Building Guide

### Step 1: Setting up the HTML Foundation 🏠

**File: `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Abhacken</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>
    <div id="app">
        <header>
            <h1>Abhacken</h1>
            <input id="new-todo" placeholder="Was muss getan werden?" autofocus>
        </header>
        <section id="main">
            <ul id="todo-list"></ul>
        </section>
    </div>

    <!-- This is our template for individual todo items -->
    <script type="text/template" id="item-template">
        <div class="view">
            <input class="toggle" type="checkbox" <%= completed ? 'checked' : '' %>>
            <label><%- title %></label>
            <button class="destroy">x</button>
        </div>
    </script>

    <!-- Load our libraries -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.6/underscore-min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.4.1/backbone-min.js"></script>

    <!-- Load our app -->
    <script src="app.js"></script>
</body>
</html>
```

**🤔 What's happening here?**

- `<div id="app">` - This is like the main container where our entire app lives
- `<input id="new-todo">` - This is where users type new todos
- `<ul id="todo-list">` - This empty list will hold all our todo items
- `<script type="text/template">` - This is a special template that describes what each todo item looks like
- The `<%= %>` and `<%- %>` are like blanks that get filled in with real data later

---

### Step 2: Creating the Todo Model 📝

**File: `app.js` (Lines 13-25)**

```javascript
// Create a global namespace for our app
const app = {};

$(function() {
    'use strict';

    // ==================
    // STEP 2: The Model
    // ==================

    // This is like a blueprint for a single todo item
    app.Todo = Backbone.Model.extend({

        // Every new todo starts with these default values
        defaults: {
            title: '',           // The text of the todo
            completed: false     // Whether it's done or not
        },

        // This function flips a todo between done/not done
        toggle: function() {
            this.save({
                completed: !this.get('completed')
            });
        }
    });
```

**🤔 What's a Model?**

Think of a **Model** like a blueprint for a single todo item. Just like how a cookie cutter defines the shape of a cookie, a Model defines what data a todo should have.

**Line-by-line explanation:**

- **Line 13**: `app.Todo = Backbone.Model.extend({` - We're creating a new type of Model called "Todo"
- **Lines 15-18**: `defaults: {title: '', completed: false}` - Every new todo starts with empty text and is not completed
- **Lines 20-24**: `toggle: function()` - This is like a button that switches a todo between "done" and "not done"

---

### Step 3: Creating the Todo Collection 📚

**File: `app.js` (Lines 33-38)**

```javascript
// ==================================================
// STEP 3: The Collection
// This is the blueprint for the LIST of to-do items.
// ==================================================

app.TodoList = Backbone.Collection.extend({

    // This tells the collection what kind of items it will hold
    model: app.Todo

});
```

**🤔 What's a Collection?**

Think of a **Collection** like a box that holds many todo items. If a Model is one cookie, then a Collection is the cookie jar that holds all the cookies!

**Line-by-line explanation:**

- **Line 33**: `app.TodoList = Backbone.Collection.extend({` - We're creating a container called "TodoList"
- **Line 36**: `model: app.Todo` - This tells the collection "you can only hold Todo models"

---

### Step 4: Creating the Individual Todo View 👁️

**File: `app.js` (Lines 90-125)**

```javascript
// ===============================================
// STEP 5.1: THE VIEW FOR A SINGLE TO-DO ITEM
// ===============================================

app.TodoView = Backbone.View.extend({
    // This view will be an `<li>` HTML tag
    tagName: 'li',

    // Cache the template function for a single item
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item
    events: {
        'click .toggle': 'toggleCompleted',
        'click .destroy': 'clear'
    },

    // The TodoView listens for changes to its model, re-rendering itself
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    // Render the view
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.toggleClass('completed', this.model.get('completed'));
        return this;
    },

    // Toggle the `"completed"` state of the model
    toggleCompleted: function() {
        this.model.toggle();
    },

    // Remove the item, destroying the model from the collection
    clear: function() {
        this.model.destroy();
    }
});
```

**🤔 What's a View?**

Think of a **View** like a robot that knows how to display one todo item on the screen. Each todo gets its own robot!

**Line-by-line explanation:**

- **Line 92**: `tagName: 'li'` - "Make each todo look like a list item (`<li>`)"
- **Line 95**: `template: _.template($('#item-template').html())` - "Use the HTML template we wrote earlier"
- **Lines 98-101**: `events: {...}` - "When someone clicks the checkbox, run `toggleCompleted`. When they click the X, run `clear`"
- **Lines 104-107**: `initialize: function()` - "Listen for changes to my todo data and update myself automatically"
- **Lines 110-113**: `render: function()` - "Take my todo data and turn it into HTML that people can see"
- **Lines 116-118**: `toggleCompleted: function()` - "Mark my todo as done/not done"
- **Lines 121-123**: `clear: function()` - "Delete myself completely"

---

### Step 5: Creating the Main App View 🎛️

**File: `app.js` (Lines 45-84)**

```javascript
// ===============================================
// STEP 4: THE APPLICATION'S MAIN VIEW (AppView)
// ===============================================
app.AppView = Backbone.View.extend({

    // We're telling this View to take control of the existing HTML
    // element that has the ID 'app'
    el: '#app',

    // This is a delegated event handler
    events: {
        'keypress #new-todo': 'createOnEnter'
    },

    // The initialize function is automatically called when a new instance
    // of this View is created
    initialize: function() {
        // Create the instance of our collection that will hold the todos
        this.collection = new app.TodoList();
        this.$list = this.$('#todo-list'); // Cache the <ul> element
        this.listenTo(this.collection, 'add', this.addOne); // Listen for new todos

        // Cache the input element so we don't have to keep looking for it
        this.$input = this.$('#new-todo');
    },

    // The function to render a single todo item
    addOne: function(todo) {
        const view = new app.TodoView({ model: todo });
        this.$list.append(view.render().el);
    },

    // This function is called by our event handler
    createOnEnter: function(event) {
        // Check if Enter was pressed and if there's text in the input
        if (event.which !== 13 || !this.$input.val().trim()) {
            return; // If not, do nothing
        }

        // Create a new model and add it to our collection
        this.collection.add({
            title: this.$input.val().trim()
        });

        // Clear the input field for the next item
        this.$input.val('');
    }
});
```

**🤔 What's the App View?**

Think of **AppView** like the manager of a restaurant. It doesn't cook the food (that's what TodoViews do), but it coordinates everything and makes sure new orders get to the right places.

**Line-by-line explanation:**

- **Line 49**: `el: '#app'` - "I'm in charge of the div with id 'app'"
- **Lines 53-55**: `events: {...}` - "When someone types in the input field, run `createOnEnter`"
- **Line 61**: `this.collection = new app.TodoList()` - "Create an empty list to hold todos"
- **Line 62**: `this.$list = this.$('#todo-list')` - "Remember where the todo list is in the HTML"
- **Line 63**: `this.listenTo(this.collection, 'add', this.addOne)` - "Whenever a new todo is added, automatically display it"
- **Lines 71-74**: `addOne: function(todo)` - "Create a new TodoView for this todo and add it to the page"
- **Lines 77-88**: `createOnEnter: function(event)` - "When Enter is pressed, create a new todo"

---

### Step 6: Starting the App 🚀

**File: `app.js` (Lines 130-133)**

```javascript
// ================================
// KICK OFF THE APP!
// ================================
// We create an instance of our main AppView and assign it to our namespace
// so we can easily inspect it in the console
app.mainView = new app.AppView();
```

**🤔 What's happening here?**

This is like pressing the "ON" button for our app. It creates the main manager (AppView) and everything starts working!

---

## 🔄 How Everything Works Together

Here's what happens when you type "Buy milk" and press Enter:

1. **User types "Buy milk"** in the input field
2. **User presses Enter** → triggers `createOnEnter` function
3. **`createOnEnter`** checks: "Is this the Enter key? Is there text?" ✅
4. **New todo is created** and added to the collection: `{title: "Buy milk", completed: false}`
5. **Collection fires 'add' event** → automatically calls `addOne` function
6. **`addOne`** creates a new `TodoView` for this todo
7. **TodoView renders itself** using the HTML template
8. **New `<li>` appears** on the page with "Buy milk"
9. **Input field clears** automatically for the next todo

### When you click the checkbox:

1. **User clicks checkbox** → triggers `toggleCompleted` in TodoView
2. **`toggleCompleted`** calls `model.toggle()`
3. **Model changes** `completed` from `false` to `true`
4. **TodoView automatically re-renders** because it's listening for changes
5. **Checkbox appears checked** and gets the "completed" CSS class

### When you click the X button:

1. **User clicks X** → triggers `clear` in TodoView
2. **`clear`** calls `model.destroy()`
3. **Model is removed** from the collection
4. **TodoView automatically removes itself** from the page

---

## 🧠 Key Concepts Explained

### 🎭 Separation of Concerns

Each part has ONE job:

- **Model** → Holds the data for one todo
- **Collection** → Manages the list of todos
- **TodoView** → Displays and handles one todo item
- **AppView** → Coordinates everything

### 🔗 Event-Driven Architecture

Instead of manually calling functions everywhere, we use **events**:

- When collection changes → views update automatically
- When user clicks → appropriate function runs
- When model changes → view re-renders automatically

This makes the code much cleaner and easier to maintain!

### 📡 Data Binding

Views automatically update when their data changes. No need to manually update the HTML!

---

## 🚀 How to Run This App

1. Clone this repository
2. Open `index.html` in your web browser
3. Start adding todos!

---

## 🤝 Technologies Used

- **Backbone.js** - MVC framework for organizing JavaScript
- **jQuery** - DOM manipulation and event handling
- **Underscore.js** - Utility functions (used for templating)
- **HTML5 & CSS3** - Structure and styling

---

## 📚 What's Next?

This is just the beginning! You could add:

- ✅ Mark all todos as complete
- 🗑️ Clear completed todos
- 📝 Edit todo text inline
- 💾 Save todos to localStorage
- 🎨 Better styling and animations
- 📱 Mobile-responsive design

---

## 🎉 Congratulations!

You've just built a complete todo application using Backbone.js! You now understand:

- How MVC (Model-View-Controller) architecture works
- How to organize JavaScript code properly
- How different parts of an application communicate
- The power of event-driven programming

Keep building and learning! 🚀

---

*Made with ❤️ while learning Backbone.js*