var helditems = ["None", "Everstone", "Destiny Knot", "Power Weight", "Power Bracer", "Power Belt", "Power Lens", "Power Band", "Power Anklet"]
var itemstats = ["hp", "atk", "def", "spatk", "spdef", "spe"]
var natures = ["Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Docile", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Serious", "Jolly", "Naive", "Modest", "Mild", "Quiet", "Bashful", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky"]

var group1 = []
var group2 = []
var evochain = ""
var evochainmale = ""
var finalbaby = ""
var pk1moves = null
var pk2moves = null
var pk1abil = []
var pk2abil = []
var counter = 0

function swapPokemon(){
    var current1 = document.getElementById("pk1").value;
    document.getElementById("pk1").value = document.getElementById("pk2").value;
    document.getElementById("pk2").value = current1;
    search(document.getElementById("pk1"))
    search(document.getElementById("pk2"))
}

function search(x) {
    var thisid = x.id.substr(-1, 1)
    var output = {}
    var tosearchfor = x.value.toLowerCase();

    var request = new XMLHttpRequest()
    request.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + tosearchfor, true)
    request.onload = function () {
        output = JSON.parse(this.response)
        document.getElementById("pkim" + thisid).src = output.sprites.front_default
        if (thisid == "1") {
            pk1moves = output.moves;
        } else {
            pk2moves = output.moves;
        }
        fillmoves(output.moves, x)

        abilities = output.abilities
        document.getElementById("abil" + thisid).options.length = 0
        abilities.forEach(x => {
            var ele = document.createElement("option")
            if (x.is_hidden) {
                ele.innerHTML = x.ability.name + " (h)"
            } else {
                ele.innerHTML = x.ability.name
            }

            document.getElementById("abil" + thisid).appendChild(ele)
        })
    }
    request.send()

    var egggrp = new XMLHttpRequest()
    egggrp.open('GET', 'https://pokeapi.co/api/v2/pokemon-species/' + tosearchfor, true)
    egggrp.onload = function () {
        output = JSON.parse(this.response)
        if (thisid == "1") {
            group1 = []
            output.egg_groups.forEach(x => group1.push(x.name))
            evochainmale = output.evolution_chain.url
        } else {
            group2 = []
            output.egg_groups.forEach(x => group2.push(x.name))
            evochain = output.evolution_chain.url
        }
    }
    egggrp.send()
}

function naturecalc() {
    var mnature = document.getElementById("nature1").value;
    var fnature = document.getElementById("nature2").value;
    var mitem = document.getElementById("helditem1").value;
    var fitem = document.getElementById("helditem2").value;

    if (mitem == "Everstone") {
        document.getElementById("outputnature").value = mnature;
    } else if (fitem == "Everstone") {
        document.getElementById("outputnature").value = fnature;
    } else {
        var randnature = Math.floor(Math.random() * natures.length)
        document.getElementById("outputnature").value = natures[randnature];
    }
}

function getability(abc, hidden, parent) {
    var abx = []
    abc.forEach(a => {
        abx.push(a)
    })
    console.log(abx, hidden, parent)
    var abilsim = document.getElementById("hasim").checked
    if (abilsim) {
        var hanotfound = true
        while (hanotfound) {

        }
    } else {
        var seed = Math.floor(Math.random() * 100)
        console.log(seed)
        if (hidden) {
            if (seed < 60) {
                document.getElementById("abilout").value = document.getElementById("abil" + parent).value;
            } else {
                var gothidden = true
                while(gothidden){
                var newabil = abx[Math.floor(Math.random() * abx.length)]
                if(newabil.includes("(h)")){
                    gothidden = true
                } else {
                    gothidden = false
                }
            }
                document.getElementById("abilout").value = newabil
                }
        }
    }

}

function abilitycalc(pk1, pk2) {
    if (pk2.toLowerCase().includes("ditto")) {
        abils = []

        var getabilities = new XMLHttpRequest()
        getabilities.open('GET', "https://pokeapi.co/api/v2/pokemon/" + pk1, true)
        getabilities.onload = function () {
            var output = JSON.parse(this.response)
            output.abilities.forEach(a => {
                if (a.is_hidden) {
                    abils.push(a.ability.name + " (h)")
                } else {
                    abils.push(a.ability.name)
                }
            })
            var hidden = false
            if (document.getElementById("abil1").value.includes("(h)")) {
                hidden = true
            }
            getability(abils, hidden, "1")
        }
        getabilities.send()

    } else {
        abils = []

        var getabilities = new XMLHttpRequest()
        getabilities.open('GET', "https://pokeapi.co/api/v2/pokemon/" + pk2, true)
        getabilities.onload = function () {
            var output = JSON.parse(this.response)
            output.abilities.forEach(a => {
                if (a.is_hidden) {
                    abils.push(a.ability.name + " (h)")
                } else {
                    abils.push(a.ability.name)
                }

            })
            var hidden = false
            if (document.getElementById("abil2").value.includes("(h)")) {
                hidden = true
            }
            getability(abils, hidden, "2")
        }
        getabilities.send()
    }
}

