function updateClock(){
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes().toString().padStart(2,'0');
    var ampm = h>=12?'PM':'AM';
    var hour12 = h%12||12;
    
    var bartimeEl = document.getElementById('bartime');
    if(bartimeEl) bartimeEl.innerText = hour12+':'+m+' '+ampm;
    
    var timeEl = document.getElementById('clock-time');
    var dateEl = document.getElementById('clock-date');
    if(timeEl) timeEl.innerText = hour12+':'+m+' '+ampm;
    if(dateEl) dateEl.innerText = now.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

    let sec = now.getSeconds();
    let min = now.getMinutes();
    let hr = now.getHours();
    
    var secDeg = sec*6;
    var minDeg = min*6+(sec*0.1);
    var hrDeg = (hr%12)*30+(min*0.5);

    const secHand = document.getElementById('hand-second');
    const minHand = document.getElementById('hand-minute');
    const hrHand = document.getElementById('hand-hour');

    if(secHand) secHand.style.transform = `rotate(${secDeg}deg)`;
    if(minHand) minHand.style.transform = 'rotate('+minDeg+'deg)';
    if(hrHand) hrHand.style.transform = 'rotate(' + hrDeg + 'deg)';
}
setInterval(updateClock,1000); 
updateClock();

function escapeHTML(value){
    return String(value).replace(/[&<>"']/g,function(character){
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];
    });
}

let doomQuotes = [
    "I was a god.",
    "This world is mine to rule, and mine alone.",
    "I found it... beneath me.",
    "Pain? That is for lesser men...",
    "Child, my love is infinite. My patience is not.",
    "Big Ups To My Boy Spider-Man",
    "Also Big Ups To My Boy Koushik Tummepalli"
];

function playDoomHackSound(){
    try{
        var ctx = new (window.AudioContext||window.webkitAudioContext)();
        let oscillator = ctx.createOscillator();
        let gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(110,ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(30,ctx.currentTime+4.0);
        
        gainNode.gain.setValueAtTime(0.4,ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+4.0);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime+4.0);
    }catch(e){
        console.log("Web Audio API not supported on this browser.");
    }
}

var zCounter = 100;
function openWindow(id){
    var win = document.getElementById(id);
    if(!win) return;
    win.style.display = 'flex';
    
    if(win.style.left === ''){
        win.style.left = (window.innerWidth/2 - parseInt(win.style.width)/2)+'px';
        win.style.top = (window.innerHeight/2 - parseInt(win.style.height)/2)+'px';
    }
    bringToFront(win);
}

function closeWindow(id){ 
    var win = document.getElementById(id);
    if(win) win.style.display = 'none'; 
}

function bringToFront(el){ 
    zCounter++; 
    el.style.zIndex = zCounter; 
}

document.querySelectorAll('.window').forEach(win=>{
    win.addEventListener('mousedown',()=>{ bringToFront(win); });
});

var cWin = null, oX = 0, oY = 0;

function dragWIndow(e, id){ 
    cWin = document.getElementById(id);
    if(!cWin) return;
    oX = e.clientX - cWin.offsetLeft;
    oY = e.clientY - cWin.offsetTop;
}

document.addEventListener('mousemove',function(e){
    if(cWin){
        cWin.style.left = (e.clientX - oX)+'px';
        cWin.style.top = (e.clientY - oY)+'px';
    }
});

document.addEventListener('mouseup',()=>{ 
    cWin = null; 
});

function loadGame(gameName, gameId, type){
    let iframe = document.getElementById('game-iframe');
    let title = document.getElementById('game-title');
    var url = "";
    
    if(type === 'scratch'){
        url = "https://scratch.mit.edu/projects/" + gameId + "/embed";
    }else if(type === 'youtube'){
        url = "https://www.youtube.com/embed/" + gameId + "?autoplay=1";
    }
    
    iframe.src = url;
    title.innerText = "Now Playing: " + gameName;
}

function sendJarvisMsg(){
    var inp = document.getElementById('jarvis-input');
    var btn = document.getElementById('jarvis-send-btn');
    var text = inp.value.trim();
    if(!text) return;
    
    var mDiv = document.getElementById('jarvis-messages');
    let userRow = document.createElement('div');
    userRow.className = 'jarvis-msg-row user';
    userRow.innerHTML = '<div class="jarvis-msg-label">You</div><div class="jarvis-msg-bubble">' + escapeHTML(text) + '</div>';
    mDiv.appendChild(userRow);
    
    inp.value=''; inp.disabled=true; btn.disabled=true;
    mDiv.scrollTop = mDiv.scrollHeight;

    setTimeout(function(){
        var reply = "Processing request, sir. The TVA sensors are currently blocking my mainframe access, but I am logging your query: '" + text + "'.";
        var label = "F.R.I.D.A.Y.";
        
        if(document.body.classList.contains('doomed')){
            reply = doomQuotes[Math.floor(Math.random()*doomQuotes.length)];
            label = "DOOMBOT-AI";
        }
        
        let aiRow = document.createElement('div');
        aiRow.className = 'jarvis-msg-row assistant';
        aiRow.innerHTML = '<div class="jarvis-msg-label">' + escapeHTML(label) + '</div><div class="jarvis-msg-bubble">' + escapeHTML(reply) + '</div>';
        mDiv.appendChild(aiRow);
        mDiv.scrollTop = mDiv.scrollHeight;
        inp.disabled=false; btn.disabled=false; inp.focus();
    },1000);
}

document.getElementById('jarvis-input').addEventListener('keydown',e=>{ if(e.key==='Enter') sendJarvisMsg(); });

function searchShield(){
    let inp = document.getElementById('shield-search');
    let res = document.getElementById('shield-result');
    var query = inp.value.trim().toLowerCase();
    
    if(!query) return;
    
    res.innerHTML = "<p>> SEARCHING MAINFRAME FOR: " + escapeHTML(query.toUpperCase()) + "...</p>";
    
    setTimeout(()=>{
        var data = "";
        
        if(document.body.classList.contains('doomed')){
            var doomQuote = doomQuotes[Math.floor(Math.random()*doomQuotes.length)];
            data = "<p>> " + escapeHTML(query.toUpperCase()) + "?</p><br><h3>DOOMBOT-AI SAYS:</h3><p>" + escapeHTML(doomQuote) + "</p>";
        }else if(query.includes("thanos")){
            data = "<h3>THANOS</h3><p>STATUS: DECEASED</p><p>THREAT LEVEL: APPREHENDED (2018-2023)</p><p>ORIGIN: TITAN</p>";
        }else if(query.includes("spider-man")||query.includes("spiderman")){
            data = "<h3>SPIDER-MAN</h3><p>STATUS: ACTIVE</p><p>THREAT LEVEL: LOW (PUBLIC MENACE)</p><p>ORIGIN: EARTH, QUEENS</p>";
        }else{
            data = "<p>> NO RECORDS FOUND FOR '" + escapeHTML(query.toUpperCase()) + "'.</p><p>> CLEARANCE LEVEL INSUFFICIENT OR SUBJECT DOES NOT EXIST IN SACRED TIMELINE.</p>";
        }
        res.innerHTML = data;
    },800);
}
