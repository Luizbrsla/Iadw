// Selecionar o personagem
const personagem = document.getElementById('personagem');
const pupilas = document.querySelectorAll('.pupila');

// Variáveis para posição do personagem
let personagemX = window.innerWidth / 2;
let personagemY = window.innerHeight / 2;

// Variáveis para suavização do movimento
let targetX = personagemX;
let targetY = personagemY;
let velocidade = 0.08; // Quanto menor, mais suave o movimento

// Variável para detectar movimento
let estaMovendo = false;
let timeoutMovimento;

// Posição inicial do personagem
personagem.style.left = personagemX + 'px';
personagem.style.top = personagemY + 'px';

// Atualizar posição alvo quando o mouse se move
document.addEventListener('mousemove', (e) => {
    targetX = e.clientX - 40; // Centralizar o personagem no cursor
    targetY = e.clientY - 60;
    
    // Marcar como movendo
    if (!estaMovendo) {
        personagem.classList.add('movendo');
        estaMovendo = true;
    }
    
    // Limpar timeout anterior
    clearTimeout(timeoutMovimento);
    
    // Definir timeout para parar animação
    timeoutMovimento = setTimeout(() => {
        personagem.classList.remove('movendo');
        estaMovendo = false;
    }, 200);
    
    // Atualizar direção das pupilas
    atualizarPupilas(e.clientX, e.clientY);
});

// Função para animar o movimento suave
function animar() {
    // Calcular a diferença entre posição atual e alvo
    const dx = targetX - personagemX;
    const dy = targetY - personagemY;
    
    // Atualizar posição com suavização
    personagemX += dx * velocidade;
    personagemY += dy * velocidade;
    
    // Aplicar transformação com rotação baseada na direção
    const angulo = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Aplicar posição
    personagem.style.left = personagemX + 'px';
    personagem.style.top = personagemY + 'px';
    
    // Adicionar leve inclinação na direção do movimento
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        const inclinacao = Math.min(Math.abs(dx) / 50, 15);
        if (dx > 0) {
            personagem.style.transform = `rotate(${inclinacao}deg)`;
        } else {
            personagem.style.transform = `rotate(-${inclinacao}deg)`;
        }
    } else {
        personagem.style.transform = 'rotate(0deg)';
    }
    
    // Continuar animação
    requestAnimationFrame(animar);
}

// Função para atualizar as pupilas olhando para o cursor
function atualizarPupilas(mouseX, mouseY) {
    pupilas.forEach((pupila, index) => {
        const olho = pupila.parentElement;
        const olhoRect = olho.getBoundingClientRect();
        const olhoCentroX = olhoRect.left + olhoRect.width / 2;
        const olhoCentroY = olhoRect.top + olhoRect.height / 2;
        
        // Calcular ângulo entre olho e cursor
        const angulo = Math.atan2(mouseY - olhoCentroY, mouseX - olhoCentroX);
        
        // Distância máxima que a pupila pode se mover (raio do olho - raio da pupila)
        const distanciaMax = 3;
        
        // Calcular nova posição da pupila
        const pupilaX = Math.cos(angulo) * distanciaMax;
        const pupilaY = Math.sin(angulo) * distanciaMax;
        
        // Aplicar transformação
        pupila.style.transform = `translate(calc(-50% + ${pupilaX}px), calc(-50% + ${pupilaY}px))`;
    });
}

// Iniciar animação
animar();

// Adicionar efeito de cursor customizado
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('body::after');
    document.body.style.setProperty('--mouse-x', e.clientX + 'px');
    document.body.style.setProperty('--mouse-y', e.clientY + 'px');
});

// Atualizar CSS para cursor customizado
const style = document.createElement('style');
style.textContent = `
    body::after {
        left: var(--mouse-x, 0);
        top: var(--mouse-y, 0);
        transform: translate(-50%, -50%);
    }
`;
document.head.appendChild(style);

console.log('🎮 Personagem seguidor ativado! Mova o mouse para ver a mágica acontecer!');