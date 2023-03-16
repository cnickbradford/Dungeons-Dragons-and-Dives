let $noSpell = $('<div>No spells meet search criteria, Please try again</div>)')
let $opening = $(`<div>Search for spells by spell level</div`)
let $classes = ["barbarian", "bard", "cleric", "druid", "fighter", "monk", "paladin", "ranger", "rogue", "sorceror", "warlock", "wizard"]
let spellData = []






//function that determines if the user is searching by class, spell level, or school
function searchforSpell() {
    spellData = []
    let $searchedSpell = $('input').val()
    for (let i = 0; i < $classes.length; i++) {
        if ($searchedSpell.toLowerCase() === $classes[i]) {
            return gatherSpellsbyClass()
        }
    }
    if (/^\d+$/.test($searchedSpell)) {
        gatherSpellsbyLevel()
    } else {
        gatherSpellsbySchool()
    }
}





//function that gathers all spells of determined level
function gatherSpellsbyLevel() {
    let $searchedSpell = $('input').val()
    $.get(`https://www.dnd5eapi.co/api/spells?level=${$searchedSpell}`, (data) => {
        let actualSpells = data.results
        for (let i = 0; i < actualSpells.length; i++) {
            $.get(`https://www.dnd5eapi.co${actualSpells[i].url}`, (spell) => {
                spellData.push(spell)
                if (i === actualSpells.length - 1) {
                    displaySpells()
                }
            })
        }
    })
}

//function that gathers all spells that are used by determined class
function gatherSpellsbyClass() {
    let $searchedSpell = $('input').val()
    $.get(`https://www.dnd5eapi.co/api/classes/${$searchedSpell}/spells`, (data) => {
        let actualSpells = data.results
        for (let i = 0; i < actualSpells.length; i++) {
            $.get(`https://www.dnd5eapi.co${actualSpells[i].url}`, (spell) => {
                spellData.push(spell)
                if (i === actualSpells.length - 1) {
                    displaySpells()
                }
            })
        }
    })
}



// function that gathers spells by school 
function gatherSpellsbySchool() {
    let $searchedSpell = $('input').val()
    $.get(`https://www.dnd5eapi.co/api/spells?school=${$searchedSpell}`, (data) => {
        let actualSpells = data.results
        for (let i = 0; i < actualSpells.length; i++) {
            $.get(`https://www.dnd5eapi.co${actualSpells[i].url}`, (spell) => {
                spellData.push(spell)
                if (i === actualSpells.length - 1) {
                    displaySpells()
                }
            })
        }
    })
}


//function that will display the searched spells to the user and add buttons to each spell
function displaySpells() {
    console.log(spellData)
    //$open.hide() && $noShow.hide();
    for (let i = 0; i < spellData.length; i++) {
        let spellClasses = []
        let $card = $(`<span class="result-card">
  <h2 class="spell-title">${spellData[i].name}</h2>
  <h3 class="spell-genres">Spell Level: ${spellData[i].level}</h3>
  <h3 class="spell-genres">${spellData[i].casting_time}</h3>
  <h3 class="spell-genres">${spellData[i].range}</h3>
  <h3 class="spell-genres">${spellData[i].components}</h3>
  <h3 class="spell-genres">${spellData[i].duration}</h3>
  <div class="spell-summary">
    <em>Summary:</em>
    ${spellData[i].desc}
  </div>
  </span>`)
        for (let j = 0; j < spellData[i].classes.length; j++) {
            spellClasses.push(spellData[i].classes[j].name)
        }
        let addedClasses = (`<h3 class = "spell-genres">${spellClasses.join(", ")}</h3>`)
        $card.append(addedClasses)
        let $saveButton = $(`<button id = ${i} class = "save">Save spell</button>`);
        $saveButton.on("click", saveSpell)
        $card.append($saveButton)
        $('#results').append($card);

    }

}



//function that saves the selected spell to local storage
function saveSpell(e) {
    let savedSpell = spellData[e.target.id]
    localStorage.setItem(`${savedSpell.name}`, `Level ${savedSpell.level}`)
}


//event listeners for onclick and keypress enter for searchbar
$("#submit").on("click", () => {
    searchforSpell()
})

$("input").on("keypress", (e) => {
    if (e.which === 13) {
        searchforSpell()
    }
})


