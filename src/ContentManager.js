const CARDS = {
    // contentID = 0
    0: {
        "title": "Find Where You Want To Go",
        "top": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est voluptatibus autem veniam ad pariatur nostrum fugit ullam! Ipsa doloremque voluptate, architecto quidem eos debitis culpa?",
        "bot": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est voluptatibus autem veniam ad pariatur nostrum fugit ullam! Ipsa doloremque voluptate, architecto quidem eos debitis culpa?",
        "imgSrc": "Images/Pepe.jpg",
        "href": "https://www.youtube.com",
    },
    // contentID = 1
    1: {
        "title": "Show Who You Are",
        "top": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est voluptatibus autem veniam ad pariatur nostrum fugit ullam! Ipsa doloremque voluptate, architecto quidem eos debitis culpa?",
        "bot": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est voluptatibus autem veniam ad pariatur nostrum fugit ullam! Ipsa doloremque voluptate, architecto quidem eos debitis culpa?",
        "imgSrc": "Images/pepega.jpg",
        "href": "https://www.google.com",
    }
};


function updateContent(document, contentToAdd, questionToAdd) {
    if (typeof contentToAdd === 'undefined') return;

    let title = document.getElementById("title");
    let topContent = document.getElementById("top-content");
    let botContent = document.getElementById("bot-content");
    let logo = document.getElementById("logo");
    let link = document.getElementById("link");
    
    title.innerHTML = contentToAdd.title;
    topContent.innerHTML = contentToAdd.top;
    botContent.innerHTML = contentToAdd.bot;
    logo.src = contentToAdd.imgSrc;
    link.href = contentToAdd.href;

}

function removeCard() {
    document.getElementById("info-card").classList.remove("popShow");
    document.getElementById("info-card").classList.add("popHide");
    document.getElementById("question-card").classList.remove("popShow");
    document.getElementById("question-card").classList.add("popHide");
}

function addCard () {
    document.getElementById("info-card").classList.add("popShow")
    document.getElementById("info-card").classList.remove("popHide")
    document.getElementById("question-card").classList.add("popShow")
    document.getElementById("question-card").classList.remove("popHide")
}

export { updateContent, removeCard, addCard, CARDS }


