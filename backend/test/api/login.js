/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';


var kraken = require('kraken-js'),
    express = require('express'),
    path = require('path'),
    request = require('supertest');


describe('api/login', function () {

    var app, mock;


    beforeEach(function (done) {
        app = express();
        app.on('start', done);
        app.use(kraken({
            basedir: path.resolve(__dirname, '..')
        }));

        mock = app.listen(1337);

    });


    afterEach(function (done) {
        mock.close(done);
    });


    it('should have model name "api/login"', function (done) {
        request(mock)
            .get('/api/login')
            .expect(200)
            .expect('Content-Type', /html/)
            
                .expect(/"name": "api/login"/)
            
            .end(function (err, res) {
                done(err);
            });
    });

});
