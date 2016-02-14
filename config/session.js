module.exports = {
    /** Session timeout: in minutes **/
    timeout: 30,
    /** Session driver: file, memory **/
    driver: "file",
    /** Session file path **/
    storage: __dir + "/storage/sessions"
};