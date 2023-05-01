import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, MapDirectionsService } from '@angular/google-maps';
import { Observable, map } from 'rxjs';
import * as haversine from 'haversine';

@Component({
  selector: 'app-marker-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './marker-map.component.html',
  styleUrls: ['./marker-map.component.scss']
})
export class MarkerMapComponent implements OnInit {
  directionsResults$!: Observable<google.maps.DirectionsResult | undefined>;
  center!: google.maps.LatLngLiteral;
  pos!: google.maps.LatLngLiteral;
  pointsArray: any[] = [];

  poss = [
    { lat: 35.8237342, lng: 10.6334133 },
    { lat: 35.8244185, lng: 10.6335037 },
    { lat: 35.8244723, lng: 10.6346993 },
    { lat: 35.8267506, lng: 10.6347938 },
    { lat: 35.8293056, lng: 10.6329588 },
    { lat: 35.8677548, lng: 10.6025402 },
  ];
  constructor(private mapDirectionsService: MapDirectionsService) {

  }

  zoom = 15;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };
  trackerOptions: google.maps.MarkerOptions = {
    draggable: false,
  };
  destinationPosition!: google.maps.LatLngLiteral;
  markerPositions!: google.maps.LatLngLiteral;
  startPosition!: google.maps.LatLngLiteral;
  directionsRenderer = new google.maps.DirectionsRenderer();

  ngOnInit(): void {
    navigator.geolocation.watchPosition(
      (position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log('center position => ', this.center)

        this.destinationPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
        this.startPosition = { lat: 35.81341449030665, lng: 10.629244363527144 };
        // this.markerPositions.push({
        //   lat: position.coords.latitude,
        //   lng: position.coords.longitude,
        // });
        this.markerPositions = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log('destination position => ', this.destinationPosition)
        console.log('start position => ', this.startPosition)
        console.log('Marker position => ', this.markerPositions)
        console.log('havrsine ===> ', haversine(
          { latitude: position.coords.latitude, longitude: position.coords.longitude },
          { latitude: 35.72984938442179, longitude: 10.57984007638687 }
          , { threshold: 1, unit: 'meter' }))

      },
      (err) => err,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }

  // _ngOnInit() {
  //   const start = new google.maps.LatLng(this.startLat, this.startLng);
  //   const end = new google.maps.LatLng(this.endLat, this.endLng);
  //   const request = {
  //     origin: start,
  //     destination: end,
  //     travelMode: 'DRIVING'
  //   };
  //   this.directionsService.route(request, (result, status) => {
  //     if (status == 'OK') {
  //       this.directions = {
  //         directions: result
  //       };
  //       const points = result.routes[0].overview_path;
  //       console.log(points);
  //     }
  //   });
  // }

  drive() {
    console.log('drive in')
    let i = 0;
    const request: google.maps.DirectionsRequest = {
      destination: this.destinationPosition,
      // origin: this.center,
      origin: this.startPosition,
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: new Date(),
        trafficModel: google.maps.TrafficModel.PESSIMISTIC,
      },
    };
    // this.pos = this.center;
    this.pos = this.startPosition;
    this.directionsResults$ = this.mapDirectionsService.route(request).pipe(
      map((response: any) => {
        console.log('response', response);
        // this.directionsRenderer.setDirections(response);
        this.pointsArray = response.result.routes[0].overview_path;
        console.log('array points ', this.pointsArray)
        return response.result;
      })
    );
    
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.markerPositions = (event.latLng.toJSON());
      console.log(event.latLng.toJSON());
    }
  }

  setPointsMap(){
    let i: number = 0;
    setInterval(() => {
        if (i <= this.pointsArray.length) {
          this.markerPositions = {lat: this.pointsArray[i].lat(), lng: this.pointsArray[i].lng()};
        }
          i += 1;
      }, 1000);
}
}