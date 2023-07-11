import React, { createContext, useReducer } from 'react';

import Reducer from "./Reducer";

const initialState = {
    audioIsPlaying: false,
    notes: [],  
    currentNote: 0,
    canSetCameraPos: true,
    cameraZPos: -1050,
    cameraRotateSpeed: -2
}

export const Context = createContext(initialState);

export const GlobalContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    const updateIsAudioPlaying = (playing) => {
        dispatch({ type: "UPDATE_AUDIO_STATE", payload: playing });
    }

    const updateNotes = (newNote) => {
        dispatch({ type: "UPDATE_NOTES", payload: newNote });
        console.log(state.notes);
    }

    return <Context.Provider
        value={
            {
                audioIsPlaying: state.audioIsPlaying,
                updateIsAudioPlaying,
                notes: state.notes,
                updateNotes,
            }
        }
    >
        {children}
    </Context.Provider>
};
