const apiKey = "1d8920159c7640568805c621776bc305";
const blogContainer = document.getElementById("blog-container");
const searchInput = document.getElementById("search-input");
const searchButton = document.querySelector(".search-button");

let currentPage = 1; 
const articlesPerPage = 50; 

function getDateRange() {
    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - 3); 

    const to = today.toISOString().split('T')[0]; 
    const from = fromDate.toISOString().split('T')[0]; 

    return { from, to };
}

async function fetchRandomNews(query, from, to, page) {
    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=${query}&from=${from}&to=${to}&pageSize=${articlesPerPage}&page=${page}&apiKey=${apiKey}`; 
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.articles;   
    } catch (error) {
        console.error("Error fetching random news", error);
        return [];
    }
}

function displayBlogs(articles) {
    articles.forEach((article) => {
        if (article.urlToImage) { 
            const blogCard = document.createElement("div");
            blogCard.classList.add("blog-card");

            const img = document.createElement("img");
            img.src = article.urlToImage;
            img.alt = article.title;

            const title = document.createElement("h2");
            title.textContent = article.title;

            const description = document.createElement("p");
            description.textContent = article.description || "No description available.";

            blogCard.appendChild(img);
            blogCard.appendChild(title);
            blogCard.appendChild(description);  
            blogContainer.appendChild(blogCard);
        }
    });
}

async function handleSearch() {
    const query = searchInput.value.trim();
    const { from, to } = getDateRange(); 
    currentPage = 1; 
    blogContainer.innerHTML = ""; 
    await loadArticles(query, from, to, currentPage);
}

async function loadArticles(query, from, to, page) {
    const articles = await fetchRandomNews(query, from, to, page);
    displayBlogs(articles);
}


searchButton.addEventListener("click", handleSearch);


searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});


window.addEventListener("scroll", async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        currentPage++;
        const query = searchInput.value.trim() || 'apple'; 
        const { from, to } = getDateRange(); 
        await loadArticles(query, from, to, currentPage);
    }
});


(async () => {
    const { from, to } = getDateRange(); 
    await loadArticles('apple', from, to, currentPage);
})();
