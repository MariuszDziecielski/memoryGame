class GameCards {
    constructor(container) {
        this.$cardsContainer = container;
        this.$cards = $(".cards_container").children();
        this.$cardsBackContainer = $(".cards_back_container");
        this.cardsBackImagesIds = ['_01', '_02', '_03', '_04', '_05', '_06', '_07', '_08', '_09', '_10', '_11', '_12', '_13', '_14', '_15'];
        this.$links = $(".card a");
        this.$firstCardLink = null;
        this.$secondCardLink = null;
        this.selectedCards = 0;
        this.$links.on("click", this.revealCard);
        this.$cardsBackContainer.children().on("click", e => {
                this.setCardsBackImage(e.target);
                game.$selectGameCardsBackElement.add(this.$cardsBackContainer).hide();
                game.$degreeOfDifficultyElement.css('display', 'flex');
            }
        );
    }
    setCardsBackImage(element) {
        const cardBackImage = $(element).attr("id") !== "_16" ? $(element).attr("id") : this.cardsBackImagesIds[Math.floor(Math.random() * 15)];
        $(".card_reverse").css("background", `url(images/cards_back/card_back${cardBackImage}.png) no-repeat center/cover`);
    }
    shuffleCards() {
        while (this.$cards.length) {
            this.$cardsContainer.append(this.$cards.splice(Math.floor(Math.random() * this.$cards.length), 1)[0]);
        }
    }
    addCardClass(element, cardClass) {
        $(element).parent().removeAttr("style");
        $(element).find(".card_reverse").css("visibility", "hidden");
        $(element).parent().addClass(cardClass);
        this.selectedCards ++;
    }
    removeSelectedCardsClasses() {
        $(".card").removeClass("firstCard secondCard");
        this.selectedCards = 0;
    }
    addCardClickHandler() {
        this.removeSelectedCardsClasses();
        this.$links.on("click", this.revealCard).css("cursor", `url(images/hand_icon.png) 5 5, pointer`);
        if (game.$windowWidth > 767) {
            $(".card_reverse").addClass("question_mark");
        }
    }
    changeCardReverseVisibility(firstCardLinkVisibility, secondCardLinkVisibility) {
        this.$firstCardLink.find(".card_reverse").css("visibility", firstCardLinkVisibility);
        this.$secondCardLink.find(".card_reverse").css("visibility", secondCardLinkVisibility);
    }
    revealCard(e) {
        e.preventDefault();
        let $firstCard,
            $secondCard,
            $twoCards;
        if (gameCards.selectedCards === 0) {
            gameCards.addCardClass(this, "firstCard");
            $(this).css("cursor", `url(images/disabled_icon.png) 5 5, not-allowed`);
        }
        if (gameCards.selectedCards === 1 & !$(this).parent().hasClass("firstCard")) {
            gameCards.addCardClass(this, "secondCard");
        }
        if (gameCards.selectedCards === 2) {
            $(".card_reverse").removeClass("question_mark");
            gameCards.$links.off("click").on("click", e => {
                e.preventDefault();
            }).css("cursor", `url(images/disabled_icon.png) 5 5, not-allowed`);
            $firstCard = $(".firstCard");
            $secondCard = $(".secondCard");
            $twoCards = $firstCard.add($secondCard);
            gameCards.$firstCardLink = $firstCard.find("a");
            gameCards.$secondCardLink = $secondCard.find("a");
            if (gameCards.$firstCardLink.attr("class") == gameCards.$secondCardLink.attr("class")) {
                setTimeout(() => {
                    $twoCards.addClass("card_match");
                }, 500);
                setTimeout(() => {
                    $twoCards.removeClass("card_match").css("visibility", "hidden");
                    gameCards.changeCardReverseVisibility("hidden", "hidden");
                    game.pairsLeft --;
                    game.$pairsLeftElement.text(game.pairsLeft);
                    game.pairsFound ++;
                    game.$pairsFoundElement.text(game.pairsFound);
                    game.setAttemptsDone();
                    game.checkGameStatus();
                }, 900);
                setTimeout(() => {
                    gameCards.addCardClickHandler();
                }, 950);
            } else {
                setTimeout(() => {
                    $twoCards.addClass("card_mismatch");
                }, 500);
                setTimeout(() => {
                    $twoCards.removeClass("card_mismatch");
                    gameCards.changeCardReverseVisibility("visible", "visible");
                    game.setAttemptsDone();
                    game.checkGameStatus();
                }, 900);
                setTimeout(() => {
                    gameCards.addCardClickHandler();
                }, 950);
            }
        }
    }
    showCards(cards) {
        if (game.$windowWidth > 767) {
            $(".card_reverse").addClass("question_mark");
        }
        game.$degreeOfDifficultyElement.hide();
        this.$cards = this.$cardsContainer.children();
        this.$cardsContainer.fadeIn();
        this.$cards.hide();
        this.shuffleCards();
        cards.add(game.$restartGameBtn).add(game.$finishGameBtn).add(game.$gameDataElement).fadeIn();
        switch(game.degreeOfDifficulty) {
            case 'easy':
                game.$gameLevelElement.text("łatwy");
                break;
            case 'medium':
                game.$gameLevelElement.text("średni");
                break;
            case 'hard':
                game.$gameLevelElement.text("trudny");
                break;
            case 'extreme':
                game.$gameLevelElement.text("ekstremalny");
        }
        game.$pairsLeftElement.text(game.pairsLeft);
        game.$attemptsLeftElement.text(game.attemptsLeft);
        game.$restartGameBtn.on("click", () => {
            game.resetGameElements();
            switch(game.degreeOfDifficulty) {
                case 'easy':
                    game.$degOfDiffElemButtons[0].click();
                    break;
                case 'medium':
                    game.$degOfDiffElemButtons[1].click();
                    break;
                case 'hard':
                    game.$degOfDiffElemButtons[2].click();
                    break;
                case 'extreme':
                    game.$degOfDiffElemButtons[3].click();
            }
        });
        game.$finishGameBtn.on("click", () => {
            game.gameState = "ended";
            game.setGameElements();
        });
    }
}
const game = new Game($('#js-newGame')),
    gameCards = new GameCards($(".cards_container"));
game.setGameElements();
game.handleDegOfDiffElemButtons();