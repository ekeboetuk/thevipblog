import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';

export const GoogleMap = () => {
  const position = {lat: 5.163690, lng: 7.732550};
  console.log(process.env.GOOGLE_MAPS_API_KEY)

  return (
    <APIProvider apiKey={"AIzaSyAkFtokqvx17fwQWfsqSQz7nP-fBys0IMA"}>
      <Map
      style={{width: '100vw', height: '400px'}}
      center={position}
      zoom={15}
      >
        <Marker position={position} />
      </Map>
    </APIProvider>
  );
}
