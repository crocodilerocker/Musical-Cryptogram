const msgIn = document.getElementById('textbox');
const playButton = document.getElementById('button');
const audioFiles = {
    C4: new Audio('./audio/C4.mp3'),
    D4: new Audio('./audio/D4.mp3'),
    E4: new Audio('./audio/E4.mp3'),
    F4: new Audio('./audio/F4.mp3'),
    G4: new Audio('./audio/G4.mp3'),
    A4: new Audio('./audio/A4.mp3'),
    B4: new Audio('./audio/B4.mp3'),
    C5: new Audio('./audio/C5.mp3'),
}
let length = 0;
let playing = false;

//WRITE FUNCTIONS

//cypher function - returns the encoded message
const cypher = input => {
    let cypher = [];
    for(i in input) {
        let letter = input[i].toUpperCase();
        if (isLetter(letter)) {
            let note = toNote(letter.charCodeAt(0));
            //ensures that any C immediately following the note B defaults to the higher octave
            if(cypher.length > 0 && note === 'C' && ['B', 'c'].includes(cypher[cypher.length-1])) {
                note = note.toLowerCase();
            }
            cypher.push(note);
        }
    }
    return cypher.join('');
}

//receives the ASCII value of a character, and encodes it as a note (string)
const toNote = (int) => {return String.fromCharCode(((int - 65) % 7) + 65);}

//returns a bool - validates individual letters
const isLetter = (s) => {return s.match("^[a-zA-Z]+$")};

//event handler function - formats string to standard ABC notation, renders it to staff, and plays inputted notes
const notes = () => {
    const strIn = msgIn.value;
    const strOut = cypher(strIn);
    ABCJS.renderAbc("notes", 'L: 4/4\n' + strOut + '|]', {responsive:"resize"});
}

//text box event listener
msgIn.addEventListener('keyup', notes);

//PLAY FUNCTIONS//

//selects corresponding audio file for a given note
const selectAudioFile = (noteChar) => {
    let audioFile;
    switch (noteChar) {
        case 'C':
            audioFile = audioFiles.C4;
            break;
        case 'D':
            audioFile = audioFiles.D4;
            break;
        case 'E':
            audioFile = audioFiles.E4;
            break;
        case 'F':
            audioFile = audioFiles.F4;
            break;
        case 'G':
            audioFile = audioFiles.G4;
            break;
        case 'A':
            audioFile = audioFiles.A4;
            break;
        case 'B':
            audioFile = audioFiles.B4;
            break;
        case 'c':
            audioFile = audioFiles.C5;
            break;
        default:
            break;
    }
    return audioFile;
}

//plays entire message
const playAll = (strOut, num) => {
    if(strOut[num] && playing === true) {
        let audio = selectAudioFile(strOut[num]);
        audio.play()
        audio.onended = function() {
            num += 1;
            playAll(strOut, num)
        };
    } else {
        stopEverything();
    }
}

//gateway event handler
const playEverything = () => {
    playing = true;
    playButton.innerHTML = 'Stop';
    playAll(cypher(msgIn.value), 0);
}

const stopEverything = () => {
    playing = false;
    playButton.innerHTML = 'Play';
}

playButton.onclick = () => !playing ? playEverything() : stopEverything();