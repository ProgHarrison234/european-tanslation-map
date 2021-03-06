// testing Maps api: https://developer.tomtom.com/
// API key: UidCozvRt9CII6OELF37fl3Z07e2PyGh
// *2500 free transactions per day
$(document).ready(function () {
  const serializer = new XMLSerializer();

  $("#translating").attr("style", "display: none");
  $("#translating").appendTo($("userInputDiv"));
  // define variables

  // langList: language list
  let langList = [
    "en",
    "es",
    "fr",
    "it",
    "nl",
    "hu",
    "ru",
    "uk",
    "de",
    "pl",
    "el",
    "pt",
    "cs",
    "hr",
    "sr",
    "bg",
    "da",
    "no",
    "sv",
    "lt",
    "lv",
    "et",
    "fi",
  ]; // English, Spanish, French, Italian, Dutch, Hungarian, Russian, Ukrainian, German, Polish, Greek, Portuguese, Czechia "cs", Croatia "hr", Serbia "sr", Bulgaria "bg", Denmark "da", Norway "no", Sweden "sv", Lithuania "lt", Latvia "lv", Estonia "et", Finland "fi"
  let countryList = [
    "Br",
    "Sp",
    "Fr",
    "It",
    "Nl",
    "Hu",
    "Ru",
    "Uk",
    "De",
    "Pl",
    "El",
    "Pt",
    "Cs",
    "Hr",
    "Sr",
    "Bg",
    "Da",
    "No",
    "Sv",
    "Lt",
    "Lv",
    "Et",
    "Fi",
  ];

  let keymap = [
    "English",
    "Spanish",
    "French",
    "Italian",
    "Dutch",
    "Hungarian",
    "Russian",
    "Ukrainian",
    "German",
    "Polish",
    "Greek",
    "Portuguese",
    "Czech",
    "Croatian",
    "Serbian",
    "Bulgarian",
    "Danish",
    "Norwegian",
    "Swedish",
    "Lithuanian",
    "Latvian",
    "Estonian",
    "Finnish",
  ];

  let input = "Hello World!";

  let map = tt.map({
    container: "map",
    key: "IZ0RMVec7S9rARyrNQXSbkwDQJQhNYUJ",
    center: { lat: 50.9375, lng: 6.9603 },
    zoom: 3.8,
    style: "tomtom://vector/1/basic-main",
    language: "en-US",
  });

  let coordinates = {
    Br: [-0.009184, 51.51279],
    Sp: [-3.70379, 40.416775],
    Fr: [2.3488, 48.85341],
    It: [12.51133, 41.89193],
    Nl: [4.8952, 52.3702],
    Hu: [19.0402, 47.4979],
    Ru: [37.6237, 55.7496],
    Uk: [30.5234, 50.4201],
    De: [13.4061, 52.5192],
    Pl: [21.0122, 52.2297],
    El: [23.7293, 37.9837],
    Pt: [-9.15, 38.7253],
    Cs: [14.4378, 50.0755],
    Hr: [15.9779, 45.813],
    Sr: [20.4622, 44.8206],
    Bg: [23.3217, 42.6978],
    Da: [12.5683, 55.6761],
    No: [10.7522, 59.9139],
    Sv: [18.0649, 59.3289],
    Lt: [25.2797, 54.6872],
    Lv: [24.1052, 56.9496],
    Et: [24.7536, 59.437],
    Fi: [24.9386, 60.1698],
  }; // [lng, lat]
  let markerHeight = 0,
    markerRadius = 10,
    linearOffset = 25;
  let popupOffsets = {
    top: [0, 0],
    "top-left": [0, 0],
    "top-right": [0, 0],
    bottom: [0, -markerHeight],
    "bottom-left": [
      linearOffset,
      (markerHeight - markerRadius + linearOffset) * -1,
    ],
    "bottom-right": [
      -linearOffset,
      (markerHeight - markerRadius + linearOffset) * -1,
    ],
    left: [markerRadius, (markerHeight - markerRadius) * -1],
    right: [-markerRadius, (markerHeight - markerRadius) * -1],
  };

  // create an array that stores all api call by ajax
  let requestList = [];

  // number of API call waiting for response
  let numWaits = 0;

  // translate the input english phrase to multiple languages given in langList, and create popups
  function translate() {
    input = $("#userInput").val();
    if (input === "") {
      return;
    }

    $(".translatedPopup").remove();

    // abort all ongoing api calls
    for (let request of requestList) {
      request.abort();
    }

    // reset requestList
    requestList = [];

    // reset the number of waiting APIs
    numWaits = 0;

    for (let i = 0; i < langList.length; i++) {
      numWaits++;

      // for english - english pair, just use the input value
      if (langList[i] === "en") {
        let marker = new tt.Marker().setLngLat(coordinates["Br"]).addTo(map);
        let popup = new tt.Popup({
          offset: popupOffsets,
          closeButton: false,
          closeOnClick: false,
          className: `translatedPopup popupEn`,
        }).setHTML(input);

        marker.setPopup(popup).togglePopup();
        $(`.popupEn .mapboxgl-popup-content`).addClass(`tooltip tooltipDivEn`);
        numWaits--;

        let tooltipSpan = $("<span>")
          .attr("class", "tooltiptext toolTipEn")
          .text("English");
        $(`.popupEn .mapboxgl-popup-content`).append(tooltipSpan);

        if (numWaits === 0) {
          clearLoadSpinner();
        }
        continue;
      }

      let tar = langList[i];

      var settings = {
        async: true,
        crossDomain: true,
        url: `https://microsoft-azure-translation-v1.p.rapidapi.com/translate?from=en&to=${tar}&text=${input}!`,
        method: "GET",
        headers: {
          "x-rapidapi-host": "microsoft-azure-translation-v1.p.rapidapi.com",
          "x-rapidapi-key":
            "26417dba96mshc908747af3c9234p1996ddjsnf25834dcd684",
          accept: "text/html",
        },
      };

      requestList.push(
        $.ajax(settings)
          .done(function (response) {
            let xmlString = serializer.serializeToString(response);
            let translation = xmlString.substring(68, xmlString.length - 10);

            let marker = new tt.Marker().setLngLat(coordinates[countryList[i]]);
          

            marker.addTo(map);

            //  create popup
            let popup = new tt.Popup({
              offset: popupOffsets,
              closeButton: false,
              closeOnClick: false,
              className: `translatedPopup popup${i}`,
            }).setHTML(translation);
            marker.setPopup(popup).togglePopup();
            $(`.popup${i} .mapboxgl-popup-content`).addClass(
              `tooltip tooltipDiv${i}`
            );

            //  add translation with popup for translation.
            let tooltipSpan = $("<span>")
              .attr("class", "tooltiptext toolTip" + i)
              .text(keymap[i]);
            $(`.popup${i} .mapboxgl-popup-content`).append(tooltipSpan);

            numWaits--;
            if (numWaits === 0) {
              clearLoadSpinner();
            }
          })
          .fail(function (err) {
            console.log("There was an error: ", err);
            numWaits--;
            if (numWaits === 0) {
              clearLoadSpinner();
            }
          })
      );
    }
    //clearLoadSpinner();
  }

  function loadSpinner() {
    let transBtn = $("#translating");

    transBtn.attr("style", "display: run-in");
    $("#userInputDiv").append(transBtn);
  }

  function clearLoadSpinner() {
    let transBtn = $("#translating");

    transBtn.attr("style", "display: none");
    $("#userInputDiv").append(transBtn);
  }

  function assignListeners() {
    $("#userInput").keydown(function (event) {
      if (event.keyCode === 13) {
        translate();
        loadSpinner();
      }
    });

    $("#translate").click(translate).click(loadSpinner);
  }

  assignListeners();
});
