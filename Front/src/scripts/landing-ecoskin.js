
const cenas = document.querySelectorAll(".cena");
const mensagens = document.querySelectorAll(".mensagem");
const indicador = document.querySelector("#indicador");
const jornada = document.querySelector(".jornada");

function atualizarJornada() {
  if (!jornada || cenas.length === 0) return;

  const limite = jornada.offsetHeight - window.innerHeight;
  const deslocamento = jornada.getBoundingClientRect().top;

  const progresso = limite > 0
    ? Math.max(0, Math.min(1, -deslocamento / limite))
    : 0;

  const quadro = Math.min(
    cenas.length - 1,
    Math.floor(progresso * cenas.length)
  );

  cenas.forEach((cena, indice) => {
    cena.classList.toggle("ativa", indice === quadro);
  });

  mensagens.forEach((mensagem, indice) => {
    mensagem.classList.toggle("ativa", indice === quadro);
  });

  if (indicador) {
    indicador.textContent = quadro === cenas.length - 1
      ? "ECOSKIN · BELEZA CONSCIENTE"
      : "ROLE PARA DESCOBRIR";
  }
}

window.addEventListener("scroll", atualizarJornada, {
  passive: true
});

window.addEventListener("resize", atualizarJornada);

atualizarJornada();
