const firstOptions = [
  { id: 'Snack', label: 'Snack', name: 'radio', happiness: 40 },
  { id: 'Food', label: 'Food', name: 'radio', happiness: 20 },
  { id: 'Nothing', label: 'Nothing', name: 'radio', happiness: -20 },
]
const secondOptions = [
  { id: 'Fishing play', label: 'Fishing play', name: 'radio', happiness: 40 },
  { id: 'Catnip', label: 'Catnip', name: 'radio', happiness: 40 },
  { id: 'Foot', label: 'Foot', name: 'radio', happiness: 20 },
]
const thirdOptions = [
  { id: 'Yes', label: 'Yes', name: 'radio', happiness: 40 },
  { id: 'No', label: 'No', name: 'radio', happiness: -100 },
]
let happiness = 0
let arr = []

const sum = (a, b) => a + b
let totalHappiness = 0

const main = document.getElementById('main')
const title = document.getElementById('title')
title.textContent = 'Bring Champ Back Home And Make Him Happy'
title.className = 'maximize'
title.onclick = gameBegin

progressBar(happiness)
//depends on happiness, change the width of progressBar
function progressBar(happiness) {
  if (happiness === 0) {
    arr = []
  }
  arr.push(happiness)
  totalHappiness = arr.reduce(sum, 0)
  if (totalHappiness > 100) {
    totalHappiness = 100
  } else if (totalHappiness < 0) {
    totalHappiness = 0
  }
  const id = document.getElementById('progressBar')
  id.style.width = `${totalHappiness}%`
  id.textContent = `${totalHappiness}%`
}

function gameBegin() {
  if (title.classList.contains('minimize')) {
    return
  }
  title.classList.remove('maximize')
  title.classList.add('minimize')
  //add first IMG
  updateImg(1)
  //add firstQuestion
  const questionnTextContent =
    'Hi, my name is Champ. You can look after me for whole day!'
  updateQuestion(questionnTextContent)
  //add first question button
  const buttonTextContent = 'Of course'
  updateButton(buttonTextContent, secondQuestion)
}

function secondQuestion() {
  happiness = 20
  progressBar(happiness)
  main.removeChild(document.getElementById('minimize-img'))
  main.removeChild(document.getElementById('question'))
  main.removeChild(document.getElementById('button'))
  //add second Image
  updateImg(2)
  //add secondQuestion
  const questionnTextContent = 'I’m so hungry. What would you feed me?'
  updateQuestion(questionnTextContent)
  //add second question radio
  createOptions(firstOptions, thirdQuestion)
}

//when hit ancion button, get the choosen radiobox's data
//if choosen radio box's id = options.id
function thirdQuestion() {
  firstOptions.forEach((option) => {
    let checked = document.getElementById(option.id).checked
    if (checked) {
      progressBar(option.happiness)
    }
  })
  updateImg(3)
  const questionnTextContent = 'What should we play?'
  updateQuestion(questionnTextContent)

  if (document.getElementById(firstOptions[0].id).checked) {
    //go to fishingGame index and
    createOptions(secondOptions, forthQuestion)
  } else if (document.getElementById(firstOptions[1].id).checked) {
    createOptions(secondOptions, forthQuestion)
  } else if (document.getElementById(firstOptions[2].id).checked) {
    main.removeChild(document.getElementById('minimize-img'))
    main.removeChild(document.getElementById('question'))
    updateImg(4)
    const questionnTextContent =
      'I wanna go outside to play with other cate. would you let me go out?'
    updateQuestion(questionnTextContent)
    createOptions(thirdOptions, revealIfChampBack)
  } else {
    alert('You need to choose at least one!')
    restartWhilePlaying()
    main.removeChild(document.getElementById('minimize-img'))
    main.removeChild(document.getElementById('question'))
  }

  removeChildNode()
}

