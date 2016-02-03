module.exports = {
    /** Session timeout: minutes **/
    timeout: 30,
    /** Session driver: file, memory **/
    driver: "file",
    /** Session file path **/
    storage: __dir + "/storage/sessions"
};