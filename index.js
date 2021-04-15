const { Cryptonator } = require('node-crypto-api');

const cryptonator = new Cryptonator();
let __price, i;
const fs = require('fs')
const replace = require('replace-in-file');

//ticker

setInterval(() => {

    for (i = 0; i < 2; i++) {
        fs.readFile('datalist.txt', 'utf8', (err, data, __price) => {
            __data = JSON.parse(data)
            console.log(__data)
        })

        cryptonator.ticker('btc', 'usd')
            .then(value => {
                __price = value.ticker.price
                console.log("im here")
                return __price

            }).then(value => {

                fs.readFile('datalist.txt', 'utf8', (err, data, __price) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    __data = JSON.parse(data)
                    __price = value
                    if (__price >= __data[0].price) {
                        console.log(__data[0].price)
                        console.log(__price)
                        console.log("It is above")

                        //Edits file here
                        var result = data.replace(/54000/g, 'priceissued');

                        fs.writeFile("datalist.txt", result, 'utf8', function(err) {
                            if (err) return console.log(err);
                        });


                    }

                })


            })
            .catch(console.error);
    }
}, 5000);