const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

//  Make sure the URLs are EXACTLY as specified in the API documentation
const apiUrls = {
    prime: "http://20.244.56.144/evaluation-service/prime",
    fibo: "http://20.244.56.144/evaluation-service/fibo",
    even: "http://20.244.56.144/evaluation-service/even",
    random: "http://20.244.56.144/evaluation-service/rand"
};

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2NjI3NjI0LCJpYXQiOjE3NDY2MjczMjQsImlzcyI6IkFmZm9yZG1lZCIsimp0aSI6ImI0ZTU2MDhmLWQ5MTgtNDAzYS05ZGRhLTJkOTRkZjBkYmYwZSIsInN1YiI6InRocmlzaGFnb3dkYWJsMjAwNUBnbWFpbC5jb20ifSwiZW1haWwiOiJ0aHJpc2hhZ293ZGFibDIwMDVAZ21haWwuY29tIiwibmFtZSI6InRocmlzaGEgZ293ZGEgYiBsIiwicm9sbE5vIjoiNG5pMjJpczIzMSIsImFjY2Vzc0NvZGUiOiJEUllzY0UiLCJjbGllbnRJRCI6ImI0ZTU2MDhmLWQ5MTgtNDAzYS05ZGRhLTJkOTRkZjBkYmYwZSIsInN1YiI6InRocmlzaGFnb3dkYWJsMjAwNUBnbWFpbC5jb20ifSwiZW1haWwiOiJ0aHJpc2hhZ293ZGFibDIwMDVAZ21haWwuY29tIiwibmFtZSI6InRocmlzaGEgZ293ZGEgYiBsIiwicm9sbE5vIjoiNG5pMjJpczIzMSIsImFjY2Vzc0NvZGUiOiJEUllzY0UiLCJjbGllbnRJRCI6ImI0ZTU2MDhmLWQ5MTgtNDAzYS05ZGRhLTJkOTRkZjBkYmYwZSIsInN1YiI6InRocmlzaGFnb3dkYWJsMjAwNUBnbWFpbC5jb20ifSwiZW1haWwiOiJ0aHJpc2hhZ293ZGFibDIwMDVAZ21haWwuY29tIiwibmFtZSI6InRocmlzaGEgZ293ZGEgYiBsIiwicm9sbE5vIjoiNG5pMjJpczIzMSIsImFjY2Vzc0NvZGUiOiJEUllzY0UiLCJjbGllbnRJRCI6ImI0ZTU2MDhmLWQ5MTgtNDAzYS05ZGRhLTJkOTRkZjBkYmYwZSIsInN1YiI6InRocmlzaGFnb3dkYWJsMjAwNUBnbWFpbC5jb2mifQ.RtkSCGd22m-vhUH8JiIydlAFAYe_UhnxUJhzTNLFeeQ"; // Replace with your actual token

// Store the latest 10 unique numbers
const latestNumbers = new Set();

app.post('/average/calculate', async (req, res) => {
    const { types, range } = req.body;

    if (!types || !range) {
        return res.status(400).json({ message: "Types and range are required." });
    }

    try {
        for (const type of types) {
            if (apiUrls[type]) {
                const response = await axios.get(apiUrls[type], { // Use GET here
                    headers: {
                        'Authorization': `Bearer ${TOKEN}` // Include the Bearer token
                    }
                });
                if (response.data && response.data.numbers) {
                    response.data.numbers.forEach(num => {
                        latestNumbers.add(num);
                        if (latestNumbers.size > 10) {
                            const oldestNumber = Array.from(latestNumbers)[0];
                            latestNumbers.delete(oldestNumber);
                        }
                    });
                }
            }
        }

        const currentNumbersInWindow = Array.from(latestNumbers).sort((a, b) => b - a).slice(0, 10);

        if (!currentNumbersInWindow.length) {
            return res.status(200).json({ numbers: [], average: 0 });
        }

        const sum = currentNumbersInWindow.reduce((acc, num) => acc + num, 0);
        const average = sum / currentNumbersInWindow.length;

        res.status(200).json({ numbers: currentNumbersInWindow, average: parseFloat(average.toFixed(2)) });

    } catch (error) {
        console.error("Error fetching from APIs:", error); // Log the full error
        res.status(500).json({ message: "An error occurred while fetching data." });
    }
});

app.get('/', (req, res) => {
    res.send("Average Calculator API is running.");
});

const PORT = process.env.PORT || 9870;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});