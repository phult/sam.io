module.exports = {
    /** Session timeout: in minutes **/
    timeout: 30,
    /** Default session driver: file, memory **/
    driver: "file",
    /** Session driver storage path **/
    driverPath: "/libs/session-drivers",
    /** Session storage path **/
    storage: __dir + "/storage/sessions"
};