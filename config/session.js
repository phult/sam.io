module.exports = {
    /** Session timeout: in minutes **/
    timeout: 30,
    /** Session driver: file, memory **/
    driver: "file",
    /** Session driver path **/
    driverPath: "/libs/session-drivers",
    /** Session storage path **/
    storage: __dir + "/storage/sessions"
};