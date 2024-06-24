import { browser } from '$app/environment';

export function saveStorage(savefile){
    if (browser) {
        console.log("save complete")
        localStorage.setItem('crossChroma', JSON.stringify(savefile));
        return 
    }
        
}

export function getStorage(){
    const saveFile = JSON.parse(localStorage.getItem('crossChroma'))
    // setting player setting object equal to save file
    return saveFile
}