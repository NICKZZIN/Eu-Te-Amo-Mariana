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
    let emojiDX = 7; // Velocidade em X
    let emojiDY = 7; // Velocidade em Y
    let paddleX = 0;
    let gameInterval;
    const GAME_WIDTH = 600; // Largura do contêiner do jogo (ajustar conforme CSS)
    const GAME_HEIGHT = 800; // Altura do contêiner do jogo (ajustar conforme CSS)
    const PADDLE_WIDTH = 120;
    const PADDLE_HEIGHT = 20;
    const EMOJI_SIZE = 50;
    const TARGET_SCORE = 10; // Pontuação para parar o jogo

    // Flag para controlar se o jogo está ativo (game state)
    let isGameActive = false;
    // Flag para controlar se o paddle está sendo arrastado (dragging state)
    let isPaddleBeingDragged = false;


    // Funções do Jogo

    // Iniciar o Jogo
    function startGame() {
        startScreen.classList.add('hidden');
        gameArea.classList.add('visible'); // Mostra a área do jogo
        gameArea.classList.remove('hidden'); // Garante que não esteja escondida
        score = 0;
        scoreDisplay.textContent = score;
        resetEmojiAndPaddle();
        isGameActive = true; // Jogo ativo, pode receber movimentos da plataforma
        gameInterval = setInterval(gameLoop, 20); // Atualiza a cada 20ms
    }

    // Resetar a posição do emoji e da plataforma
    function resetEmojiAndPaddle() {
        emojiX = gameArea.clientWidth / 2 - EMOJI_SIZE / 2;
        emojiY = gameArea.clientHeight * 0.2; // Começa a 20% do topo da área do jogo

        paddleX = gameArea.clientWidth / 2 - PADDLE_WIDTH / 2;

        emoji.style.left = `${emojiX}px`;
        emoji.style.top = `${emojiY}px`;
        paddle.style.left = `${paddleX}px`;
    }

    // Mover a plataforma com o dedo/mouse
    // Esta função é chamada apenas pelo pointermove do document, que já verifica isPaddleBeingDragged
    function movePaddle(event) {
        // Posição X do centro da plataforma em relação à tela
        let newPaddleX = event.clientX - gameArea.getBoundingClientRect().left - PADDLE_WIDTH / 2;

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
                isGameActive = false; // Jogo não está mais ativo
                showLoveMessage();
            }
        }

        // Se o emoji cair (game over)
        if (emojiY + EMOJI_SIZE > gameArea.clientHeight) {
            clearInterval(gameInterval);
            isGameActive = false; // Jogo não está mais ativo
            isPaddleBeingDragged = false; // Garante que o arrasto pare

            alert('Ops! O coração caiu... Mas não se preocupe, o amor continua! Clique em OK para tentar novamente.');

            // Volta para a tela inicial
            gameArea.classList.add('hidden');
            startScreen.classList.remove('hidden');

            // Resetar o estado da pontuação para o próximo jogo
            score = 0; // Zera a pontuação
            scoreDisplay.textContent = score; // Atualiza o display

            // Garante que o display da pontuação esteja no lugar certo para o próximo jogo
            scoreDisplay.style.position = 'absolute';
            scoreDisplay.style.top = '20px';
            scoreDisplay.style.left = 'auto';
            scoreDisplay.style.transform = 'none';
            scoreDisplay.style.fontSize = '3em';
            scoreDisplay.classList.remove('hidden');
            return; // Sai da função gameLoop para não processar mais nada
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
        isPaddleBeingDragged = false; // Garante que o arrasto pare

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
        Oiiiii minha princesa, não faz muito tempo que já disse isso, mas eu queria dizer de novo eu amei ter te conhecido, eu amei a nossa primeira interação, desde lá até hoje, eu tenho amado esse tempo com você, meu dia só é dia se posso conversar com você, pq você é meu Sol, que ilumina meu dia mediante as coisas que quero esquecer, conversando contigo eu sou a pessoa mais feliz do mundo, e mesmo que não estejamos conversando tanto esses tempos sabe, mesmo que só responda se está tudo bem, se você tá comendo direitinho e bebendo aguinha, então saiba que meu dia é com toda certeza melhor, quando tenho você comigo. Estarei com você pra sempre, seu dia estando bom ou ruim, vc achando que tá chata ou não, mesmo que não estejamos conversando eu ainda vou estar aqui por você. Eu queria poder te fazer sentir o quanto eu te amo e o quanto vc é uma benção na minha vida, não no "modo mãe" de falar kkkkkkk, digo um como um presente, você é tipo ganhar algo que você gosta autografado por uma pessoa que você é muito fã, sabe? Eu quero dizer é que, você é única, e se posso dizer que acertei em algo na minha vida, esse algo foi ter escolhido ficar com você, e se eu pudesse que escolher de novo, eu com certeza te escolheria, não me arrependo, e nem teria como me arrepender doq torna meu dias mais felizes❤️
Obrigado por ter me escolhido mesmo que não fosse escolher terminar, mais por estar tudo difícil e você decidir continuar, sei que não faz sentido, mas eu me odiaria se te visse com outro homem, ou soubesse, não consigo nem imaginar uma coisa dessas, tudo que eu mais queria agora era estar pertinho de você pra gente aproveitar esse dia, não vejo a hora de entrar logo naquele exército e sair o mais rápido possível pra ir te ver, sabe, eu não almejo muita coisa na vida, digo, não quero disputa sobre ser o melhor em algo por exemplo, sla, é que, eu já tenho tudo que eu preciso, e é você, não tô dizendo que não quero por exemplo sair e aproveitar, sabe? Mas se tiver que sair, que seja com você, se tiver de aproveitar algo que seja com você, se tiver de registrar um momento na minha vida, quero que você esteja lá, pq você é o motivo, o sentido, o que me completa, quem me preenche, alguém que com poucas palavras, já consegue me fazer a pessoa mais feliz do mundo e a mais sortuda de ter você aqui comigo, eu te amo muito Mariana❤️ Obrigado por ficar, obrigado por ser essa mulher incrível, obrigado por me escolher, obrigado por ser a mulher da minha vida, por ter essa alma linda e esse coração grandioso. Você é a minha bênção e sou muito grato a Deus. EU NICOLAS CARVALHO NASCIMENTO amo VOCÊ MARIANA SILVA DE JESUS, não se esqueça nunca disso, você É e SEMPRE SERÁ a mulher da minha vida❤️

Feliz dia dos namorados meu amor❤️
        Ass: Nicolas Rs🫦
        `;
    });

    // Fechar a carta
    closeCardButton.addEventListener('click', () => {
        cardContainer.classList.remove('open');
        setTimeout(() => {
            // Esconde a tela da mensagem e mostra a tela inicial
            loveMessageScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');

            // Resetar o estado da pontuação, infinito e carta para o próximo jogo
            score = 0; // Zera a pontuação para o próximo jogo
            scoreDisplay.textContent = score; // Atualiza o display da pontuação
            scoreDisplay.style.position = 'absolute'; // Volta a posição original da pontuação
            scoreDisplay.style.top = '20px';
            scoreDisplay.style.left = 'auto';
            scoreDisplay.style.transform = 'none';
            scoreDisplay.style.fontSize = '3em';
            scoreDisplay.classList.remove('hidden'); // Garante que a pontuação esteja visível

            infiniteScoreDisplay.textContent = '0'; // Reseta o texto do infinito
            infiniteScoreDisplay.classList.add('hidden'); // Esconde o display do infinito

            cardContainer.classList.remove('visible'); // Esconde a carta
            cardContainer.style.opacity = 0;
            cardContainer.style.pointerEvents = 'none';

            // Garante que o botão de início seja clicável novamente
            startButton.style.pointerEvents = 'auto';

            // O jogo estará pronto para ser iniciado novamente
        }, 600); // Espera a animação de fechamento da carta
    });

    // Event Listeners para iniciar o jogo
    startButton.addEventListener('click', startGame);

    // Esconde a área do jogo e a tela de mensagem no início
    gameArea.classList.add('hidden');
    loveMessageScreen.classList.add('hidden');
    cardContainer.classList.add('hidden'); // Esconde a carta no início
});