function getIVs() {
    var choices = ["atk", "def", "spatk", "spdef", "hp", "spe"];
    var sim = document.getElementById("ivsim").checked;

    var sixiv = 0;
    choices.forEach(x => {
        if (document.getElementById(x + "1").value == "31") {
            sixiv++
        } else {
            if (document.getElementById(x + "2").value == "31") {
                sixiv++
            }

        }
    })

    if (sixiv >= 3) {
        var legaltest = true
    } else {
        var legaltest = false
    }

    if (sim && legaltest) {
        var notfound = true;
        while (notfound) {
            var ivs = ivcalc()
            var perfects = 0
            ivs.forEach(x => {
                if (x == "31") {
                    perfects++
                }
            })
            if (perfects == 6) {
                notfound = false;
                for (x = 0; x < 6; x++) {
                    document.getElementById(choices[x] + "out").value = ivs[x]
                }
            } else {
                counter++
            }
        } document.getElementById("counter").innerHTML = counter + " Eggs Hatched"
    } else if (sim && !legaltest) {
        document.getElementById("counter").innerHTML = "This breeding pair cannot create a perfect IV Pokémon"
    } else {
        var ivs = ivcalc()
        for (x = 0; x < 6; x++) {
            document.getElementById(choices[x] + "out").value = ivs[x]
        }
    }
}

function ivcalc() {
    var choices = ["atk", "def", "spatk", "spdef", "hp", "spe"];
    var passitems = ["Power Weight", "Power Bracer", "Power Belt", "Power Lens", "Power Band", "Power Anklet"];
    var mitem = document.getElementById("helditem1").value;
    var fitem = document.getElementById("helditem2").value;
    var finalIVs = []
    if (mitem == "Destiny Knot" || fitem == "Destiny Knot") {
        if (mitem == "Destiny Knot" && fitem == "Destiny Knot") {
            var ivnottoinherit = choices[Math.floor(Math.random() * choices.length)]
            choices.forEach(x => {
                if (x == ivnottoinherit) {
                    finalIVs.push("" + Math.floor((Math.random() * 31) + 1))
                } else {
                    finalIVs.push(document.getElementById(x + (Math.floor(Math.random() * 2) + 1)).value)
                }
            })
        } else {
            if (mitem == "Destiny Knot") {
                var parentknot = "1";
            } else {
                var parentknot = "2";
            }
            var ivnottoinherit = choices[Math.floor(Math.random() * choices.length)]
            choices.forEach(x => {
                if (x == ivnottoinherit) {
                    finalIVs.push("" + Math.floor((Math.random() * 31) + 1))
                } else {
                    finalIVs.push(document.getElementById(x + parentknot).value)
                }
            })
        }
    } else {
        var ivtoinherit = []
        var count = 0
        if (passitems.includes(mitem)) {
            ivtoinherit.push(choices[passitems.indexOf(mitem)])
            count++
        }
        if (passitems.includes(fitem)) {
            ivtoinherit.push(choices[passitems.indexOf(fitem)])
            count++
        }
        while (count < 3) {
            var inherit = choices[Math.floor(Math.random() * choices.length)]
            if (ivtoinherit.includes(inherit) == false) {
                ivtoinherit.push(inherit)
                count++
            }
        }
        choices.forEach(x => {
            if (ivtoinherit.includes(x)) {
                finalIVs.push(document.getElementById(x + (Math.floor(Math.random() * 2) + 1)).value)
            } else {
                finalIVs.push("" + Math.floor((Math.random() * 31) + 1))
            }
        })

    }

    return (finalIVs)
}

function getbaby() {
    var pk1 = document.getElementById("pk1").value;
    var pk2 = document.getElementById("pk2").value;
    if (pk2.toLowerCase() != "ditto") {
        var getline = new XMLHttpRequest()
        getline.open('GET', evochain, true)
        getline.onload = function () {
            output = JSON.parse(this.response)
            finalbaby = output.chain.species.name
            getbabyimage()
        }
        getline.send()
    } else {
        var getline = new XMLHttpRequest()
        getline.open('GET', evochainmale, true)
        getline.onload = function () {
            output = JSON.parse(this.response)
            finalbaby = output.chain.species.name
            getbabyimage()
        }
        getline.send()
    }
}

