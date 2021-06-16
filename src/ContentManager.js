// contentId = 0
const card0Title = "Find Where You Want To Go";
const card0TopContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est voluptatibus autem veniam ad pariatur nostrum fugit ullam! Ipsa doloremque voluptate, architecto quidem eos debitis culpa?";
const card0BotContent = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et, quaerat!";
const card0ImageSrc = "Images/Pepe.jpg";
const card0Href = "https://www.youtube.com";
const card0Content = [card0Title, card0TopContent, card0BotContent, card0ImageSrc, card0Href]

// contentId = 1
const card1Title = "Show Who You Are";
const card1TopContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est voluptatibus autem veniam ad pariatur nostrum fugit ullam! Ipsa doloremque voluptate, architecto quidem eos debitis culpa?";
const card1BotContent = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et, quaerat!";
const card1ImageSrc = "Images/pepega.jpg";
const card1Href = "https://www.google.com";
const card1Content = [card1Title, card1TopContent, card1BotContent, card1ImageSrc, card1Href]

// contentId = 2

function updateContent(document, contentToAdd) {
    let title = document.getElementById("title");
    let topContent = document.getElementById("top-content");
    let botContent = document.getElementById("bot-content");
    let logo = document.getElementById("logo");
    let link = document.getElementById("link");
    
    title.innerHTML = contentToAdd[0];
    topContent.innerHTML = contentToAdd[1];
    botContent.innerHTML = contentToAdd[2];
    logo.src = contentToAdd[3];
    link.href = contentToAdd[4];

}

function removeCard() {
    document.getElementById("info-card").classList.remove("popShow");
    document.getElementById("info-card").classList.add("popHide");
}

function addCard () {
    document.getElementById("info-card").classList.add("popShow")
    document.getElementById("info-card").classList.remove("popHide")
}

export { updateContent, removeCard, addCard, card0Content, card1Content }


