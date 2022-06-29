import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks : []
    };

    this.search = this.search.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  search(searchTerm) {
    Spotify.search(searchTerm)
      .then(newSearchResults => {
        this.setState({searchResults: newSearchResults});
      });
  }

  updatePlaylistName(newPlaylistName) {
    this.setState({playlistName: newPlaylistName});
  }

  addTrack(track) {
    let tracks = [...this.state.playlistTracks];

    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    
    tracks.push(track);
    this.setState({playlistTracks: tracks});
  }

  removeTrack(trackToRemove) {
    let tracks = [...this.state.playlistTracks];

    tracks = tracks.filter(track => track.id !== trackToRemove.id);

    this.setState({playlistTracks: tracks});
  }


  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);

    Spotify.savePlaylist(this.state.playlistName, trackURIs)
      .then(() => {
        this.setState({
          playlistName: 'New Playlist',
          playlistTracks: []
        });
      });
  }


  render() {
      return (
        <div>
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch={this.search} />
            <div className="App-playlist">
              <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
              <Playlist 
                playlistName={this.playlistName} 
                onNameChange={this.updatePlaylistName} 
                playlistTracks={this.state.playlistTracks} 
                onRemove={this.removeTrack} 
                onSave={this.savePlaylist} />
            </div>
          </div>
        </div>
      );
    }
}

export default App;