// Create a global namespace for our app
const app = {};

$(function() {

    'use strict';

    // ==================
    // STEP 2: The Model
    // ==================

    // Attach our Todo Model to the global app object
    app.Todo = Backbone.Model.extend({

        defaults: {
            title: '',
            completed: false
        },

        toggle: function() {
            this.save({
                completed: !this.get('completed')
            });
        }
    });

     // ==================================================
    // STEP 3: The Collection
    // ADD this new section right after the Model code.
    // This is the blueprint for the LIST of to-do items.
    // ==================================================

    app.TodoList = Backbone.Collection.extend({

        // This part tells the list what kind of items it will hold.
        model: app.Todo

    }); // <-- The Collection definition ends here.



    // ===============================================
    // STEP 4: THE APPLICATION'S MAIN VIEW (AppView)
    // ===============================================
    app.AppView = Backbone.View.extend({

        // We're telling this View to take control of the existing HTML
        // element that has the ID 'app'.
        el: '#app',

        // This is a delegated event handler. It says: "when a 'keypress'
        // event happens on the '#new-todo' element, run the 'createOnEnter' function."
        events: {
            'keypress #new-todo': 'createOnEnter'
        },

        // The initialize function is automatically called when a new instance of this
        // View is created. It's the perfect place for setup logic.
        initialize: function() {
            // Here, we create the instance of our collection that will hold the todos.
            this.collection = new app.TodoList();
            this.$list = this.$('#todo-list'); // NEW: Cache the <ul> element.
            this.listenTo(this.collection, 'add', this.addOne); // NEW

            // We also "cache" the input element so we don't have to keep looking for it.
            // The '$' prefix is a common convention for variables that hold a jQuery object.
            this.$input = this.$('#new-todo');
        },

        // NEW: The function to render a single todo item.
        addOne: function(todo) {
            const view = new app.TodoView({ model: todo });
            this.$list.append(view.render().el);
        },

        // This function is called by our event handler.
        createOnEnter: function(event) {
            // The 'which' property of the event tells us which key was pressed. 13 is the Enter key.
            // We also check if the input has a value (after trimming whitespace).
            if (event.which !== 13 || !this.$input.val().trim()) {
                return; // If it's not Enter or the input is empty, do nothing.
            }

            // Here's the core logic: create a new model and add it to our collection.
            this.collection.add({
                title: this.$input.val().trim()
            });

            // Finally, clear the input field so it's ready for the next item.
            this.$input.val('');
        }
    });

    // ===============================================
    // STEP 5.1: THE VIEW FOR A SINGLE TO-DO ITEM
    // ===============================================

    app.TodoView = Backbone.View.extend({
        // This view will be an `<li>` HTML tag.
        tagName: 'li',

        // Cache the template function for a single item.
        template: _.template($('#item-template').html()),

        // The DOM events specific to an item.
        events: {
            'click .toggle': 'toggleCompleted',
            'click .destroy': 'clear'
        },

        // The TodoView listens for changes to its model, re-rendering itself.
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove); // When the model is destroyed, remove the view.
        },

        // Render the view.
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('completed', this.model.get('completed'));
            return this;
        },

        // Toggle the `"completed"` state of the model.
        toggleCompleted: function() {
            this.model.toggle();
        },

        // Remove the item, destroying the model from the collection.
        clear: function() {
            this.model.destroy();
        }
    });


    // ================================
    // KICK OFF THE APP!
    // ================================
    // We create an instance of our main AppView and assign it to our namespace
    // so we can easily inspect it in the console. This is the line that starts everything.
    app.mainView = new app.AppView();

});
