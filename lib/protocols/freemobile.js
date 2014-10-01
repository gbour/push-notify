/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var request = require('request');
var _ = require('lodash');

var url = 'https://smsapi.free-mobile.fr/sendmsg';

/**
 * Expose module.
 */

module.exports = Sender;

/**
 * Create a new FreeMobile SMS sender.
 *
 * @param {object} options
 * @param {string} options.user
 * @param {string} options.password
 */

function Sender(options) {
  EventEmitter.call(this);
  this.options = options;
};

util.inherits(Sender, EventEmitter);

/**
 * Send a notification.
 *
 * @param {object} data
 * @see https://mobile.free.fr/moncompte/index.php?page=options, "Notification par SMS" option
 */

Sender.prototype.send = function (data) {
  var sender = this;

  request({
      method: 'GET',
      uri: url,
      strictSSL: false,
      qs: {user: this.options.user, pass: this.options.password, msg: data.payload}
    }, function(err, resp, body) {

      if(err || resp.statusCode != 200) {
        sender.emit('transmissionError', err, data.id);
      }

      sender.emit('transmitted', data.id);
  });
};
