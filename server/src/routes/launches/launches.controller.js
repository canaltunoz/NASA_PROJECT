const { getAllLaunches, addNewLaunch, exitstsLaunchWithId, abortLaunchById, } = require('../../models/launches.model');
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const { response } = require('../../app');

const ajv = new Ajv();
addFormats(ajv);
const schema = {
    type: "object",
    properties: {
        mission: { type: "string" },
        rocket: { type: "string" },
        target: { type: "string" },
        launchDate: { type: "string", format: "date-time" }
    },
    required: ["mission", "rocket", "target", "launchDate"],
    additionalProperties: false,
}



const validate = ajv.compile(schema);

function httpGetAllLaunches(req, res) {
    //200 leri otomatik olarak zaten dönüyor.Diğer status code ları set etmek lazm...
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {

    const launch = req.body;
    const valid = validate(launch);
    if (!valid)
        return res.status(400).json({
            error: 'Bad request : Missing property',
        });

    launch.launchDate = new Date(launch.launchDate);
    addNewLaunch(launch);
    return res.status(201).json(launch);

}
function httpAbortLaunch(req, res) {

    const launchId = Number(req.params.id);
    //
    if (!exitstsLaunchWithId(launchId)) {
        response.status(404).json({
            error: 'Launch not found'
        });
    }

    const aborted = abortLaunchById(launchId);

    return res.status(200).json(aborted);

}
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};