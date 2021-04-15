const { Cryptonator } = require('node-crypto-api');
const cryptonator = new Cryptonator();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('sheet.json')
const db = low(adapter)
var TelegramBot = require('node-telegram-bot-api');
var token = '1552990411:AAEsiJpLC0ZGnPdSYwGZfd6T01p_M0nzrRM';
var bot = new TelegramBot(token, { polling: true });



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

});



//for looping and checking price
setInterval(() => {

    setTimeout(function() {

        hello()
        async function hello() {


            let __detect = db.get('posts')
                .size()
                .value()

            for (i = 0; i < __detect; i++) {



                let __id = i
                let john = db.get('posts')
                    .find({ id: __id })
                    .value()
                __chatId = john.chatId
                __ticker = john.ticker
                __compare = john.compare
                __com_price = john.com_price
                __upndown = john.upndown
                __status = john.status


                //console.log(__chatId + '\n' + __ticker + '\n' + __compare + '\n' + __com_price + '\n' + __upndown + '\n' + __status)


                await cryptonator.ticker(__ticker, __compare)
                    .then(value => {

                        __price = value.ticker.price
                        if (__status == "active") {

                            if (__upndown == "up" || __upndown == "UP" || __upndown == "Up" || __upndown == "uP") {
                                if (__com_price <= __price) {
                                    console.log(__price)
                                    console.log(i)
                                    console.log(__id)
                                    console.log(__ticker)
                                    console.log(__compare)
                                    console.log(__com_price)
                                    db.get('posts')
                                        .find({ id: __id })
                                        .assign({ status: "inactive" })
                                        .write()
                                    bot.sendMessage(__chatId, __ticker + '/' + __compare + " is above " + __com_price)

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
    }, 100)

}, 3600000);