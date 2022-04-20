const $boxes = document.querySelectorAll(".box");
const $flipCards = document.querySelectorAll(".flip-card");
const $container = document.querySelector("#container");
const $restartButton = document.getElementById("restart");
let $turnValue = document.getElementById("turn-value");

$restartButton.addEventListener("click", () => {
  window.location.reload();
});

const mixColors = (colors) => {
  const mixedColors = colors.sort(function (a, b) {
    return Math.random() - 0.5;
  });
  return mixedColors;
};

const assignColor = ($DOMnodes, arrColors) => {
  $DOMnodes.forEach(($node, index) => {
    $node.className += ` ${arrColors[index]}`;
  });
};

const configureBoxes = () => {
  const colors = ["red", "blue", "green", "yellow", "violet", "black"];
  const colorsDuplicated = [...colors, ...colors];
  mixedColors = mixColors(colorsDuplicated);
  assignColor($boxes, mixedColors);
  assignColor($flipCards, mixedColors);
  handleEvents($container);
};

const handleEvents = ($container) => {
  $container.onclick = function (e) {
    if (e.target.nextElementSibling.classList.contains("box")) {
      const $elementBox = e.target.nextElementSibling;
      if (
        e.target.parentElement.parentElement.classList.contains("flip-card")
      ) {
        const $elementFlip = e.target.parentElement.parentElement;
        $elementFlip.className += ` flip-card-active`;
        /*bloqueo el elemento para que no se pueda clickear dos veces*/
        $elementFlip.style.pointerEvents = "none";
        $elementBox.style.pointerEvents = "none";
        return handleSelection($elementBox, $elementFlip);
      }
    }
  };
};

let movements = [];
let flips = [];

const handleSelection = ($elementBox, $elementFlip) => {
  movements.push($elementBox);
  flips.push($elementFlip);
  if (movements.length === 2) compareColors(movements[0], movements[1]);
};

const compareColors = (firstColor, secondColor) => {
  firstColor.className === secondColor.className
    ? showColors(flips[0], flips[1])
    : hideColors(flips[0], flips[1]);
  handleTurns();
};

const showColors = (firstFlip, secondFlip) => {
  firstFlip.className += " flip-card-active";
  secondFlip.className += " flip-card-active";
};

const hideColors = (firstFlip, secondFlip) => {
  firstFlip.classList.remove("flip-card-active");
  setTimeout(() => {
    secondFlip.classList.remove("flip-card-active");
    firstFlip.style.pointerEvents = "auto";
    secondFlip.style.pointerEvents = "auto";
  }, 600);
};

let turn = 0;
const handleTurns = () => {
  movements = [];
  flips = [];
  turn++;
  $turnValue.setAttribute("value", turn);
  isGameOver();
};

const isGameOver = () => {
  if (
    Array.from($flipCards).every(($flipCard) =>
      $flipCard.classList.contains("flip-card-active")
    )
  )
    finishGame();
};

const finishGame = () => {
  const h2GameOver = document.createElement("H2");
  h2GameOver.id = "game-over";
  h2GameOver.innerHTML = `Juego finalizado en ${turn} turnos.`;
  $container.innerHTML = "";
  $container.appendChild(h2GameOver);
};

configureBoxes();
