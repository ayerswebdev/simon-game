//ui object used to store ui methods
var ui = {};

//populate level box with correctly formatted level
ui.displayLevel = function(level) {
  $("#level-text").text(level < 10 ? "0" + level : level);
};

//walk through correct sequence, playing sounds and
ui.showSequence = function() {
  var seq = globals.game.sequence;
  var i = 0;

  //loop through sequence with 700ms delay
  (function loop() {
    var item = $("#" + seq[i]);
    item.addClass("lit");
    globals.audio[seq[i]].play();
    setTimeout(function() {
      item.removeClass("lit");
    }, 500);

    //only continue if not done with the sequence
    if(++i < seq.length && !globals.resetPressed) {
      setTimeout(loop, 700);
    }
  })(); //run this function immediately when the showSequence function is called

};

var globals = {};

//audio files
var greenAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
var redAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
var yellowAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
var blueAudio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");

globals.audio = {
  green: greenAudio,
  red: redAudio,
  yellow: yellowAudio,
  blue: blueAudio
};

//track whether reset function has been pressed
globals.resetPressed = false;

//game has not yet begun; create a new Game object on page load
$(document).ready(function() {
  $("#level-text").text("--");
  globals.game = new Game();

  //buttons disabled until game has begun
  $("#green").prop("disabled", true);
  $("#red").prop("disabled", true);
  $("#yellow").prop("disabled", true);
  $("#blue").prop("disabled", true);

  //start button results in new game; not in strict mode
  $("#start-btn").click(function() {
    globals.game.start(false);
  });

  //strict button results in new game, using strict mode
  $("#strict-btn").click(function() {
    globals.game.start(true);
  });

  //reset the game
  $("#reset-btn").click(function() {
    globals.game.reset();

    globals.resetPressed = true;

    setTimeout(function() {
      globals.resetPressed = false;
    }, 1000)
  });

  //handle user clicking green button
  $("#green").click(function() {
    $("#green").addClass("lit");
    globals.audio["green"].play();
    globals.game.playerEntries.push("green");
    setTimeout(function() {
      $("#green").removeClass("lit");
    }, 500);
    globals.game.checkPresses();
  });

  //handle user clicking red button
  $("#red").click(function() {
    $("#red").addClass("lit");
    globals.audio["red"].play();
    globals.game.playerEntries.push("red");
    setTimeout(function() {
      $("#red").removeClass("lit");
    }, 500);
    globals.game.checkPresses();
  });

  //handle user clicking yellow button
  $("#yellow").click(function() {
    $("#yellow").addClass("lit");
    globals.audio["yellow"].play();
    globals.game.playerEntries.push("yellow");
    setTimeout(function() {
      $("#yellow").removeClass("lit");
    }, 500);
    globals.game.checkPresses();
  });

  //handle user clicking blue button
  $("#blue").click(function() {
    $("#blue").addClass("lit");
    globals.audio["blue"].play();
    globals.game.playerEntries.push("blue");
    setTimeout(function() {
      $("#blue").removeClass("lit");
    }, 500);
    globals.game.checkPresses();
  });
});

var Game = function() {
  this.choices = ["green", "red", "yellow", "blue"]; //4 color choices
  this.sequence = []; //the sequence the player must follow
  this.playerEntries = []; //sequence player has followed
  this.status = "start"; //game has not yet started;
  this.strict = ""; //boolean stating whether playing in strict mode
  this.level = 0;

  //start the game, implementing strict rules if this is specified
  this.start = function(strict) {
    if(this.status === "start") {

      //enable buttons
      $("#green").prop("disabled", false);
      $("#red").prop("disabled", false);
      $("#yellow").prop("disabled", false);
      $("#blue").prop("disabled", false);

      if(strict)
        this.strict = true;

      else this.strict = false;

      this.status = "running";

      ui.displayLevel(this.level + 1);

      this.addPress();
    }
  };

  //reset the program
  this.reset = function() {
    this.level = 0;
    $("#level-text").text("--");
    this.status = "start";
    this.strict = "";
    this.sequence = [];
    this.playerEntries = [];
  };

  //add a press to the end of the sequence, then show the user the sequence
  this.addPress = function() {
    this.level++;
    ui.displayLevel(this.level);
    var press = this.choices[Math.floor(Math.random() * 4)];
    this.sequence.push(press);
    ui.showSequence();

  };

  //check to see if presses are correct
  this.checkPresses = function() {
    var correct = true;

    //search for incorrect keypresses
    for(var i = 0; i < this.playerEntries.length; i++) {
      if(this.playerEntries[i] !== this.sequence[i])
        correct = false;
    }


    if(correct) {
      //if you complete the entire sequence
      if(this.playerEntries.length === this.sequence.length) {

        //and you've gone through a 20 step sequence
        if(this.sequence.length === 20) {

          //then you win!
          $("#level-text").css("font-size", "40px");
          $("#level-text").text("WIN");
          setTimeout(function() {
            $("#level-text").css("font-size", "54px");
            globals.game.reset();
          }, 3000);
        }

        //and you haven't yet done a 20 step sequence
        else {

          //then reset entries and add another step to the sequence
          this.playerEntries = [];
          setTimeout(function() {
            globals.game.addPress();
          }, 1000);
        }
      }
    }

    //if user made incorrect press
    else {

      //and is playing strict mode, reset
      if(this.strict) {
        $("#level-text").text("!!");
        setTimeout(function() {
          globals.game.reset();
        }, 2000);
      }

      //and is not playing strict mode, then show the sequence again after notifying the user
      else {
        $("#level-text").text("!!");
        this.playerEntries = [];
        setTimeout(function() {
          ui.displayLevel(globals.game.level);
          ui.showSequence();
        }, 2000);
      }
    }
  };
};
