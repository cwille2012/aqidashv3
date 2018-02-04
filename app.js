import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import { csv as requestCsv } from 'd3-request';

const MAPBOX_TOKEN = "pk.eyJ1IjoiY3dpbGxlMjAxMiIsImEiOiJjajJxdWJyeXEwMDE5MzNydXF2cm1sbDU1In0.kCKIz6Ivh3EfNOmEfTANOA";

var socket = require('engine.io-client')('ws://ec2-18-220-229-176.us-east-2.compute.amazonaws.com:3001');

socket.on('open', function() {
    socket.on('message', function(data) {
        //console.log(data);
        var newData = String(data);
        if (true) {
            //first message
            newData = JSON.parse(newData);
            console.log(newData);


            const DATA_URL = 'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv';



            class Root extends Component {
                constructor(props) {
                    super(props);
                    this.state = {
                        viewport: {
                            ...DeckGLOverlay.defaultViewport,
                            width: 500,
                            height: 500
                        },
                        data: null
                    };

                    requestCsv(DATA_URL, (error, responsedata) => {
                        if (!error) {

                            var response = new Array();
                            for (var i in newData) {

                                console.log("newData:");
                                console.log(newData);

                                var lng = newData[i]['pos']['lon'];
                                var lat = newData[i]['pos']['lat'];

                                var positionArray = new Array();

                                positionArray.push(lng);
                                positionArray.push(lat);

                                response.push(positionArray);


                            }

                            console.log(data);
                            this.setState({ data: response });

                        }
                    });
                    // console.log(response);

                    //const data = response.map(d => [Number(d.lng), Number(d.lat)]);




                    /*requestCsv(DATA_URL, (error, response) => {
                        if (!error) {
                            const data = response.map(d => [Number(d.lng), Number(d.lat)]);
                            console.log(data);
                            this.setState({ data });
                        }
                    });*/

                }

                componentDidMount() {
                    window.addEventListener('resize', this._resize.bind(this));
                    this._resize();
                }

                _resize() {
                    this._onViewportChange({
                        width: window.innerWidth,
                        height: window.innerHeight
                    });
                }

                _onViewportChange(viewport) {
                    this.setState({
                        viewport: {...this.state.viewport, ...viewport }
                    });
                }

                render() {
                    const { viewport, data } = this.state;

                    return ( <
                        MapGL {...viewport }
                        mapStyle = "mapbox://styles/mapbox/dark-v9"
                        onViewportChange = { this._onViewportChange.bind(this) }
                        mapboxApiAccessToken = { MAPBOX_TOKEN } >
                        <
                        DeckGLOverlay viewport = { viewport }
                        data = { data || [] }
                        /> < /
                        MapGL >
                    );
                }
            }

            render( < Root / > , document.getElementById('mapHolder').appendChild(document.createElement('div')));













        }

    });
    socket.on('close', function() {});
});