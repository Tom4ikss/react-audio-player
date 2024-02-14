/* eslint-disable no-loop-func */
import React from "react";
import './audio_style.css';
import './DragAndDrop.css'
import { FileUploader } from "react-drag-drop-files";
const PORT = 3011;
export function getPort() {
  return PORT;
}

let img;
let elem;
let prevImg = require("./images/icons8-перейти-в-начало-100.png");
let nextImg = require("./images/icons8-конец-100.png")
let playImg = require("./images/icons8-воспроизведение-50.png");
let pauseImg = require("./images/icons8-пауза-100.png")
let musicArray = [];
let audioArray = [];
let isPlayed = false;
let playList = [];
let playingAudioIndex = 0;
let audio;
let durationContainer;
let currentTimeContainer;
let audioPlayerContainer;
let seekSlider;
let raf = null;
let muteState = 'unmute';
let main;
let mainImg;
let reloadingInProcces = false;
const fileTypes = ["MP3"];

const russianPicture = require("./images/Russian.jpg");
const englishPicture = require("./images/English.jpg");

const afterReload = async () => {
  await fetch (`http://localhost:${PORT}/afterReload`, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log(data)
    let index = data.info.playingAudioNumber
    playingAudioIndex = index
      if(playList.length !== 0){
          let sliceIndex = playList[index].lastIndexOf('.');
          try {
            img = require(`./images/${playList[index].replace(playList[index].slice(sliceIndex), '.jpg')}`);
          } catch {
            img = require('./images/No-Image-Placeholder.svg.png');
          }
          let fileInput = document.querySelector('#filePath');
          fileInput.addEventListener('input', showNext);
          let h2Txt = playList[index].replace(playList[index].slice(sliceIndex), '');
          document.querySelector(".playingAudioName").innerHTML = h2Txt;
          document.querySelector(".main_audio").src = require(`./uploads/${playList[index]}`);
          audio = document.querySelector('.main_audio');
          durationContainer = document.querySelector('.audioDuration');
          currentTimeContainer = document.querySelector('.currentTime');
          audioPlayerContainer = document.querySelector('.durationControler');
          seekSlider = document.querySelector('.playerSlider');
          seekSlider.value = 0;
          audio.onloadedmetadata = () => {
            displayDuration();
            setSliderMax();
            displayBufferedAmount();
            audio.addEventListener('progress', displayBufferedAmount);
            audio.addEventListener('ended', nextAudio);
          }
          seekSlider.addEventListener('input', e => {
            currentTimeContainer.textContent = calculateTime(seekSlider.value);
            showRangeProgress(e.target);
            if(!audio.paused) {
                cancelAnimationFrame(raf);
            }
          })
            seekSlider.addEventListener('change', () => {
              audio.currentTime = seekSlider.value;
              if(!audio.paused) {
                  requestAnimationFrame(whilePlaying);
              }
          });

          if(data.info.play) {
            audio.play()
            document.querySelector(".playImg").src = pauseImg;
            isPlayed = true
          }
  
  
          showRangeProgress(seekSlider);
          if(!audio.paused) {
              cancelAnimationFrame(raf);
          }
          seekSlider.value = data.info.sliderValue;
          currentTimeContainer.textContent = calculateTime(seekSlider.value);
          audio.currentTime = seekSlider.value;
          if(!audio.paused) {
              requestAnimationFrame(whilePlaying);
          }
  
  
        } else {
          main = document.querySelector('.audioControls');
          main.style.opacity = "0";
          mainImg = document.querySelector('.audioImg_outer');
          mainImg.style.opacity = "0";
          audio = document.querySelector('.main_audio');
          durationContainer = document.querySelector('.audioDuration');
          currentTimeContainer = document.querySelector('.currentTime');
          audioPlayerContainer = document.querySelector('.durationControler');
          seekSlider = document.querySelector('.playerSlider');
          seekSlider.value = 0;
          let fileInput = document.querySelector('#filePath');
          fileInput.addEventListener('input', showNext);
        }

  })
}


