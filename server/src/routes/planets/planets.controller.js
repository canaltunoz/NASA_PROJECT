const { getAllPlanets } = require('../../models/planets.model');

async function httpGetAllPlanets(req, res) {
    //200 leri otomatik olarak zaten dönüyor.Diğer status code ları set etmek lazm...
    return  res.status(200).json(await getAllPlanets());
}

module.exports = {
    httpGetAllPlanets,
};