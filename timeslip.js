function triggerTimeSlip(windowId){
    if(windowId){
        const target = document.getElementById(windowId);
        if(target && target.classList.contains('window') && typeof closeWindow === 'function'){
            closeWindow(windowId);
        }
    }

    const desktop = document.getElementById('desktop');
    const overlay = document.getElementById('time-slip-overlay');
    const textEl = document.getElementById('slip-text');
    if(!overlay || !textEl) return;

    const phrases = ["TIME SLIPPING...","SACRED TIMELINE","TVA ACCESS GRANTED","JETSKI DETECTED"];
    textEl.textContent = phrases[Math.floor(Math.random()*phrases.length)];

    if(desktop) desktop.classList.add('shaking');
    overlay.classList.remove('active');
    void overlay.offsetWidth;
    overlay.classList.add('active');

    playSlipSound();
    setTimeout(function(){
        if(desktop) desktop.classList.remove('shaking');
        overlay.classList.remove('active');
    },2000);
}

function playSlipSound(){
    try{
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if(!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(800,ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50,ctx.currentTime+1.5);
        gainNode.gain.setValueAtTime(.3,ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(.01,ctx.currentTime+1.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime+1.5);
        oscillator.onended = function(){ ctx.close(); };
    }catch(error){
        console.log("Web Audio API not supported on this browser.");
    }
}