window.onload = () => {
  setTimeout(() => {
    afterReload()
  }, 210)
  getLang()
    const dragAndDropMain = document.querySelector(".sc-bczRLJ");

        document.querySelector(".file-types").textContent = "";

        dragAndDropMain.style.minWidth = "13.5vw";
        dragAndDropMain.style.marginTop = "30vh";
        dragAndDropMain.style.border = "2px solid #f25f5c";
        dragAndDropMain.style.borderRadius = "0";

        const russian = document.querySelector(".russian");
        const english = document.querySelector(".english");

        const yourPlaylist = document.querySelector(".listHeader");
        const addAudioText = document.querySelector(".uploadTxt");
        const uploadAudio = document.querySelector(".fileUpload");
        const uploadImage = document.querySelector(".fileUpload2");
        const chooseText = document.querySelector(".chooseText");
        const dragAndDropText = document.querySelector(".sc-hKMtZM");

        russian.onclick = () => {
            changeLang('rus')
            yourPlaylist.textContent = "Ваш плейлист:";
            addAudioText.textContent = "Добавить трек в плейлист";
            document.querySelectorAll(".listButtons").forEach(el => {
                el.textContent = "Удалить файл";
            });
            uploadAudio.textContent = "Выбрать трек";
            uploadImage.textContent = "Выбрать обложку";
            chooseText.textContent = "Выбрать язык:";
            dragAndDropText.textContent = "Загрузите или перетащите файл сюда";
        }

        english.onclick = () => {
            changeLang('en')
            yourPlaylist.textContent = "Your playlist:";
            addAudioText.textContent = "Add audio to playlist";
            document.querySelectorAll(".listButtons").forEach(el => {
                el.textContent = "Delete file";
            });
            uploadAudio.textContent = "Choose audio";
            uploadImage.textContent = "Choose image";
            chooseText.textContent = "Choose language:";
            dragAndDropText.textContent = "Upload or drop a file right here";
        }
        
}

const getLang = async () => {
  await fetch(`http://localhost:${PORT}/getLang`, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }
  )
    .then(res => res.json())
    .then(data => {
      if(data.info.lang === "rus") {
        const yourPlaylist = document.querySelector(".listHeader");
        const addAudioText = document.querySelector(".uploadTxt");
        const uploadAudio = document.querySelector(".fileUpload");
        const uploadImage = document.querySelector(".fileUpload2");
        const chooseText = document.querySelector(".chooseText");
        const dragAndDropText = document.querySelector(".sc-hKMtZM");
        yourPlaylist.textContent = "Ваш плейлист:";
        addAudioText.textContent = "Добавить трек в плейлист";
        document.querySelectorAll(".listButtons").forEach(el => {
            el.textContent = "Удалить файл";
        });
        uploadAudio.textContent = "Выбрать трек";
        uploadImage.textContent = "Выбрать обложку";
        chooseText.textContent = "Выбрать язык:";
        dragAndDropText.textContent = "Загрузите или перетащите файл сюда";
      }
    })
}

const changeLang = async (lang) => {
  await fetch(`http://localhost:${PORT}/changeLang`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  body: JSON.stringify({
    lang: lang
  })
})
}


const showRangeProgress = (rangeInput) => {
  audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
}


const calculateTime = secs => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
}

const displayDuration = () => {
  durationContainer.textContent = calculateTime(audio.duration);
}

const setSliderMax = () => {
  seekSlider.max = Math.floor(audio.duration);
}

const displayBufferedAmount = () => {
  const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
  Math.floor(audio.buffered.end(audio.buffered.length - 1));
    audioPlayerContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
}

const whilePlaying = () => {
  seekSlider.value = Math.floor(audio.currentTime);
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
  audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
  raf = requestAnimationFrame(whilePlaying);
}

document.addEventListener('keydown', function(event) {
  switch(event.code) {
    case "ArrowLeft":
      if (event.ctrlKey || event.metaKey) {
        minSec();
      } else {
        prevAudio();
      }
      break;
    case "ArrowRight":
      if (event.ctrlKey || event.metaKey) {
        plusSec();
      } else {
        nextAudio();
      }
      break;
    case "Space":
      playAudio()
      break;
    default:
      break;
  }
});

const showNext = () => {
  document.querySelector('input[type = "submit"]').style.right = "0";
}

const plusSec = () => {
  showRangeProgress(seekSlider);
  if(!audio.paused) {
      cancelAnimationFrame(raf);
  }
  seekSlider.value = Number(seekSlider.value) + 5;
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
  audio.currentTime = seekSlider.value;
  if(!audio.paused) {
      requestAnimationFrame(whilePlaying);
  }
}

const minSec = () => {
  showRangeProgress(seekSlider);
  if(!audio.paused) {
      cancelAnimationFrame(raf);
  }
  if(Number(seekSlider.value) > 5 ) {
    seekSlider.value = Number(seekSlider.value) - 5;
  } else {
    seekSlider.value = 0;
  }
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
  audio.currentTime = seekSlider.value;
  if(!audio.paused) {
      requestAnimationFrame(whilePlaying);
  }
}

const handleChange = async (filedata) => {
  console.error(filedata);

  const formData = new FormData();
  formData.append("filedata", filedata);
  console.log(formData)

  await fetch(`http://localhost:${PORT}/upload`, {
      method: 'POST',
      body: formData
  });
}

