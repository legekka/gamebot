// creating systems for stars
var fs = require('fs');


// maximum system size
var size = 10;

// probabilites of creating object in a starsystem
// all values between 0 and 1 and the sum of it should be 1
var probability = {
    star: 0.1,
    planet: 0.7,
    station: 0.2
}
var objectsize = {
    star: 5,
    planet: 1
}

// idk
const max = 4;

var path = './data/starmap.json';

var StarMap = JSON.parse(fs.readFileSync(path).toString());

for (j = 0; j < StarMap.stars.length; j++) {
    if (StarMap.stars[j].system == '!createSystem') {
        var system = {
            id: StarMap.stars[j].id + '-S',
            name: StarMap.stars[j].name + ' System',
            childs: [
                // creating central star
                {
                    id: StarMap.stars[j].id + '-S-0',
                    name: StarMap.stars[j].name + " Star",
                    type: "star",
                    size: parseFloat(((Math.random() * objectsize.star)).toFixed(2)),
                    info: "!createInfo",
                    childs: [],
                }
            ]
        }
        system.childs[0].childs = generateChilds(system.childs[0], 1);
        StarMap.stars[j].system = system;
    }
}

fs.writeFileSync('./teszt.json', JSON.stringify(StarMap));

function generateChilds(parent, level) {
    var childs = [];
    var childcount = Math.floor(Math.random() * max / level);
    var i = 0;
    while (i < childcount) {
        var rnd = Math.random();
        var type;
        if (parent.type != "star") {
            if (probability.planet >= rnd) {
                type = "planet";
            } else if (probability.planet + probability.station >= rnd) {
                type = "station";
            }
        } else {
            if (probability.star >= rnd) {
                type = "star";
            } else if (probability.planet + probability.star >= rnd) {
                type = "planet";
            } else if (probability.planet + probability.star + probability.station >= rnd) {
                type = "station";
            }
        }
        switch (type) {
            case "star": {
                var child = {
                    id: parent.id + `-${i}`,
                    name: "Teszt " + type,
                    type: type,
                    size: parseFloat(((Math.random() * objectsize.star)).toFixed(2)),
                    distance: parseFloat(((Math.random() * size)).toFixed(2)),
                    info: "!createInfo",
                    childs: []
                }
                child.childs = generateChilds(child, level + 1)
                break;
            }
            case "planet": {
                var child = {
                    id: parent.id + `-${i}`,
                    name: "Teszt " + type,
                    type: type,
                    size: parseFloat(((Math.random() * objectsize.planet)).toFixed(2)),
                    distance: parseFloat(((Math.random() * size)).toFixed(2)),
                    info: "!createInfo",
                    childs: []
                }
                child.childs = generateChilds(child, level + 1)
                break;
            }
            case "station": {
                var child = {
                    id: parent.id + `-${i}`,
                    name: "Teszt " + type,
                    type: type,
                    distance: parseFloat(((Math.random() * size)).toFixed(2)),
                    info: "!createInfo",
                    services: "!createServices"
                }
                break;
            }
        }

        childs.push(child);
        i++;
    }
    return childs;
}