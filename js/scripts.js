$(function () {
    const $cardsContainer = $(".cards_container"),
        $cardsEasyLevel = $cardsContainer.find(".easy_level"),
        $cardsMediumLevel = $cardsContainer.find(".medium_level"),
        $cardsHardLevel = $cardsContainer.find(".hard_level"),
        $cardsExtremeLevel = $cardsContainer.find(".extreme_level"),
        $gameDataElement = $("#js-game_data"),
        $newGameBtn = $('#js-newGameBtn'),
        $playAgainBtn = $('.js-playAgainBtn'),
        $finishGameBtn = $(".js-finishGameBtn"),
        $newGameElement = $('#js-newGame'),
        $degreeOfDifficultyElement = $('#js-degree_of_difficulty'),
        $playerWonElement = $("#js-player_won"),
        $playerLostElement = $("#js-player_lost"),
        $links = $(".card a"),
        $easyLevelButton = $("#js-easyLevel"),
        $mediumLevelButton = $("#js-mediumLevel"),
        $hardLevelButton = $("#js-hardLevel"),
        $extremeLevelButton = $("#js-extremeLevel"),
        $gameLevelElement = $("#js-game_level"),
        $pairsLeftElement = $("#js-pairs_left"),
        $pairsFoundElement = $("#js-pairs_found"),
        $attemptsDoneElement = $("#js-attempts_done"),
        $attemptsLeftElement = $("#js-attempts_left");
    let selectedCards = 0,
        $cards = $cardsContainer.children(),
        gameState,
        $firstCard,
        $secondCard,
        $twoCards,
        $firstCardLink,
        $secondCardLink,
        degreeOfDifficulty,
        pairsLeft,
        pairsFound = 0,
        attemptsDone = 0,
        attemptsLeft;
    function setGameElements() {
        $newGameElement.show();
        $degreeOfDifficultyElement.add($gameDataElement).add($playerWonElement).add($playerLostElement).add($cardsContainer).add($cards).add($finishGameBtn).hide();
        switch (gameState) {
            case 'started':
                $newGameElement.hide();
                $degreeOfDifficultyElement.css('display', 'flex');
                break;
            case 'ended':
                $newGameBtn.text("Zagraj jeszcze raz!");
                pairsFound = 0;
                $pairsFoundElement.text(pairsFound);
                attemptsDone = 0;
                $attemptsDoneElement.text(attemptsDone);
                $(".card, .card_reverse").css("visibility", "visible");
        }
    }
    setGameElements();
    function newGame() {
        gameState = 'started';
        setGameElements();
    }
    function shuffleCards() {
        while ($cards.length) {
            $cardsContainer.append($cards.splice(Math.floor(Math.random() * $cards.length), 1)[0]);
        }
    }
    function addCardClass(element, cardClass) {
        $(element).find(".card_reverse").css("visibility", "hidden");
        $(element).parent().addClass(cardClass);
        selectedCards ++;
    }
    function restoreDefaults() {
        $(".card").removeClass("firstCard secondCard");
        selectedCards = 0;
    }
    function changeCardReverseVisibility(firstCardLinkVisibility, secondCardLinkVisibility) {
        $firstCardLink.find(".card_reverse").css("visibility", firstCardLinkVisibility);
        $secondCardLink.find(".card_reverse").css("visibility", secondCardLinkVisibility);
    }
    function setAttemptsDone() {
        attemptsDone ++;
        $attemptsDoneElement.text(attemptsDone);
        if((attemptsLeft - attemptsDone)==3) {
            $attemptsDoneElement.addClass("warning");
        }
    }
    function revealCard(e) {
        e.preventDefault();
        if (selectedCards === 0) {
            addCardClass(this, "firstCard");
            $(this).css("cursor", "not-allowed").parent().removeAttr("title");
        }
        if (selectedCards === 1 & !$(this).parent().hasClass("firstCard")) {
            addCardClass(this, "secondCard");
        }
        if (selectedCards === 2) {
            $links.off("click", revealCard).click(function(e) {
                e.preventDefault();
            }).css("cursor", "not-allowed").parent().removeAttr("title");
            $firstCard = $(".firstCard");
            $secondCard = $(".secondCard");
            $twoCards = $firstCard.add($secondCard);
            $firstCardLink = $firstCard.find("a");
            $secondCardLink = $secondCard.find("a");
            if ($firstCardLink.attr("class") == $secondCardLink.attr("class")) {
                setTimeout(function () {
                    $twoCards.addClass("card_match");
                }, 500);
                setTimeout(function () {
                    $twoCards.removeClass("card_match").css("visibility", "hidden");
                    changeCardReverseVisibility("hidden", "hidden");
                    pairsLeft --;
                    $pairsLeftElement.text(pairsLeft);
                    pairsFound ++;
                    $pairsFoundElement.text(pairsFound);
                    setAttemptsDone();
                    checkGameStatus();
                }, 800);
                restoreDefaults();
                setTimeout(function () {
                    $links.on("click", revealCard).css("cursor", "pointer").parent().attr("title", "Odkryj kartę!");
                }, 850);
            } else {
                setTimeout(function () {
                    $twoCards.addClass("card_mismatch");
                }, 500);
                setTimeout(function () {
                    $twoCards.removeClass("card_mismatch");
                    changeCardReverseVisibility("visible", "visible");
                    setAttemptsDone();
                    checkGameStatus();
                }, 800);
                restoreDefaults();
                setTimeout(function () {
                    $links.on("click", revealCard).css("cursor", "pointer").parent().attr("title", "Odkryj kartę!");
                }, 850);
            }
        }
    }
    function showGameResult(element) {
        element.css('display', 'flex');
        $finishGameBtn.hide();
        $attemptsDoneElement.removeClass("warning");
    }
    function endGame(gameResult) {
        $cardsContainer.hide();
        switch (gameResult) {
            case "playerWon":
                showGameResult($playerWonElement);
                break;
            case "playerLost":
                showGameResult($playerLostElement);
        }
        gameState = 'ended';
    }
    function checkGameStatus() {
        if (pairsLeft === 0 && attemptsDone <= attemptsLeft) {
            endGame("playerWon");
        } else if (pairsLeft !== 0 && attemptsDone == attemptsLeft) {
            endGame("playerLost");
        }
    }
    function showCards(cards) {
        $degreeOfDifficultyElement.hide();
        $cards = $cardsContainer.children();
        $cardsContainer.fadeIn();
        $cards.hide();
        shuffleCards();
        cards.attr("title", "Odkryj kartę!").add($finishGameBtn).add($gameDataElement).fadeIn();
        switch(degreeOfDifficulty) {
            case "easy":
                $gameLevelElement.text("łatwy");
                break;
            case "medium":
                $gameLevelElement.text("średni");
                break;
            case "hard":
                $gameLevelElement.text("trudny");
                break;
            case "extreme":
                $gameLevelElement.text("ekstremalny");
        }
        $pairsLeftElement.text(pairsLeft);
        $attemptsLeftElement.text(attemptsLeft);
    }
    function beginGame(degreeOfDifficulty_, pairsLeft_, attemptsLeft_, cardsContainerClass, cards) {
        degreeOfDifficulty = degreeOfDifficulty_;
        pairsLeft = pairsLeft_;
        attemptsLeft = attemptsLeft_;
        $cardsContainer.removeClass("easy medium hard extreme").addClass(cardsContainerClass);
        showCards(cards);
    }
    $newGameBtn.click(function () {
        newGame();
    });
    $playAgainBtn.click(function () {
        setGameElements();
    });
    $finishGameBtn.click(function () {
        gameState = "ended";
        $attemptsDoneElement.removeClass("warning");
        setGameElements();
    });
    $links.on("click", revealCard);
    $easyLevelButton.click(function () {
        beginGame("easy", 13, 39, "easy", $cardsEasyLevel);
    });
    $mediumLevelButton.click(function () {
        beginGame("medium", 26, 78, "medium", $cardsEasyLevel.add($cardsMediumLevel));
    });
    $hardLevelButton.click(function () {
        beginGame("hard", 39, 117, "hard", $cardsEasyLevel.add($cardsMediumLevel).add($cardsHardLevel));
    });
    $extremeLevelButton.click(function () {
        beginGame("extreme", 54, 162, "extreme", $cardsEasyLevel.add($cardsMediumLevel).add($cardsHardLevel).add($cardsExtremeLevel));
    });
});