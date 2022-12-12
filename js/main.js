/* 
Jordan Bishop
INF651 - VC - Front End Web Development
Final Project
*/


function createElemWithText(elem = 'p', text = '', className){
    const newElem = document.createElement(elem);
    const textContent = document.createTextNode(text);
    newElem.appendChild(textContent);
    if (className){
        newElem.classList.add(className);
    }
    return newElem;
}

function createSelectOptions(data){
    let newArr = [];
    if (!data){
        return undefined;
    }

    return data.map(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        return option;
      });   
}

function toggleCommentSection(postId){
    if (!postId) return;

        const newSel = document.querySelector(`section[data-post-id="${postId}"]`);
        if (newSel) {
            newSel.classList.toggle('hide');
        }
        return newSel;
}

function toggleCommentButton(postId){
    if (!postId) return;

    const newSel = document.querySelector(`button[data-post-id="${postId}"]`);
    if (newSel){
        if (newSel.textContent == 'Show Comments' ? newSel.textContent = 'Hide Comments' : newSel.textContent = 'Show Comments');
    }
    return newSel;
}

function deleteChildElements(parentElement){
    if (!(parentElement instanceof HTMLElement)) return;

    let childEle = parentElement.lastElementChild;
    while (childEle){
        parentElement.removeChild(childEle);
        childEle = parentElement.lastElementChild;
    }
     return parentElement;
}

function addButtonListeners() {
    const buttons = document.querySelectorAll('main button')
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        button.addEventListener('click', (event) => {
            toggleComments(event, postId);
        });
    });

    return buttons; 
}

function removeButtonListeners() {
    const buttons = document.querySelectorAll('main button')
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        button.removeEventListener('click', (event) => {
            toggleComments(event, postId);
        });
    });

    return buttons; 
}

function createComments(commentData){
    if(!commentData) return;

    const fragment = document.createDocumentFragment();
  
    for (let i = 0; i < commentData.length; i++){
      const newEle = commentData[i];
      const article = document.createElement('article');
      let h3 = createElemWithText('h3', commentData.name);
      let p1 = createElemWithText('p', commentData.body);
      let p2 = createElemWithText('p', `From: '${commentData.email}`);
  
      article.append(h3);
      article.append(p1);
      article.append(p2);
  
      fragment.append(article);
    }
  
    return fragment;
  
  }

  function populateSelectMenu(userData){
    if (!userData) return;

    const selectEle = document.querySelector("#selectMenu");
    let options = createSelectOptions(userData);

    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        selectEle.append(option);
  }
  return selectEle;
}

let getUsers = async() => {

    let retrieve;
    
    try {
        retrieve = await fetch("https://jsonplaceholder.typicode.com/users");
    }
    catch (error) {
        console.log(error);
    } 
    return await retrieve.json();

} 

let getUserPosts = async(userId) => {
    if (!userId) return;

    let retrieve;
    try {
        retrieve = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
    }
    catch (error) {
        console.log(error);
    } 
    return retrieve.json();
} 

let getUser = async(userId) => {
    if (!userId) return;

    let retrieve;

    try {
        retrieve = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    } 
    catch (error) {
        console.log(error);
    } 
    return retrieve.json();
}

let getPostComments = async(postId) => {
    if(!postId) return;

    let retrieve;

    try {
        retrieve = await fetch(`https://jsonplaceholder.typicode.com/users/${postId}/comments?postId=${postId}`);
    }
    catch (error) {
        console.log(error);
    }

    return retrieve.json();

}

let displayComments = async(postId) => {
    if(!postId) return;

    const sectionEle = document.createElement("section");
    sectionEle.dataset.postId = postId;
    sectionEle.classList.add("comments", "hide");
    let comments = await getPostComments(postId);
    let fragment = createComments(comments);
    sectionEle.append(fragment);
    return sectionEle;

}

let createPosts = async(posts) => {
    if (!posts) return;

    const fragment = document.createDocumentFragment();

    for (const post of posts) {
        const article = document.createElement('article');
        const h2 = createElemWithText('h2', post.title);
        const p1 = createElemWithText('p', post.body);
        const p2 = createElemWithText('p', `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const p3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        const p4 = createElemWithText('p', author.company.catchPhrase);
        const button = createElemWithText('button', 'Show Comments');
        button.dataset.postId = post.id;
        article.append(h2, p1, p2, p3, p4, button);
        const section = await displayComments(post.id);
        article.append(section);
        fragment.append(article);
    }

    return fragment;
}

let displayPosts = async (posts) => {

    let mainEle = document.querySelector("main");

    let element = (posts) ? await createPosts(posts) : document.querySelector("main p");
    mainEle.append(element);
    
    return element;
}

function toggleComments(event, postId){

    if (!event || !postId) return;

    event.target.listener = true;

    let section  = toggleCommentSection(postId);
    let button = toggleCommentButton(postId);
    let newArr = [section, button];

    return newArr;
}

let refreshPosts = async (posts) => {

    if (!posts) return;

    let buttons = removeButtonListeners();
    let mainEle = deleteChildElements(document.querySelector("main"));
    let fragment = await displayPosts(posts);
    let button = addButtonListeners();
    let newArr = [buttons, mainEle, fragment, button];

    return newArr;
}

const selectMenuChangeEventHandler = async (e) => {

    if (!e) return;

    let userId = e?.target?.value || 1;
    let posts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts(posts);

    return [userId, posts, refreshPostsArray];

}

const initPage = async() => {

    let users = await getUsers();
    let newEle = populateSelectMenu(users);
    return [users, select];

}

function initApp(){

    initPage();
    let newEle = document.getElementById("selectMenu");
    newEle.addEventListener("change", selectMenuChangeEventHandler, false);

}

document.addEventListener("DOMContentLoaded", initApp, false);


function toggleComments(){

}