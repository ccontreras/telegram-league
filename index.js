'use strict';

const ROBOT_TOKEN = '<TOKEN>';
const RIOT_API_KEY = '<API KEY>';

let tg = require("telegram-node-bot")(ROBOT_TOKEN);
let _ = require("lodash");
let endpoints = require("./endpoints.json");
let riot = require("riot-api-client")({ apiKey: RIOT_API_KEY, requestLimit: 10 });

tg.router
    .when(['/free :region'], 'FreeToPlayController')
    .otherwise('DefaultController');

tg.controller('DefaultController', ($) => {
    console.log($.message.text);
    $.sendMessage('hello world!');
});
    
tg.controller('FreeToPlayController', ($) => {
    function getEndpoint(region) {
        let i = _.find(endpoints, ['region', _.lowerCase(region)]);
        return (!_.isUndefined(i)) ? i.endpoint : null;
    };
    
    tg.for('/free :region', ($) => {
        let region = _.lowerCase($.query.region);
        let endpoint = getEndpoint(region);
        
        if (_.isNull(endpoint)) {
            $.sendMessage('Unknown region');
        } else {            
            riot.get(`https://${endpoint}/api/lol/${region}/v1.2/champion?freeToPlay=true&api_key=${RIOT_API_KEY}`, (err, data) => {
                if (err) throw err;
                
                let msg = '';
                let length = _.size(data.champions);
                endpoint = getEndpoint('global');
                
                for (let i = 0; i < length; i++) {
                    let champ = data.champions[i];
                    
                    riot.get(`https://${endpoint}/api/lol/static-data/${region}/v1.2/champion/${champ.id}?api_key=${RIOT_API_KEY}`, (err, data) => {
                        if (err) throw err;
                        
                        msg += data.name + '\n';
                        
                        // if done then send the message.
                        if ((i + 1) == length)
                            $.sendMessage(msg);
                    });
                }
            });
        }
    });
});