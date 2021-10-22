import './App.css';
import React, {useState, useEffect} from 'react';
const width = 8
const candyColors = [
  'blue',
  'green',
  'orange',
  'purple',
  'red',
  'yellow'
]
function App() {
  const [currentColorArrangement, setColorArrangement] = useState([])
  const [squaredBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setsquareBeingReplaced] = useState(null)
  const [score, setScore] = useState(0)

  const checkForColumnOfThree = () => {
    for(let i = 0; i < 47; i++) {
      const columnOfThree = [i, i+width, i+width*2]
      const decidedColor = currentColorArrangement[i]
      if (columnOfThree.every(square=> currentColorArrangement[square] === decidedColor)) {
        columnOfThree.forEach(square=> currentColorArrangement[square] = '')
        return true
      }
    }
  }
  const checkForColumnOfFour = () => {
    for(let i = 0; i < 39; i++) {
      const columnOfFour = [i, i+width,i+width*2, i+width*3]
      const decidedColor = currentColorArrangement[i]
      if (columnOfFour.every(square=> currentColorArrangement[square] === decidedColor)) {
        columnOfFour.forEach(square=> currentColorArrangement[square] = '')
        return true
      }
    }
  }
    const checkForRowOfThree = () => {
      const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64]
        for(let i = 0; i < 64; i++) {
            const rowOfThree = [i, i+1, i+2]
            const decidedColor = currentColorArrangement[i]
            if (notValid.includes(i)) continue
              if (rowOfThree.every(square=> currentColorArrangement[square] === decidedColor)) {
                  rowOfThree.forEach(square=> currentColorArrangement[square] = '')
                  return true
              }
        }
  }
    const checkForRowOfFour = () => {
      const notValid = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,62,63,64]
        for(let i = 0; i < 64; i++) {
            const rowOfThree = [i, i+1, i+2, i+3]
            const decidedColor = currentColorArrangement[i]
            if (notValid.includes(i)) continue
              if (rowOfThree.every(square=> currentColorArrangement[square] === decidedColor)) {
                  rowOfThree.forEach(square=> currentColorArrangement[square] = '')
                  return true
              }
        }
  }

  const moveIntoSquareBelow = () => {
    for (let i = 0; i < 64-width; i++) {
       const firstRow = [0,1,2,3,4,5,6,7]
       const isFirstRow = firstRow.includes(i)
       if (isFirstRow && currentColorArrangement[i] === '') {
         let randomNumber = Math.floor(Math.random() * candyColors.length)
         currentColorArrangement[i] = candyColors[randomNumber]
       }
       if (currentColorArrangement[i+width] === '') {
         currentColorArrangement[i+width] = currentColorArrangement[i]
         currentColorArrangement[i] = ''
         return true
       }
    }
  }
  const dragStart = (e) => {
     console.log(e.target)
    setSquareBeingDragged(e.target)
  }

  const dragDrop = (e) => {
    console.log(e.target)
    setsquareBeingReplaced(e.target)
  }

  const dragEnd = (e) => {
    const squareBeingDraggedId = parseInt(squaredBeingDragged.getAttribute('data-id'))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))
    currentColorArrangement[squareBeingReplacedId] = squaredBeingDragged.style.backgroundColor
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.style.backgroundColor
     const validMoves = [
      squareBeingDraggedId -1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width,
    ]
    const validMove = validMoves.includes(squareBeingReplacedId)
    const isAColumnOfFour = checkForColumnOfFour()
    const isARowOfFour = checkForRowOfFour()
    const isAColumnOfThree = checkForColumnOfThree()
    const isARowOfThree = checkForRowOfThree()
    if (squareBeingReplacedId && validMove && (isAColumnOfFour || isARowOfFour || isAColumnOfThree || isARowOfThree)) {
      setSquareBeingDragged(null)
      setsquareBeingReplaced(null)
      setScore(score+100)
    } else {
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.style.backgroundColor
      currentColorArrangement[squareBeingDraggedId] = squaredBeingDragged.style.backgroundColor
      setColorArrangement([...currentColorArrangement])
    }
  }

  const createBoard = () => {
    const randomColorArrangement = []
    for (let i = 0; i < width*width; i++) {
      const randomColor =candyColors[Math.floor(Math.random() * candyColors.length)]
      randomColorArrangement.push(randomColor);
    }
    setColorArrangement(randomColorArrangement)
  }
  useEffect(()=>{
    createBoard();
  },[])

  useEffect(()=>{
    const timer = setInterval(()=>{
      checkForColumnOfFour()
      checkForColumnOfThree()
      checkForRowOfFour()
      checkForRowOfThree()
      moveIntoSquareBelow()
      setColorArrangement([...currentColorArrangement])
    },100)
    return ()=>clearInterval(timer)
  },[checkForColumnOfFour, checkForColumnOfThree, checkForRowOfFour,checkForRowOfThree, moveIntoSquareBelow,currentColorArrangement])
  return (
    <div className="app">
       <h1>CANDY CRUSH</h1>
       <p>Score: {score}</p>
      <div className="game">
        {currentColorArrangement.map((candyColor, index)=>(
          <div
            className="box"
            key={index} 
            style={{backgroundColor: candyColor}} 
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e)=> e.preventDefault()}
            onDragEnter = {(e)=>e.preventDefault()}
            onDragLeave = {(e)=>e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}/>
        ))}
      </div>
    </div>
  );
}

export default App;