const playAudio = () => {
  if(isPlayed) {
    audio.pause();
    cancelAnimationFrame(raf);
    isPlayed = false;
    document.querySelector(".playImg").src = playImg;
  } else {
    audio.play();
    requestAnimationFrame(whilePlaying);
    isPlayed = true;
    document.querySelector(".playImg").src = pauseImg;
  }
}
const prevAudio = () => {
  let audio_prev;
  if (playingAudioIndex!==0) {
    audio_prev = playList[playingAudioIndex-1];
    playingAudioIndex--;
  } else {
    audio_prev = playList[playList.length - 1];
    playingAudioIndex = playList.length - 1;
  }
  let sliceIndex = playList[playingAudioIndex].lastIndexOf('.');
  let h2Txt = playList[playingAudioIndex].replace(playList[playingAudioIndex].slice(sliceIndex), '');
  document.querySelector(".playingAudioName").innerHTML = h2Txt;
  try {
    document.querySelector(".audioImg").src = require(`./images/${h2Txt + '.jpg'}`);
  } catch {
    document.querySelector(".audioImg").src = require(`./images/No-Image-Placeholder.svg.png`);
  }
  seekSlider.value = 0
  audio.src = require(`./uploads/${audio_prev}`);
  audio.onloadedmetadata = () => {
    displayDuration();
    setSliderMax();
    displayBufferedAmount();
    audio.addEventListener('progress', displayBufferedAmount);
  }
  if (isPlayed) {
    audio.play();
  }
}


const nextAudio = () => {
  let audio_next;
  if (playingAudioIndex!==(playList.length-1)) {
    audio_next = playList[playingAudioIndex+1];
    playingAudioIndex++
  } else {
    audio_next = playList[0];
    playingAudioIndex = 0;
  }
  let sliceIndex = playList[playingAudioIndex].lastIndexOf('.');
  let h2Txt = playList[playingAudioIndex].replace(playList[playingAudioIndex].slice(sliceIndex), '');
  document.querySelector(".playingAudioName").innerHTML = h2Txt;
  try {
    document.querySelector(".audioImg").src = require(`./images/${h2Txt + '.jpg'}`);
  } catch {
    document.querySelector(".audioImg").src = require(`./images/No-Image-Placeholder.svg.png`);
  }
  seekSlider.value = 0
  audio.src = require(`./uploads/${audio_next}`);
  audio.onloadedmetadata = () => {
    displayDuration();
    setSliderMax();
    displayBufferedAmount();
    audio.addEventListener('progress', displayBufferedAmount);
  }
  if (isPlayed) {
    audio.play();
  }
}

const reload = async (index, notIn) => {
  if (notIn) {
    console.log("zeroAud")
    await fetch(`http://localhost:${PORT}/reload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        playingAudioNumber: index,
        sliderValue: 0,
        play: null,
      })
    })
  } else {
    console.log("reloading...")
    await fetch(`http://localhost:${PORT}/reload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        playingAudioNumber: index,
        sliderValue: seekSlider.value,
        play: isPlayed,
      })
    })
  }
}

const deleteElem = async (index, array) => {
  reloadingInProcces = true;
  if(playingAudioIndex !== index) { 
    let post_index = playingAudioIndex
    if(playingAudioIndex > index) {
      post_index--
    }
  console.log("anotherDel")
  await fetch(`http://localhost:${PORT}/reload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      playingAudioNumber: post_index,
      sliderValue: seekSlider.value,
      play: isPlayed,
    })
  }).then(
    toDelete(index, array)
  )
} else {
  console.log("playingDel")
  await fetch(`http://localhost:${PORT}/reload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      playingAudioNumber: 0,
      sliderValue: 0,
      play: false,
    })
  }).then(
    toDelete(index, array)
  )
}
  toDelete(index, array)

}

