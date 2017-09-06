// starmap generation

var fs = require('fs');

// parameters

var uname = "Universe One";
var starcount = 20; // number of stars (=star systems)
var size = 200; // size of the universe
var mindist = 1; // TODO: minimum distance between stars
var path = './data/starmap.json';



var StarMap = {
    name: uname,
    stars: []
};

function parseDate(date) {
    return date.getMilliseconds() + date.getSeconds() * 1000 + date.getMinutes() * 60000 + date.getHours() * 3600000 + date.getDate() * 86400000;
}

function buildStar(id) {
    var Star = {
        id: id,
        name: nameCreator(),
        coordinates: createCoordinates(),
        system: "!createSystem"
    }
    StarMap.stars.push(Star);
}

function createCoordinates() {
    do {
        var coordinates = {
            x: parseFloat(((Math.random() * size) - size / 2).toFixed(2)),
            y: parseFloat(((Math.random() * size) - size / 2).toFixed(2)),
            z: parseFloat(((Math.random() * size) - size / 2).toFixed(2))
        }
    } while (!validCoordinates(coordinates))
    return coordinates;
}

function validCoordinates(coordinates) {
    var i = 0;
    while (i < StarMap.stars.length && mindist < Math.sqrt(Math.pow(Math.abs(coordinates.x - StarMap.stars[i].coordinates.x), 2)+Math.pow(Math.abs(coordinates.y - StarMap.stars[i].coordinates.y), 2) + Math.pow(Math.abs(coordinates.z - StarMap.stars[i].coordinates.z), 2))) { i++ }
    if (i < StarMap.stars.length) {
        console.log('anyád.');
        return false;
    } else {
        return true;
    }
}

function valid(name) {
    let i = 0;
    while (i < StarMap.stars.length && StarMap.stars[i].name != name) {
        i++;
    }
    if (i < StarMap.stars.length) {
        return false;
    } else {
        return true;
    }
}

function nameCreator() {
    do {
        var chars = ["A", "B", "C", "D", "E", "F"]
        var name = "";
        for (i = 0; i < Math.ceil(Math.random() * 5); i++) {
            name += chars[Math.round(Math.random() * (chars.length - 1))];
        }
        name += "-";
        for (i = 0; i < Math.ceil(Math.random() * 3); i++) {
            name += Math.round(Math.random() * 9);
        }
    } while (!valid(name));
    return name;
}



var start = new Date();
var j = 0
while (j < starcount) {
    buildStar(j);
    j++;
}
var time = parseDate(new Date()) - parseDate(start);
console.log(`Time: ${time} ms`);

fs.writeFileSync(path, JSON.stringify(StarMap));
