function calcuLator (...types) {
  var fairy = 1;
  var steel = 1 ;
  var ice = 1;
  var poison = 1;
  var rock = 1;
  var water = 1;
  var flying = 1;
  var dragon = 1;
  var grass = 1;
  var fight = 1;
  var bug = 1;
  var fire = 1;
  var ground = 1;
  var ghost = 1;
  var electr = 1;
  var normal = 1;
  var psychc = 1;
  var dark = 1;
  var count = 0;

  types.forEach( type => {
    if (type.includes("fairy")) {
      fairyType(poison, steel, fight, dark, dragon, bug);
      count = count + 1;
    }
    else if (type.includes("steel")) {
      steelType(normal, fire, grass, ice, fight, poison, ground, flying, psychc, bug, rock, dragon, fairy);
      count = count + 1;
    }
    else if (type.includes("dark")) {
      darkType(fight, bug, fairy, psychc, ghost, dark);
      count = count + 1;
    }
    else if (type.includes("dragon")) {
      dragonType(ice, dragon, fairy, fire, water, electr, grass);
      count = count + 1;
    }
    else if (type.includes("ghost")) {
      ghosType(normal, fight, poison, bug, ghost, dark);
      count = count + 1;
    }
    else if (type.includes("rock")) {
      rockType(normal, fire, water, grass, fight, poison, flying, steel);
      count = count + 1;
    }
    else if (type.includes("bug")) {
      bugType(fire, grass, fight, ground, flying, rock);
      count = count + 1;
    }
    else if (type.includes("psychc")) {
      psychcType(fight, psychc, bug, ghost, dark);
      count = count + 1;
    }
    else if (type.includes("flying")) {
      flyingType(electr, grass, ice, fight, ground, bug, rock);
      count = count + 1;
    }
    else if (type.includes("ground")) {
      groundType(water, electr, grass, ice, poison, rock);
      count = count + 1;
    }
    else if (type.includes("poison")) {
      poisonType(grass, fight, poison, ground, psychc, bug, fairy);
      count = count + 1;
    }
    else if (type.includes("fight")) {
      fighType(flying, psychc, bug, rock, dark, fairy);
      count = count + 1;
    }
    else if (type.includes("ice")) {
      iceType(fire, ice, fight, rock, steel);
      count = count + 1;
    }
    else if (type.includes("grass")) {
      grassType(fire, water, electr, grass, ice, poison, ground, flying);
      count = count + 1;
    }
    else if (type.includes("electr")) {
      electrType(electr, ground, flying, steel);
      count = count + 1;
    }
    else if (type.includes("water")) {
      waterType(fire, water, electr, grass, ice, steel);
      count = count + 1;
    }
    else if (type.includes("fire")) {
      fireType(fire, water, grass, ice, ground, bug, rock, steel, fairy);
      count = count + 1;
    }
    else if (type.includes("normal")) {
      normalType(fight, ghost);
      count = count + 1;
    }
  });

  return { "fairy": fairy, 
      "steel": steel, "dark": dark, 
      "dragon": dragon, "ghost": ghost, 
      "rock": rock, "bug": bug, 
      "psychc": psychc, "flying": flying, 
      "ground": ground, "poison": poison, 
      "fight": fight, "ice": ice, 
      "grass": grass, "electr": electr, 
      "water": water, "fire": fire, 
      "normal": normal, "count": count
    };


  function fairyType (type){
    poison = poison * 2;
    steel = steel * 2;
    fight = fight / 2;
    dark = dark / 2
    dragon = dragon * 0;
    bug = bug / 2;
    return (poison,steel,fight,dark,dragon,bug);
  }
  function steelType(type){
    normal = normal / 2 ;
    fire = fire * 2; 
    grass = grass / 2;
    ice = ice / 2;
    fight = fight * 2;
    poison = poison * 0; 
    ground = ground * 2;
    flying = flying / 2;
    psychc = psychc / 2;
    bug = bug / 2;
    rock = rock / 2;
    dragon = dragon / 2;
    steel = steel / 2;
    fairy = fairy / 2;
    return (normal, fire, grass, ice, fight, poison, ground, flying, psychc,bug,rock,dragon,steel,fairy);
  }
  function darkType(type){
    fight = fight * 2;
    bug = bug * 2;
    fairy = fairy * 2;
    psychc = psychc * 0
    ghost = ghost / 2;
    dark = dark / 2;
    return (fight, bug, fairy, psychc, ghost,dark);
  }
  function dragonType (type){
    ice = ice * 2;
    dragon = dragon * 2;
    fairy = fairy * 2;
    fire = fire / 2;
    water = water / 2;
    electr = electr / 2;
    grass = grass / 2;
    return (ice, dragon, fairy, fire, water, electr, grass);
  }
  function ghosType (type){
    normal = normal * 0;
    fight = fight * 0;
    poison = poison / 2;
    bug = bug / 2;
    ghost = ghost * 2;
    dark = dark * 2;
    return (normal, fight, poison, bug, ghost, dark);
  }
  function rockType (type){
    normal = normal / 2;
    fire = fire / 2;
    water = water * 2;
    grass = grass * 2;
    fight = fight * 2;
    poison = poison / 2;
    ground = ground * 2; 
    flying = flying / 2;
    steel = steel * 2;
    return (normal, fire, water, grass, fight, poison, ground, flying, steel);
  }
  function bugType(type){
    fire = fire * 2;
    grass = grass / 2;
    fight = fight / 2;
    ground = ground / 2;
    flying = flying * 2;
    rock = rock * 2;
    return (fire, grass, fight, ground, flying, rock);
  }
  function psychcType (type){
    fight = fight / 2;
    psychc = psychc / 2;
    bug = bug * 2;
    ghost = ghost / 2;
    dark = dark * 2;
    return (fight, psychc, bug, ghost, dark);
  }
  function flyingType (type){
    electr = electr * 2;
    grass = grass / 2;
    ice = ice * 2;
    fight = fight / 2;
    ground = ground * 0;
    bug = bug / 2;
    rock = rock * 2;
    return (electr, grass, ice, fight, ground, bug, rock);
  }
  function groundType (type){
    water = water * 2;
    electr = electr * 0;
    grass = grass * 2;
    ice = ice * 2;
    poison = poison / 2;
    rock = rock / 2;
    return (water, electr, grass, ice, poison, rock);
  }
  function poisonType (type){
    grass = grass / 2;
    fight = fight / 2;
    poison = poison / 2;
    ground = ground * 2;
    psychc = psychc * 2;
    bug = bug / 2;
    fairy = fairy / 2;
    return (grass, fight, poison, ground, psychc, bug, fairy);
  }
  function fighType (type){
    flying = flying * 2;
    psychc = psychc * 2;
    bug = bug / 2;
    rock = rock / 2;
    dark = dark / 2;
    fairy = fairy * 2;
    return (flying, psychc, bug, rock, dark, fairy);
  }
  function iceType (type){
    fire = fire * 2;
    ice = ice / 2;
    fight = fight * 2;
    rock = rock *2;
    steel = steel *2;
    return (fire, water, grass, ice, ground, bug, rock, steel, fairy);
  }
  function grassType (type){
    fire = fire * 2;
    water = water / 2;
    electr = electr / 2;
    grass = grass / 2; 
    ice = ice * 2; 
    poison = poison * 2; 
    ground = ground / 2;
    flying = flying * 2;
    bug = bug * 2;
    return (fire, water, electr, grass, ice, poison, ground, flying)
  }
  function electrType (type){
    electr = electr / 2;
    ground = ground * 2;
    flying = flying / 2;
    steel = steel / 2;
    return (electr, ground, flying, steel);
  }
  function waterType (type){
    fire = fire / 2;
    water = water / 2; 
    electr = electr * 2;
    grass = grass * 2;
    ice = ice / 2 ;
    steel = steel / 2;
    return (fire, water, electr, grass, ice, steel);
  }
  function fireType (type){
    fire = fire / 2
    water = water * 2
    grass = grass / 2
    ice = ice / 2
    ground = ground * 2 
    bug = bug / 2
    rock = rock * 2 
    steel = steel / 2
    fairy = fairy / 2
    return (fire, water, grass, ice, ground, bug, rock, steel, fairy);
  }
  function normalType (type){
    fight = fight * 2;
    ghost = ghost * 0;
    return (fight, ghost);
  }

}
module.exports = {calcuLator}