function shinycalc() {
    var masuda = document.getElementById("masuda").checked;
    var charm = document.getElementById("shinycharm").checked;
    if (masuda && charm) {
        var shinychance = 512
    } else if (masuda) {
        var shinychance = 683
    } else if (charm) {
        var shinychance = 1365
    } else {
        var shinychance = 4096
    }
    if (document.getElementById("cyini").checked) {
        shinychance = shinychance * 100
    }
    var shinyid = Math.floor(Math.random() * shinychance)
    return shinyid
}

function getbabyimage() {
    var sim = document.getElementById("shinysim").checked;
    if (sim) {
        var shinyfound = false
        while (!shinyfound) {
            var hatch = shinycalc()
            if (hatch == 100) {
                shinyfound = true
            }
            counter++
        } document.getElementById("counter").innerHTML = counter + " Eggs Hatched"
        var shinyid = 100
    } else {
        var shinyid = shinycalc()
    }

    var getbabyid = new XMLHttpRequest()
    getbabyid.open('GET', "https://pokeapi.co/api/v2/pokemon/" + finalbaby, true)
    getbabyid.onload = function () {
        output = JSON.parse(this.response)
        if (shinyid != 100) {
            document.getElementById("pkimout").src = output.sprites.front_default
        }
        else {
            document.getElementById("pkimout").src = output.sprites.front_shiny
        }
        calcmoves()

    }
    getbabyid.send()
}


function fillfields() {
    helditems.forEach(x => {
        var ele = document.createElement("option")
        ele.innerHTML = x;
        document.getElementById("helditem1").appendChild(ele);

    })
    helditems.forEach(x => {
        var ele = document.createElement("option")
        ele.innerHTML = x;
        document.getElementById("helditem2").appendChild(ele)

    })
    natures.forEach(x => {
        var ele = document.createElement("option")
        ele.innerHTML = x;
        document.getElementById("nature1").appendChild(ele)
    })
    natures.forEach(x => {
        var ele = document.createElement("option")
        ele.innerHTML = x;
        document.getElementById("nature2").appendChild(ele)
    })

    document.getElementById("breedbutton").onclick = breed
}

function fillmoves(x, y) {
    var id = y.id.substr(-1, 1)
    document.getElementById("move1-" + id).options.length = 0;
    document.getElementById("move2-" + id).options.length = 0;
    document.getElementById("move3-" + id).options.length = 0;
    document.getElementById("move4-" + id).options.length = 0;
    for (i = 1; i < 5; i++) {
        x.forEach(move => {
            var ele = document.createElement("option")
            ele.innerHTML = move.move.name
            document.getElementById("move" + i + "-" + id).appendChild(ele)
        })
    }
}

function calcmoves() {
    var movelist = new XMLHttpRequest()
    movelist.open('GET', "https://pokeapi.co/api/v2/pokemon/" + finalbaby, true)
    movelist.onload = function () {
        var output = JSON.parse(this.response);
        var genmoves = []
        output.moves.forEach(a => {
            if (a.version_group_details[0].level_learned_at == 1) {
                genmoves.push(a.move.name)
            }

        })
        var mcounter = 1;
        genmoves.forEach(a => {
            document.getElementById("moveout" + mcounter).value = a;
            mcounter++
        })
        while (mcounter <= 4) {
            document.getElementById("moveout" + mcounter).value = "";
            mcounter++
        }
    }
    movelist.send()
}

function loading() {
    document.getElementById("pkimout").src = "images/loading.gif"
}

function breed() {
    counter = 0
    var pk1 = document.getElementById("pk1").value;
    var pk2 = document.getElementById("pk2").value;
    var breedable = false
    if (group1.includes("no-eggs") || group2.includes("no-eggs") || (group1.includes("ditto") && group2.includes("ditto"))) {
        breedable = false
    } else if (pk1.toLowerCase() == "ditto" || pk2.toLowerCase() == "ditto") {
        breedable = true
    } else {
        group1.forEach(a => {
            if (group2.includes(a)) {
                breedable = true
            }
        })
    }

    if (breedable) {

        getIVs()
        getbaby()
        naturecalc()
        abilitycalc(pk1, pk2)
    } else {
        document.getElementById("pkimout").src = "images/sadface.png"
    }
}

document.getElementById("swap").onclick = swapPokemon
fillfields()