const toDelete = async(index, array) => {
  await fetch(`http://localhost:${PORT}/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      index: index,
      fileName: array
    })
  })
    .then(document.location.reload())
    .catch(err => console.error(err));
}
 const getAllMusic = async () => {
   if(!reloadingInProcces) {
   await fetch(`http://localhost:${PORT}/getAllMusic`, {
     headers: {
       'Access-Control-Allow-Origin': '*',
     }
   }
   )
     .then(res => res.json())
     .then(data => {
       if(data.music.length === 0) {
         musicArray.push(
           <div className="list_items">
           <h1>Add audios --&#62;</h1>
           </div>
         )
       }
       for (let i = 0; i < data.music.length; i++) {
         try {
           elem = require(`./uploads/${data.music[i]}`);
         } catch (err) {
           let reloadI = false
           let next = true
           if (err.code === 'MODULE_NOT_FOUND' && (playList.length !== 0)) {
               for(let g = 0; g < data.music.length; g++) {
                 if(data.music[g] === playList[playingAudioIndex]) {
                   reloadI = g
                 }
               }
               if(typeof(reloadI) != 'number') {
                 reloadI = 0
                 reload(reloadI, true)
               } else {
                 reload(reloadI, false)
               }
               document.location.reload();
               console.log(playList, data.music, next)
           }
         }
        let name = () => { 
           const index = data.music[i].lastIndexOf('.');
           return (data.music[i].replace(data.music[i].slice(index), ''));
         }
        musicArray.push(
           <div className="list_items">
             <h2 onClick={() => {
               seekSlider.value = 0
               const h2Audio =  document.querySelector(".main_audio")
               h2Audio.src = require(`./uploads/${data.music[i]}`);
               h2Audio.onloadedmetadata = () => {
                 displayDuration();
                 setSliderMax();
                 displayBufferedAmount();
                 h2Audio.addEventListener('progress', displayBufferedAmount);
               }
               if(isPlayed) {
                 h2Audio.play();
               }
               document.querySelector(".playingAudioName").innerHTML = name();
               try {
                 document.querySelector(".audioImg").src = require(`./images/${name() + '.jpg'}`);
               } catch {
                 document.querySelector(".audioImg").src = require(`./images/No-Image-Placeholder.svg.png`);
               }
            
               playingAudioIndex = i;
             }}>{name()}</h2>
             <audio controls="controls" src={elem} id={"audioNumber_" + i}></audio>
             <button className={"listButtons"} onClick={() => { deleteElem(i, data.music) }}>Delete file</button>
           </div>)
       }
       audioArray = musicArray.map((audio, i) =>
         <li key={i}>
           {audio}
         </li>
       )
       playList = data.music;
       musicArray = [];
     }
     )
   }
 }

 const getInfo = () => {
   console.log(
     playList,
     playingAudioIndex,
     main,
     mainImg,
     audioArray,
     musicArray,
     isPlayed,
     img,
     elem,
     reloadingInProcces,
     seekSlider


   )
 }

export class CreateAudio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // func: getAllMusic(),
      array: audioArray,
    }
  }
  
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      100
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      array: audioArray,
      // func: getAllMusic(),
    });
  }

  render() {
    return (
      <>
      <div className="playList">
        <div className="listHeader">Your playlist:</div>
        <ul>
          {audioArray}
        </ul>
      </div>
        <div className="outer_main">
          <div className="inner_main">
            <div className="audioImg_outer">
              <img className="audioImg" alt="" src={img}></img>
              </div><br/>
            {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
            <h1 className="playingAudioName"></h1><br></br>
            <div className="audioControls">
              <div className="button_outer"><button onClick = {() => prevAudio()} className="controlButton prevButton"><img className="prevImg" alt="" src={prevImg}></img></button></div>
              <div className="button_outer"><button onClick={() => playAudio()} className="controlButton playButton"><img className="playImg" alt="" src={playImg}></img></button></div>
              <div className="button_outer"><button onClick={() => nextAudio()} className="controlButton nextButton"><img className="nextImg" alt="" src={nextImg}></img></button></div>
              <div className="durationControler">
                <span className="currentTime">0:00</span>
                <input className="playerSlider" type="range" max="100"></input>
                <span className="audioDuration">0:00</span>
              </div>
            </div>
            <audio controls className="main_audio"></audio>
          </div>
        </div>
        <div className="menu_outer">
          <div className="menu">
            <form action={'http://localhost:' + PORT + '/upload'} method="post" encType="multipart/form-data">
              <label className="uploadTxt">Add audio to playlist</label><br />
              <input accept=".mp3" type="file" name="filedata" id="filePath" /><br/>
              <label htmlFor="filePath" className="fileUpload">Choose audio</label><br/>
              <input accept=".jpg" type="file" name="filedata" id="filePath2" /><br/>
              <label htmlFor="filePath2" className="fileUpload2">Choose image</label><br/>
              <input type="submit" value="Upload file" />
            </form> 
            <div>
            <FileUploader handleChange={handleChange} name="filedata" types={fileTypes} />
            <div className="chooseText">Choose language:</div>
            <div className="languages">
                <img src={russianPicture} alt="Русский язык" id="language" className="russian" />
                <img src={englishPicture} alt="English language" id="language" className="english" />
            </div>
        </div>
          </div>
        </div>
        {/* <button className="info" onClick={getInfo}></button> */}
      </>
    );
  }
}