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

});
