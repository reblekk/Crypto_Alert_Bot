const { Cryptonator } = require('node-crypto-api');
const cryptonator = new Cryptonator();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('sheet.json')
const db = low(adapter)
var TelegramBot = require('node-telegram-bot-api');
var token = process.env.BOTTOKEN;
var bot = new TelegramBot(token, { polling: true });
const keepAlive = require('./server.js')



//btc usd 56000 up

bot.onText(/\/set (.+)/, function(msg, match) {

    var chatId = msg.chat.id;

    const string = match[1];
    var __world = string.split(" ")


    __get_ticker = __world[0];
    __get_compare = __world[1];
    __get_com_price = __world[2]
    __get_upndown = __world[3]
    db.defaults({ posts: [], count: 0, })
        .write()


    let don = db.get('posts')
        .size()
        .value()

    db.get('posts')
        .push({ id: don, chatId: chatId, ticker: __get_ticker, compare: __get_compare, com_price: __get_com_price, upndown: __get_upndown, status: "active" })
        .write()

				bot.sendMessage(chatId, "your alert is set")

});
keepAlive()


//for looping and checking price
setInterval(() => {
    hello()
    async function hello() {
        let __detect = db.get('posts')
            .size()
            .value()

        for (i = 0; i < __detect; i++) {
            let __id = i
            let john = db.get('posts')
                .find({ id: i })
                .value()
            __chatId = john.chatId
            __ticker = john.ticker
            __compare = john.compare
            __com_price = john.com_price
            __upndown = john.upndown
            __status = john.status
            //console.log(john)

            //console.log(__chatId + '\n' + __ticker + '\n' + __compare + '\n' + __com_price + '\n' + __upndown + '\n' + __status)


            await cryptonator.ticker(__ticker, __compare)
                .then(value => {
                    //console.log(__status)
                    __price = value.ticker.price
                    if (__status == "active") {
                       // console.log("here")
                        if (__upndown == "up" || __upndown == "UP" || __upndown == "Up" || __upndown == "uP") {
                            if (__price >= __com_price) {

                                
                                    // console.log(__chatId + '\n' + __ticker + '\n' + __compare + '\n' + __com_price + '\n' + __upndown + '\n' + __status)
                                bot.sendMessage(__chatId, __ticker + '/' + __compare + " is above " + __com_price);
														
                                db.get('posts')
                                    .find({ id: __id })
                                    .assign({ status: "inactive" })
                                    .write();

                            }
                        } else {
                            if (__price <= __com_price) {
                                db.get('posts')
                                    .find({ id: __id })
                                    .assign({ status: "inactive" })
                                    .write();
														
                                bot.sendMessage(__chatId, __ticker + '/' + __compare + " is down " + __com_price)

                            }

                        }
                    }

                    //console.log(__com_price)
                })
                .catch(console.error)


        }
    }

}, 120000);


bot.onText(/\/echo/, function(msg, match) {
	var chatId = msg.chat.id
	bot.sendMessage(chatId," ECHO")
})



//price of crypto. 
bot.onText(/\/p (.+)/, function(msg, match) {

    var chatId = msg.chat.id;
    var __symbol = match[1]
    var __price = [];
    var __price_btc, __price_eth, __price_usd, __drice
    var __change_btc = ""
    var __change_eth = ""
    var __change_usd = ""
    var __indicator1 = " "
    var __indicator2 = " "
    var __indicator3 = " "
    cryptonator.ticker(__symbol, 'btc')
        .then(value => setTimeout(() => {
            if (value.success == true) {
                __price[0] = value.ticker.price
                __change = value.ticker.change
                __change_btc = (__change / value.ticker.price) * 100


                if (__change_btc > 0) {
                    __indicator1 = '🔼'
                } else if (__change_btc < 0) {
                    __indicator1 = '🔻'
                } else if (__change_btc == 0) {
                    __indicator1 = "✅"
                }
                __change_btc = __change_btc.toFixed(4) + "%"


            } else {
                __price[0] = "N/A"
                __change_btc = "N/A"
            }

        })).then(value => setTimeout(() => {
            cryptonator.ticker(__symbol, 'eth')
                .then(value => {
                    if (value.success == true) {
                        __price[1] = value.ticker.price
                        __change = value.ticker.change
                        __change_eth = (__change / value.ticker.price) * 100



                        if (__change_eth > 0) {
                            __indicator2 = '🔼'
                        } else if (__change_eth < 0) {
                            __indicator2 = '🔻'
                        } else if (__change_eth == 0) {
                            __indicator2 = "✅"
                        }

                        __change_eth = __change_eth.toFixed(4) + "%"

                    } else {
                        __price[1] = "N/A"
                        __change_eth = "N/A"
                    }


                })
        })).then(value => setTimeout(() => {
            cryptonator.ticker(__symbol, 'usd')
                .then(value => {
                    if (value.success == true) {
                        __price[2] = value.ticker.price
                        __change = value.ticker.change
                        __change_usd = (__change / value.ticker.price) * 100


                        if (__change_usd > 0) {
                            __indicator3 = '🔼'
                        } else if (__change_usd < 0) {
                            __indicator3 = '🔻'
                        } else if (__change_usd == 0) {
                            __indicator3 = "✅"
                        }


                        __change_usd = __change_usd.toFixed(4) + "%"
                    } else {
                        __price[2] = "N/A"
                        __change_usd = "N/A"
                    }


                    let unix_timestamp = value.timestamp * 1000
                    var __timenow = Date.now()
                    var __ago = (__timenow - unix_timestamp) / 1000
                    __ago = parseInt(__ago)

                    bot.sendMessage(chatId, "<b><u>Requested Coin</u></b>: " + __symbol.toUpperCase() + "\n\n<b><u>BTC</u></b>: " + __price[0] + "<b><u>\nChange in Last Hour</u></b>: " + __change_btc + __indicator1 + "\n\n<b><u>ETH</u></b>: " + __price[1] + "<b><u>\nChange in Last Hour</u></b>: " + __change_eth + __indicator2 + "\n\n<b><u>USD</u></b>: " + __price[2] + "<b><u>\nChange in Last Hour</u></b>: " + __change_usd + __indicator3 + "\n\n<b>Updated </b>: " + __ago + "s ago", { parse_mode: "HTML" })
                }).catch((err) => {
                    bot.sendMessage(chatId, 'Undefined Request. Spelling Error or Coin is not listed.')
                })
        }, 500))

});

