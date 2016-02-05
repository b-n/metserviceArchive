var http = require('http');
var fs = require('fs');
var moment = require('moment');

if (!fs.existsSync('images')) {
    fs.mkdirSync('images');
}

var timeFormat = {
    input: 'h:mma dddd D MMM YYYY',
    output: 'YYYY-MM-DDTHH:mm:ss'
};

function callout(options, callback) {
    http.get(
        {
            host: 'www.metservice.com',
            port: '80',
            path: options.path
        },
        function(res) {
            var data = '';
            res.setEncoding(options.encoding);
            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function() { callback(data); });
        }
    );
}

callout(
    {
        path: '/publicData/rainRadarNZ_2h_7min_300K',
        encoding: 'utf-8'
    },
    function(data) {
        parseAndSave(JSON.parse(data));
    }
);

function parseAndSave(data) {
    data.forEach(item => {
        var d = moment(item.longDateTime, timeFormat.input);
        callout(
            {
                path: item.url,
                encoding: 'binary'
            },
            res => {
                fs.writeFile(
                    'images/' + d.format(timeFormat.output) + '.jpg',
                    res,
                    'binary',
                    function(err) {
                        if (err) throw err;
                    }
                );
            }
        );
    });
}
