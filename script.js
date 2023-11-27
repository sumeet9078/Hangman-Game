// Theme toggle
document.getElementById("toggle").addEventListener("click", function () {
    document.getElementsByTagName("body")[0].classList.toggle("dark-theme")
})

// Initial references
const optionsContainer = document.getElementById("options-container")
const letterContainer = document.getElementById("letter-container")
const userInputSection = document.getElementById("user-input-section")
const newGameContainer = document.getElementById("new-game-container")
const confettiContainer = document.getElementById("confetti")
const resultText = document.getElementById("result-text")
const newGameButton = document.getElementById("new-game-button")
const canvas = document.getElementById("canvas")

// Importing audio files
let audioSelectOption = new Audio("./audio/select-option.wav")
let audioCorrectLetter = new Audio("./audio/correct-letter.wav")
let audioWrongLetter = new Audio("./audio/wrong-letter.wav")
let audioWinGame = new Audio("./audio/win.wav")
let audioLoseGame = new Audio("./audio/lose.wav")
let audioNewGame = new Audio("./audio/new-game.wav")

// Options values for buttons
let options = {
    fruits: [
        "Apple",
        "Blueberry",
        "Banana",
        "Pineapple",
        "Pomegranate",
        "Watermelon",
        "Mango",
        "Orange",
        "Guava",
        "Papaya",
    ],
    animals: [
        "Lion",
        "Rhinoceros",
        "Tiger",
        "Hippopotamus",
        "Horse",
        "Zebra",
        "Elephant",
        "Donkey",
        "Gorilla",
        "Shark",
    ],
    countries: [
        "India",
        "Australia",
        "Brazil",
        "Switzerland",
        "Zimbabwe",
        "Canada",
        "China",
        "France",
        "Mexico",
        "Indonesia",
        "Germany",
        "Japan",
        "Austria",
        "Egypt",
        "Malaysia",
    ],
}

// Count
let winCount = 0
let count = 0
let chosenWord = ""

// Display option buttons
const displayOptions = () => {
    optionsContainer.innerHTML += `<h3>Please Select an Option</h3>`
    let buttonCon = document.createElement("div")
    for (let value in options) {
        buttonCon.innerHTML += `<button class="options" onclick="generateWord('${value}')">${value}</button>`
    }
    optionsContainer.appendChild(buttonCon)
}

// Block all the buttons
const blocker = () => {
    let optionsButtons = document.querySelectorAll(".options")
    let letterButtons = document.querySelectorAll(".letters")

    // Disable all options
    optionsButtons.forEach((button) => {
        button.disabled = true
    })

    // Disable all letters
    letterButtons.forEach((button) => {
        button.disabled = true
    })

    newGameContainer.classList.remove("hide")
}

// Word generator
const generateWord = (optionValue) => {
    // Play audio
    audioSelectOption.play()
    let optionsButtons = document.querySelectorAll(".options")
    // If optionValue matches the button innerText then highlight the button
    optionsButtons.forEach((button) => {
        if (button.innerText.toLowerCase() === optionValue) {
            button.classList.add("active")
        }
        button.disabled = true
    })

    // Initially hide the letters, clear the previous word
    letterContainer.classList.remove("hide")
    userInputSection.innerText = ""

    let optionArray = options[optionValue]
    // choose a random word
    chosenWord = optionArray[Math.floor(Math.random() * optionArray.length)]
    chosenWord = chosenWord.toUpperCase()

    // replace every letter with a span containing a dash
    let displayItem = chosenWord.replace(/./g, '<span class="dashes">_</span>')

    // Display each element as a span
    userInputSection.innerHTML = displayItem
}

