const URL = "http://127.0.0.1:8080";
const BOXES_NUMBER = 12;

context("Memotest", () => {
  before(() => {
    cy.visit(URL);
  });

  it("se asegura que haya un tablero con cuadros", () => {
    cy.get("#container").find(".box").should("have.length", BOXES_NUMBER);
  });

  it("se asegura que los cuadros sean aleatorios", () => {
    cy.get(".box").then((boxes) => {
      let originalClasses = [];
      boxes.each((i, box) => {
        originalClasses.push(box.className);
      });
      cy.visit(URL);
      let newClasses = [];
      cy.get(".box").then((newBoxes) => {
        newBoxes.each((i, box) => {
          newClasses.push(box.className);
        });
      });
      cy.wrap(originalClasses).should("not.deep.equal", newClasses);
    });
  });
});

describe("resuelve el juego", () => {
  let pairMap, pairList;
  it("elige una combinación errónea", () => {
    cy.get(".flip-card").then((boxes) => {
      pairMap = getPairBoxes(boxes);

      pairList = Object.values(pairMap);

      cy.get(pairList[0][0]).click();

      cy.get(pairList[1][0]).click();

      cy.get(".flip-card").should("have.length", BOXES_NUMBER);
    });
  });

  it("resuelve el juego", () => {
    cy.get(".box").should("have.length", BOXES_NUMBER);

    pairList.forEach((pair) => {
      cy.get(pair[0]).click();
      cy.get(pair[1]).click();
    });

    cy.get("flip-card").should("have.length", 0);

    cy.get(".box-border").should("not.exist");

    const turns = BOXES_NUMBER / 2 + 1;

    cy.get("#game-over")
      .should("be.visible")
      .contains(`Juego finalizado en ${turns} turnos.`);
  });

  it("reinicia el juego", () => {
    cy.get("#restart").click();
    cy.get(".box").should("have.length", BOXES_NUMBER);
  });
});

const getPairBoxes = (boxes) => {
  const pair = {};
  boxes.each((i, box) => {
    const colorClass = box.className.replace("flip-card box-border", "");

    if (pair[colorClass]) {
      pair[colorClass].push(box);
    } else {
      pair[colorClass] = [box];
    }
  });
  console.log(pair);
  return pair;
};
