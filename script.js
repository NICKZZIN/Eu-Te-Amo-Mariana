document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const gameContainer = document.getElementById('game-container');
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const gameArea = document.getElementById('game-area');
    const scoreDisplay = document.getElementById('score');
    const emoji = document.getElementById('emoji');
    const paddle = document.getElementById('paddle');
    const loveMessageScreen = document.getElementById('love-message-screen');
    const loveText = document.getElementById('love-text');
    const infiniteScoreDisplay = document.getElementById('infinite-score');
    const closedCard = document.getElementById('closed-card');
    const cardContainer = document.getElementById('card-container');
    const openedCard = document.getElementById('opened-card');
    const cardContent = document.getElementById('card-content');
    const closeCardButton = document.getElementById('close-card-button');

    // Variáveis do Jogo
    let score = 0;
    let emojiX = 0;
    let emojiY = 0;
    let emojiDX = 5; // Velocidade em X
    let emojiDY = 5; // Velocidade em Y
    let paddleX = 0;
    let gameInterval;
    const GAME_WIDTH = 600; // Largura do contêiner do jogo (ajustar conforme CSS)
    const GAME_HEIGHT = 800; // Altura do contêiner do jogo (ajustar conforme CSS)
    const PADDLE_WIDTH = 120;
    const PADDLE_HEIGHT = 20;
    const EMOJI_SIZE = 50;
    const TARGET_SCORE = 10; // Pontuação para parar o jogo

    // Funções do Jogo

    // Iniciar o Jogo
    function startGame() {
        startScreen.classList.add('hidden');
        gameArea.classList.add('visible'); // Mostra a área do jogo
        gameArea.classList.remove('hidden'); // Garante que não esteja escondida
        score = 0;
        scoreDisplay.textContent = score;
        resetEmojiAndPaddle();
        gameInterval = setInterval(gameLoop, 20); // Atualiza a cada 20ms
        // No início da função startGame()
        gameArea.addEventListener('pointerdown', (e) => {
        gameArea.setPointerCapture(e.pointerId); // Captura o ponteiro para seguir fora da área
        gameArea.addEventListener('pointermove', movePaddle);
});

gameArea.addEventListener('pointerup', (e) => {
    gameArea.releasePointerCapture(e.pointerId); // Libera o ponteiro
    gameArea.removeEventListener('pointermove', movePaddle);
});
    }

    // Resetar a posição do emoji e da plataforma
    function resetEmojiAndPaddle() {
        emojiX = gameArea.clientWidth / 2 - EMOJI_SIZE / 2;
        emojiY = gameArea.clientHeight / 2 - EMOJI_SIZE / 2;
        paddleX = gameArea.clientWidth / 2 - PADDLE_WIDTH / 2;

        emoji.style.left = `${emojiX}px`;
        emoji.style.top = `${emojiY}px`;
        paddle.style.left = `${paddleX}px`;
    }

    // Mover a plataforma com o mouse
    function movePaddle(event) {
        const gameAreaRect = gameArea.getBoundingClientRect();
        let newPaddleX = event.clientX - gameAreaRect.left - PADDLE_WIDTH / 2;

        // Limita a plataforma dentro da área do jogo
        if (newPaddleX < 0) {
            newPaddleX = 0;
        } else if (newPaddleX > gameArea.clientWidth - PADDLE_WIDTH) {
            newPaddleX = gameArea.clientWidth - PADDLE_WIDTH;
        }
        paddleX = newPaddleX;
        paddle.style.left = `${paddleX}px`;
    }

    // Loop principal do jogo
    function gameLoop() {
        // Atualiza a posição do emoji
        emojiX += emojiDX;
        emojiY += emojiDY;

        // Colisão com as paredes (esquerda/direita)
        if (emojiX + EMOJI_SIZE > gameArea.clientWidth || emojiX < 0) {
            emojiDX *= -1; // Inverte a direção em X
        }

        // Colisão com o topo
        if (emojiY < 0) {
            emojiDY *= -1; // Inverte a direção em Y
        }

        // Colisão com a plataforma
        if (
            emojiY + EMOJI_SIZE > gameArea.clientHeight - PADDLE_HEIGHT - 20 && // 20px é a distância da plataforma do fundo
            emojiY + EMOJI_SIZE < gameArea.clientHeight - 20 && // Para evitar que o emoji "grude" na plataforma
            emojiX + EMOJI_SIZE > paddleX &&
            emojiX < paddleX + PADDLE_WIDTH
        ) {
            emojiDY *= -1; // Inverte a direção em Y
            score++;
            scoreDisplay.textContent = score;

            // Aumenta a velocidade a cada 2 pontos para dificultar
            if (score % 2 === 0) {
                emojiDX *= 1.05;
                emojiDY *= 1.05;
            }

            // Verifica a pontuação para a transição
            if (score >= TARGET_SCORE) {
                clearInterval(gameInterval); // Para o jogo
                document.removeEventListener('mousemove', movePaddle);
                showLoveMessage();
            }
        }

        // Se o emoji cair (game over)
        if (emojiY + EMOJI_SIZE > gameArea.clientHeight) {
            clearInterval(gameInterval);
            document.removeEventListener('mousemove', movePaddle);
            alert('Ops! O coração caiu... Mas não se preocupe, o amor continua! Clique em OK para tentar novamente.');
            startScreen.classList.remove('hidden');
            gameArea.classList.add('hidden');
        }

        // Atualiza a posição do emoji no DOM
        emoji.style.left = `${emojiX}px`;
        emoji.style.top = `${emojiY}px`;
    }

    // Mostrar a mensagem de amor
    function showLoveMessage() {
        gameArea.classList.add('hidden');
        loveMessageScreen.classList.remove('hidden');
        loveMessageScreen.classList.add('visible');

        // Animação da pontuação descendo e aumentando
        scoreDisplay.style.position = 'absolute';
        scoreDisplay.style.top = '50%';
        scoreDisplay.style.left = '50%';
        scoreDisplay.style.transform = 'translate(-50%, -50%)';
        scoreDisplay.style.fontSize = '8em'; // Aumenta o tamanho

        setTimeout(() => {
            scoreDisplay.classList.add('hidden'); // Esconde a pontuação antiga
            animateInfiniteScore();
        }, 1500); // Espera a animação de descida terminar
    }

    // Animação do número para infinito
    function animateInfiniteScore() {
        let currentNumber = 0;
        const animationDuration = 3000; // 3 segundos para ir até 999
        const steps = 999;
        const intervalTime = animationDuration / steps;

        infiniteScoreDisplay.classList.remove('hidden'); // Mostra o novo display de pontuação
        let animationInterval = setInterval(() => {
            if (currentNumber < 999) {
                currentNumber++;
                infiniteScoreDisplay.textContent = currentNumber;
            } else {
                clearInterval(animationInterval);
                infiniteScoreDisplay.innerHTML = '&infin;'; // Símbolo do infinito
                infiniteScoreDisplay.style.fontSize = '10em'; // Aumenta o tamanho do infinito
                setTimeout(() => {
                    cardContainer.classList.add('visible'); // Mostra a carta
                    cardContainer.style.opacity = 1;
                    cardContainer.style.pointerEvents = 'auto';
                }, 1000); // Espera um pouco antes de mostrar a carta
            }
        }, intervalTime);
    }

    // Abrir a carta
    closedCard.addEventListener('click', () => {
        cardContainer.classList.add('open');
        // Conteúdo da carta - **EDITE AQUI SUA MENSAGEM**
        cardContent.textContent = `
        Meu amor,

        Cada batida do meu coração é sua.
        Você me faz acreditar no amor mais puro,
        na alegria que transborda e na parceria
        que me inspira a ser alguém melhor a cada dia.

        Você é a estrela mais brilhante no meu céu,
        a melodia mais linda na minha canção,
        e a paz que acalma a minha alma.

        Prometo te amar e te valorizar,
        em todos os momentos, para todo o sempre.

        Feliz Dia dos Namorados, meu eterno amor!

        Com todo o meu coração,
        [Seu Nome Aqui]
        `;
    });

    // Fechar a carta
    closeCardButton.addEventListener('click', () => {
        cardContainer.classList.remove('open');
        setTimeout(() => {
            // Poderia redirecionar ou reiniciar o jogo aqui, se quiser
            // Por enquanto, apenas esconde a tela da mensagem e mostra a inicial
            loveMessageScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');
            scoreDisplay.style.position = 'absolute'; // Volta a posição original da pontuação
            scoreDisplay.style.top = '20px';
            scoreDisplay.style.left = 'auto';
            scoreDisplay.style.transform = 'none';
            scoreDisplay.style.fontSize = '3em';
            scoreDisplay.classList.remove('hidden'); // Garante que a pontuação esteja visível para o próximo jogo
            infiniteScoreDisplay.textContent = '0'; // Reseta o infinito
            infiniteScoreDisplay.classList.add('hidden'); // Esconde o infinito
            cardContainer.classList.remove('visible'); // Esconde a carta
            cardContainer.style.opacity = 0;
            cardContainer.style.pointerEvents = 'none';
        }, 600); // Espera a animação de fechamento da carta
    });


    // Event Listeners
    startButton.addEventListener('click', startGame);

    // Esconde a área do jogo e a tela de mensagem no início
    gameArea.classList.add('hidden');
    loveMessageScreen.classList.add('hidden');
    cardContainer.classList.add('hidden'); // Esconde a carta no início
});
