import { Component, OnInit, inject } from '@angular/core';
import { MapDirectionsService } from '@angular/google-maps';
import { Observable, map } from 'rxjs';

interface MarkerProperties {
  position: {
    lat: number;
    lng: number;
  }
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'googleMaps';
  _mapDirectionsService = inject(MapDirectionsService)
  // 35.82435356524344, 10.633522872603928 => my coordinates 
  center: google.maps.LatLngLiteral = { lat: 35.82435356524344, lng: 10.633522872603928 };
  zoom = 10;
  public lat!: any;
  public lng!: any;
  myLatLng = {
    lat: 35.82435356524344,
    lng: 10.633522872603928
  };
  display: any;
  markerPositions: google.maps.LatLngLiteral[] = [];
  markerOptions: google.maps.MarkerOptions = { draggable: false };

  directionsResults$!: Observable<google.maps.DirectionsResult | undefined>;

  markers: MarkerProperties[] = [
    { position: { lat: 35.837203354347196, lng: 10.590871295714496 } }, // Eiffel Tower
    { position: { lat: 35.82435356524344, lng: 10.633522872603928 } }, // Louvre Museum
    { position: { lat: 35.82939895319094, lng: 10.627906947659719 } }, // Cathédrale Notre-Dame de Paris
  ];

  constructor() {
    // this.getLocation();
    // // this.movingTarget();
    // this.calc();
  }

  ngOnInit(): void {
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log('latitude: ', this.lat);
          console.log('longitude: ', this.lng);
        }
      },
        (error: any) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  calculateTarget() {
    const request: google.maps.DirectionsRequest = {
      destination: { lat: 35.837203354347196, lng: 10.590871295714496 },
      origin: { lat: this.lat, lng: this.lng },
      travelMode: google.maps.TravelMode.DRIVING
    };
    this.directionsResults$ = this._mapDirectionsService.route(request)
      .pipe(map(response => response.result));
  }

  // movingTarget(map?: google.maps.Map) {
  //   const markerList: MarkerProperties[] = [
  //     { position: { lat: 35.837203354347196, lng: 10.590871295714496 }}, // Eiffel Tower
  //     { position: { lat: 35.82435356524344, lng: 10.633522872603928 }}, // Louvre Museum
  //     { position: { lat: 35.82939895319094, lng: 10.627906947659719 }}, // Cathédrale Notre-Dame de Paris
  //   ];
  //       setTimeout(()=>{

  //         markerList.forEach((marker: MarkerProperties) => {
  //           new google.maps.Marker({
  //             position: marker.position,
  //             map,
  //           });
  //         });
  //       }, 3000);
  //   }

  handleMapInitialized(map: google.maps.Map) {
    this.markers.forEach((marker: MarkerProperties) => {
      new google.maps.Marker({
        position: marker.position,
        map,
      });
    });
  }

  calc(map?: google.maps.Map) {
    let i: number = 0;
    const markerList: MarkerProperties[] = [
      { position: { lat: 35.837203354347196, lng: 10.590871295714496 } }, // Eiffel Tower
      { position: { lat: 35.82435356524344, lng: 10.633522872603928 } }, // Louvre Museum
      { position: { lat: 35.82939895319094, lng: 10.627906947659719 } }, // Cathédrale Notre-Dame de Paris
    ];
    // for (var i = 0; i < markerList.length; i++) {
    setInterval(function () {
      while (i <= markerList.length) {
        new google.maps.Marker({
          position: new google.maps.LatLng(markerList[i].position.lat, markerList[i].position.lat),
          map,
        });
        i++;
      }
    }, 3000);
    // }
  }
}
