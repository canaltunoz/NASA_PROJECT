// const { getAllLaunches, addNewLaunch, exitstsLaunchWithId, abortLaunchById, } = require('../../models/launches.model');
const { getAllLaunches, exitstsLaunchWithId, abortLaunchById, scheduleNewLaunch, } = require('../../models/launches.model');
const { getPagination,} = require('../../services/query');
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
        launchDate: { type: "string" }
    },
    required: ["mission", "rocket", "target", "launchDate"],
    additionalProperties: false,
}



const validate = ajv.compile(schema);

async function httpGetAllLaunches(req, res) {
    //200 leri otomatik olarak zaten dönüyor.Diğer status code ları set etmek lazm...
    // console.log(req.query);
    const { skip, limit} = getPagination(req.query);
    const launches = await getAllLaunches(skip,limit);
    return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
    console.log(req.body);
    const launch = req.body;

    const valid = validate(launch);
    if (!valid)
        return res.status(400).json({
            error: 'Bad request : Missing property',
        });
    launch.launchDate = new Date(launch.launchDate);
    // addNewLaunch(launch);
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);

}
async function httpAbortLaunch(req, res) {

    const launchId = Number(req.params.id);
    const existsLaunch = await exitstsLaunchWithId(launchId);
    if (!existsLaunch) {
        response.status(404).json({
            error: 'Launch not found'
        });
    }

    const aborted = await abortLaunchById(launchId);
    if (!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted',
        });
    }
    return res.status(200).json({ ok: true });

}
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};