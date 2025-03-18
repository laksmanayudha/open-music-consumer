const { Pool } = require('pg');

class PlaylistSongService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsInPlaylist(playlistId) {
    const queryPlaylist = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    let result = await this._pool.query(queryPlaylist);
    const playlist = result.rows[0];

    const queryPlaylistSong = {
      text: `SELECT playlist_songs.*, songs.title, songs.performer FROM playlist_songs
      LEFT JOIN songs ON playlist_songs.song_id = songs.id
      WHERE playlist_songs.playlist_id = $1
      `,
      values: [playlistId],
    };

    result = await this._pool.query(queryPlaylistSong);
    const playlistSongs = result.rows.map(({ id, title, performer }) => ({
      id, title, performer,
    }));

    return {
      id: playlist.id,
      name: playlist.name,
      songs: playlistSongs,
    };
  }
}

module.exports = PlaylistSongService;
