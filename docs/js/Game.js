class Game {
    constructor(element) {
        this.$newGameElement = element;
        this.gameState = 'notStarted';
        this.$newGameBtn = $('#js-newGameBtn');
        this.$selectGameCardsBackElement = $('#js-cards_back');
        this.$degreeOfDifficultyElement = $('#js-degree_of_difficulty');
        this.degreeOfDifficulty = "";
        this.$degOfDiffElemButtons = this.$degreeOfDifficultyElement.find("button");
        this.beginGameParam = {
            easy: {
                pairsLeft: 13,
                attemptsLeft: Math.floor(13 * 2.5),
                cardsContainerClass: "easy",
                cards: $(".easy_level")
            },
            medium: {
                pairsLeft: 26,
                attemptsLeft: Math.floor(26 * 3.4),
                cardsContainerClass: "medium",
                cards: $(".easy_level, .medium_level")
            },
            hard: {
                pairsLeft: 39,
                attemptsLeft: Math.floor(39 * 4.3),
                cardsContainerClass: "hard",
                cards: $(".easy_level, .medium_level, .hard_level")
            },
            extreme: {
                pairsLeft: 54,
                attemptsLeft: Math.floor(54 * 3.8),
                cardsContainerClass: "extreme",
                cards: $(".easy_level, .medium_level, .hard_level, .extreme_level")
            }
        };
        this.$gameDataElement = $("#js-game_data");
        this.$gameLevelElement = $("#js-game_level");
        this.$pairsLeftElement = $("#js-pairs_left");
        this.pairsLeft = 0;
        this.$pairsFoundElement = $("#js-pairs_found");
        this.pairsFound = 0;
        this.$attemptsDoneElement = $("#js-attempts_done");
        this.attemptsDone = 0;
        this.$attemptsLeftElement = $("#js-attempts_left");
        this.attemptsLeft = 0;
        this.$playerWonElement = $("#js-player_won");
        this.$playerLostElement = $("#js-player_lost");
        this.$playAgainBtn = $('.js-playAgainBtn');
        this.$restartGameBtn = $(".js-restartGameBtn");
        this.$finishGameBtn = $(".js-finishGameBtn");
        this.viewportWidth = window.matchMedia("screen and (min-width: 768px)");
    }
    handleDegOfDiffElemButtons() {
        function addClickButtonsHandler(button, degreeOfDifficulty) {
            $(game.$degOfDiffElemButtons[button]).on("click", () => {
                game.beginGame(
                    `${degreeOfDifficulty}`,
                    game.beginGameParam[degreeOfDifficulty].pairsLeft,
                    game.beginGameParam[degreeOfDifficulty].attemptsLeft,
                    game.beginGameParam[degreeOfDifficulty].cardsContainerClass,
                    game.beginGameParam[degreeOfDifficulty].cards
                );
            });
        }
        const degreeOfDifficulty = ['easy', 'medium', 'hard', 'extreme'];
        for (let i = 0; i < this.$degOfDiffElemButtons.length; i++) {
            addClickButtonsHandler(i, degreeOfDifficulty[i]);
        }
    }
    resetGameElements() {
        this.pairsFound = 0;
        this.$pairsFoundElement.text(this.pairsFound);
        this.attemptsDone = 0;
        this.$attemptsDoneElement.text(this.attemptsDone).removeClass("warning");
        $(".card, .card_reverse").css("visibility", "visible");
        gameCards.removeSelectedCardsClasses();
        gameCards.$links.css("cursor", `url(images/hand_icon.png) 5 5, pointer`);
    }
    setGameElements() {
        this.$newGameElement.show();
        this.$newGameBtn.on("click", () => {
            this.newGame();
        });
        this.$selectGameCardsBackElement.add(gameCards.$cardsBackContainer).add(this.$degreeOfDifficultyElement).add(this.$gameDataElement).add(this.$playerWonElement)
            .add(this.$playerLostElement).add(gameCards.$cardsContainer).add(gameCards.$cards).add(this.$restartGameBtn).add(this.$finishGameBtn).hide();
        switch (this.gameState) {
            case 'started':
                this.$newGameElement.hide();
                $(".card").css("background-image", "none");
                this.$selectGameCardsBackElement.add(gameCards.$cardsBackContainer).css('display', 'flex');
                break;
            case 'ended':
                this.$newGameBtn.text("Zagraj jeszcze raz!");
                this.resetGameElements();
        }
    }
    toggleTooltips() {
        function showTooltips() {
            $("button, .card_back").tooltip({
                position: {
                    using: function(position, feedback) {
                        $(this).css(position);
                        $("<div>").addClass(feedback.vertical).addClass(feedback.horizontal).appendTo(this);
                    }
                }
            });
            $("button").tooltip({
                position: {
                    my: "center bottom-3",
                    at: "center top"
                },
                classes: {
                    "ui-tooltip": "button-tooltip"
                }
            });
            $(".card_back").tooltip({
                position: {
                    my: "center top+3",
                    at: "center bottom"
                },
                classes: {
                    "ui-tooltip": "card_back-tooltip"
                }
            });
        }
        if (this.viewportWidth.matches) {
            showTooltips();
        }
        this.viewportWidth.addListener(function(mediaQuery) {
            if (mediaQuery.matches) {
                showTooltips();
                $(".card_reverse").addClass("question_mark");
            } else {
                if ($("button, .card_back").is(':ui-tooltip')) {
                    $("button, .card_back").tooltip("destroy");
                }
                $(".card_reverse").removeClass("question_mark");
            }
        });
    }
    newGame() {
        this.gameState = 'started';
        this.setGameElements();
    }
    setAttemptsDone() {
        this.attemptsDone ++;
        this.$attemptsDoneElement.text(this.attemptsDone);
        if((this.attemptsLeft - this.attemptsDone) == 3) {
            this.$attemptsDoneElement.addClass("warning");
        }
    }
    showGameResult(element) {
        element.css('display', 'flex');
        this.$playAgainBtn.on("click", () => {
            this.setGameElements();
        });
        this.$restartGameBtn.add(this.$finishGameBtn).hide();
        this.$attemptsDoneElement.removeClass("warning");
    }
    endGame(gameResult) {
        gameCards.$cardsContainer.hide();
        this.showGameResult(gameResult == "playerWon" ? this.$playerWonElement : this.$playerLostElement);
        this.gameState = 'ended';
    }
    checkGameStatus() {
        if (this.pairsLeft === 0 && this.attemptsDone <= this.attemptsLeft) {
            this.endGame("playerWon");
        } else if (this.pairsLeft !== 0 && this.attemptsDone == this.attemptsLeft) {
            this.endGame("playerLost");
        }
    }
    beginGame(degreeOfDifficulty, pairsLeft, attemptsLeft, cardsContainerClass, cards) {
        this.degreeOfDifficulty = degreeOfDifficulty;
        this.pairsLeft = pairsLeft;
        this.attemptsLeft = attemptsLeft;
        gameCards.$cardsContainer.removeClass("easy medium hard extreme").addClass(cardsContainerClass);
        gameCards.showCards(cards);
    }
}