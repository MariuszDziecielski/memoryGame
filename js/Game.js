class Game {
    constructor(element) {
        this.$newGameElement = element;
        this.gameState = 'notStarted';
        this.$newGameBtn = $('#js-newGameBtn');
        this.$selectGameCardsBackElement = $('#js-cards_back');
        this.$degreeOfDifficultyElement = $('#js-degree_of_difficulty');
        this.degreeOfDifficulty = "";
        this.$degOfDiffElemButtons = this.$degreeOfDifficultyElement.find("button");
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
        this.$windowWidth = $(window).width();
    }
    handleDegOfDiffElemButtons() {
        let beginGameParam = [
            ["easy", 13, Math.floor(13 * 2.5), "easy", gameCards.$cardsEasyLevel],
            ["medium", 26, Math.floor(26 * 3.4), "medium", gameCards.$cardsEasyLevel.add(gameCards.$cardsMediumLevel)],
            ["hard", 39, Math.floor(39 * 4.3), "hard", gameCards.$cardsEasyLevel.add(gameCards.$cardsMediumLevel).add(gameCards.$cardsHardLevel)],
            ["extreme", 54, Math.floor(39 * 5.2), "extreme", gameCards.$cardsEasyLevel.add(gameCards.$cardsMediumLevel).add(gameCards.$cardsHardLevel).add(gameCards.$cardsExtremeLevel)]
        ];
        function addClickButtonsHandler(button) {
            $(game.$degOfDiffElemButtons[button]).click(() => {
                game.beginGame(...beginGameParam[button]);
            });
        }
        for (let i = 0; i < game.$degOfDiffElemButtons.length; i++) {
            addClickButtonsHandler(i);
        }
        if (this.$windowWidth > 767) {
            $("button").tooltip({
                position: {
                    my: "center bottom-0",
                    at: "center top",
                    using: function(position, feedback) {
                        $(this).css(position);
                        $("<div>").addClass(feedback.vertical).addClass(feedback.horizontal).appendTo(this);
                    }
                }
            });
        }
    }
    resetGameElements() {
        this.pairsFound = 0;
        this.$pairsFoundElement.text(this.pairsFound);
        this.attemptsDone = 0;
        this.$attemptsDoneElement.text(this.attemptsDone).removeClass("warning");
        $(".card, .card_reverse").css("visibility", "visible");
        gameCards.removeSelectedCardsClasses();
        gameCards.$links.css("cursor", "pointer");
    }
    setGameElements() {
        this.$newGameElement.show();
        this.$newGameBtn.click(() => {
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
        this.$playAgainBtn.click(() => {
            this.setGameElements();
        });
        this.$restartGameBtn.add(this.$finishGameBtn).hide();
        this.$attemptsDoneElement.removeClass("warning");
    }
    endGame(gameResult) {
        gameCards.$cardsContainer.hide();
        switch (gameResult) {
            case "playerWon":
                this.showGameResult(this.$playerWonElement);
                break;
            case "playerLost":
                this.showGameResult(this.$playerLostElement);
        }
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