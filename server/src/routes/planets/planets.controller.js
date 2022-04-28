const {planets} = require('../../models/planets.model');

function getAllPlanets(req,res) {
    //200 leri otomatik olarak zaten dönüyor.Diğer status code ları set etmek lazm...
   return res.status(200).json(planets)
}


module.exports = {
    getAllPlanets,
};