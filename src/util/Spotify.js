const clientId = 'removed for security purposes';
const redirectUri = 'http://localhost:3000/';
 
let accessToken;
 
 
const Spotify = {
 
   getAccessToken() {
       if(accessToken) {
           return accessToken;
       }
       const hasAccessToken = window.location.href.match(/access_token=([^&]*)/);
       const hasExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
       if (hasAccessToken && hasExpiresIn) {
           accessToken = hasAccessToken[1];
           const expiresIn = Number(hasExpiresIn[1]);
           window.setTimeout(() => accessToken = '', expiresIn * 1000);
           window.history.pushState('Access Token', null, '/');
           return accessToken;
       } else {
           const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
           window.location = accessUrl;
       }
   },
   search(term) {
       const accessToken = Spotify.getAccessToken();
       return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
           headers: {
               Authorization: `Bearer ${accessToken}`
           }
       }).then(
           response => {
               if (response.ok) {
                   return response.json();
               } else {
                   console.log('API request failed');
               }
       }).then(
           jsonResponse => {
           if(!jsonResponse.tracks) {
               return [];
           }
           return jsonResponse.tracks.items.map(track => ({
               id: track.id,
               name: track.name,
               artist: track.artists[0].name,
               album: track.album.name,
               uri: track.uri
           }));
       });
   },
   savePlaylist(playlistName, trackURIs) {
 
       if (!playlistName || !trackURIs.length) {
           return;
       }
       const accessToken = Spotify.getAccessToken();
       const headers = {
           Authorization: `Bearer ${accessToken}`
       };
       let userId;
        return fetch('https://api.spotify.com/v1/me', {
           headers: headers
       }).then(
           response => {
               if(response.ok) {
                   return response.json();
               }
       }).then(
           jsonResponse => {
               userId = jsonResponse.id;
 
               // Adds playlist to user's account
               return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                   headers: headers,
                   method: 'POST',
                   body: JSON.stringify({name: playlistName})
               }).then(
                   response => {
                   if (response.ok) {
                       return response.json();
                   } else {
                       console.log('API request failed');
                   }
               }).then(
                   jsonResponse => {
                       const playlistId = jsonResponse.id;
                       return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                           headers: headers,
                           method: 'POST',
                           body: JSON.stringify({ uris: trackURIs})
                       });
                   });
           });
 
 
   }
 
}
 
export default Spotify;
