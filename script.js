const likes = [];
var likesCount = 0;
var currScreen = 'none';
var nResults = 10;

window.addEventListener('load', openFeed); 
window.onscroll = function(ev) {
    if (currScreen == 'feed' && nResults < 96 && (window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        loadMore();
    }
};

function loadMore() {
    let last = nResults;
    nResults += 5;
    for (let i = last; i < nResults; i++) {
        let i0 = ('0' + i).slice(-2);
        results.innerHTML += '<div class="container" id="cont' + i0 + '"></div>';
    }
    const d = new Date();
    for (let i = last; i < nResults; i++) {
        let currDay = new Date(d - i * 1000 * 60 * 60 * 24);
        search(currDay.getFullYear() + '-' + (currDay.getMonth()+1) + '-' + currDay.getDate(), i, false);
    }
}
function openFeed() {
    if (currScreen == 'none') {
        // erase old results
        results.innerHTML = '';
        for (let i = 0; i < nResults; i++) {
            let i0 = ('0' + i).slice(-2);
            results.innerHTML += '<div class="container" id="cont' + i0 + '"></div>';
        }
        const d = new Date();
        for (let i = 0; i < nResults; i++) {
            let currDay = new Date(d - i * 1000 * 60 * 60 * 24);
            search(currDay.getFullYear() + '-' + (currDay.getMonth()+1) + '-' + currDay.getDate(), i, false);
        }
    } else if (currScreen == 'likes') {
        pageTitle.innerText = 'Spacetagram';
        likesTitle.style.display = 'none';
        feedTitle.style.display = 'none';
        removeOverlay(1);
        // erase old results
        results.innerHTML = '';
        for (let i = 0; i < nResults; i++) {
            let i0 = ('0' + i).slice(-2);
            results.innerHTML += '<div class="container" id="cont' + i0 + '"></div>';
        }
        const d = new Date();
        for (let i = 0; i < nResults; i++) {
            let currDay = new Date(d - i * 1000 * 60 * 60 * 24);
            search(currDay.getFullYear() + '-' + (currDay.getMonth()+1) + '-' + currDay.getDate(), i, true);
        }
    } else {
        likesTitle.style.display = 'none';
        feedTitle.style.display = 'none';
        removeOverlay(1);
    }
    currScreen = 'feed';
}

function search(date, id, likes) { 
    let url = 'https://api.nasa.gov/planetary/apod?date=' + date + '&api_key=ClNW9j5wh2neNfOnJVViMugoeNURhTEmMV32bAyB';
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.onload = function() {
        if (request.response.url.substring(request.response.url.length-3) == 'jpg')
            if (likes)
                showResultsWithLikes(request.response, id);
            else
                showResults(request.response, id);
        else {
            id0 = ('0' + id).slice(-2);
            document.getElementById('cont' + id0).remove();
        }
        return request.response;
    }
    request.send();
}

function showResults(resp, id) {
    // list elements according to id
    id0 = ('0' + id).slice(-2);
    let cont = document.getElementById('cont' + id0);
    cont.innerHTML += `
            <h3 class="title">${resp.title}</h3>
            <btn class="circle_heart" id="btn${id0}" onclick="heart(this.id);"><input id="heart${id0}" type="image" class="heart" src="heart-stencil.png"></btn>
            <p class="date">${resp.date}</p>
            <img class="picture" src="${resp.url}">
            <p class="description" id="desc${id0}" onclick="description(this.id)">${resp.explanation}</p>
            <h4 id="show${id0}" class="showMore" onclick="description(this.id)">&#8595</h4>
            `;
}

function showResultsWithLikes(resp, id) {
    // list elements according to id
    id0 = ('0' + id).slice(-2);
    const cont = document.getElementById('cont' + id0);
    cont.innerHTML += `
            <h3 class="title">${resp.title}</h3>
            <btn class="circle_heart" id="btn${id0}" onclick="heart(this.id);"><input id="heart${id0}" type="image" class="heart" src="heart-stencil.png"></btn>
            <p class="date">${resp.date}</p>
            <img class="picture" src="${resp.url}">
            <p class="description" id="desc${id0}" onclick="description(this.id)">${resp.explanation}</p>
            <h4 id="show${id0}" class="showMore" onclick="description(this.id)">&#8595</h4>
            `;
    // check if ID in likes
    for (const e of likes) {
        if (e.id == id0) {
            document.getElementById('heart' + id0).classList = 'heart hearted begin';
            document.getElementById('heart' + id0).src = 'heart.png';
        }
    }
}

function removeOverlay(opacity) {
   if (opacity>0) {
      opacity -= .1;
    setTimeout(function(){removeOverlay(opacity)},50);
   } else {
        overlay.classList = 'transparent';
        opacity = 0;
   }
   overlay.style.opacity = opacity;
}

function addOverlay(opacity) {
    if (opacity<1) {
       opacity += .1;
      setTimeout(function(){addOverlay(opacity)},30);
    } else {
        overlay.classList = 'opaque';
        opacity = 1;
    }
    overlay.style.opacity = opacity;
 }

function menu() {
    if (overlay.classList.contains('opaque')) {
        likesTitle.style.display = 'none';
        feedTitle.style.display = 'none';
        removeOverlay(1);
    }
    else {
        likesTitle.style.display = 'block';
        feedTitle.style.display = 'block';
        addOverlay(0);
    }     
}
function openLikes() {
    if (currScreen == 'feed') {
        pageTitle.innerText = 'My Likes';
        if (likesCount == 0) {
            results.innerHTML = '<h2 style="color:#483449;font-weight:lighter;text-align:center;padding-top:15%;">Find all your favourite posts here :)</h2>';
        } else {
            results.innerHTML = '';
        }
        likesTitle.style.display = 'none';
        feedTitle.style.display = 'none';
        removeOverlay(1);
        for (let i = 0; i < likesCount; i++) {
            let currLike = likes[i];
            let likeID = currLike.id;
    
            results.innerHTML += '<div class="container" id="cont' + likeID + '"></div>';
            let cont = document.getElementById('cont' + likeID);
            cont.innerHTML += `
                <h3 class="title">${currLike.title}</h3>
                <btn class="circle_heart" id="btn${likeID}" onclick="heart(this.id);"><input id="heart${likeID}" type="image" class="heart hearted begin" src="heart.png"></btn>
                <p class="date">${currLike.date}</p>
                <img class="picture" src="${currLike.url}">
                <p class="description" id="desc${likeID}" onclick="description(this.id)">${currLike.desc}</p>
                <h4 id="show${likeID}" class="showMore" onclick="description(this.id)">&#8595</h4>
                `;
    
        }
    } else {
        likesTitle.style.display = 'none';
        feedTitle.style.display = 'none';
        removeOverlay(1);
    }
    currScreen = 'likes';
}

function description(id) {
    let desc = document.getElementById('desc' + id.substring(4));
    let show = document.getElementById('show' + id.substring(4));
    if (desc.classList.contains('expanded')) {
        desc.classList = 'description';
        show.style['box-shadow'] = '0 -16px 36px 23px black';
        show.innerHTML = '&#8595';
    } else {
        desc.classList = 'description expanded';
        show.style['box-shadow'] = 'none';
        show.innerHTML = '&#8593';
    }
}

function removeLike(e, height, opacity) {
    if (height>0 || opacity>0) {
       height -= 30;
       opacity -= .05;
     setTimeout(function(){removeLike(e, height, opacity)},30);
    } else {
         e.classList.add('transparent');
         height = 0;
         opacity = 0;
         e.style.padding = 0;
         e.style.margin = 0;
         e.style['box-shadow'] = 'none';
         if (likesCount == 0)
            results.innerHTML = '<h2 id="filler" style="color:#483449;font-weight:lighter;text-align:center;padding-top:15%;">Find all your favourite posts here :)</h2>';
    }
    e.style['max-height'] = height + 'px';
    e.style.opacity = opacity;
 }

function heart(id) {
    let id0 = id.substring(3);
    let heartImg = document.getElementById('heart' + id0);
    if (heartImg.classList.contains('hearted')) {
        heartImg.classList = 'heart unhearted';
        heartImg.src = "heart-stencil.png";
        for (let i = 0; i < likesCount; i++) {
            if (likes[i].id == id0) {
                likes.splice(i, 1);
                break;
            }
        }
        if (currScreen == 'likes') {
            // remove liked
            document.getElementById(id).parentNode.classList = 'container shrink';
            removeLike(document.getElementById(id).parentNode, 500, 1);
        }
        likesCount--;
    } else {
        heartImg.classList = 'heart hearted';
        heartImg.src = "heart.png";
        let card = document.getElementById('cont' + id0);
        likes.push({"id":id0, "title":card.querySelector('h3').innerText, "date":card.querySelector('p').innerText, "desc":card.querySelector('#desc' + id0).innerText, "url":card.querySelector('img').src});
        likesCount++;
    }
}