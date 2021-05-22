var BookInstance = require('../models/bookinstance');

//Display list of all BookInstances.
exports.bookinstance_list = function(req, res) {
    BookInstance.find()
    .populate('book')
    .exec(function (err, list_bookinstances) {
        if (err) { return next(err); }

        res.render('bookinstance_list', {title: 'Book Instance List', error: err, bookinstance_list: list_bookinstances});
    })
};

//Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res) {
    BookInstance.findById(req.params.id)
    .populate('author')
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
exports.bookinstance_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED : BookInstance create GET');
};

//Display BookInstance create form on POST
exports.bookinstance_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED : BookInstance create POST');
};

//Handle BookInstance delete on GET
exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED : BookInstance delete GET');
};

//Handle BookInstance delete on POST
exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED : BookInstance delete POST');
};

//Handle BookInstance update on GET
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED : BookInstance update GET');
};

//Handle BookInstance update on POST
exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED : BookInstance update POST');
};