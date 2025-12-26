pkmn = [["Bulbasaur", "Grass", "Monster"], ["Charmander", "Monster", "Dragon"], ["Squirtle", "Monster", "Water"], ["Tauros", "Field"]];



function additem1(toadd) {
    var ele = document.createElement("option")
    ele.innerHTML = toadd[0]
    document.getElementById("pk1").appendChild(ele)
}

function additem2(toadd) {
    var ele = document.createElement("option")
    ele.innerHTML = toadd[0]
    document.getElementById("pk2").appendChild(ele)
}

pkmn.forEach(additem1)
pkmn.forEach(additem2)

function breed() {
    var breed = false
    var poke1 = document.getElementById("pk1").value
    var poke2 = document.getElementById("pk2").value
    var counter = 0
    pokemonOnePosition = null
    pokemonTwoPosition = null
    pkmn.forEach(x => {
        if (x.includes(poke1)) {
            pokemonOnePosition = counter;
        }
        counter++;
    })
    counter = 0
    pkmn.forEach(x => {
        if (x.includes(poke2)) {
            pokemonTwoPosition = counter;
        }
        counter++;
    })

    for (x = 0; x < pkmn[pokemonOnePosition].length; x++) {
        if (pkmn[pokemonTwoPosition].includes(pkmn[pokemonOnePosition][x])) {
            var breed = true }
        if(breed){
            document.getElementById("breedstatus").innerHTML = "We can breed!"
        } else {
            document.getElementById("breedstatus").innerHTML = "We can't breed :("
        }
    }
}

function updateimage(selectObject){
    var newpokemon =  selectObject.value.toLowerCase();
    var id = selectObject.id.substr(-1, 1);
    var imagetoupdate = document.getElementById("pkim"+id).src = "images\\"+newpokemon+".gif"
}

document.getElementById("breedbutton").onclick = breed