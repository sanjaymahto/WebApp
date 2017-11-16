var jsonfile = require('jsonfile');
var fs = require('fs');
var loadJsonFile = require('load-json-file');

//Private variables and functions
var jsonFile = __dirname + '/data.json'

jsonExists = function(){
  fs.stat(jsonFile, function(err, stat) {
    if(err == null) {
        console.log('JSON file exists');
        return true
    } else if(err.code == 'ENOENT') {
        console.log('JSON file does not exit. Error Code', err.code)
        return false
    } else {
        console.log('Some other error: ', err.code);
        return false
    }
});
}

oldPrices = loadJsonFile(jsonFile).then(json => {
      oldPrices = json
      return oldPrices
});

function datesEqual(a, b) {
    return a.getTime() === b.getTime();
}

//api functions
function updatePrices(req, res){
  var updatedPrices ={
    Adjustible_connector : req.body.Adjustible_connector,
     Door_knob : req.body.Door_knob,
     Floor_to_Glass_Bracket : req.body.Floor_to_Glass_Bracket,
     Glass_Timeles : req.body.Glass_Timeles,
     Glass_to_Glass_Bracket_90 : req.body.Glass_to_Glass_Bracket_90,
     Glass_to_Glass_Hinge_135 : req.body.Glass_to_Glass_Hinge_135,
     Glass_to_Glass_Hinge_180 : req.body.Glass_to_Glass_Hinge_180,
     Glass_to_Glass_Hinge_180_Adj : req.body.Glass_to_Glass_Hinge_180_Adj,
     Glass_to_Glass_Hinge_90 : req.body.Glass_to_Glass_Hinge_90,
     Installation_Cost : req.body.Installation_Cost,
     Magnetic_seal_2500mm : req.body.Magnetic_seal_2500mm,
     Margin_for_installer : req.body.Margin_for_installer,
     Middle_Seal_2500_long : req.body.Middle_Seal_2500_long,
     Pentagonal_support_bar : req.body.Pentagonal_support_bar,
     Rod_to_Glass_Clamp : req.body.Rod_to_Glass_Clamp,
     Silicon_Sealant : req.body.Silicon_Sealant,
     Sliding_Door : req.body.Sliding_Door,
     Soft_nose_seal_2500 : req.body.Soft_nose_seal_2500,
     Support_Bar_2100 : req.body.Support_Bar_2100,
     Three_Way_Hinge : req.body.Three_Way_Hinge,
     Towel_rod_cum_handrail : req.body.Towel_rod_cum_handrail,
     Wall_Seal_2500_mm : req.body.Wall_Seal_2500_mm,
     Wall_to_Glass_Bracket : req.body.Wall_to_Glass_Bracket,
     Wall_to_Glass_Hinge : req.body.Wall_to_Glass_Hinge,
     Wall_to_Rod_Connector : req.body.Wall_to_Rod_Connector,
     Water_disperser_2000 : req.body.Water_disperser_2000,
     admin_discount : req.body.admin_discount
  }

  var price;

  for (price in updatedPrices){

    updatedPrices[price] = parseFloat(updatedPrices[price]);//Convert whatever is entered to number

    //check for empty data that may be entered
    if(!updatedPrices[price]){
      updatedPrices[price] = oldPrices[price]; //since nothing is entered in this field, old price is retained
    }else if(typeof updatedPrices[price] !== "number"){
      updatedPrices[price] = oldPrices[price]; // since the typeof value entered is not a number, old price is retained
      console.log("Valid value not entered is field - " + updatedPrices[price] + ". Retaining old value")
    }
  }

  if(jsonExists){
    jsonfile.writeFile(jsonFile, updatedPrices, {spaces: 2}, function (err) {
      if(err) {console.error(err); res.json ({pricesUpdated :false})}
      else { console.log('Latest Prices over-written Successfully'); res.json({pricesUpdated : true})}

    })
  }else{
    jsonfile.writeFile(jsonFile, updatedPrices, {spaces: 2}, function (err) {
      if(err) {console.error(err); res.json ({pricesUpdated :false})}
      else { console.log('Could not find Old Prices. New data.json created'); res.json({pricesUpdated : true})}

    })
  }

}

function sendData(req , res){
  if(jsonExists){
    console.log('here')
    res.sendFile(jsonFile);
    console.log('Latest data.json sent');
  }
  else{
    res.json({isSynced : false})
  }

}

function syncData(){
if(jsonExists){
  fs.stat(jsonFile, function(err, stats) {
    if(err){console.log(err)}
    else{ console.log(stats.mtime) }
  })
}
}



module.exports = { sendData : sendData, updatePrices : updatePrices, syncData : syncData}
