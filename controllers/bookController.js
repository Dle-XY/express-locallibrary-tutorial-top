var Book = require('../models/book');
var Author = require('../models/author');
var BookInstance = require('../models/bookinstance');
var Genre = require('../models/genre');

var async = require('async');


exports.index = function(req, res) {

    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback);
        },
        book_instance_count: function(callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_availlable_count: function(callback) {
            BookInstance.countDocuments({status: 'Availlable'}, callback);
        },
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', {title: 'Local Library Home', error: err, data: results});
    });
    
};

//Display list of all Book.
exports.book_list = function(req, res) {
    Book.find({}, 'title author')
    .populate('author')
    .exec(function (err, list_books) {
        if (err) { return next(err); }

        res.render('book_list', {title: 'Book list', book_list: list_books});
    })
};

//Display detail page for a specific Book.
exports.book_detail = function(req, res, next) {
   async.parallel({
       book: function(callback) {
           Book.findById(req.params.id)
           .populate('author')
           .populate('genre')
           .exec(callback)
       },
       book_instance: function(callback) {
           BookInstance.find({'book': req.params.id})
           .exec(callback)
       }
   }, function(err, results) {
       if(results.book==null) {
           var err = new Error('NOT FOUND BOOK');
           err.status = 404;
           return next(err);
       }

       res.render('book_detail', {title: results.book.title, book: results.book, book_instances: results.book_instance})
   })
};

//Display Book create form on GET
exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED : Book create GET');
};

//Display Book create form on Genre
exports.book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED : Book create POST');
};

//Handle Book delete on GET
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED : Book delete GET');
};

//Handle Book delete on POST
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED : Book delete POST');
};

//Handle Book update on GET
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED : Book update GET');
};

//Handle Book update on POST
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED : Book update POST');
};