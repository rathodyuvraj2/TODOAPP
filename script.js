document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const taskId = this.getAttribute('data-id');
            fetch('/complete-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `id=${taskId}`
            })
            .then(response => {
                if (response.ok) {
                    this.parentElement.classList.toggle('completed', this.checked);
                }
            })
            .catch(error => {
                console.error(error);
            });
        });
    });
});
