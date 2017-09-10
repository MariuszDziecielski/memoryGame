function GameCards(container) {
    this.$cardsContainer = container;
    this.$cards = $(".cards_container").children();
    this.cardReverseImages = ['card_back_01', 'card_back_02', 'card_back_03', 'card_back_04', 'card_back_05', 'card_back_06', 'card_back_07', 'card_back_08', 'card_back_09', 'card_back_10', 'card_back_11'];
    this.$cardsEasyLevel = $(".cards_container").find(".easy_level");
    this.$cardsMediumLevel = $(".cards_container").find(".medium_level");
    this.$cardsHardLevel = $(".cards_container").find(".hard_level");
    this.$cardsExtremeLevel = $(".cards_container").find(".extreme_level");
    this.$links = $(".card a");
    this.$firstCardLink = null;
    this.$secondCardLink = null;
    this.selectedCards = 0;
    this.$links.on("click", this.revealCard);
}
GameCards.prototype = {
    setCardReverseImage: function () {
        const cardReverseImage = this.cardReverseImages[Math.floor(Math.random() * 11)];
        $(".card_reverse").css("background", `url(images/${cardReverseImage}.png) no-repeat center/cover`);
    },
    shuffleCards: function () {
        while (this.$cards.length) {
            this.$cardsContainer.append(this.$cards.splice(Math.floor(Math.random() * this.$cards.length), 1)[0]);
        }
    },
    addCardClass: function (element, cardClass) {
        $(element).parent().removeAttr("style");
        $(element).find(".card_reverse").css("visibility", "hidden");
        $(element).parent().addClass(cardClass);
        this.selectedCards ++;
    },
    removeSelectedCardsClasses: function () {
        $(".card").removeClass("firstCard secondCard");
        this.selectedCards = 0;
    },
    changeCardReverseVisibility: function (firstCardLinkVisibility, secondCardLinkVisibility) {
        this.$firstCardLink.find(".card_reverse").css("visibility", firstCardLinkVisibility);
        this.$secondCardLink.find(".card_reverse").css("visibility", secondCardLinkVisibility);
    },
    revealCard: function (e) {
        e.preventDefault();
        let $firstCard,
            $secondCard,
            $twoCards;
        if (gameCards.selectedCards === 0) {
            gameCards.addCardClass(this, "firstCard");
            $(this).css("cursor", "not-allowed").parent().removeAttr("title");
        }
        if (gameCards.selectedCards === 1 & !$(this).parent().hasClass("firstCard")) {
            gameCards.addCardClass(this, "secondCard");
        }
        if (gameCards.selectedCards === 2) {
            gameCards.$links.off("click", gameCards.revealCard).click(e => {
                e.preventDefault();
            }).css("cursor", "not-allowed").parent().removeAttr("title");
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
                }, 800);
                gameCards.removeSelectedCardsClasses();
                setTimeout(() => {
                    gameCards.$links.on("click", gameCards.revealCard).css("cursor", "pointer").parent().attr("title", "Odkryj kartę!");
                }, 850);
            } else {
                setTimeout(() => {
                    $twoCards.addClass("card_mismatch");
                }, 500);
                setTimeout(() => {
                    $twoCards.removeClass("card_mismatch");
                    gameCards.changeCardReverseVisibility("visible", "visible");
                    game.setAttemptsDone();
                    game.checkGameStatus();
                }, 800);
                gameCards.removeSelectedCardsClasses();
                setTimeout(() => {
                    gameCards.$links.on("click", gameCards.revealCard).css("cursor", "pointer").parent().attr("title", "Odkryj kartę!");
                }, 850);
            }
        }
    },
    showCards: function (cards) {
        game.$degreeOfDifficultyElement.hide();
        this.$cards = this.$cardsContainer.children();
        this.$cardsContainer.fadeIn();
        this.$cards.hide();
        this.shuffleCards();
        cards.attr("title", "Odkryj kartę!").add(game.$finishGameBtn).add(game.$gameDataElement).fadeIn();
        switch(game.degreeOfDifficulty) {
            case "easy":
                game.$gameLevelElement.text("łatwy");
                break;
            case "medium":
                game.$gameLevelElement.text("średni");
                break;
            case "hard":
                game.$gameLevelElement.text("trudny");
                break;
            case "extreme":
                game.$gameLevelElement.text("ekstremalny");
        }
        game.$pairsLeftElement.text(game.pairsLeft);
        game.$attemptsLeftElement.text(game.attemptsLeft);
        game.$finishGameBtn.click(() => {
            game.gameState = "ended";
            game.setGameElements();
        });
    }
};
const game = new Game($('#js-newGame')),
    gameCards = new GameCards($(".cards_container"));
game.setGameElements();