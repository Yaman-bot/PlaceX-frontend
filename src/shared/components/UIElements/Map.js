import React,{Component} from 'react'
import ReactMapboxGl,{ Layer, Feature } from "react-mapbox-gl";

class MapRendered extends Component{
    
    render(){
        const Map=ReactMapboxGl({
            accessToken: process.env.REACT_APP_MAPBOX_API_KEY
        });
        
        return (
                <Map 
                    style="mapbox://styles/mapbox/streets-v9"
                    containerStyle={{
                        height: '100%',
                        width: '100%'
                    }}
                    
                    >
                    <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
                        <Feature coordinates={this.props.coordinates} />
                    </Layer>
                </Map>
    
          );
    }
    
}

export default MapRendered;