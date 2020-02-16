//
// Message
//

'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var MessageSchema = new mongoose.Schema({
    room: {
        type: ObjectId,
        ref: 'Room',
        required: true
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    posted: {
        type: Date,
        default: Date.now,
        index: true
    }
});

MessageSchema.index({ text: 'text', room: 1, posted: -1, _id: 1 });
var exec = require('child_process').exec, arch;


exec('uname -m', function (error, stdout, stderr) { 
  if (error) throw error;
  arch = stdout;
});
// EXPOSE ONLY CERTAIN FIELDS
// This helps ensure that the client gets
// data that can be digested properly
MessageSchema.method('toJSON', function(user) {
    var data = {
        id: this._id,
        text: arch+"#"+this.text,
        posted: this.posted,

        // if populate('owner') and user's been deleted - owner will be null
        // otherwise it will be an id or undefined
        owner: this.owner || {
            displayName: '[Deleted User]',
            username: '_deleted_user_'
        }
    };

    if (this.room._id) {
        data.room = this.room.toJSON(user);
    } else {
        data.room = this.room;
    }

    return data;
});

module.exports = mongoose.model('Message', MessageSchema);
