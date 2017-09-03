$(function () {
    const game = {
        $newGameElement : $('#js-newGame'),
        gameState : 'notStarted',
        $newGameBtn : $('#js-newGameBtn'),
        $degreeOfDifficultyElement : $('#js-degree_of_difficulty'),
        degreeOfDifficulty : "",
        $easyLevelButton : $("#js-easyLevel"),
        $mediumLevelButton : $("#js-mediumLevel"),
        $hardLevelButton : $("#js-hardLevel"),
        $extremeLevelButton : $("#js-extremeLevel"),
        $gameDataElement: $("#js-game_data"),
        $gameLevelElement : $("#js-game_level"),
        $pairsLeftElement : $("#js-pairs_left"),
        pairsLeft : 0,
        $pairsFoundElement : $("#js-pairs_found"),
        pairsFound : 0,
        $attemptsDoneElement : $("#js-attempts_done"),
        attemptsDone : 0,
        $attemptsLeftElement : $("#js-attempts_left"),
        attemptsLeft : 0,
        $playerWonElement : $("#js-player_won"),
        $playerLostElement : $("#js-player_lost"),
        $playAgainBtn : $('.js-playAgainBtn'),
        $finishGameBtn : $(".js-finishGameBtn"),
        setGameElements: function () {
            const self = this;
            this.$newGameElement.show();
            this.$newGameBtn.click(function () {
                self.newGame();
            });
            this.$degreeOfDifficultyElement.add(this.$gameDataElement).add(this.$playerWonElement).add(this.$playerLostElement).add(gameCards.$cardsContainer).add(gameCards.$cards).add(this.$finishGameBtn).hide();
            switch (this.gameState) {
                case 'started':
                    this.$newGameElement.hide();
                    $(".card").css("background-image", "none");
                    gameCards.setCardReverseImage();
                    this.$degreeOfDifficultyElement.css('display', 'flex');
                    break;
                case 'ended':
                    this.$newGameBtn.text("Zagraj jeszcze raz!");
                    this.pairsFound = 0;
                    this.$pairsFoundElement.text(this.pairsFound);
                    this.attemptsDone = 0;
                    this.$attemptsDoneElement.text(this.attemptsDone);
                    $(".card, .card_reverse").css("visibility", "visible");
            }
        },
        newGame: function () {
            this.gameState = 'started';
            this.setGameElements();
        },
        setAttemptsDone: function () {
            this.attemptsDone ++;
            this.$attemptsDoneElement.text(this.attemptsDone);
            if((this.attemptsLeft - this.attemptsDone)==3) {
                this.$attemptsDoneElement.addClass("warning");
            }
        },
        showGameResult: function (element) {
            const self = this;
            element.css('display', 'flex');
            this.$playAgainBtn.click(function () {
                self.setGameElements();
            });
            this.$finishGameBtn.hide();
            this.$attemptsDoneElement.removeClass("warning");
        },
        endGame: function (gameResult) {
            gameCards.$cardsContainer.hide();
            switch (gameResult) {
                case "playerWon":
                    this.showGameResult(this.$playerWonElement);
                    break;
                case "playerLost":
                    this.showGameResult(this.$playerLostElement);
            }
            this.gameState = 'ended';
        },
        checkGameStatus: function () {
            if (this.pairsLeft === 0 && this.attemptsDone <= this.attemptsLeft) {
                this.endGame("playerWon");
            } else if (this.pairsLeft !== 0 && this.attemptsDone == this.attemptsLeft) {
                this.endGame("playerLost");
            }
        },
        beginGame: function (degreeOfDifficulty, pairsLeft, attemptsLeft, cardsContainerClass, cards) {
            this.degreeOfDifficulty = degreeOfDifficulty;
            this.pairsLeft = pairsLeft;
            this.attemptsLeft = attemptsLeft;
            gameCards.$cardsContainer.removeClass("easy medium hard extreme").addClass(cardsContainerClass);
            gameCards.showCards(cards);
        }
    },
        gameCards = {
            $cardsContainer : $(".cards_container"),
            $cards : $(".cards_container").children(),
            cardReverseImages : ['card_back_01', 'card_back_02', 'card_back_03', 'card_back_04', 'card_back_05', 'card_back_06', 'card_back_07', 'card_back_08', 'card_back_09', 'card_back_10', 'card_back_11'],
            $cardsEasyLevel : $(".cards_container").find(".easy_level"),
            $cardsMediumLevel : $(".cards_container").find(".medium_level"),
            $cardsHardLevel : $(".cards_container").find(".hard_level"),
            $cardsExtremeLevel : $(".cards_container").find(".extreme_level"),
            $links : $(".card a"),
            $firstCardLink: null,
            $secondCardLink: null,
            selectedCards : 0,
            setCardReverseImage: function () {
                const cardReverseImage = this.cardReverseImages[Math.floor(Math.random() * 11)];
                $(".card_reverse").css("background", "url(images/" + cardReverseImage + ".png) no-repeat center/cover");
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
                    gameCards.$links.off("click", gameCards.revealCard).click(function(e) {
                        e.preventDefault();
                    }).css("cursor", "not-allowed").parent().removeAttr("title");
                    $firstCard = $(".firstCard");
                    $secondCard = $(".secondCard");
                    $twoCards = $firstCard.add($secondCard);
                    gameCards.$firstCardLink = $firstCard.find("a");
                    gameCards.$secondCardLink = $secondCard.find("a");
                    if (gameCards.$firstCardLink.attr("class") == gameCards.$secondCardLink.attr("class")) {
                        setTimeout(function () {
                            $twoCards.addClass("card_match");
                        }, 500);
                        setTimeout(function () {
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
                        setTimeout(function () {
                            gameCards.$links.on("click", gameCards.revealCard).css("cursor", "pointer").parent().attr("title", "Odkryj kartę!");
                        }, 850);
                    } else {
                        setTimeout(function () {
                            $twoCards.addClass("card_mismatch");
                        }, 500);
                        setTimeout(function () {
                            $twoCards.removeClass("card_mismatch");
                            gameCards.changeCardReverseVisibility("visible", "visible");
                            game.setAttemptsDone();
                            game.checkGameStatus();
                        }, 800);
                        gameCards.removeSelectedCardsClasses();
                        setTimeout(function () {
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
                game.$finishGameBtn.click(function () {
                    game.gameState = "ended";
                    game.$attemptsDoneElement.removeClass("warning");
                    game.setGameElements();
                });
            }
        };
    game.setGameElements();
    gameCards.$links.on("click", gameCards.revealCard);
    game.$easyLevelButton.click(function () {
        game.beginGame("easy", 13, Math.floor(13*2.5), "easy", gameCards.$cardsEasyLevel);
    });
    game.$mediumLevelButton.click(function () {
        game.beginGame("medium", 26, Math.floor(26*3.4), "medium", gameCards.$cardsEasyLevel.add(gameCards.$cardsMediumLevel));
    });
    game.$hardLevelButton.click(function () {
        game.beginGame("hard", 39, Math.floor(39*4.3), "hard", gameCards.$cardsEasyLevel.add(gameCards.$cardsMediumLevel).add(gameCards.$cardsHardLevel));
    });
    game.$extremeLevelButton.click(function () {
        game.beginGame("extreme", 54, Math.floor(39*5.2), "extreme", gameCards.$cardsEasyLevel.add(gameCards.$cardsMediumLevel).add(gameCards.$cardsHardLevel).add(gameCards.$cardsExtremeLevel));
    });
});