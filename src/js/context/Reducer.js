export default function Reducer(state, action) {
    switch (action.type) {
        case "UPDATE_AUDIO_STATE": {
            return {
                ...state,
                audioIsPlaying: action.payload
            }
        }
         case "UPDATE_CURRENT_NOTE": {
            return {
                ...state,
                currentNote: action.payload
            }
        }
        case "UPDATE_NOTES": {
            return {
                ...state,
                notes: [...state.notes, action.payload]
            }
        }
        default:
            throw new Error('Action type does not exist!')
    }
}