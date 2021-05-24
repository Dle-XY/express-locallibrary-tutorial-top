var Genre = require('../models/genre');
var Book = require('../models/book');

var async = require('async');
const { body,validationResult } = require("express-validator");
const author = require('../models/author');

//Display list of all Genre.
exports.genre_list = function(req, res) {
    Genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_genres) {
        if (err) { return next(err); }
        res.render('genre_list', {title: 'Genre List', error: err, genre_list: list_genres});
    })

};

//Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
              .exec(callback);
        },

        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
    });
   
};

//Display Genre create form on GET
exports.genre_create_get = function(req, res, next) {
    res.render('genre_form', {title: 'Create Genre'})
};

//Display Genre create form on Genre
    exports.genre_create_post = [

        body('name', 'Genre name required').trim().isLength( {min: 1 }).escape(),

        (req, res, next) => {

            const errors = validationResult(req)

            var genre = new Genre(
                {name: req.body.name}
            );

            if (!errors.isEmpty()) {
                res.render('genre_form', {title: 'Genre Create', genre: genre, errors: errors.array()})
            }
            else {

                Genre.findOne({ 'name': req.body.name })
                .exec( function(err, found_genre) {
                    if(err) { return next(errr); }

                    if(found_genre) {
                        res.redirect(found_genre.url)

                    }
                    else {
                        genre.save(function(err) {
                            if(err) { return next(errr); }
                            res.redirect(genre.url)
                        });
                    }
                });
            }
        }

    ];

//Handle Genre delete on GET
exports.genre_delete_get = function(req, res, next) {
   async.parallel({
       genre: function(callback) {
           Genre.findById(req.params.id).exec(callback);
       },
        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id })
            .exec(callback);
        },
   }, function(err, results) {
       if(err) { return next(); }
        if(results.genre==null) {
            res.redirect('/catalog/authors');
        }
        // Successful, so render.
        res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genres_books } );
   })
};

//Handle Genre delete on POST
exports.genre_delete_post = function(req, res, next) {
   async.parallel({

    genre: function(callback) {
        Genre.findById(req.body.genreid).exec(callback);
    },
     genres_books: function(callback) {
         Book.find({ 'genre': req.body.genreid }).exec(callback);
     },

   }, function(err, results) {
    if(err) { return next(); }
    //Success
    if(results.genres_books.length > 0) {
        // Genre has books. Render in same way as for GET route.
        res.render('genre_delete', {titlte: 'Delete Genre', genre: results.genre, genre_books: results.genres_books,});
        return;
    }
    else {
        Genre.findByIdAndRemove(req.body.genreid, function DeleteGenre(err) {
            if (err) { return next(err); }
            // Success - go to genre list
            res.redirect('/catalog/genres')
        })
    }
   })
};

//Handle Genre update on GET
exports.genre_update_get = function(req, res) {
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
         genre_books: function(callback) {
             Book.find({ 'genre': req.params.id })
             .exec(callback);
         },
    }, function(err, results) {
        if(err) { return(err); }
        // Successful, so render
        res.render('genre_form', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );

    })
};

//Handle Genre update on POST
exports.genre_update_post = [
    body('name', 'Genre name required').trim().isLength( {min: 1 }).escape(),

    (req, res, next) => {
        const errors = validationResult(req)

            var genre = new Genre(
                {
                  name: req.body.name,
                  _id:req.params.id //This is required, or a new ID will be assigned!}
                }
            );

        if(!errors.isEmpty()) {
            res.render('genre_form', {title: 'Genre Create', genre: genre, errors: errors.array()});
            return;
        }
        else {
            Genre.findByIdAndUpdate(req.params.id, genre, {}, function(err, thegenre) {
                if(err) { return next(err); }
                // Successful - redirect to author detail page.
                res.redirect(thegenre.url);
             })
        }
    }
];