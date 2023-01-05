//! -----===== /// MAIN COMPONENT - CHILD \\\=====-----
import React, { useState, useEffect } from "react";
import "./MusicComponent.css";
function InstrumentRack({
  Links,
  ctx,
  setLoaded,
  loadedIndex,
  activeAudioFile,
  setActiveAudioFile,
  allLoaded,
  playTrigger,
}) {
  //! -----=====\\\ States ///=====-----
  //? State to hold the audio files
  const [audioFiles, setAudioFiles] = useState([null, null, null, null]);
  //----------------------------------------------------------------------
  //! -----=====\\\ Functions ///=====-----
  //? Function to load the audio files and initialize them
  const loadAudioFiles = async (files) => {
    const requests = await files.map(async (node, i) => {
      //* fetch song from url or physical audio
      const response = await fetch(node.src);
      //* convert audio to arrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      //* convert arrayBuffer to audioBuffer
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer); //
      //* create new buffer source Node
      const source = await ctx.createBufferSource();
      //* connect the audio buffer that we created before to the source node
      source.buffer = audioBuffer;
      //* set the source node to loop
      source.loop = true;
      //* create new gain node
      const gainNode = await ctx.createGain();
      //* set the gain of the gain node to 0
      gainNode.gain.value = 0;
      //* connect the gain node to the final destination
      gainNode.connect(ctx.destination);
      //* connect the gain node to the gain node
      source.connect(gainNode);
      setAudioFiles((prevState) => {
        prevState[i] = { source, gainNode };
        return prevState;
      });
      return source;
    });
    Promise.all(requests).then((requests) => {
      setLoaded((prevState) => {
        prevState[loadedIndex] = true;
        return prevState;
      });
    });
  };

  //----------------------------------------------------------------------
  //? Function to handle the click event of the audio file buttons
  const handleButtonClick = (i) => {
    //* Set the activeAudioFile in the parent component to the current audio file index
    setActiveAudioFile((prevState) => {
      prevState[loadedIndex] = i;
      return prevState;
    });
    console.log("allLoaded in play: ", allLoaded);
    console.log("activeAudioFile in play: ", activeAudioFile);
    audioFiles.forEach((audioFile, j) => {
      const current = audioFiles[i].gainNode.gain.value === 1 ? 0 : 1;
      if (i === j) {
        audioFiles[j].gainNode.gain.value = current;
      } else {
        audioFiles[j].gainNode.gain.value = 0;
      }
      // console.log(audioFiles[j].gainNode.gain.value);
    });
  };
  //----------------------------------------------------------------------
  //? Use the useEffect hook to load the audio files when the component mounts
  useEffect(() => {
    ctx && loadAudioFiles(Links);
    // setLoaded((prevState) => {
    //   return [...prevState.slice(0, id), true, ...prevState.slice(id + 1)];
    // });
    //* Set the activeAudioFile in the parent component to the current audio file index
    setActiveAudioFile((prevState) => {
      prevState[loadedIndex] = 0;
      return prevState;
    });
    console.log("playTrigger in USEEFEECT:!!!!!", playTrigger);
    if (playTrigger === "play") {
      setTimeout(() => play(audioFiles), 850);
    }
    if (playTrigger === "stop") {
      stop(audioFiles);
    }
    // eslint-disable-next-line
  }, [
    Links,
    activeAudioFile,
    allLoaded,
    playTrigger,
    audioFiles,
    setActiveAudioFile,
  ]);
  //----------------------------------------------------------------------
  //? Function to play all the audio files
  async function play(audioFiles) {
    for (let i = 0; i < audioFiles.length; i++) {
      await audioFiles[i].source.start();
    }
  }
  async function stop(audioFiles) {
    for (let i = 0; i < audioFiles.length; i++) {
      await audioFiles[i].source.stop();
    }
    loadAudioFiles(Links);
  }

  return (
    <div className="gridlane">
      {audioFiles.map((audioFile, i) => (
        <div
          className="btnContainer"
          key={Math.floor(Math.random() * 10000000)}
        >
          <button onClick={() => handleButtonClick(i)}>
            {`CLIP ${i + 1}`}
          </button>
        </div>
      ))}
    </div>
  );
}

export default InstrumentRack;
