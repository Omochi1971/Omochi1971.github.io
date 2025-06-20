document.addEventListener('DOMContentLoaded', () => {
    // Variablen initialisieren
    const form = document.getElementById('weightForm');
    const dateInput = document.getElementById('date');
    const weightInput = document.getElementById('weight');
    const saveBtn = document.getElementById('saveBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const exportBtn = document.getElementById('exportBtn');
    const clearBtn = document.getElementById('clearBtn');
    const navIcons = document.getElementById('navIcons');
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker registriert'))
            .catch((error) => console.error('Service Worker Fehler:', error));
}

    let weightData = JSON.parse(localStorage.getItem('weightData')) || [];

    // Funktionen
    function saveWeight() {
        if (dateInput && weightInput) {
            const date = dateInput.value;
            const weight = weightInput.value;
            if (date && weight) {
                weightData.push({ date, weight });
                localStorage.setItem('weightData', JSON.stringify(weightData));
                alert('Gewicht erfolgreich gespeichert!');
                weightInput.value = '';
                updateTableGlobally();
            } else {
                alert('Bitte Datum und Gewicht eingeben!');
            }
        }
    }

    function deleteLastEntry() {
        if (weightData.length > 0) {
            weightData.pop();
            localStorage.setItem('weightData', JSON.stringify(weightData));
            alert('Letzter Eintrag gelöscht!');
            updateTableGlobally();
        } else {
            alert('Keine Einträge vorhanden!');
        }
    }

    function updateTableGlobally() {
        console.log('Aktualisiere Tabelle, weightData:', weightData);
        weightData = JSON.parse(localStorage.getItem('weightData')) || [];
        weightData.sort((a, b) => new Date(b.date) - new Date(a.date));
        const tables = document.getElementsByClassName('weightTableBody');
        console.log('Gefundene Tabellen:', tables);
        for (let table of tables) {
            if (table) {
                table.innerHTML = '';
                weightData.forEach(entry => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${entry.date}</td>
                        <td>${entry.weight}</td>
                    `;
                    table.appendChild(row);
                });
            } else {
                console.log('Keine Tabelle gefunden');
            }
        }
    }

    function exportToCSV() {
        if (weightData.length === 0) {
            alert('Keine Daten zum Exportieren vorhanden!');
            return;
        }
        const csv = [
            'Datum,Gewicht (kg)',
            ...weightData.map(entry => `${entry.date},${entry.weight}`)
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bodylog_weights_${new Date().toLocaleDateString()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    function clearTableData() {
        if (weightData.length > 0) {
            if (confirm('Möchtest du alle Einträge (außer Überschriften) löschen?')) {
                weightData = [];
                localStorage.removeItem('weightData');
                alert('Alle Einträge wurden gelöscht!');
                updateTableGlobally();
            }
        } else {
            alert('Keine Einträge vorhanden!');
        }
    }

    // Navigation-Funktion
    function navigate(page) {
        window.location.href = page; // Wechselt zur angegebenen Seite
    }

    // Dynamische Icon-Aktualisierung beim Laden
    function updateNavIcons() {
        if (!navIcons) return;
        const icons = navIcons.getElementsByClassName('icon');
        const currentPage = window.location.pathname.split('/').pop();
        for (let icon of icons) {
            const iconType = icon.className.split(' ')[1]; // z. B. 'home', 'chart', 'settings'
            icon.classList.remove('active');
            let src = `assets/${iconType}_inactive.png`;
            console.log(`Generierter Pfad für ${iconType}: ${src}`); // Debugging-Log
            if (
                (iconType === 'home' && currentPage === 'index.html') ||
                (iconType === 'chart' && currentPage === 'weight-history.html') ||
                (iconType === 'settings' && currentPage === 'settings.html')
            ) {
                icon.classList.add('active');
                src = `assets/${iconType}_active.png`;
                console.log(`Aktiver Pfad für ${iconType}: ${src}`); // Debugging-Log
            }
            icon.src = src;
        }
    }

    // Event-Listener für Navigation hinzufügen
    function setupNavigation() {
        if (navIcons) {
            const icons = navIcons.getElementsByClassName('icon');
            for (let icon of icons) {
                icon.onclick = () => {
                    const iconType = icon.className.split(' ')[1];
                    let page = '';
                    if (iconType === 'home') page = 'index.html';
                    if (iconType === 'chart') page = 'weight-history.html';
                    if (iconType === 'settings') page = 'settings.html';
                    navigate(page);
                };
            }
        }
    }

    // Seitenspezifische Event-Listener
    if (form && saveBtn && deleteBtn) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveWeight();
        });
        deleteBtn.addEventListener('click', deleteLastEntry);
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    }

    if (exportBtn && clearBtn) {
        exportBtn.addEventListener('click', exportToCSV);
        clearBtn.addEventListener('click', clearTableData);
    }

    // Tabelle, Icons und Navigation aktualisieren
    updateTableGlobally();
    updateNavIcons();
    setupNavigation();
});