function forthQuestion() {
  secondOptions.forEach((option) => {
    let checked = document.getElementById(option.id).checked
    if (checked) {
      progressBar(option.happiness)
    }
  })
  updateImg(4)
  const questionnTextContent =
    'I wanna go outside to play with other cate. would you let me go out?'
  updateQuestion(questionnTextContent)
  if (document.getElementById(secondOptions[0].id).checked) {
    createOptions(thirdOptions, revealIfChampBack)
  } else if (document.getElementById(secondOptions[1].id).checked) {
    createOptions(thirdOptions, revealIfChampBack)
  } else if (document.getElementById(secondOptions[2].id).checked) {
    createOptions(thirdOptions, revealIfChampBack)
  } else {
    alert('You need to choose at least one!')
    restartWhilePlaying()
    main.removeChild(document.getElementById('minimize-img'))
    main.removeChild(document.getElementById('question'))
  }
  removeChildNode()
}
//ending img
async function endingImage(imgIndex) {
  const createdImage = []
  const button = document.getElementById('button')
  const buttonRect = button.getBoundingClientRect()

  console.log(button)
  console.log(buttonRect)
  for (let i = 0; i < 2; i++) {
    await new Promise((resolve) => setTimeout(resolve, i * 1000))
    const image = document.createElement('img')
    image.src = `./img/IMG-${imgIndex}.png`
    image.className = 'animate__animated animate__tada endingImage'
    image.id = `endingImage${i}`

    let isOverlapping
    let randomX, randomY
    const imageWidth = 200
    const imageHeight = 200

    do {
      randomX = Math.random() * (window.innerWidth - imageWidth)
      randomY = Math.random() * (window.innerHeight - imageHeight)
      if (
        randomX + imageWidth > buttonRect.left &&
        randomX < buttonRect.right &&
        randomY + imageHeight > buttonRect.top &&
        randomY < buttonRect.bottom
      ) {
        continue
      }
      isOverlapping = createdImage.some((existingImage) => {
        return !(
          randomX + imageWidth < existingImage.x ||
          randomX > existingImage.x + existingImage.width ||
          randomY + imageHeight < existingImage.y ||
          randomY > existingImage.y + existingImage.height
        )
      })
    } while (isOverlapping)

    image.style.position = 'absolute'
    image.style.left = `${randomX}px`
    image.style.top = `${randomY}px`
    main.appendChild(image)
    createdImage.push({
      x: randomX,
      y: randomY,
      width: imageWidth,
      height: imageHeight,
    })
  }
}
function revealIfChampBack() {
  thirdOptions.forEach((option) => {
    let checked = document.getElementById(option.id).checked
    if (checked) {
      progressBar(option.happiness)
    }
  })

  if (
    document.getElementById(thirdOptions[0].id).checked &&
    totalHappiness >= 40
  ) {
    const questionnTextContent =
      'I am back! Outside was full of fun. Love you Mom!'
    updateButton('restart', restart)
    endingImage(5)
    endingImage(7)
    endingImage(8)
    updateQuestion(questionnTextContent)
  } else if (
    document.getElementById(thirdOptions[1].id).checked ||
    totalHappiness < 40
  ) {
    const questionnTextContent = 'Champ didn`t come back yet.'
    updateImg(6)
    updateQuestion(questionnTextContent)
    updateButton('Restart', restart)
  } else {
    alert('You need to choose at least one!')
    restartWhilePlaying()
    main.removeChild(document.getElementById('minimize-img'))
    main.removeChild(document.getElementById('question'))
  }
  removeChildNode()
}

//change img
function updateImg(imgIndex) {
  const image = document.createElement('img')
  image.src = `./img/IMG-${imgIndex}.jpg`
  image.id = 'minimize-img'
  main.appendChild(image)
}

//change title
function updateQuestion(textContent) {
  const question = document.createElement('h2')
  question.id = 'question'
  question.className = 'animate__animated animate__rubberBand'
  question.textContent = textContent
  main.appendChild(question)
}

//change button
function updateButton(textContent, func) {
  const button = document.createElement('button')
  button.textContent = textContent
  button.id = 'button'
  button.className = 'submit'
  button.onclick = func
  main.append(button)
}

//create radio
function createOptions(options, nextQuestion) {
  const form = document.createElement('form')
  const submit = document.createElement('input')
  form.id = 'form'
  submit.type = 'submit'
  submit.value = 'Action'
  submit.id = 'button'

  options.forEach((option) => {
    const div = document.createElement('div')
    const input = document.createElement('input')
    const label = document.createElement('label')
    input.type = 'radio'
    input.id = option.id
    input.value = option.label
    input.name = option.name
    label.textContent = option.label
    div.append(input, label)
    form.appendChild(div)
  })
  submit.addEventListener('click', (event) => {
    event.preventDefault()
    nextQuestion()
  })
  form.appendChild(submit)
  main.append(form)
}

//restart button
function restart() {
  main.removeChild(document.getElementById('question'))
  main.removeChild(document.getElementById('button'))
  const array = Array.from(document.getElementsByTagName('img'))
  array.forEach((arr) => main.removeChild(arr))
  restartWhilePlaying()
}
function restartWhilePlaying() {
  happiness = 0
  progressBar(happiness)
  updateImg(1)
  //add firstQuestion
  const questionnTextContent =
    'Hi, my name is Champ. You can look after me for whole day!'
  updateQuestion(questionnTextContent)
  //add first question button
  const buttonTextContent = 'Of course'
  updateButton(buttonTextContent, secondQuestion)
}

function removeChildNode() {
  main.removeChild(document.getElementById('minimize-img'))
  main.removeChild(document.getElementById('question'))
  main.removeChild(document.getElementById('form'))
}
