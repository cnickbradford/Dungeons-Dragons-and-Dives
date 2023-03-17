let $noSpell = $('<div>No spells meet search criteria, Please try again</div>)')
let $opening = $(`<h3 class ="result-card" >You can search for spells by spell level, class, or school</h3>
<h2 class = 'saved-card'>You can also save the spells once you search and can view all saved spells!</h2>`)
let $classes = ["barbarian", "bard", "cleric", "druid", "fighter", "monk", "paladin", "ranger", "rogue", "sorceror", "warlock", "wizard"]
let spellData = []
let spellLevelArr = []
// let spellLevelCount = {};

$("#results").append($opening)
$("#showspell").on("click", displaysavedSpells)








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
    $('#results').children().remove()
    $('#homeimg').remove()
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
        //adding the buttons to save the spell to each result card 
        let addedClasses = (`<h3 class = "spell-genres">${spellClasses.join(", ")}</h3>`)
        $card.append(addedClasses)
        let $saveButton = $(`<button id = ${i} class = "submit">Save spell</button>`);
        $saveButton.on("click", saveSpell)
        $card.append($saveButton)
        $('#results').append($card);

    }

}

//function that that gathers all of the levels of the spells you have saved and finds how many times that level appears 
// function totalSpellLevels(){
//     spellLevelArr = [];
//     spellLevelCount = {};
//     for (let i = 0; i < localStorage.length; i++) {
//       let spellLevel = localStorage.key(i).split('')
//       spellLevelArr.push(spellLevel[spellLevel.length - 2])
//     }
//     for(let j = 0; j < spellLevelArr.length;j++ ){
//         let num = spellLevelArr[j]
//         if(spellLevelCount[num]){
//             spellLevelCount[num]++
//         }else{
//             spellLevelCount[num] = 1
//         }
//     }
//     displaySpellLevels()
// }


//function that displays the total of each spell level you have saved
// function displaySpellLevels(){
//     let $card = $(`<span class ="saved-card">
//     <h2 class = "spell-title"> Saved spell levels </h2>
//     <ul id = "level-list">
//     </ul>
//     </span>`)
//     for(key in spellLevelCount){
//         console.log(spellLevelCount[key])
//         console.log(key)
//          let count = $(`<li>${spellLevelCount[key]} Level ${key}</li>`)
//          $("#level-list").append(count)
//          $("#level-counts").append($card)
//     }
// }



//adding grid function to view saved spells button 
function displaysavedSpells() {
    $('#savedSpells').children().remove()
    $('#homeimg').remove()
    for (let i = 0; i < localStorage.length; i++) {
        let $card = $(`<span class = "saved-card">
    <h3 class = "spell-title">${localStorage.key(i)}</h3>
    <em>Summary:</em>
    ${localStorage.getItem(localStorage.key(i))}
    </span>`)
        let $deleteButton = $(`<button id = ${i} class = "delete">Delete spell</button>`);
        $deleteButton.on("click", deleteSpell)
        $card.append($deleteButton)
        $(`#savedSpells`).append($card)
    }
    //totalSpellLevels()
}




//function that saves the selected spell to local storage
function saveSpell(e) {
    let savedSpell = spellData[e.target.id]
    console.log(savedSpell.desc[0])
    localStorage.setItem(`${savedSpell.name} Level ${savedSpell.level}`, `${savedSpell.desc}`)
}

//function that deletes spell from local storage and re-runs view saved function, refreshing the list
function deleteSpell(e) {
    console.log(e.target.id)
    localStorage.removeItem(localStorage.key(e.target.id))
    displaysavedSpells()

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


