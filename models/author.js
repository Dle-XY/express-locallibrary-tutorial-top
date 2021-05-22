var mongoose = require('mongoose')

var Schema = mongoose.Schema;

const { DateTime } = require("luxon");

var AuthorSchema = new Schema(
    {
        first_name: {type: String, required: true, maxLengLength: 100},
        family_name: {type: String, required: true, maxLengLength: 100 },
        date_of_birth: {type: Date},
        date_of_death: {type: Date},
    }
);

AuthorSchema
.virtual('name')
.get(function() {
    return this.family_name + ', ' + this.first_name;
});

AuthorSchema
.virtual('lifespan')
.get(function() {
    return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)+ ' - ' +DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
});

AuthorSchema
.virtual('url')
.get(function() {
    return '/catalog/author/' + this._id;
});

module.exports = mongoose.model('Author', AuthorSchema);
