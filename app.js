document.addEventListener("DOMContentLoaded", function() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Fonction pour vérifier si un élément est visible
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Fonction pour ajouter la classe 'visible'
    function showVisibleTimelineItems() {
        timelineItems.forEach(item => {
            // Un petit décalage (offset) pour que l'élément apparaisse juste avant qu'il n'arrive
            // au milieu de l'écran. 
            const itemTop = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (itemTop < windowHeight * 0.75) {
                item.classList.add('visible');
            }
        });
    }

    // Exécute la vérification au chargement
    showVisibleTimelineItems();

    // Écoute l'événement de défilement (scroll)
    window.addEventListener('scroll', showVisibleTimelineItems);
});