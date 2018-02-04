import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import { csv as requestCsv } from 'd3-request';

const MAPBOX_TOKEN = "pk.eyJ1IjoiY3dpbGxlMjAxMiIsImEiOiJjajJxdWJyeXEwMDE5MzNydXF2cm1sbDU1In0.kCKIz6Ivh3EfNOmEfTANOA";

var socket = require('engine.io-client')('ws://ec2-18-220-229-176.us-east-2.compute.amazonaws.com:3001');

var data;

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

                        newData = JSON.parse(newData);

                        requestCsv(DATA_URL, (error, responsedata) => {
                            if (!error) {

                                var response = new Array();
                                for (var i in newData) {

                                    console.log("newData:");
                                    console.log(newData);

                                    for (var j = 0; j < 300; j++) {

                                        var lng = newData[i]['pos']['lon'];
                                        var lat = newData[i]['pos']['lat'];

                                        var positionArray = new Array();

                                        positionArray.push(lng + (j / 50));
                                        positionArray.push(lat + (j / 50));


                                        response.push(positionArray);
                                    }



                                }
                                data = response;

                                //this.setState({ data: response });
                                console.log(data);
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

                    _onHover({ x, y, object }) {
                        this.setState({ x, y, hoveredObject: object });
                    }

                    _onMouseMove(evt) {
                        if (evt.nativeEvent) {
                            this.setState({ mousePosition: [evt.nativeEvent.offsetX, evt.nativeEvent.offsetY] });
                        }
                    }

                    _onMouseEnter() {
                        this.setState({ mouseEntered: true });
                    }

                    _onMouseLeave() {
                        this.setState({ mouseEntered: false });
                    }

                    _renderTooltip() {
                        const { x, y, hoveredObject } = this.state;

                        if (!hoveredObject) {
                            return null;
                        }

                        var tooltipExists = !!document.getElementById('tooltip');

                        var hoveredObjectHTML = hoveredObject.address;

                        if (tooltipExists) {
                            document.getElementById('tooltip').style.position = "absolute";
                            document.getElementById('tooltip').style.zIndex = 99999;
                            document.getElementById('tooltip').style.color = '#fff';
                            document.getElementById('tooltip').style.background = 'rgba(0, 0, 0, 0.8)';
                            document.getElementById('tooltip').style.padding = '4px';
                            document.getElementById('tooltip').style.fontSize = '10px';
                            document.getElementById('tooltip').style.maxWidth = '300px';
                            document.getElementById('tooltip').style.left = x + 'px';
                            document.getElementById('tooltip').style.top = y + 'px';
                            document.getElementById('tooltip').style.cursor = 'pointer';
                            document.getElementById('tooltip').setAttribute('text-decoration', 'none!important');
                            //console.log(hoveredObject);
                            //codeLatLng(hoveredObject.centroid[1], hoveredObject.centroid[0]);
                        }

                        var locationPlace;
                        var timeSpent = String(Math.round((((hoveredObject.points.length * 2) / 60) * 100) / 100)) + " hours";

                        if (hoveredObject.points.length == 252) {
                            locationPlace = "Georgetown University Student Center";
                        } else if (hoveredObject.points.length == 37) {
                            locationPlace = "Georgetown University Library";
                        } else if (hoveredObject.points.length == 108) {
                            locationPlace = "Sheraton Pentagon City";
                        } else if (hoveredObject.points.length == 48) {
                            locationPlace = "Air Force Memorial";
                        } else if (hoveredObject.points.length == 50) {
                            locationPlace = "Dama Cafe";
                        } else if (hoveredObject.points.length == 30) {
                            locationPlace = "US Court of federal Claims";
                        } else if (hoveredObject.points.length == 47) {
                            locationPlace = "Hyatt Rosyln Suites";
                        } else if (hoveredObject.points.length == 28) {
                            locationPlace = "Miriam's Kitchen";
                        } else if (hoveredObject.points.length == 25) {
                            locationPlace = "Federal Reserve Building";
                        } else if (hoveredObject.points.length > 15) {
                            locationPlace = "Unlisted Location";
                        } else {
                            locationPlace = "In transit";
                        }

                        return ( < div id = "tooltip"
                            style = {
                                { left: x, top: y }
                            } >
                            <
                            div > { 'Index: ' + hoveredObject.index } < /div> <
                            div > { 'Longitude: ' + hoveredObject.centroid[0] } < /div> <
                            div > { 'Latitude: ' + hoveredObject.centroid[1] } < /div> <
                            div > { 'Location: ' + locationPlace } < /div> <
                            div > { 'Time spent: ' + timeSpent } < /div> <
                            div > { 'Points: ' + hoveredObject.points.length } < /div> <
                            div > { 'Test value: ' + hoveredObject } < /div>  < /
                            div >
                        );
                    }

                    render() {
                        const { viewport, data, iconMapping, mousePosition, mouseEntered } = this.state;

                        return ( <
                            div onMouseMove = { this._onMouseMove.bind(this) }
                            onMouseEnter = { this._onMouseEnter.bind(this) }
                            onMouseLeave = { this._onMouseLeave.bind(this) } > { this._renderTooltip() } <
                            MapGL {...viewport }
                            mapStyle = "mapbox://styles/mapbox/dark-v9"
                            onViewportChange = { this._onViewportChange.bind(this) }
                            mapboxApiAccessToken = { MAPBOX_TOKEN } >
                            <
                            DeckGLOverlay viewport = { viewport }
                            data = { data || [] }
                            mousePosition = { mousePosition }
                            mouseEntered = { mouseEntered }
                            onHover = { this._onHover.bind(this) }
                            /> < /
                            MapGL >
                            <
                            /div>
                        );
                    }
                }

                render( < Root / > , document.getElementById('mapHolder').appendChild(document.createElement('div')));
            }












        }

    }); socket.on('close', function() {});
});