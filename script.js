document.addEventListener("DOMContentLoaded",function(){
  const grid = document.querySelector(".grid")
  const start = document.querySelector(".start")
  const restart = document.querySelector(".restart")
  const bombleft = document.querySelector("p")
  const addFlagbtn = document.querySelector(".add-flag")
  
  let isBtnFlag = false
  let isGameOver = false
  let tmpStart = null
  let squares = []
  let width = 10
  let bombAmount = 20
  let flags = 0
  let emojiFlag = "🚩"
  let emojiBomb = "💣"

  bombleft.querySelector("span").innerHTML = bombAmount

  showElement(start)

  
  const btnStart = start.querySelector("button")
  const btnRestart = restart.querySelector("button")
  const btnAddFlag = addFlagbtn.querySelector("button")

  btnStart.addEventListener("click",function(){
    showElement(grid)
    showElement(addFlagbtn)
    showElement(bombleft)
    hideElement(start)
    createBoard()
  })

  btnRestart.addEventListener("click",function(){
    location.reload()
  })

  btnAddFlag.addEventListener("click",function(){
    if(isBtnFlag){
      this.innerHTML = "add flag"
      this.style.color = "rgb(8, 74, 216)"
      this.style.borderColor = "rgb(8, 74, 216)"
      isBtnFlag = false
    }else{
      this.innerHTML = "off flag"
      this.style.color = "red"
      this.style.borderColor = "red"
      isBtnFlag = true
    }
  })


  function createBoard(){
    let gameArray =Array(width*width - bombAmount).fill("valid").concat(Array(bombAmount).fill("bomb")).sort(()=> Math.random()-0.5)

    for(let i = 0;i < width*width;i++){
      const square = document.createElement("div")
      square.setAttribute('id',i)
      square.classList.add(gameArray[i])
      squares.push(square)
      grid.appendChild(square)
      
      square.addEventListener("click",function(){
        if(isBtnFlag){
          addFlag(this)
        }else{
          click(this)
        }
      })
      // ctrl and left click
      square.addEventListener("contextmenu",function(e){
        e.preventDefault()
        addFlag(this)
      })
    }
    
    // add number
    for(let i = 0;i < squares.length;i++){
      let total = 0
      let isLeftEdge = i % width === 0
      let isRightEdge = i % width === width - 1 
      if(squares[i].classList.contains("valid")){
        if( !isLeftEdge && squares[i - 1].classList.contains("bomb"))total++
        if(i > 9 && !isLeftEdge && squares[i - 1 - width].classList.contains("bomb"))total++
        if(i > 9 && squares[i - width].classList.contains("bomb"))total++
        if(i > 9 &&  !isRightEdge && squares[i + 1 - width].classList.contains("bomb"))total++
        if(!isRightEdge && squares[i + 1].classList.contains("bomb"))total++
        if(i < 89 && !isRightEdge && squares[i + 1 + width].classList.contains("bomb"))total++
        if(i < 89 && squares[i + width].classList.contains("bomb"))total++
        if( i < 89 && !isLeftEdge && squares[i - 1 + width].classList.contains("bomb"))total++
        squares[i].setAttribute("data",total)
      }
    }
    
  }
  function showElement(element){
    element.classList.add("active")
  }
  function hideElement(element){
    element.classList.remove("active")
    element.classList.remove("indexup")
  }
  function click(square){
    let currentId = parseInt(square.id)
    if(isGameOver) return
    if(square.classList.contains("checked") || square.classList.contains("flag")) return
    if(square.classList.contains("bomb")){
      gameOver()
    }else{
      let total = parseInt(square.getAttribute("data"))
      if(total !== 0){
        if(total < 2){
          square.style.color = "green" 
        }else if(total < 3){
          square.style.color = "yellow"
        }else{
          square.style.color = "red"
        }
        square.classList.add("checked")
        square.innerHTML = total
        return
      }
      checkSquare(square,currentId)
    }
    square.classList.add("checked")
  }


  function addFlag(square){
    if(isGameOver)return
    if(!square.classList.contains("checked") && (flags < bombAmount)){
      if(!square.classList.contains("flag")){
        square.classList.add("flag")
        square.innerHTML = emojiFlag
        flags++
        checkForWin()
      }else{
        square.classList.remove("flag")
        square.innerHTML = ""
        flags--
        checkForWin()
      }
    }
  }
  function checkSquare(square,currentId){
    let isLeftEdge = currentId % width === 0
    let isRightEdge = currentId % width === width - 1 

    setTimeout(()=>{
      if( !isLeftEdge){
        let newSquare = squares[currentId - 1]
        click(newSquare)
      }
      if(currentId > 9 && !isLeftEdge){
        let newSquare = squares[currentId - 1 - width]
        click(newSquare)
      }
      if(currentId > 9 ){
        let newSquare = squares[currentId - width]
        click(newSquare)
      }
      if(currentId > 9 &&  !isRightEdge ){
        let newSquare =  squares[currentId + 1 - width]
        click(newSquare)
      }
      if(!isRightEdge){
        let newSquare = squares[currentId + 1]
        click(newSquare)
      }  
      if(currentId < 89 && !isRightEdge ){
        let newSquare = squares[currentId + 1 + width]
        click(newSquare)
      }
      if(currentId < 89 ){
        let newSquare = squares[currentId + width]
        click(newSquare)
      }
      if( currentId < 89 && !isLeftEdge){
        let newSquare = squares[currentId - 1 + width]
        click(newSquare)
      } 
    },100)
  }
  function gameOver(){
    restart.querySelector(".restart-title").innerHTML = "BAAM!!! You Lose!!"
    restart.querySelector(".emoji").innerHTML = "😭"
    showElement(restart)
    isGameOver = true
    
    // show all BOMB
    squares.forEach(square=>{
      if(square.classList.contains("bomb")){
        square.classList.add("checked")
        square.innerHTML = emojiBomb
      }
    })
  }
  function checkForWin(){
    let matches = 0 
    for(let i = 0;i < squares.length;i++){
      if(squares[i].classList.contains("flag") && squares[i].classList.contains("bomb")){
        matches++
      }
      if(matches===bombAmount){

        restart.querySelector(".restart-title").innerHTML = "congratulations you win"
        restart.querySelector(".emoji").innerHTML = "🏆 😎 🤙"
        showElement(restart)
        isGameOver = true
        restart.classList.add("active")
        break
      }
    }
    bombleft.querySelector("span").innerHTML = bombAmount - matches
  }
  
})
