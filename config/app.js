module.exports = {
    port: 2307,
    debug: true,
    autoload: [
        "/controllers",
        "/entities",
        "/start"
    ],
    encryption: {
        'key': "d6F3Efeq",
        'cipher': "aes-256-ctr"
    }
};