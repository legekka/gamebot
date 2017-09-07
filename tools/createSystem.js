
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
    if (StarMap.stars[j].children == '!createSystem') {
        var system = [
            // creating central star
            {
                id: StarMap.stars[j].id + '-0',
                name: StarMap.stars[j].name + " Star",
                type: "star",
                size: parseFloat(((Math.random() * objectsize.star)).toFixed(2)),
                info: "!createInfo",
                children: [],
            }
        ]
        system[0].children = generatechildren(system[0], 1);
        StarMap.stars[j].children = system;
    }
}

fs.writeFileSync(path, JSON.stringify(StarMap));

function generatechildren(parent, level) {
    var children = [];
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
                    children: []
                }
                child.children = generatechildren(child, level + 1)
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
                    children: []
                }
                child.children = generatechildren(child, level + 1)
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

        children.push(child);
        i++;
    }
    console.log(children);
    return children;
}