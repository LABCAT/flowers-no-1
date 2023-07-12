import React, { createContext, useReducer } from 'react';

import Reducer from "./Reducer";

const initialState = {
    audioIsPlaying: false,
    notes: [],  
    currentNote: 0
}

export const Context = createContext(initialState);

export const GlobalContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    const updateIsAudioPlaying = (playing) => {
        dispatch({ type: "UPDATE_AUDIO_STATE", payload: playing });
    }

    const updateNotes = (newNote) => {
        dispatch({ type: "UPDATE_NOTES", payload: newNote });
    }

    const updateCurrentNote = (newNote) => {
        dispatch({ type: "UPDATE_CURRENT_NOTE", payload: newNote });
    }

    return <Context.Provider
        value={
            {
                audioIsPlaying: state.audioIsPlaying,
                updateIsAudioPlaying,
                notes: state.notes,
                updateNotes,
                currentNote: state.currentNote,
                updateCurrentNote,
            }
        }
    >
        {children}
    </Context.Provider>
};
