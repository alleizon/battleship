const Utils = (() => {
  const legendHTML = () => `<p>Legend :</p>
    <div class="ship">
      <span>Ship</span>
      <div class="legend-ship"></div>
    </div>
    <div class="miss">
      <span>Missed hit</span>
      <div class="wrapper">
        Player <div class="legend-miss"></div>
        /
        Computer <div class="legend-hit"></div>
      </div>
    </div>
    <div class="hit">
      <span>Ship hit</span>
      <div class="wrapper">
        Player <div class="legend-hit"></div>
        /
        Computer <div class="legend-miss"></div>
      </div>
    </div>`;

  const infoHTML = () => `<h1>Info</h1>
    <p>Drag and drop the ships from the left of the grid to build your board.
      <br>
      By default, ships are placed horizontaly. Once placed on the board,
      click on the ship to flip it vertically (however ships can't overlap).
      <br>
      Options:
    </p>
    <ul>
      <li><b>Start</b> (once all ships are placed)</li>
      <li><b>Reset</b></li>
      <li><b>Randomise</b> the board</li>
    </ul>
  </div>`;

  const shipsHTML = () => `<h1>Ships</h1>
    <div id="carrier">
      <span data-ship="name">Carrier <span data-ship="amount">x1</span></span>
      <div class="ship" draggable="true" data-ship-length="5"></div>
    </div>
    <div id="battleship">
      <span data-ship="name">Battleship <span data-ship="amount">x1</span></span>
      <div class="ship" draggable="true" data-ship-length="4"></div>
    </div>
    <div id="cruiser">
      <span data-ship="name">Cruiser <span data-ship="amount">x1</span></span>
      <div class="ship" draggable="true" data-ship-length="3"></div>
    </div>
    <div id="submarine">
      <span data-ship="name">Submarine <span data-ship="amount">x1</span></span>
      <div class="ship" draggable="true" data-ship-length="3"></div>
    </div>
    <div id="destroyer">
      <span data-ship="name">Destroyer <span data-ship="amount">x1</span></span>
      <div class="ship" draggable="true" data-ship-length="2"></div>
    </div>`;

  const buttonsHTML = () => `<button class="start" type="button">Start</button>
    <button class="randomise" type="button">Randomise</button>
    <button class="reset" type="button">Reset</button>`;

  return { legendHTML, infoHTML, shipsHTML, buttonsHTML };
})();

module.exports = Utils;
