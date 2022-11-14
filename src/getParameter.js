const { PARAM_FILE, CONF_FILE } = process.env;

const getParameter = () => {
    // load  parameters file
    const params = require(PARAM_FILE || '/in/parameters.json');

    return params;
}

module.exports = getParameter