var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');

var async = require('async');
const { body,validationResult } = require('express-validator');

//Display list of all BookInstances.
exports.bookinstance_list = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: BookInstance list');
  BookInstance.find()
  .populate('book')
  .exec(function(err, list_bookinstances){ 
    if(err){return next(err); }
    res.render('bookinstance_list', {title: "Book Instance List", bookinstance_list: list_bookinstances})
  })
};

//Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {
    BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function(err, bookinstance) {
        if (err) { return next(err); }
        if(bookinstance==null){
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        res.render('bookinstance_detail', {title: 'Copy: '+bookinstance.book.title, bookinstance: bookinstance})
    })
};

//Display BookInstance create form on GET
exports.bookinstance_create_get = function(req, res,  next) {
    Book.find({},'title')
    .exec(function (err, books) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books});
    
    });
};

//Display BookInstance create form on POST
exports.bookinstance_create_post = [

    // Validate and sanitise fields.
    body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
    body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
    body('status').escape(),
    body('due_back', 'Invalid Date').optional({ checkFalse: true }).isISO8601().toDate(),


    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

         // Create a BookInstance object with escaped and trimmed data.
         var bookinstance = new BookInstance(
            { book: req.body.book,
              imprint: req.body.imprint,
              status: req.body.status,
              due_back: req.body.due_back
             });

             if (!errors.isEmpty()) {
                // There are errors. Render form again with sanitized values and error messages.
                Book.find({},'title')
                    .exec(function (err, books) {
                        if (err) { return next(err); }
                        // Successful, so render.
                        res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id , errors: errors.array(), bookinstance: bookinstance });
                });
                return;
        }
        else{
             // Data from form is valid.
             bookinstance.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect(bookinstance.url);
                });
        }
    }

];

//Handle BookInstance delete on GET
exports.bookinstance_delete_get = function(req, res, next) {
    async.parallel({
        bookinstances: function(callback) {
            BookInstance.findById(req.params.id).exec(callback);
        },
    }, function(err, results) {
        if(err) { return next(err); }
        if(results.bookinstances==null) {
            res.redirect('/catalog/bookinstances');
        }
        // Successful, so render.
        res.render('bookinstance_delete', { title: 'Delete BookInstance', bookinstance: results.bookinstances} );
    })
};

//Handle BookInstance delete on POST
exports.bookinstance_delete_post = function(req, res, next) {
    async.parallel({
        bookinstances: function(callback) {
            BookInstance.findById(req.body.bookinstanceid).exec(callback);
        },
    }, function(err, results) {
        if(err) { return next(); }
        //Success
        if(results.bookinstances) {

            BookInstance.findByIdAndRemove(req.body.bookinstanceid, function DeleteBookInstance(err) {
                if (err) { return next(err); }
                // Success - go to genre list 
                res.redirect('/catalog/bookinstances')
            })
        }
    
    })
};

//Handle BookInstance update on GET
exports.bookinstance_update_get = function(req, res, next) {
    async.parallel({
        bookinstance: function(callback) {
            BookInstance.findById(req.params.id).exec(callback)
        },
        books: function(callback) {
            Book.find({}, 'title').exec(callback)
        },
    }, function(err, results) {
        if(err) { return next(err); }
        if(results.bookinstance==null) {
            var err = new Error('Instance not found')
            err:status = 404;
            return next(err);
        }
        res.render('bookinstance_form', {title: 'Update BookInstance',bookinstance: results.bookinstance, book_list: results.books});
    })
};

//Handle BookInstance update on POST
exports.bookinstance_update_post = [
    body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
    body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
    body('status').escape(),
    body('due_back', 'Invalid Date').optional({ checkFalse: true }).isISO8601().toDate(),

    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var bookinstance = new BookInstance(
            { 
              book: req.body.book,
              imprint: req.body.imprint,
              status: req.body.status,
              due_back: req.body.due_back,
              _id:req.params.id //This is required, or a new ID will be assigned!
             });

             if(!errors.isEmpty()) {
                 async.parallel({
                    books: function (callback) {
                        Book.find(callback)

                    },
                 }, function (err, results) {

                    if(err) { return next(err); }

                    res.render('bookinstance_form', { title: 'Update Instance',book_list: results.books, bookinstance: bookinstance, errors: errors.array() })
                   
                 });
                 return;
             }
               else {
                BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err, thebookinstance){
                    if(err) { return next(err); }
                     // Successful - redirect to book detail page.
                     res.redirect(thebookinstance.url);
                   })
            }

       }
  ];