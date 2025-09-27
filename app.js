// app.js

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

});
