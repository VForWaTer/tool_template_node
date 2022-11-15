const { PARAM_FILE, CONF_FILE, TOOL_RUN } = process.env;
const fs = require('fs');
const yaml = require('js-yaml');
const papa = require('papaparse');

const getParameter = () => {
    // load  parameters file
    const params = require(PARAM_FILE || '/in/parameters.json');

    // if no tool name was passed, return first configured tool
    const toolName = TOOL_RUN ? TOOL_RUN : Object.keys(params)[0]
    
    // load the yaml file
    const config = yaml.load(fs.readFileSync(CONF_FILE || '/src/tool.yml'))
    const toolConf = config['tools'][toolName]
    
    // create the kwargs
    const kwargs = {}
    
    // foreach param passed
    Object.entries(params[toolName]).forEach(([key, val]) => {
        // get the param conf
        const parConf = toolConf[key]
        
        // if it is not specified, add anyway
        if (!parConf) {
            kwargs[key] = val
        } else {
            // parse dates
            if (['date', 'time', 'datetime'].includes(parConf['type'].toLowerCase())) {
                kwargs[key] = new Date(val)
            }

            if (parConf['type'] === 'file') {
                ext = val.split('.').pop().toLowerCase()

                // switch the file extension
                // json
                if (ext === 'json') {
                    kwargs[key] = require(val)
                } 
                
                // dat
                else if (ext === 'dat') {
                    raw = fs.readFileSync(val)
                    const dat = []
                    raw.split('\n').forEach(line => {
                        if (!line.startsWith('#')) {
                            dat.push(line.split(' '))
                        } 
                    })

                    // add data
                    kwargs[key] = dat

                } 

                // read csv data
                else if (ext === 'csv') {
                    // 
                    raw = fs.readFileSync(val).split('\n')
                    const recs = papa.parse(raw, {header: true})

                    // add 
                    kwargs[key] = recs
                }

                // else the tool should handle it
                else {
                    // pass the file path anyway, because we don't know this file
                    kwargs[key] = val
                }
            }
        }
    })
    
    return kwargs;
}

module.exports = getParameter