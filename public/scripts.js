const modalOverlay = document.querySelector(".modal_overlay");
const cards = document.querySelectorAll(".card");

for (let card of cards) {
    card.addEventListener("click", function () {
        const videoId = card.getAttribute("id")
        window.location.href = `/video?id=${videoId}`


        // Manipula o Modal
        // modalOverlay.classList.add('active');
        // modalOverlay.querySelector("iframe").src = `https://www.youtube.com/embed/${videoId}`;
    })
}

document.querySelector(".close_modal").addEventListener("click", function () {
    modalOverlay.classList.remove("active");
    modalOverlay.querySelector("iframe").src = "";
})