// Initial function (Called when the page loads/user presses new game button)
const initializer = () => {
    winCount = 0
    count = 0

    // Initially erase all the content and hide the letters and new game button
    userInputSection.innerHTML = ""
    optionsContainer.innerHTML = ""
    letterContainer.innerHTML = ""
    letterContainer.classList.add("hide")
    newGameContainer.classList.add("hide")

    // For creating letter buttons
    for (let i = 65; i < 91; i++) {
        let button = document.createElement("button")
        button.classList.add("letters")
        // Number to ASCII [A-Z]
        button.innerText = String.fromCharCode(i)
        // Character button click
        button.addEventListener("click", () => {
            let charArray = chosenWord.split("")
            let dashes = document.getElementsByClassName("dashes")
            // If the array contains clicked alphabet then replace the matched dash with the alphabet else draw on canvas
            if (charArray.includes(button.innerText)) {
                charArray.forEach((char, index) => {
                    // If a character in the array is the same as the clicked alphabet
                    if (char === button.innerText) {
                        // Play audio
                        audioCorrectLetter.play()
                        // Replace the dash with the alphabet
                        dashes[index].innerText = char
                        // Increment the counter
                        winCount += 1
                        // If the winCount equals the word length
                        if (winCount == charArray.length) {
                            resultText.innerHTML = `<h2 class='win-msg'>You Win!!</h2><p>The word was <span>${chosenWord}</span></p>`
                            // Play audio
                            audioWinGame.play()
                            // Show Confetti
                            confettiContainer.classList.remove("hide")
                            // Block all the buttons
                            blocker()
                        }
                    }
                })
            } else {
                // Play audio
                audioWrongLetter.play()
                // Lose count
                count += 1
                // For drawing a man
                drawMan(count)
                // count == 6 because head + body + left arm + right arm + left leg + right leg
                if (count == 6) {
                    resultText.innerHTML = `<h2 class='lose-msg'>You Lose!!</h2><p>The word was <span>${chosenWord}</span></p>`
                    // Play audio
                    audioLoseGame.play()
                    // Show Confetti
                    confettiContainer.classList.add("hide")
                    // Block all the buttons
                    blocker()
                }
            }
            // Disable clicked button
            button.disabled = true
        })
        letterContainer.append(button)
    }

    displayOptions()

    // Call to canvasCreator (for clearing previous canvas and creating initial canvas)
    let { initialDrawing } = canvasCreator()
    // initialDrawing would draw the frame
    initialDrawing()
}

// Canvas
const canvasCreator = () => {
    let context = canvas.getContext("2d")
    context.beginPath()
    context.strokeStyle = "#000"
    context.lineWidth = 2

    // For drawing lines
    const drawLine = (fromX, fromY, toX, toY) => {
        context.moveTo(fromX, fromY)
        context.lineTo(toX, toY)
        context.stroke()
    }

    const head = () => {
        context.beginPath()
        context.arc(70, 30, 10, 0, Math.PI * 2, true)
        context.stroke()
    }

    const body = () => {
        drawLine(70, 40, 70, 80)
    }

    const leftArm = () => {
        drawLine(70, 50, 50, 70)
    }

    const rightArm = () => {
        drawLine(70, 50, 90, 70)
    }

    const leftLeg = () => {
        drawLine(70, 80, 50, 110)
    }

    const rightLeg = () => {
        drawLine(70, 80, 90, 110)
    }

    // Initial frame
    const initialDrawing = () => {
        // Clear canvas
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        // Bottom line
        drawLine(10, 130, 130, 130)
        // Left line
        drawLine(10, 10, 10, 131)
        // Top line
        drawLine(10, 10, 70, 10)
        // Small Top line
        drawLine(70, 10, 70, 20)
    }

    return { initialDrawing, head, body, leftArm, rightArm, leftLeg, rightLeg }
}

// Draw the man
const drawMan = (count) => {
    let { head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator()
    switch (count) {
        case 1:
            head()
            break
        case 2:
            body()
            break
        case 3:
            leftArm()
            break
        case 4:
            rightArm()
            break
        case 5:
            leftLeg()
            break
        case 6:
            rightLeg()
            break
        default:
            break
    }
}

// New game
newGameButton.addEventListener("click", initializer)
window.onload = initializer
