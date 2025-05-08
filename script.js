document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const charCount = document.getElementById('charCount');
    const humanizeBtn = document.getElementById('humanizeBtn');
    const outputText = document.getElementById('outputText');
    const copyBtn = document.getElementById('copyBtn');
    const loader = document.getElementById('loader');

    console.log('Humanize button:', humanizeBtn); // Debug log
    console.log('DOM elements loaded:', { inputText, charCount, outputText, copyBtn, loader }); // Debug log

    // Real-time character counter
    inputText.addEventListener('input', () => {
        const count = inputText.value.length;
        console.log('Character count:', count); // Debug log
        charCount.textContent = count;
        charCount.style.color = count > 9500 ? 'red' : '#555';
    });

    // Humanize button click handler
    humanizeBtn.addEventListener('click', async () => {
        const text = inputText.value.trim();
        console.log('Input text:', text); // Debug log
        if (!text) {
            alert('Please enter some text to humanize.');
            return;
        }

        loader.style.display = 'block';
        humanizeBtn.disabled = true;
        outputText.value = '';
        copyBtn.disabled = true;

        try {
            console.log('Sending request to backend...'); // Debug log
            const response = await fetch('https://humanizer-backend-6ypi.vercel.app/', {                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            console.log('Response status:', response.status); // Debug log
            const data = await response.json();
            console.log('Response data:', data); // Debug log

            if (response.ok) {
                outputText.value = data.humanizedText;
                copyBtn.disabled = false;
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error('Fetch error:', error); // Debug log
            alert('Failed to connect to the server. Please try again.');
        } finally {
            loader.style.display = 'none';
            humanizeBtn.disabled = false;
        }
    });

    // Copy button click handler
    copyBtn.addEventListener('click', () => {
        outputText.select();
        try {
            document.execCommand('copy');
            alert('Text copied to clipboard!');
        } catch (error) {
            alert('Failed to copy text.');
            console.error('Copy error:', error); // Debug log
        }
    });
});